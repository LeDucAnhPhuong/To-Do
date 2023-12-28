/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
type Props = {
  open: number;
  setOpen: (open: number) => void;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
};
let animate: any;
let canvasArray: any = [];

const CanvasFireWorks = ({ open, setOpen, position, width, height }: Props) => {
  const colorArray = ["#cd1624", "#f18701", "#fe7f2d", "#23856d", "#89c2d9"];
  const type = ["rect", "circle"];
  let canvasArrayLength = 0;
  const canvasRef = useRef<HTMLCanvasElement>();
  function randomRange(position: number) {
    const random = Math.floor((Math.random() - 0.5) * 50 + position);
    return random;
  }
  // function drawCanvas() {}
  useEffect(() => {
    if (open === 0) return;
    const ctx = canvasRef.current?.getContext("2d");
    function createCanvas(this: any, x: number, y: number, number: number) {
      this.x = x;
      this.y = y;
      this.skew = Math.random() * 2 * Math.PI;
      this.type = type[Math.round(Math.random())];
      this.scale = Math.random() * 2 * Math.PI;
      this.rotate = Math.random() * 2 * Math.PI;
      this.opacity = 1;
      this.number = number;
      this.speed = {
        x: Math.random() * 10 * this.number,
        y: -18,
      };
      this.acceleration = {
        x: 0.2 * -this.number,
        y: Math.random() * 0.55,
      };
      this.color = colorArray[Math.round(Math.random() * 5) % 5];
      this.draw = () => {
        ctx?.beginPath();
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = this.opacity;
        ctx?.transform(
          1,
          Math.sin(this.skew) * 0.1,
          Math.cos(this.skew) * 0.1,
          1,
          0, // (Math.abs(Math.sin(this.scale)) + 0.5) * 20,
          0 // (Math.abs(Math.cos(this.scale)) + 0.5) * 20
        );
        switch (this.type) {
          case "rect":
            ctx?.rect(
              this.x,
              this.y,
              (Math.abs(Math.cos(this.scale)) + 0.5) * 8,
              (Math.abs(Math.sin(this.scale)) + 0.5) * 8
            );
            break;
          case "circle":
            ctx?.ellipse(
              this.x,
              this.y,
              (Math.abs(Math.cos(this.scale)) + 0.5) * 5,
              (Math.abs(Math.sin(this.scale)) + 0.5) * 5,
              0,
              0,
              2 * Math.PI
            );
            break;
        }
        ctx?.fill();
        ctx?.closePath();
        ctx?.resetTransform();
      };
      this.update = () => {
        this.skew += 0.008;
        this.scale += 0.005;
        this.rotate += 0.01;
        if (this.speed.y < 0) {
          this.speed.x =
            ((this.speed.y + this.acceleration.y) / this.speed.y) *
            this.speed.x;
          this.speed.y += this.acceleration.y;
          this.x += this.speed.x;
        } else {
          this.opacity -= 0.002;
          this.speed.y = 1;
        }
        this.y += this.speed.y;
        this.draw();
      };
    }
    (function create() {
      for (let i = 0; i < 100; i++) {
        const array = [1, -1];
        const number = array[Math.round(Math.random())];
        canvasArray = [
          ...canvasArray,
          new (createCanvas as any)(
            randomRange(position?.x),
            randomRange(position?.y),
            number
          ),
        ];
      }
    })();
    canvasArrayLength = canvasArray.length;
    function animation() {
      animate = requestAnimationFrame(animation);
      ctx?.clearRect(0, 0, width, height);
      if (canvasArray.length !== 0) {
        for (let i = 0; i < canvasArrayLength; i++) {
          canvasArray[i]?.update();
          if (canvasArray[i]?.opacity < 0.002) {
            canvasArray.splice(i, 1);
          }
        }
      }
    }
    animation();
    return () => {
      setOpen(open - 1);
      window.cancelAnimationFrame(animate);
    };
  }, [open]);
  return (
    <canvas
      id="canvas-fire-works"
      ref={(el: HTMLCanvasElement) => (canvasRef.current = el)}
      width={width}
      height={height}
    ></canvas>
  );
};

export default CanvasFireWorks;
