"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type BackgroundPlaneProps = {
  progress: number;
};

function BackgroundPlane({ progress }: BackgroundPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uProgress.value = progress;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: progress }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uProgress;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(in vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.12;
            float flow = noise(uv * 4.0 + vec2(t, -t));
            float haze = smoothstep(0.2, 0.85, flow + (uProgress * 0.2));
            vec3 base = vec3(0.02, 0.02, 0.04);
            vec3 gloss = vec3(0.58, 0.37, 0.84) * haze * 0.33;
            float sweep = smoothstep(0.0, 1.0, sin((uv.x + uProgress) * 6.2831) * 0.5 + 0.5);
            vec3 color = base + gloss + vec3(0.15, 0.08, 0.18) * sweep * 0.12;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function CanvasBG({ progress }: BackgroundPlaneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas dpr={[1, 1.6]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <BackgroundPlane progress={progress} />
      </Canvas>
    </div>
  );
}
