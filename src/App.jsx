import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  'Not your regular lawyer',
  'I make rules bend',
  'Case closed. Lips glossed.',
  'Some break laws. I break limits.'
];

function BackgroundFX({ scene, mouse, reduced }) {
  const mat = useRef(null);
  useFrame(({ clock }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.elapsedTime;
    mat.current.uniforms.uScene.value = scene;
    mat.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.x, mouse.y), 0.1);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={{
          uTime: { value: 0 },
          uScene: { value: 1 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uReduced: { value: reduced ? 1 : 0 }
        }}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.0);}`}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime; uniform float uScene; uniform vec2 uMouse; uniform float uReduced;
          float noise(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          void main(){
            vec3 white = vec3(0.98);
            vec3 ink = vec3(0.07,0.05,0.1);
            float g = noise(vUv * (uReduced > 0.5 ? 80.0 : 140.0) + uTime * 0.05) * 0.04;
            float sceneMix = smoothstep(1.5, 3.8, uScene);
            vec3 col = mix(white + g, mix(vec3(0.95), ink, 0.12), sceneMix);
            float sparkle = 0.0;
            if (uScene > 3.5) {
              float d = distance(vUv, uMouse);
              sparkle = (1.0 - smoothstep(0.0, 0.35, d)) * (0.06 + 0.04 * sin(uTime * 8.0));
            }
            gl_FragColor = vec4(col + sparkle, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function App() {
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  const subjectRef = useRef(null);
  const sideRef = useRef(null);
  const [scene, setScene] = useState(1);
  const [line, setLine] = useState(lines[0]);
  const [ctaState, setCtaState] = useState('sleeping');
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('');
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.panel');
      panels.forEach((panel, idx) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            const n = idx + 1;
            setScene(n + p * 0.2);
            if (n === 1) {
              if (p < 0.25) setLine(lines[0]);
              else if (p < 0.55) setLine(lines[1]);
              else if (p < 0.8) setLine(lines[2]);
              else setLine(lines[3]);
            }
            if (n === 4 && p > 0.2) setCtaState('armed');
          }
        });
      });

      gsap.fromTo(imageRef.current, { y: 120, scale: 0.92 }, { y: -20, scale: 1.03, scrollTrigger: { trigger: '.scene-2', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo(subjectRef.current, { y: 60, x: 0, scale: 0.98 }, { y: -35, x: -40, scale: 1.08, scrollTrigger: { trigger: '.scene-3', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo(sideRef.current, { x: 80, opacity: 0 }, { x: 0, opacity: 1, scrollTrigger: { trigger: '.scene-2', start: 'top center', end: 'bottom center', scrub: true } });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      consent: fd.get('consent') === 'on',
      consentTextVersion: 'v1'
    };
    setStatus('Submitting...');
    try {
      const res = await fetch('https://example-worker.dev/case', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('endpoint unavailable');
      const data = await res.json();
      setSession(data);
      setCtaState('upload');
      setStatus(`Case created: ${data.caseId}`);
    } catch {
      const local = { caseId: `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1e6).toString().padStart(6, '0')}` };
      setSession(local);
      setCtaState('upload');
      setStatus(`Demo mode active. Case created: ${local.caseId}`);
    }
  };

  return (
    <div ref={wrapperRef} className="app" onPointerMove={(e) => setMouse({ x: e.clientX / innerWidth, y: 1 - e.clientY / innerHeight })}>
      <div className="canvas-wrap">
        <Canvas dpr={reduced ? [1, 1] : [1, 1.5]}>
          <BackgroundFX scene={scene} mouse={mouse} reduced={reduced} />
        </Canvas>
      </div>

      <section className="panel scene-1">
        <h1>{line}</h1>
        <p className="tiny">HX-{Math.floor(scene * 9281).toString(16).toUpperCase()}</p>
      </section>

      <section className="panel scene-2">
        <div className="frame" ref={imageRef}><img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1920&q=80" alt="Subject"/></div>
        <div className="subject" ref={subjectRef}><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80" alt="Subject cutout"/></div>
        <div className="side" ref={sideRef}>Rules are clay. Outcomes are sculpture.</div>
      </section>

      <section className="panel scene-3">
        <div className="recompose">Case closed. Lips glossed.</div>
      </section>

      <section className="panel scene-4">
        <h2>Seal the case in one click.</h2>
      </section>

      <button className={`cta ${ctaState !== 'sleeping' ? 'armed' : ''}`} disabled={ctaState === 'sleeping'} onClick={() => setOpen(true)}>
        {ctaState === 'sleeping' ? 'Seal your case in one click' : ctaState === 'upload' ? 'Upload files' : 'Open intake'}
      </button>

      {open ? (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Intake</h3>
            {!session ? (
              <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" required minLength={2} />
                <input name="email" type="email" placeholder="Email" required />
                <label><input name="consent" type="checkbox" required /> I confirm these files are mine to share and I agree to the processing of my data for case evaluation.</label>
                <button type="submit">Submit details</button>
              </form>
            ) : (
              <form onSubmit={(e)=>{e.preventDefault(); setStatus('Upload stub complete. Connect backend /upload endpoint.');}}>
                <input type="file" multiple />
                <button type="submit">Upload files</button>
              </form>
            )}
            <p>{status}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
