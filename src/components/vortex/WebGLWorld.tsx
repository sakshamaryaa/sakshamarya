import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial, Points, PointMaterial, Torus, Environment } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Full-viewport WebGL background scene.
 * Scroll-driven camera + a swarm of glassy icosahedra, a distortion core,
 * a slow-spinning halo and a starfield. Sits behind all content but above Aurora.
 */

function Starfield({ count = 1800 }: { count?: number }) {
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 14;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(p) * Math.cos(t);
      a[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      a[i * 3 + 2] = r * Math.cos(p);
    }
    return a;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#9cc4ff" size={0.025} sizeAttenuation depthWrite={false} opacity={0.85} />
    </Points>
  );
}

function Shards() {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.45,
        speed: 0.5 + Math.random() * 1.2,
        color: i % 3 === 0 ? '#7aa7ff' : i % 3 === 1 ? '#b28cff' : '#7ff0e6',
      })),
    [],
  );
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.05;
  });
  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={1.5} floatIntensity={1.2}>
          <Icosahedron args={[s.scale, 0]} position={s.pos}>
            <meshPhysicalMaterial
              color={s.color}
              metalness={0.6}
              roughness={0.15}
              transmission={0.6}
              thickness={0.6}
              ior={1.4}
              emissive={s.color}
              emissiveIntensity={0.15}
            />
          </Icosahedron>
        </Float>
      ))}
    </group>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1]}>
      <icosahedronGeometry args={[1.4, 5]} />
      <MeshDistortMaterial
        color="#4d7cff"
        emissive="#3355ff"
        emissiveIntensity={0.3}
        distort={0.42}
        speed={1.6}
        roughness={0.2}
        metalness={0.7}
      />
    </mesh>
  );
}

function Halo() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * 0.08;
      ref.current.rotation.x = Math.PI / 2.4;
    }
  });
  return (
    <Torus ref={ref} args={[3.2, 0.008, 16, 200]} position={[0, 0, -1]}>
      <meshBasicMaterial color="#8fb4ff" transparent opacity={0.35} />
    </Torus>
  );
}

function Rig() {
  const [scroll, setScroll] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(h > 0 ? window.scrollY / h : 0);
    };
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);
  useFrame((state) => {
    const cam = state.camera;
    const targetZ = 6 - scroll * 3;
    const targetY = -scroll * 4;
    cam.position.x += (mouse.x * 0.6 - cam.position.x) * 0.04;
    cam.position.y += (targetY + -mouse.y * 0.4 - cam.position.y) * 0.04;
    cam.position.z += (targetZ - cam.position.z) * 0.04;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export function WebGLWorld() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050710']} />
        <fog attach="fog" args={['#050710', 6, 18]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a8c6ff" />
        <directionalLight position={[-5, -3, -2]} intensity={0.6} color="#b28cff" />
        <Environment preset="city" />
        <Rig />
        <Starfield />
        <Halo />
        <Core />
        <Shards />
      </Canvas>
    </div>
  );
}
