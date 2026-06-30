"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { useTheme } from "./ThemeProvider";

// India boundary polygon coordinates
const INDIA_POLYGON = [
  { lat: 35.5, lng: 74.5 },
  { lat: 35.5, lng: 77.0 },
  { lat: 34.0, lng: 78.0 },
  { lat: 31.0, lng: 79.5 },
  { lat: 29.5, lng: 81.0 },
  { lat: 28.0, lng: 84.0 },
  { lat: 27.5, lng: 88.0 },
  { lat: 27.8, lng: 92.0 },
  { lat: 28.5, lng: 96.0 },
  { lat: 26.5, lng: 97.0 },
  { lat: 24.5, lng: 94.5 },
  { lat: 22.5, lng: 92.2 },
  { lat: 22.0, lng: 89.0 },
  { lat: 20.0, lng: 86.5 },
  { lat: 13.0, lng: 80.5 },
  { lat: 8.0, lng: 77.5 },
  { lat: 10.0, lng: 76.0 },
  { lat: 13.0, lng: 74.8 },
  { lat: 16.0, lng: 73.5 },
  { lat: 19.0, lng: 72.8 },
  { lat: 21.0, lng: 72.0 },
  { lat: 23.0, lng: 68.5 },
  { lat: 24.5, lng: 68.5 },
  { lat: 25.5, lng: 71.0 },
  { lat: 28.0, lng: 70.0 },
  { lat: 31.0, lng: 73.5 },
  { lat: 33.0, lng: 75.0 },
  { lat: 35.5, lng: 74.5 }, // Closed loop
];

const CITIES = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Guwahati", lat: 26.1158, lng: 91.7086 },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
];

const MAP_CENTER_LAT = 22.0;
const MAP_CENTER_LNG = 80.0;
const SCALE_X = 0.18;
const SCALE_Y = 0.2;
const PIN_HEIGHT = 0.55;

function IndiaMesh() {
  const { isDark } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  const pinsRef = useRef<THREE.InstancedMesh>(null);

  // Active theme color hex resolving
  const themeColor = isDark ? "#CDBA96" : "#8C7550";

  // Slow rotation/wobble for 3D depth feeling
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.12;
      groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.06 - 0.15;
    }
  });

  // Calculate outline vectors
  const outlineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    INDIA_POLYGON.forEach((p) => {
      const x = (p.lng - MAP_CENTER_LNG) * SCALE_X;
      const y = (p.lat - MAP_CENTER_LAT) * SCALE_Y;
      points.push(new THREE.Vector3(x, y, 0));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Set pin transforms
  useEffect(() => {
    if (!pinsRef.current) return;
    const dummy = new THREE.Object3D();

    CITIES.forEach((city, i) => {
      const x = (city.lng - MAP_CENTER_LNG) * SCALE_X;
      const y = (city.lat - MAP_CENTER_LAT) * SCALE_Y;
      
      dummy.position.set(x, y, PIN_HEIGHT / 2);
      dummy.rotation.x = Math.PI / 2;
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      pinsRef.current!.setMatrixAt(i, dummy.matrix);
    });

    pinsRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Simple, Classic Wireframe Line loop outline */}
      <lineLoop geometry={outlineGeometry}>
        <lineBasicMaterial color={themeColor} linewidth={2.5} transparent opacity={0.8} />
      </lineLoop>

      {/* Grid of outer coordinates for a high-tech blueprint grid projection inside boundary */}
      <gridHelper
        args={[4.5, 9, themeColor, themeColor]}
        position={[0, 0, -0.05]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        {/* Simple material override to make it transparent */}
        <meshBasicMaterial transparent opacity={0.06} color={themeColor} />
      </gridHelper>

      {/* Instanced vertical glowing cylinders */}
      <instancedMesh
        ref={pinsRef}
        args={[undefined as any, undefined as any, CITIES.length]}
      >
        <cylinderGeometry args={[0.015, 0.015, PIN_HEIGHT, 6]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.9} />
      </instancedMesh>

      {/* City sphere markers at the top of cylinders */}
      {CITIES.map((city, i) => {
        const x = (city.lng - MAP_CENTER_LNG) * SCALE_X;
        const y = (city.lat - MAP_CENTER_LAT) * SCALE_Y;
        return (
          <mesh key={i} position={[x, y, PIN_HEIGHT]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={themeColor} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function IndiaMap3D() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <IndiaMesh />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
