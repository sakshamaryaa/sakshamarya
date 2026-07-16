import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import portraitUrl from '@/assets/saksham-train.jpg';

/* ──────────────────────── Scroll driver ──────────────────────── */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return p;
}

/* ──────────────────────── Fragmented Portrait ──────────────────────── */
const COLS = 8;
const ROWS = 10;
const COUNT = COLS * ROWS;

function FragmentedPortrait({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const texture = useLoader(THREE.TextureLoader, portraitUrl);

  // portrait aspect roughly 3:4 (portrait). We'll scale grid to fit ~4x5 world units.
  const gridW = 4;
  const gridH = 5;
  const cellW = gridW / COLS;
  const cellH = gridH / ROWS;

  // Per-instance random seed data
  const seeds = useMemo(() => {
    const arr: {
      target: THREE.Vector3;
      scatter: THREE.Vector3;
      dissolve: THREE.Vector3;
      rot: THREE.Euler;
      spin: THREE.Vector3;
      phase: number;
    }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const tx = (col - (COLS - 1) / 2) * cellW;
      const ty = ((ROWS - 1) / 2 - row) * cellH;
      arr.push({
        target: new THREE.Vector3(tx, ty, 0),
        scatter: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8 - 2,
        ),
        dissolve: new THREE.Vector3(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 18 - 4,
          (Math.random() - 0.5) * 14 - 6,
        ),
        rot: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  // Per-instance UV offsets — each plane samples its own patch of the portrait
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(cellW * 0.96, cellH * 0.96);
    const uvOffset = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      uvOffset[i * 2] = col / COLS;
      uvOffset[i * 2 + 1] = (ROWS - 1 - row) / ROWS;
    }
    geo.setAttribute('uvOffset', new THREE.InstancedBufferAttribute(uvOffset, 2));
    return geo;
  }, []);

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           attribute vec2 uvOffset;
           varying vec2 vUvFrag;`,
        )
        .replace(
          '#include <uv_vertex>',
          `#include <uv_vertex>
           vUvFrag = uvOffset + uv * vec2(${(1 / COLS).toFixed(6)}, ${(1 / ROWS).toFixed(6)});`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           varying vec2 vUvFrag;`,
        )
        .replace(
          '#include <map_fragment>',
          `#ifdef USE_MAP
             vec4 sampledDiffuseColor = texture2D( map, vUvFrag );
             diffuseColor *= sampledDiffuseColor;
           #endif`,
        );
    };
    return mat;
  }, [texture]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = progressRef.current;
    const t = state.clock.elapsedTime;

    // Two lerp phases: 0..0.18 scatter→assembled, 0.28..0.55 assembled→dissolve
    const assemble = THREE.MathUtils.smoothstep(p, 0.0, 0.2);
    const dissolve = THREE.MathUtils.smoothstep(p, 0.3, 0.6);

    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      // scatter → target
      tmpPos.copy(s.scatter).lerp(s.target, assemble);
      // add subtle drift while scattered
      const drift = 1 - assemble;
      tmpPos.x += Math.sin(t * 0.4 + s.phase) * 0.25 * drift;
      tmpPos.y += Math.cos(t * 0.35 + s.phase) * 0.2 * drift;
      // target → dissolve
      tmpPos.lerp(s.dissolve, dissolve);

      dummy.position.copy(tmpPos);

      // Rotation: chaotic when scattered/dissolved, aligned when assembled
      const align = assemble * (1 - dissolve);
      dummy.rotation.x = s.rot.x + s.spin.x * t * (1 - align);
      dummy.rotation.y = s.rot.y + s.spin.y * t * (1 - align);
      dummy.rotation.z = s.rot.z + s.spin.z * t * (1 - align);
      // ease rotation to 0 when aligned
      dummy.rotation.x *= 1 - align * 0.98;
      dummy.rotation.y *= 1 - align * 0.98;
      dummy.rotation.z *= 1 - align * 0.98;

      const scale = 0.9 + 0.15 * Math.sin(t * 0.8 + s.phase) * (1 - align);
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} frustumCulled={false} />
  );
}

/* ──────────────────────── Dust field ──────────────────────── */
function DustField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    pts.rotation.y = state.clock.elapsedTime * 0.02;
    pts.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a78bfa"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ──────────────────────── Camera rig ──────────────────────── */
function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    const p = progressRef.current;
    const cam = state.camera;
    // Dolly in from z=9 → z=6 during assembly, then drift back for cinematic depth
    const targetZ = 9 - THREE.MathUtils.smoothstep(p, 0, 0.25) * 3 + THREE.MathUtils.smoothstep(p, 0.35, 1) * 4;
    const targetY = -p * 2;
    cam.position.x += (mouse.current.x * 0.6 - cam.position.x) * 0.04;
    cam.position.y += (targetY + mouse.current.y * -0.4 - cam.position.y) * 0.05;
    cam.position.z += (targetZ - cam.position.z) * 0.05;
    cam.lookAt(0, targetY, 0);
  });
  return null;
}

/* ──────────────────────── Scroll bridge ──────────────────────── */
function ScrollBridge({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const p = useScrollProgress();
  useEffect(() => {
    progressRef.current = p;
  }, [p, progressRef]);
  return null;
}

/* ──────────────────────── Public Scene ──────────────────────── */
export function Scene() {
  const progressRef = useRef(0);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Ambient background gradient — the void */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 20%, hsl(268 60% 18% / 0.9), hsl(258 80% 5%) 60%, #050308 100%)',
        }}
      />
      <ScrollBridge progressRef={progressRef} />
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#08060f', 8, 28]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 4, 6]} intensity={2.2} color="#a78bfa" distance={30} />
        <pointLight position={[-5, -3, 4]} intensity={1.4} color="#3b1e6e" distance={30} />

        <Suspense fallback={null}>
          <FragmentedPortrait progressRef={progressRef} />
        </Suspense>
        <DustField count={reduced ? 300 : 900} />

        <CameraRig progressRef={progressRef} />

        {!reduced && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0012, 0.0012] as unknown as THREE.Vector2}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise opacity={0.05} premultiply blendFunction={BlendFunction.OVERLAY} />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        )}
      </Canvas>

      {/* Subtle grid vignette overlay for extra depth */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(hsl(268 40% 60% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(268 40% 60% / 0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
    </div>
  );
}
