import React, { useState, isValidElement } from "react";

interface CardProps {
  children: React.ReactNode;
  description: string;
  buttonText: string;
  buttonClickedText?: string;
  onButtonClick?: () => void; // 现在变为可选
  isButtonClicked?: boolean;
  className?: string;
  embedUrl?: string; // 嵌入链接（优先级最高）
  host?: string; // 主机地址，用于组合完整URL
}

export const Card: React.FC<CardProps> = ({
  children,
  description,
  buttonText,
  buttonClickedText = "Copied!",
  onButtonClick,
  isButtonClicked = false,
  className = "",
  embedUrl,
  host = "https://widgets.heysimo.com",
}) => {
  const [internalButtonClicked, setInternalButtonClicked] = useState(false);

  // 使用内部状态或外部传入的状态
  const buttonClicked = isButtonClicked || internalButtonClicked;

  // 动态获取embedUrl
  const getEmbedUrl = () => {
    // 如果直接传入了embedUrl，使用它
    if (embedUrl) {
      return embedUrl;
    }

    // 尝试从子组件获取embedPath
    if (isValidElement(children) && children.type) {
      const componentType = children.type as any;
      if (componentType.embedPath) {
        return `${host}${componentType.embedPath}`;
      }
    }

    // 如果都没有，返回null
    return null;
  };

  const handleButtonClick = () => {
    const urlToCopy = getEmbedUrl();
    if (urlToCopy) {
      navigator.clipboard.writeText(urlToCopy);
      setInternalButtonClicked(true);
      setTimeout(() => {
        setInternalButtonClicked(false);
      }, 2000);
    }

    // 调用外部传入的点击处理函数（如果有的话）
    onButtonClick?.();
  };

  return (
    <>
      <div className={`card ${className}`}>
        {children}
        <div className="card-content">
          <div className="card-description">{description}</div>
          <button className="card-button" onClick={handleButtonClick}>
            {buttonClicked ? buttonClickedText : buttonText}
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
          max-width: 480px;
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
