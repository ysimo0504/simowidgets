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
    <>
      <div className={`card ${className}`}>
        {children}
        <div className="card-content">
          <div className="card-description">{description}</div>
          <button className="card-button" onClick={onButtonClick}>
            {isButtonClicked ? buttonClickedText : buttonText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .card {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          position: relative;
          width: 100%;
          max-width: 400px;
          margin-left: 0;
        }

        .card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .card-content {
          padding: 16px;
        }

        .card-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
        }

        .card-button {
          width: 100%;
          background: #000;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .card-button:hover {
          background: #333;
        }
      `}</style>
    </>
  );
};
