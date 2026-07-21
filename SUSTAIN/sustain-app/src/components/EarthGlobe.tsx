"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function EarthGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Constants & Config ---
    const GLOBE_RADIUS = 2;
    const BORDER_RADIUS = 2.005;
    const MARKER_RADIUS = 2.04;
    const BRAND_GREEN = "#0F5132"; // Primary brand green
    const BORDER_SUBTLE = "#707971"; // Outline gray
    const ATMOSPHERE_COLOR = "#4ade80";

    // --- Shaders ---
    const EarthShader = {
      uniforms: {
        uDayTex: { value: null as THREE.Texture | null },
        uNightTex: { value: null as THREE.Texture | null },
        uSunDirection: { value: new THREE.Vector3(3, 2, 5).normalize() }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayTex;
        uniform sampler2D uNightTex;
        uniform vec3 uSunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vec3 dayColor = texture2D(uDayTex, vUv).rgb;
          vec3 nightColor = texture2D(uNightTex, vUv).rgb;
          float dotNL = dot(vNormal, uSunDirection);
          float dayWeight = smoothstep(-0.4, 0.4, dotNL);
          
          // Cap dayColor to prevent white glare from bright texture regions
          vec3 clampedDay = min(dayColor * 0.85, vec3(0.78));
          vec3 color = mix(nightColor * 0.6, clampedDay, dayWeight);
          gl_FragColor = vec4(color, 1.0);
        }
      `
    };

    const AtmosphereShader = {
      uniforms: {
        glowColor: { value: new THREE.Color(ATMOSPHERE_COLOR) },
        coefficient: { value: 0.04 },
        power: { value: 4.5 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float coefficient;
        uniform float power;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float intensity = pow(1.0 + dot(vNormal, vViewDir), power);
          gl_FragColor = vec4(glowColor, intensity);
        }
      `
    };

    const latLongToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const textureLoader = new THREE.TextureLoader();
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Earth
    const earthGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(EarthShader.uniforms),
      vertexShader: EarthShader.vertexShader,
      fragmentShader: EarthShader.fragmentShader
    });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    globeGroup.add(earth);

    // Load textures
    textureLoader.load(
      "https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg",
      (tex) => {
        earthMat.uniforms.uDayTex.value = tex;
        earthMat.needsUpdate = true;
      }
    );
    textureLoader.load(
      "https://raw.githubusercontent.com/turban/webgl-earth/master/images/earth-night-4k.jpg",
      (tex) => {
        earthMat.uniforms.uNightTex.value = tex;
        earthMat.needsUpdate = true;
      }
    );

    // 2. Atmosphere
    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(AtmosphereShader.uniforms),
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
    scene.add(atmosphere);

    // 3. Borders
    const borderGroup = new THREE.Group();
    globeGroup.add(borderGroup);

    let isDestroyed = false;

    const loadBorders = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
        );
        const data = await response.json();
        
        if (isDestroyed) return;

        data.features.forEach((feature: any) => {
          const isIndia =
            feature.properties.NAME === "India" || feature.properties.ISO_A3 === "IND";
          const color = isIndia ? BRAND_GREEN : BORDER_SUBTLE;
          const opacity = isIndia ? 1.0 : 0.25;

          const renderPoly = (points: number[][]) => {
            const vertices: number[] = [];
            points.forEach((p) => {
              const v = latLongToVector3(p[1], p[0], BORDER_RADIUS);
              vertices.push(v.x, v.y, v.z);
            });
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
            const line = new THREE.Line(geometry, material);
            borderGroup.add(line);
          };

          if (feature.geometry.type === "Polygon") {
            renderPoly(feature.geometry.coordinates[0]);
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((poly: number[][][]) => renderPoly(poly[0]));
          }
        });
      } catch (e) {
        console.error("Failed to load borders: ", e);
      }
    };
    loadBorders();

    // 4. Markers
    const markersData = [
      { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
      { name: "Delhi", lat: 28.7041, lng: 77.1025 },
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Kolkata", lat: 22.5726, lng: 88.3639 }
    ];

    const markerGeom = new THREE.SphereGeometry(0.025, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: BRAND_GREEN });

    const pulseMeshes: { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial }[] = [];

    markersData.forEach((m) => {
      const pos = latLongToVector3(m.lat, m.lng, MARKER_RADIUS);
      const mesh = new THREE.Mesh(markerGeom, markerMat);
      mesh.position.copy(pos);
      globeGroup.add(mesh);
      
      const pulseGeom = new THREE.SphereGeometry(0.04, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({ color: BRAND_GREEN, transparent: true, opacity: 0.4 });
      const pulse = new THREE.Mesh(pulseGeom, pulseMat);
      pulse.position.copy(pos);
      globeGroup.add(pulse);
      pulseMeshes.push({ mesh: pulse, material: pulseMat });
    });

    // Camera settings
    camera.position.copy(latLongToVector3(22, 79, 10));
    camera.lookAt(0, 0, 0);

    const targetCameraPos = latLongToVector3(22, 79, 6.5);
    let isMoving = true;
    let animationFrameId: number;

    const animate = () => {
      if (isDestroyed) return;
      animationFrameId = requestAnimationFrame(animate);
      const now = Date.now();
      
      if (isMoving && targetCameraPos) {
        camera.position.lerp(targetCameraPos, 0.03);
        camera.lookAt(0, 0, 0);
        if (camera.position.distanceTo(targetCameraPos) < 0.05) isMoving = false;
      } else {
        globeGroup.rotation.y += 0.0008;
      }

      pulseMeshes.forEach(({ mesh, material }) => {
        const s = 1 + Math.sin(now * 0.005) * 0.5;
        mesh.scale.set(s, s, s);
        material.opacity = 0.4 * (1 - (s - 1));
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      // Dispose resources
      earthGeom.dispose();
      earthMat.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
      markerGeom.dispose();
      markerMat.dispose();
      borderGroup.children.forEach((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      pulseMeshes.forEach(({ mesh, material }) => {
        mesh.geometry.dispose();
        material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
