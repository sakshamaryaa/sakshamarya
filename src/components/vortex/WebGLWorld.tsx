import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type ThemeColors = { primary: string; accent: string; foreground: string };

function readThemeColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement);
  const color = (name: string) => {
    const value = styles.getPropertyValue(name).trim();
    return value ? `hsl(${value})` : 'hsl(0 0% 90%)';
  };
  return {
    primary: color('--primary'),
    accent: color('--accent'),
    foreground: color('--foreground'),
  };
}

function useThemeColors() {
  const [colors, setColors] = useState<ThemeColors | null>(null);
  useEffect(() => {
    const sync = () => setColors(readThemeColors());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    return () => observer.disconnect();
  }, []);
  return colors;
}

function Starfield({ count, color }: { count: number; color: string }) {
  const positions = useMemo(() => {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 22;
      const azimuth = Math.random() * Math.PI * 2;
      const polar = Math.acos(2 * Math.random() - 1);
      points[i * 3] = radius * Math.sin(polar) * Math.cos(azimuth);
      points[i * 3 + 1] = radius * Math.sin(polar) * Math.sin(azimuth);
      points[i * 3 + 2] = radius * Math.cos(polar);
    }
    return points;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (ref.current) {
      ref.current.rotation.y += delta * 0.012;
      ref.current.rotation.x += delta * 0.004;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color={color} size={0.018} sizeAttenuation depthWrite={false} opacity={0.62} />
    </Points>
  );
}

function Gyroscope({ colors }: { colors: ThemeColors }) {
  const outer = useRef<THREE.Mesh>(null);
  const middle = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (outer.current) outer.current.rotation.y += delta * 0.12;
    if (middle.current) middle.current.rotation.x -= delta * 0.19;
    if (inner.current) inner.current.rotation.z += delta * 0.24;
    if (core.current) {
      core.current.rotation.x += delta * 0.16;
      core.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group position={[2.35, 0.12, -0.5]} scale={1.48}>
      <mesh ref={outer} rotation={[0.4, 0.2, 0.3]}>
        <torusGeometry args={[1.72, 0.012, 8, 120]} />
        <meshStandardMaterial color={colors.foreground} metalness={0.78} roughness={0.3} transparent opacity={0.24} />
      </mesh>
      <mesh ref={middle} rotation={[1.2, 0.2, -0.4]}>
        <torusGeometry args={[1.4, 0.024, 8, 100]} />
        <meshStandardMaterial color={colors.primary} metalness={0.68} roughness={0.24} emissive={colors.primary} emissiveIntensity={0.12} />
      </mesh>
      <mesh ref={inner} rotation={[0.5, 0.8, 0.2]}>
        <torusGeometry args={[1.06, 0.018, 8, 96]} />
        <meshStandardMaterial color={colors.accent} metalness={0.62} roughness={0.25} emissive={colors.accent} emissiveIntensity={0.1} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 2]} />
        <meshPhysicalMaterial color={colors.primary} metalness={0.54} roughness={0.2} clearcoat={0.9} clearcoatRoughness={0.18} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const pointer = useRef({ x: 0, y: 0, scroll: 0 });
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      pointer.current.scroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const amount = 1 - Math.exp(-2.4 * delta);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 0.12, amount);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.current.y * 0.1 - pointer.current.scroll * 0.28, amount);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function WebGLWorld() {
  const colors = useThemeColors();
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const update = () => setSmallScreen(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (!colors) return null;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={smallScreen ? [1, 1.15] : [1, 1.4]}
        camera={{ position: [0, 0, 8], fov: 58 }}
        gl={{ antialias: !smallScreen, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.48} />
        <pointLight position={[3, 4, 4]} color={colors.primary} intensity={12} distance={16} />
        <pointLight position={[-4, -2, 2]} color={colors.accent} intensity={8} distance={14} />
        <CameraRig />
        <Gyroscope colors={colors} />
        <Starfield count={smallScreen ? 650 : 1600} color={colors.foreground} />
      </Canvas>
    </div>
  );
}
