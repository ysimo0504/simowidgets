import { useState } from "react";
import { CurrencyConverter } from "../components/CurrencyConverter";
import { Card } from "../components/Card";

export default function Home() {
  const host = "https://widgets.heysimo.com";

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
            "Apple Color Emoji", Arial, sans-serif;
          background-color: white;
          color: #333;
          line-height: 1.5;
        }

        .header {
          background: #white;
          border-bottom: 1px solid #f8f8f7;
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: auto;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 28px;
          height: 28px;
          background: #000;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #f8f8f7;
          background: white;
        }

        .loading {
          color: #999;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .container {
            padding: 20px 12px;
          }

          .header {
            padding: 10px 16px;
          }
        }
      `}</style>

      <header className="header">
        <div className="header-content">
          <div className="logo">🧩</div>
          <div className="brand-name">Simo Widgets</div>
        </div>
      </header>

      <div className="container">
        <div className="grid">
          {/* 汇率换算器 */}
          <Card
            description="A simple, embeddable currency converter"
            buttonText="Copy Embed Link"
            embedUrl={`${host}/exchange`}
          >
            <CurrencyConverter />
          </Card>

          {/* 可以在这里添加更多的 card */}
          {/* 例如：
          <Card
            description="Another widget for your workspace"
            buttonText="Copy Embed Link"
            embedUrl={`${host}/another-widget`}
          >
            <AnotherWidget />
          </Card>
          */}
        </div>
      </div>

      <footer className="footer">
        <p>© 2024 Simo Widgets</p>
      </footer>
    </>
  );
}
