"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function SkyDome() {
  const uniforms = useMemo(() => ({
    uColorTop: { value: new THREE.Color("#0b0b2e") },
    uColorMid: { value: new THREE.Color("#2a1a4a") },
    uColorHorizon: { value: new THREE.Color("#e8845a") },
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <sphereGeometry args={[120, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorTop;
          uniform vec3 uColorMid;
          uniform vec3 uColorHorizon;
          uniform float uTime;

          varying vec3 vPos;

          void main() {
            vec3 dir = normalize(vPos);
            float y = dir.y;

            vec3 color;
            float t = clamp(y / 0.6, 0.0, 1.0);
            color = mix(uColorHorizon, uColorMid, smoothstep(0.0, 0.3, t));
            color = mix(color, uColorTop, smoothstep(0.3, 1.0, t));

            float horizonGlow = exp(-abs(y) * 6.0);
            color += vec3(1.0, 0.6, 0.3) * horizonGlow * 0.1;

            float cloud = sin(dir.x * 14.0 + dir.z * 9.0 + uTime * 0.015) *
                          sin(dir.x * 7.0 - dir.z * 13.0 + uTime * 0.012) * 0.5 + 0.5;
            float cloudMask = smoothstep(0.25, 0.55, y) * smoothstep(0.7, 0.3, y);
            color += vec3(0.9, 0.5, 0.3) * cloud * cloudMask * 0.08;

            color += vec3(1.0, 0.85, 0.5) * horizonGlow * 0.08;

            float star = pow(max(0.0, sin(dir.x * 150.0 + dir.y * 100.0 + dir.z * 200.0) * 0.5 + 0.5), 40.0);
            star *= smoothstep(0.4, 0.8, y);
            color += vec3(1.0) * star * 0.5;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.getElapsedTime() * 0.3) * 0.015;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group>
      <mesh position={[14, 3, -25]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#ff8833" transparent opacity={0.12} />
      </mesh>
      <mesh ref={meshRef} position={[14, 3, -25]}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial color="#ffddaa" />
      </mesh>
    </group>
  );
}

function Ocean() {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color("#073642") },
    uColorShallow: { value: new THREE.Color("#1a8a8a") },
    uColorFoam: { value: new THREE.Color("#6ae0d0") },
    uSunDir: { value: new THREE.Vector3(0.6, 0.2, 0.8).normalize() },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[80, 80, 256, 256]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          varying vec3 vNormal;
          varying vec3 vViewPos;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float x = pos.x;
            float y = pos.y;

            float w1 = sin(x * 0.30 + uTime * 0.8) * 0.35;
            float w2 = sin(y * 0.25 + uTime * 0.65) * 0.25;
            float w3 = sin((x + y) * 0.16 + uTime * 0.45) * 0.18;
            float w4 = sin(x * 0.6 - y * 0.35 + uTime * 1.1) * 0.12;
            float w5 = sin(x * 0.12 + y * 0.20 + uTime * 0.3) * 0.20;

            pos.z = w1 + w2 + w3 + w4 + w5;
            vElevation = pos.z;

            float dx = 0.30 * 0.8 * cos(x * 0.30 + uTime * 0.8) * 0.35
                     + 0.16 * 0.45 * cos((x + y) * 0.16 + uTime * 0.45) * 0.18
                     + 0.60 * 1.1 * cos(x * 0.6 - y * 0.35 + uTime * 1.1) * 0.12
                     + 0.12 * 0.3 * cos(x * 0.12 + y * 0.20 + uTime * 0.3) * 0.20;

            float dy = 0.25 * 0.65 * cos(y * 0.25 + uTime * 0.65) * 0.25
                     + 0.16 * 0.45 * cos((x + y) * 0.16 + uTime * 0.45) * 0.18
                     - 0.35 * 1.1 * cos(x * 0.6 - y * 0.35 + uTime * 1.1) * 0.12
                     + 0.20 * 0.3 * cos(x * 0.12 + y * 0.20 + uTime * 0.3) * 0.20;

            vec3 normal = normalize(vec3(-dx, -dy, 1.0));
            vNormal = normal;

            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            vViewPos = mvPos.xyz;

            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          uniform vec3 uColorDeep;
          uniform vec3 uColorShallow;
          uniform vec3 uColorFoam;
          uniform vec3 uSunDir;

          varying vec2 vUv;
          varying float vElevation;
          varying vec3 vNormal;
          varying vec3 vViewPos;

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(-vViewPos);

            float waveHeight = clamp((vElevation + 1.0) / 2.0, 0.0, 1.0);

            vec3 color = mix(uColorDeep, uColorShallow, waveHeight);
            color = mix(color, uColorFoam, pow(waveHeight, 3.0) * 0.35);

            float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
            fresnel = pow(fresnel, 4.0);
            color += vec3(0.3, 0.5, 0.7) * fresnel * 0.25;

            vec3 lightDir = normalize(uSunDir);
            vec3 halfVec = normalize(lightDir + viewDir);
            float spec = pow(max(dot(normal, halfVec), 0.0), 128.0);
            color += vec3(1.0, 0.85, 0.5) * spec * 0.45;

            float foam = smoothstep(0.7, 0.95, waveHeight);
            color += vec3(0.8, 0.9, 1.0) * foam * 0.15;

            float alpha = 0.88 + waveHeight * 0.12;

            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Particles() {
  const count = 300;
  const meshRef = useRef<THREE.Points>(null!);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 12 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    return [pos] as const;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(t * 0.2 + i) * 0.001;
      pos.array[i * 3] += Math.sin(t * 0.15 + i * 1.3) * 0.001;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#8899bb"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function Scene() {
  return (
    <Canvas
      className="!fixed top-0 left-0 z-0"
      camera={{ position: [0, 2, 10], fov: 65 }}
      gl={{ antialias: true, alpha: false }}
    >
      <SkyDome />
      <Sun />
      <Ocean />
      <Particles />

      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 6, 5]} intensity={0.7} color="#ffcc88" />
      <directionalLight position={[-5, 4, -5]} intensity={0.25} color="#4488ff" />

      <fogExp2 attach="fog" args={["#0b0b2e", 0.006]} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 8}
      />
    </Canvas>
  );
}
