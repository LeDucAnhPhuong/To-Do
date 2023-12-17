import { useEffect, useState, useRef } from "react";
type Props = {
  onClick: () => void;
  id: string;
  icon: string | undefined;
  type: string;
  color: string;
  disable: boolean;
  title: string;
  size: string;
  textColor: string | undefined;
  value: string;
};
import "./style_button.scss";
let timeClicked = 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({
  onClick,
  icon = undefined,
  type,
  color,
  disable = false,
  title,
  size,
  textColor = undefined,
  value,
}: Props) => {
  const [positionMouse, setPositionMouse] = useState({
    x: 0,
    y: 0,
  });
  const [countClicked, setCountClicked] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const style =
    type == "contained"
      ? {
          backgroundColor: color,
          border: 0,
          color: "#fff",
        }
      : {
          backgroundColor: "transparent",
          borderColor: color,
          color: textColor || color,
          borderWidth: "1px",
          borderStyle: "solid",
        };
  useEffect(() => {}, [countClicked]);
  return (
    <button
      value={value}
      ref={buttonRef}
      onClick={(event: React.MouseEvent) => {
        const left = buttonRef?.current?.offsetLeft || 0;
        const top = buttonRef?.current?.offsetTop || 0;
        setPositionMouse({
          x: event.pageX - left,
          y: event.pageY - top,
        });
        clearTimeout(timeClicked);
        timeClicked = setTimeout(() => setCountClicked(0), 1000);
        setCountClicked(countClicked + 1);
        onClick();
      }}
      onMouseLeave={() => {
        clearTimeout(timeClicked);
        setTimeout(() => setCountClicked(0), 1000);
      }}
      style={style}
      className={`${
        disable ? "disable" : ""
      } components__button button--color-default size-${size} `}
    >
      <span className="list__effect">
        {Array(countClicked)
          .fill(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((_: any, index: number) => (
            <span
              key={index}
              style={{
                backgroundColor: type == "contained" ? "#fff" : color,
                top: positionMouse.y,
                left: positionMouse.x,
              }}
              className="button__effect"
            ></span>
          ))}
      </span>
      {icon ? <img src={icon}></img> : null}
      <p className="button__title">{title}</p>
    </button>
  );
};

export default Button;
