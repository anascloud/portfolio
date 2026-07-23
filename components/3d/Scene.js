"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, MeshDistortMaterial } from "@react-three/drei";

export default function Scene() {
  return (
    <Canvas className="!fixed top-0 left-0 z-0" camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={["#0f0f17"]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />

      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.5, 4]} />
          <MeshDistortMaterial
            color="#6366f1"
            distort={0.5}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
