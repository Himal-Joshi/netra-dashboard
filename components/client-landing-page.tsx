"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { MainLoginButton } from "@/components/login-button";
import { Footer } from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

interface Stats {
  server_count?: number;
  member_count?: number;
  ping?: number;
}

export default function ClientLandingPage({ stats }: { stats: Stats | null }) {
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const threejsContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll Parallax Hooks
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const yFeatures = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Shader logic (Background Texture)
  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas!.clientWidth || window.innerWidth;
      const h = canvas!.clientHeight || window.innerHeight;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    if (!gl) return;
    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `
precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
    vec2 uv = v_texCoord;
    float n = smoothNoise(uv * 3.0 + u_time * 0.1);
    n += 0.5 * smoothNoise(uv * 6.0 - u_time * 0.05);
    
    vec3 color1 = vec3(0.03, 0.035, 0.05); // Very dark navy
    vec3 color2 = vec3(0.345, 0.396, 0.949); // Netra Primary (#5865f2)
    
    vec3 finalColor = mix(color1, color1 * 1.5, n);
    finalColor = mix(finalColor, color2 * 0.15, pow(n, 4.0));
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;
    function cs(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    function render(t: number) {
      if (typeof ResizeObserver === "undefined") syncSize();
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      if (uTime) gl!.uniform1f(uTime, t * 0.001);
      if (uRes) gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      if (uMouse) gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Three.js logic (Interactive Core)
  useEffect(() => {
    const container = threejsContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Increased brightness
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x5865f2, 15, 100); // Brighter glow
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const group = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(1.8, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x5865f2,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const outerGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x5865f2, // Changed to primary blue so it's visible in light mode
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    group.add(outer);

    scene.add(group);
    camera.position.z = 7;

    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (event: MouseEvent) => {
      targetRotationX = (event.clientY / window.innerHeight - 0.5) * 1.5;
      targetRotationY = (event.clientX / window.innerWidth - 0.5) * 1.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.005 + (targetRotationY - group.rotation.y) * 0.05;
      group.rotation.x += 0.002 + (targetRotationX - group.rotation.x) * 0.05;
      core.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.03);
      renderer.render(scene, camera);
    }

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Background Shader - Hidden in light mode to prevent dark overlay */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-10 dark:opacity-60 transition-opacity duration-1000">
        <canvas
          ref={shaderCanvasRef}
          className="w-full h-full block"
        ></canvas>
      </div>

      {/* Glowing Ambient Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Edge-to-Edge Navigation */}
      <nav className="w-full top-0 backdrop-blur-xl bg-background/30 sticky z-50 border-b border-white/5 transition-colors">
        <div className="flex justify-between items-center w-full px-8 md:px-12 lg:px-24 py-5 mx-auto">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image priority src="/name.png" alt="Netra" width={160} height={60} className="h-12 w-auto object-contain filter dark:drop-shadow-none drop-shadow-md" />
          </Link>
          <div className="hidden md:flex items-center gap-16 font-mono text-sm tracking-[0.2em] uppercase font-semibold">
            <Link className="text-primary relative group" href="/">
              Home
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary transform scale-x-100 transition-transform"></span>
            </Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors relative group" href="/commands">
              Commands
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link className="text-muted-foreground hover:text-foreground transition-colors relative group" href="/support">
              Support
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1522552291327082628" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <div className="flex h-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-6 transition-all hover:bg-gradient-to-r hover:from-primary hover:to-blue-400 hover:text-white hover:border-transparent text-primary font-mono font-bold text-xs tracking-widest uppercase cursor-pointer hover:shadow-[0_0_15px_rgba(88,101,242,0.6)]">
                Invite Netra
              </div>
            </a>
            <MainLoginButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-16 pb-32">
        {/* Hero Section */}
        <motion.section 
          style={{ y: yHero, opacity: opacityHero }}
          className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative text-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 mb-12 relative"
          >
            <h2 className="text-7xl md:text-9xl font-extrabold tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-black/40 dark:from-white dark:via-white dark:to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              NETRA
            </h2>
            <p className="text-sm md:text-lg text-primary uppercase tracking-[0.4em] font-mono font-bold drop-shadow-[0_0_10px_rgba(88,101,242,0.5)]">
              Intelligence in Silence
            </p>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="relative w-full aspect-square max-w-lg mx-auto mb-16 flex items-center justify-center pointer-events-none"
          >
            <div
              ref={threejsContainerRef}
              className="w-full h-full pointer-events-auto"
            ></div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          style={{ y: yFeatures }}
          className="px-6 md:px-12 max-w-7xl mx-auto space-y-12 mt-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                version: "v0.9.2",
                title: "Precise Engineering",
                desc: "Built on a foundation of highly optimized architectures and micro-optimization for peak tactical efficiency."
              },
              {
                icon: "🛡️",
                version: "STEALTH",
                title: "Silent Operations",
                desc: "The engine hums at a frequency undetectable by traditional analysis tools, ensuring your workflow remains truly private."
              },
              {
                icon: "📊",
                version: "ANALYTICS",
                title: "Everyday Server Management Made Easy",
                desc: "Deep metric tracking and intuitive moderation tools that adapt to your unique operational rhythm, surfacing critical insights effortlessly."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                whileHover={{ y: -10, rotateX: 5, rotateY: -5 }}
                className="bg-card/70 dark:bg-card/20 backdrop-blur-2xl border border-border dark:border-white/10 p-10 rounded-2xl flex flex-col gap-6 shadow-2xl hover:border-primary/60 hover:shadow-[0_0_30px_rgba(88,101,242,0.15)] transition-colors duration-500 group"
                style={{ transformPerspective: 1000 }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">{feature.icon}</span>
                  <span className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded border border-primary/20 font-mono tracking-widest font-bold">
                    {feature.version}
                  </span>
                </div>
                <h3 className="text-3xl text-foreground font-bold tracking-tight">{feature.title}</h3>
                <p className="text-foreground/80 dark:text-muted-foreground text-base leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technical Specs Section (With Real Stats) */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="px-6 md:px-12 max-w-7xl mx-auto mt-40 pb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-2xl text-center shadow-xl hover:border-primary/50 transition-colors group">
              <div className="text-xs text-muted-foreground mb-3 font-mono tracking-widest">LATENCY (PING)</div>
              <div className="text-2xl md:text-3xl text-foreground font-mono font-bold group-hover:text-primary transition-colors">{stats?.ping ? `${stats.ping}ms` : "---"}</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-2xl text-center shadow-xl hover:border-primary/50 transition-colors group">
              <div className="text-xs text-muted-foreground mb-3 font-mono tracking-widest">USERS</div>
              <div className="text-2xl md:text-3xl text-foreground font-mono font-bold group-hover:text-primary transition-colors">{stats?.member_count || "---"}</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-2xl text-center shadow-xl hover:border-primary/50 transition-colors group">
              <div className="text-xs text-muted-foreground mb-3 font-mono tracking-widest">SERVERS</div>
              <div className="text-2xl md:text-3xl text-foreground font-mono font-bold group-hover:text-primary transition-colors">{stats?.server_count || "---"}</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-2xl text-center shadow-xl hover:border-primary/50 transition-colors group">
              <div className="text-xs text-muted-foreground mb-3 font-mono tracking-widest">STATUS</div>
              <div className="text-2xl md:text-3xl text-foreground font-mono font-bold flex items-center justify-center gap-3 group-hover:text-primary transition-colors">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                ONLINE
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
