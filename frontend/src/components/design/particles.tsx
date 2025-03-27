import React, { useEffect, useRef } from "react";
import "./particles.css";

const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    
    const setCanvasSize = () => {
      canvas.width = parent.clientWidth; 
      canvas.height = parent.clientHeight 
    };

    setCanvasSize();

    const particles: Particle[] = [];
    const numParticles = 100;
    const colors = ["#FF5733", "#FFBD33", "#33FF57", "#3383FF", "#A833FF"];

    class Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;

      constructor() {
        
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.radius = Math.random() * 5 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
      }

      move() {
        if (!canvas) return;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0; // Clear previous particles
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    function getClosest(particle: Particle): Particle | null {
      return [...particles]
        .map(p => ({ p, d: Math.hypot(p.x - particle.x, p.y - particle.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(1, 2)
        .map(p => p.p)[0] || null;
    }

    function drawLines() {
      particles.forEach(p => {
        const closest = getClosest(p);
        if (!closest || !ctx) return;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(closest.x, closest.y);

        const gradient = ctx.createLinearGradient(p.x, p.y, closest.x, closest.y);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, closest.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    let animationFrameId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      particles.forEach(p => {
        p.move();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas className="particles" ref={canvasRef}></canvas>;
};

export default Particles;
