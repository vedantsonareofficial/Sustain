"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

// ── Stylized 3D Apple Mesh Component ──
function AppleGeometry() {
  const appleRef = useRef<THREE.Group>(null);
  return (
    <group ref={appleRef}>
      {/* Apple body */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial
          color="var(--beige)"
          roughness={0.3}
          metalness={0.1}
          transmission={0.5}
          thickness={0.5}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.95, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshBasicMaterial color="var(--beige)" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ── Stylized 3D Bread Loaf Mesh Component ──
function BreadGeometry() {
  return (
    <mesh scale={[1.6, 0.9, 0.9]}>
      <sphereGeometry args={[0.7, 32, 16]} />
      <meshPhysicalMaterial
        color="var(--beige)"
        roughness={0.6}
        metalness={0.0}
        transmission={0.4}
        thickness={0.8}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Stylized 3D Cheese Wedge Component ──
function CheeseGeometry() {
  const cheeseRef = useRef<THREE.Group>(null);

  // Programmatically create a 3D triangle wedge prism
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(1, 0);
    s.lineTo(0.5, 0.866);
    s.lineTo(0, 0);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };
    return new THREE.ExtrudeGeometry(s, extrudeSettings);
  }, []);

  return (
    <group ref={cheeseRef} rotation={[-0.3, 0.2, 0.5]}>
      <mesh geometry={geom} position={[-0.5, -0.4, -0.2]}>
        <meshPhysicalMaterial
          color="var(--beige)"
          roughness={0.4}
          metalness={0.0}
          transmission={0.5}
          thickness={0.6}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FloatingFoodItem({
  children,
  position,
  scale,
  speed,
  factor = 1,
}: {
  children: React.ReactNode;
  position: [number, number, number];
  scale: number;
  speed: number;
  factor?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Rotate item slowly
    groupRef.current.rotation.x += 0.003 * speed;
    groupRef.current.rotation.y += 0.004 * speed;

    // React smoothly to cursor movement (antigravity drift effect)
    const targetX = position[0] + state.pointer.x * 1.6 * factor;
    const targetY = position[1] + state.pointer.y * 1.1 * factor;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {children}
    </group>
  );
}

function Scene() {
  const { isDark } = useTheme();

  return (
    <>
      <ambientLight intensity={isDark ? 0.35 : 0.65} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color={isDark ? "#CDBA96" : "#8C7550"} />
      <directionalLight position={[-5, -5, -5]} intensity={0.15} color={isDark ? "#101D16" : "#DDD0B4"} />

      {/* Apple on the left */}
      <FloatingFoodItem position={[-3.6, 1.6, -3]} scale={0.95} speed={1.0} factor={1.2}>
        <AppleGeometry />
      </FloatingFoodItem>

      {/* Bread Loaf on the bottom right */}
      <FloatingFoodItem position={[3.4, -1.6, -3.5]} scale={1.0} speed={0.7} factor={1.5}>
        <BreadGeometry />
      </FloatingFoodItem>

      {/* Cheese Wedge on the top right */}
      <FloatingFoodItem position={[1.8, 2.3, -4.5]} scale={1.1} speed={1.1} factor={1.0}>
        <CheeseGeometry />
      </FloatingFoodItem>
    </>
  );
}

export default function InteractiveBackground3D() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-transparent transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
