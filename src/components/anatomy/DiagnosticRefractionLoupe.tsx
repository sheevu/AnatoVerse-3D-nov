import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DiagnosticRefractionLoupeProps {
  active?: boolean;
  position?: [number, number, number];
}

/**
 * Diagnostic Optical Refraction Loupe with subtle chromatic dispersion
 * and Fresnel reflection. Used to examine fine microvascular structures
 * without disrupting global anatomical context.
 */
export function DiagnosticRefractionLoupe({
  active = false,
  position = [0, 1.25, 0.42],
}: DiagnosticRefractionLoupeProps) {
  const loupeRef = useRef<THREE.Group>(null);

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e0f2fe'),
      transmission: 0.94,
      opacity: 1.0,
      transparent: true,
      roughness: 0.04,
      ior: 1.52, // Crown glass refractive index
      thickness: 0.35,
      dispersion: 0.025, // Subtle chromatic optical dispersion
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (!loupeRef.current || !active) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating breathing sway
    loupeRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.02;
    loupeRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
  });

  if (!active) return null;

  return (
    <group ref={loupeRef} position={position}>
      {/* 1. High-Precision Refractive Glass Lens Disc */}
      <mesh material={glassMaterial}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 36]} />
      </mesh>

      {/* 2. Titanium / Cyan Medical Bezel Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.012, 16, 48]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* 3. Reticle Crosshair Grid on the lens */}
      <group position={[0, 0, 0.012]}>
        {/* Horizontal & Vertical Crosshairs */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  -0.16, 0, 0,  0.16, 0, 0,
                  0, -0.16, 0,  0, 0.16, 0,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.4} />
        </lineSegments>

        {/* Concentric Calibration Ring */}
        <mesh>
          <ringGeometry args={[0.08, 0.084, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
