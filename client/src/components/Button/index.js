import React from "react";
import ButtonStyle from "./ButtonStyle";
import { AiOutlineReload } from "react-icons/ai";

const Button = ({
  isLoading,
  children,
  onClick,
  btnStyle,
  hoverBtnStyle,
  disabled = false,
}) => {
  if (isLoading) {
    return (
      <ButtonStyle>
        <button className='btn2' disabled={true} style={hoverBtnStyle}>
          <div className='loaderIconStyle'>
            <AiOutlineReload className='loader' />
          </div>
        </button>
      </ButtonStyle>
    );
  }
  return (
    <ButtonStyle>
      <button
        onClick={onClick}
        className='btn'
        style={btnStyle}
        disabled={disabled}
      >
        {children}
      </button>
    </ButtonStyle>
  );
};

export default Button;
