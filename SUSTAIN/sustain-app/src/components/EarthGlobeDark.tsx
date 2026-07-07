"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function EarthGlobeDark() {
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

    const GLOBE_RADIUS = 2;
    const NEON_GREEN = 0x4ade80;

    // --- Shaders ---
    const EarthShader = {
      uniforms: {
        uDayTex: { value: null as THREE.Texture | null },
        uNightTex: { value: null as THREE.Texture | null },
        uSunDirection: { value: new THREE.Vector3(3, 2, 5).normalize() },
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
          float cosineAngle = dot(vNormal, uSunDirection);
          float dayWeight = smoothstep(-0.4, 0.4, cosineAngle);
          vec3 color = mix(nightColor, dayColor * 0.95, dayWeight);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    };

    const AtmosphereShader = {
      uniforms: {
        glowColor: { value: new THREE.Color("#4ADE80") },
        coefficient: { value: 0.06 },
        power: { value: 4.5 },
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
      `,
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

    let isDestroyed = false;
    const textureLoader = new THREE.TextureLoader();
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Base Earth
    const earthGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(EarthShader.uniforms),
      vertexShader: EarthShader.vertexShader,
      fragmentShader: EarthShader.fragmentShader,
    });
    const earth = new THREE.Mesh(earthGeom, earthMat);
    globeGroup.add(earth);

    textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
      (tex) => {
        earthMat.uniforms.uDayTex.value = tex;
        earthMat.needsUpdate = true;
      }
    );
    textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_lights_2048.png",
      (tex) => {
        earthMat.uniforms.uNightTex.value = tex;
        earthMat.needsUpdate = true;
      }
    );

    // 2. Cloud Layer
    const cloudGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.02, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.NormalBlending,
      roughness: 1.0,
      metalness: 0.0,
    });
    const clouds = new THREE.Mesh(cloudGeom, cloudMat);
    textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_clouds_2048.png",
      (tex) => {
        cloudMat.map = tex;
        cloudMat.needsUpdate = true;
      }
    );
    globeGroup.add(clouds);

    // 3. Atmosphere glow
    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(AtmosphereShader.uniforms),
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
    scene.add(atmosphere);

    // 4. Stars
    const starGeom = new THREE.BufferGeometry();
    const starPos: number[] = [];
    for (let i = 0; i < 5000; i++) {
      starPos.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
    }
    starGeom.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // 5. Lighting
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(3, 2, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x404040, 0.4));

    // 6. Pulsating markers
    const markersData = [
      { lat: 19.076, lng: 72.8777 },  // Mumbai
      { lat: 28.6139, lng: 77.209 },  // Delhi
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 22.5726, lng: 88.3639 }, // Kolkata
      { lat: 17.385, lng: 78.4867 },  // Hyderabad
      { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      { lat: 26.8467, lng: 80.9462 }, // Lucknow
    ];

    const pulsables: { ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; startTime: number }[] = [];
    const disposables: { geom: THREE.BufferGeometry; mat: THREE.Material }[] = [];

    markersData.forEach((m) => {
      const pos = latLongToVector3(m.lat, m.lng, GLOBE_RADIUS + 0.01);

      const markerGeom = new THREE.SphereGeometry(0.03, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: NEON_GREEN });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.copy(pos);
      globeGroup.add(marker);
      disposables.push({ geom: markerGeom, mat: markerMat });

      const ringGeom = new THREE.RingGeometry(0.045, 0.06, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: NEON_GREEN,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      globeGroup.add(ring);
      disposables.push({ geom: ringGeom, mat: ringMat });

      pulsables.push({ ring, ringMat, startTime: Math.random() * 100 });
    });

    // Camera
    camera.position.copy(latLongToVector3(22, 79, 12));
    camera.lookAt(0, 0, 0);
    const targetPos = latLongToVector3(22, 79, 6.5);
    const initialPos = camera.position.clone();
    const startTime = Date.now();
    const duration = 2500;

    let animationFrameId: number;

    const animate = () => {
      if (isDestroyed) return;
      animationFrameId = requestAnimationFrame(animate);
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < duration) {
        const t = elapsed / duration;
        const ease = 1 - Math.pow(1 - t, 4);
        camera.position.lerpVectors(initialPos, targetPos, ease);
        camera.lookAt(0, 0, 0);
      } else {
        globeGroup.rotation.y += 0.0008;
      }

      pulsables.forEach(({ ring, ringMat, startTime: st }) => {
        const pulse = (Math.sin(now * 0.005 + st) + 1) / 2;
        ring.scale.set(1 + pulse, 1 + pulse, 1);
        ringMat.opacity = 0.8 * (1 - pulse * 0.8);
      });

      clouds.rotation.y += 0.0004;
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
      earthGeom.dispose();
      earthMat.dispose();
      cloudGeom.dispose();
      cloudMat.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
      starGeom.dispose();
      starMat.dispose();
      disposables.forEach(({ geom, mat }) => {
        geom.dispose();
        mat.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" style={{ background: "transparent" }} />;
}
