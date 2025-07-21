import React, { useEffect, useState } from "react";
import Head from "next/head";

/**
 * 通用的 Widget 页面布局组件
 */

interface WidgetPageLayoutProps {
  children: React.ReactNode;
  maxWidth?: string; // 自定义最大宽度
  backgroundColor?: string; // 自定义背景色
  className?: string; // 额外的CSS类名
}

export const WidgetPageLayout: React.FC<WidgetPageLayoutProps> = ({
  children,
  maxWidth = "420px",
  backgroundColor = "white",
  className = "",
}) => {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // 检测是否在iframe中
    const checkIfEmbedded = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    setIsEmbedded(checkIfEmbedded());
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>

      <div
        className={`widget-page ${className} ${isEmbedded ? "embedded" : ""}`}
      >
        <main className="widget-main">
          <div className="widget-container">{children}</div>
        </main>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          margin: 0;
          padding: 0;
          width: 100%;
        }

        body {
          margin: 0;
          padding: 0;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        ${!isEmbedded
          ? `
          /* 非嵌入模式：使用固定高度 */
          html, body, #__next {
            height: 100%;
            overflow: hidden;
          }
        `
          : ""}
      `}</style>

      <style jsx>{`
        .widget-page {
          width: 100%;
          background: ${backgroundColor};
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .widget-page:not(.embedded) {
          height: 100vh;
          overflow: hidden;
        }

        .widget-page.embedded {
          min-height: 100vh;
          height: auto;
          padding: 24px 12px;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .widget-main {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .widget-page:not(.embedded) .widget-main {
          height: 100%;
          padding: 20px;
        }

        .widget-page.embedded .widget-main {
          padding: 0;
          height: auto;
          min-height: auto;
        }

        .widget-container {
          width: 100%;
          max-width: ${maxWidth};
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 响应式设计 */
        @media (min-width: 1200px) {
          .widget-page.embedded {
            padding: 32px 20px;
          }

          .widget-container {
            max-width: ${maxWidth};
          }
        }

        @media (min-width: 768px) and (max-width: 1199px) {
          .widget-page.embedded {
            padding: 24px 16px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 90vw);
          }
        }

        @media (max-width: 767px) {
          .widget-page.embedded {
            padding: 16px 12px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 95vw);
          }
        }

        @media (max-width: 360px) {
          .widget-page.embedded {
            padding: 12px 8px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 98vw);
          }
        }
      `}</style>
    </>
  );
};
