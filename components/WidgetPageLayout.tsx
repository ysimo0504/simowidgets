import React, { useEffect, useState } from "react";
import Head from "next/head";

/**
 * 通用的 Widget 页面布局组件
 *
 * 使用示例：
 *
 * // 基础使用
 * <WidgetPageLayout>
 *   <YourWidget />
 * </WidgetPageLayout>
 *
 * // 自定义宽度和背景色
 * <WidgetPageLayout
 *   maxWidth="500px"
 *   backgroundColor="#f5f5f5"
 * >
 *   <YourWidget />
 * </WidgetPageLayout>
 *
 * // 页面示例：
 * export default function Calculator() {
 *   return (
 *     <WidgetPageLayout maxWidth="350px">
 *       <CalculatorWidget />
 *     </WidgetPageLayout>
 *   );
 * }
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
    // 确保只在浏览器环境执行
    if (typeof window === "undefined") return;

    // 检测是否在iframe中
    const checkIfEmbedded = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    const embedded = checkIfEmbedded();
    setIsEmbedded(embedded);

    if (embedded) {
      // 🚀 优化1: 立即设置基础样式，无延迟
      document.documentElement.style.overflow = "visible";
      document.documentElement.style.height = "auto";
      document.body.style.overflow = "visible";
      document.body.style.height = "auto";
      document.body.style.margin = "0";
      document.body.style.padding = "0";

      // 🚀 优化2: 尺寸通信函数
      const sendSize = () => {
        try {
          const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.scrollHeight,
            250
          );

          // 发送多种格式确保兼容性
          const messages = [
            { type: "ready" },
            { type: "resize", height },
            { type: "setHeight", height },
            { frameHeight: height },
            { height },
          ];

          messages.forEach((msg) => {
            window.parent.postMessage(msg, "*");
          });
        } catch (e) {
          console.log("PostMessage failed:", e);
        }
      };

      // 🚀 优化3: 立即发送ready信号，无延迟
      sendSize();

      // 🚀 优化4: 监听DOM内容加载完成
      const handleDOMContentLoaded = () => {
        sendSize();
      };

      // 🚀 优化5: 监听窗口大小变化
      const handleResize = () => {
        sendSize();
      };

      // 🚀 优化6: 使用ResizeObserver监听内容变化
      let resizeObserver: ResizeObserver | null = null;
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          sendSize();
        });
        resizeObserver.observe(document.body);
      }

      // 添加事件监听
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
      } else {
        // DOM已经加载完成
        handleDOMContentLoaded();
      }

      window.addEventListener("load", sendSize);
      window.addEventListener("resize", handleResize);

      // 🚀 优化7: 多次发送确保接收（但间隔更短）
      setTimeout(sendSize, 50);
      setTimeout(sendSize, 150);
      setTimeout(sendSize, 300);

      // 清理函数
      return () => {
        document.removeEventListener(
          "DOMContentLoaded",
          handleDOMContentLoaded
        );
        window.removeEventListener("load", sendSize);
        window.removeEventListener("resize", handleResize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }
  }, []);

  return (
    <>
      {/* 🚀 优化8: 添加必要的meta标签 */}
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>

      {/* 🚀 优化9: 移除loading状态，直接同步渲染 */}
      <div
        className={`widget-page ${className} ${isEmbedded ? "embedded" : ""}`}
      >
        <main className="widget-main">
          <div className="widget-container">{children}</div>
        </main>
      </div>

      {/* 🚀 优化10: iframe通信脚本直接嵌入 */}
      {isEmbedded && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function sendSize() {
                  try {
                    const height = Math.max(
                      document.body.scrollHeight,
                      document.body.offsetHeight,
                      document.documentElement.scrollHeight,
                      250
                    );
                    window.parent.postMessage({ type: "resize", height: height }, "*");
                    window.parent.postMessage({ type: "setHeight", height: height }, "*");
                    window.parent.postMessage({ frameHeight: height }, "*");
                  } catch(e) {}
                }
                
                // DOMContentLoaded时立即发送
                if (document.readyState === 'loading') {
                  document.addEventListener("DOMContentLoaded", sendSize);
                } else {
                  sendSize();
                }
                
                // 页面加载完成后发送
                window.addEventListener("load", sendSize);
                window.addEventListener("resize", sendSize);
                
                // 立即发送一次
                sendSize();
              })();
            `,
          }}
        />
      )}

      <style jsx global>{`
        /* 🚀 优化11: 正确的响应式CSS配置 */
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
          : `
          html, body {
            overflow: visible !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          #__next {
            height: auto !important;
          }
        `}
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
          /* 🚀 优化12: 嵌入模式的正确尺寸设置 */
          height: auto !important;
          min-height: fit-content;
          padding: 24px 12px;
          overflow: visible;
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
