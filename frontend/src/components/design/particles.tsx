import React, { useEffect } from "react";
import "./particles.css";

const Particles: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById("particleCanvas") as HTMLCanvasElement; // Type canvas as HTMLCanvasElement
    const ctx = canvas.getContext("2d");

    if (!canvas || !ctx) return; // Ensure canvas and ctx are available

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 5 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
      }

      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
      }

      draw() {
         if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
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
        if (!closest) return;
        if(!ctx) return;
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

    function animate() {
        if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
      particles.forEach(p => {
        p.move();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas id="particleCanvas"></canvas>;
};

export default Particles;
