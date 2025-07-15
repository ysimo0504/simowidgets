import React from "react";

interface CardProps {
  children: React.ReactNode;
  description: string;
  buttonText: string;
  buttonClickedText?: string;
  onButtonClick: () => void;
  isButtonClicked?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  description,
  buttonText,
  buttonClickedText = "Clicked!",
  onButtonClick,
  isButtonClicked = false,
  className = "",
}) => {
  return (
    <div className={`card ${className}`}>
      {children}
      <div className="card-content">
        <div className="card-description">{description}</div>
        <button className="card-button" onClick={onButtonClick}>
          {isButtonClicked ? buttonClickedText : buttonText}
        </button>
      </div>
    </div>
  );
};
