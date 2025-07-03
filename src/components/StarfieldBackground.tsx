import React, { useRef, useEffect } from "react";
import classes from "./StarfieldBackground.module.scss";

interface Dot {
  x: number;
  y: number;
  r: number;
}

interface StarfieldBackgroundProps {
  numDots?: number;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  numDots = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const dots: Dot[] = Array.from({ length: numDots }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      dots.forEach((d) => {
        d.x += (Math.random() - 0.5) * 0.2;
        d.y += (Math.random() - 0.5) * 0.2;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
      });
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [numDots]);

  return <canvas ref={canvasRef} className={classes.starfieldBackground} />;
};

export default StarfieldBackground;
