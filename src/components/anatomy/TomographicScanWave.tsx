import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TomographicScanWaveProps {
  active?: boolean;
  color?: string;
  speed?: number;
  heightMin?: number;
  heightMax?: number;
}

/**
 * Custom GLSL Shader for real-time volumetric tomographic laser sweep.
 * Simulates a medical CT/MRI scanner beam moving vertically across the human anatomy
 * with smooth Signed Distance Field (SDF) falloff and glowing laser contour.
 */
export function TomographicScanWave({
  active = true,
  color = '#00e5ff',
  speed = 0.65,
  heightMin = -0.1,
  heightMax = 2.15,
}: TomographicScanWaveProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const customShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uScanY: { value: 1.0 },
        uThickness: { value: 0.045 },
        uRange: { value: new THREE.Vector2(heightMin, heightMax) },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uScanY;
        uniform float uThickness;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
          // Distance from the current laser plane height
          float dist = abs(vWorldPosition.y - uScanY);

          // Signed Distance Field (SDF) falloff
          float coreBeam = smoothstep(uThickness, 0.0, dist);
          float outerGlow = smoothstep(uThickness * 4.5, 0.0, dist) * 0.45;
          float totalIntensity = coreBeam + outerGlow;

          if (totalIntensity < 0.01) {
            discard;
          }

          // Fresnel edge grazing brightness
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

          vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), coreBeam * 0.7);
          float alpha = (totalIntensity * 0.85 + fresnel * 0.35);

          gl_FragColor = vec4(finalColor, min(alpha, 0.92));
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, [color, heightMin, heightMax]);

  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.getElapsedTime();
    // Oscillate vertically between heightMin and heightMax
    const cycle = (Math.sin(t * speed) + 1.0) * 0.5;
    const currentY = heightMin + cycle * (heightMax - heightMin);

    customShaderMaterial.uniforms.uTime.value = t;
    customShaderMaterial.uniforms.uScanY.value = currentY;
    if (meshRef.current) {
      meshRef.current.position.y = currentY;
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* Horizontal laser plane slice disc */}
      <mesh ref={meshRef} position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, 0.95, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Volumetric bounding cylinder scan shell with custom GLSL SDF shader */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 2.3, 32, 1, true]} />
        <primitive object={customShaderMaterial} attach="material" />
      </mesh>
    </group>
  );
}
