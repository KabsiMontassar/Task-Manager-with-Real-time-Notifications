import React, { useEffect, useRef } from 'react';
import './soda.css';

const Soda: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); 

  useEffect(() => {
    const canvas = canvasRef.current; 
    if (!canvas) return; 

    const ctx = canvas.getContext('2d');
    if (!ctx) return; 

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubblesArray: Bubble[] = [];
    const numberOfBubbles = 200;

    class Bubble {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      color: string;
      shadowBlur: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 100;
        this.size = Math.random() * 5 + 2;
        this.speedY = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
        this.shadowBlur = Math.random() * 100;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < -this.size) {
          this.y = canvas!.height + this.size;
          this.x = Math.random() * canvas!.width;
          this.speedY = Math.random() * 3 + 1;
          this.size = Math.random() * 5 + 2;
          this.opacity = Math.random() * 0.5 + 0.2;
          this.color = `rgba(255, 255, 255, ${this.opacity})`;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Add glow effect
        ctx!.shadowColor = this.color;
        ctx!.shadowBlur = this.shadowBlur;
        ctx!.fillStyle = this.color;
        ctx!.fill();

        ctx!.shadowColor = 'transparent';
        ctx!.shadowBlur = 0;
      }
    }

    function init() {
      for (let i = 0; i < numberOfBubbles; i++) {
        bubblesArray.push(new Bubble());
      }
    }

    function handleBubbles() {
      bubblesArray.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });
    }

    function animate() {
        ctx!.fillStyle = 'rgba(13, 17, 23, 0.8)';
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      handleBubbles();

      requestAnimationFrame(animate);
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    init();
    animate();

    // Cleanup resize listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas className='particles' ref={canvasRef}></canvas>;
};

export default Soda;
