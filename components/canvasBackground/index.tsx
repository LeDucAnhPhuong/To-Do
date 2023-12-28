/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  width: number;
  height: number;
};
let animate: any = 0;
let mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};
let timeOut: any;
const arrayRandomNumber = [-1, 1];
let canvasArray: any[] = [];
const arrayColor = ["#D62839", "#BA324F", "#175676", "#4BA3C3", "#CCE6F4"];
import { useEffect, useRef, useState } from "react";
const CanvasBackground = ({ width, height }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState<boolean>(true);
  function drawCanvas() {
    const ctx = canvasRef?.current?.getContext("2d");

    function createCanvas(this: any) {
      this.maxRadius = Math.round(Math.random() * 5) + 5;
      this.x = Math.random() * (width - 2 * this.maxRadius) + this.maxRadius;
      this.y = Math.random() * (height - 2 * this.maxRadius) + this.maxRadius;
      this.opacity = Math.abs(Math.random() - 0.5) + 0.5;
      this.radius = 0;
      this.velocity = {
        x:
          (Math.random() * 0.05 + 0.05) *
          arrayRandomNumber[Math.round(Math.random())],
        y:
          (Math.random() * 0.05 + 0.05) *
          arrayRandomNumber[Math.round(Math.random())],
      };
      this.radius = 0;
      this.color = arrayColor[Math.round(Math.random() * 6) % 6];
      this.draw = () => {
        ctx?.beginPath();
        ctx!.globalAlpha = this.opacity;
        ctx!.fillStyle = this.color;
        ctx?.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx?.fill();
        ctx?.closePath();
      };
      this.update = () => {
        if (
          this.x - this.maxRadius < 0 ||
          this.x + this.maxRadius > window.innerWidth
        ) {
          this.velocity.x = -this.velocity.x;
        }
        if (
          this.y - this.maxRadius < 0 ||
          this.y + this.maxRadius > window.innerHeight
        ) {
          this.velocity.y = -this.velocity.y;
        }
        if (this.radius < this.maxRadius) this.radius += 0.5;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (
          Math.abs(this.x - mouse.x) < 50 &&
          Math.abs(this.y - mouse.y) < 50
        ) {
          if (this.radius < 60) this.radius += 0.5;
        } else if (this.radius > this.maxRadius) this.radius -= 0.5;
        this.draw();
      };
    }
    (function create() {
      for (let i = 0; i < 500; i++) {
        canvasArray = [...canvasArray, new (createCanvas as any)()];
      }
    })();
    function animation() {
      ctx?.clearRect(0, 0, width, height);
      if (canvasArray.length !== 0) {
        for (let i = 0; i < 500; i++) {
          canvasArray[i]?.update();
        }
      }
      animate = window.requestAnimationFrame(animation);
    }
    animation();
  }
  useEffect(() => {
    if (!open) return () => window.cancelAnimationFrame(animate);
    drawCanvas();
    return () => window.cancelAnimationFrame(animate);
  }, [open]);
  useEffect(() => {
    window.addEventListener("mousemove", (event: MouseEvent) => {
      mouse = {
        x: event.x,
        y: event.y,
      };
    });
    window.addEventListener("resize", () => {
      canvasArray = [];
      clearTimeout(timeOut);
      setOpen(false);
      setTimeout(() => setOpen(true), 1000);
    });
  }, []);
  return (
    <canvas
      width={width}
      height={height}
      ref={canvasRef}
      id="canvas-background"
    />
  );
};

export default CanvasBackground;
