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
  const colorArray = ["#780000", "#C1121F", "#FDF0D5", "#003049", "#669BBC"];
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
      this.speedx = Math.random() * 0.7;
      this.type = type[Math.round(Math.random())];
      this.scale = Math.random() * 2 * Math.PI;
      this.rotate = Math.random() * 2 * Math.PI;
      this.opacity = 1;
      this.number = number;
      this.speed = Math.round(Math.random() + 20) * this.number;
      this.color = colorArray[Math.round(Math.random() * 5) % 5];
      this.acceleration = (Math.random() * 0.5 + 0.25) * -this.number;
      this.draw = () => {
        ctx?.beginPath();
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = this.opacity;
        ctx?.transform(
          1,
          Math.sin(this.skew) * 0.2,
          Math.cos(this.skew) * 0.2,
          1,
          (Math.abs(Math.sin(this.scale)) + 0.5) * 20,
          (Math.abs(Math.cos(this.scale)) + 0.5) * 20
        );
        switch (this.type) {
          case "rect":
            ctx?.rect(
              this.x,
              this.y,
              (Math.abs(Math.cos(this.scale)) + 0.2) * 8,
              (Math.abs(Math.sin(this.scale)) + 0.2) * 8
            );
            break;
          case "circle":
            ctx?.ellipse(
              this.x,
              this.y,
              (Math.abs(Math.cos(this.scale)) + 0.2) * 5,
              (Math.abs(Math.sin(this.scale)) + 0.2) * 5,
              0,
              0,
              2 * Math.PI
            );
            break;
        }
        ctx?.fill();
        ctx?.resetTransform();
        ctx?.closePath();
      };
      this.update = () => {
        this.skew += 0.008;
        this.scale += 0.005;
        this.rotate += 0.01;
        if (this.number == 1) {
          if (this.speed * this.speedx * this.number > 0)
            this.x += this.speed * this.speedx * this.number;
          this.y -= this.speed;
          if (this.speed > -0.7) this.speed += this.acceleration;
          else {
            if (this.opacity >= 0) this.opacity -= 0.0025;
          }
        } else {
          if (this.speed * this.speedx * this.number > 0)
            this.x -= this.speed * this.speedx * this.number;
          this.y += this.speed;
          if (this.speed < 0.7) this.speed += this.acceleration;
          else {
            if (this.opacity >= 0) this.opacity -= 0.0025;
          }
        }
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
          if (canvasArray[i]?.opacity <= 0) {
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
