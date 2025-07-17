import React, { useEffect, useState } from "react";

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 检测嵌入环境
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
      // 关键修复：确保页面完全加载后再设置为就绪状态
      const initEmbed = () => {
        // 1. 设置基础样式
        document.documentElement.style.overflow = "visible";
        document.body.style.overflow = "visible";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        // 2. 确保内容渲染完成
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsReady(true);

            // 3. 一次性通知父窗口高度（延迟确保内容已渲染）
            setTimeout(() => {
              const height = Math.max(document.body.scrollHeight, 250);
              try {
                window.parent.postMessage(
                  {
                    type: "setHeight",
                    height: height,
                  },
                  "*"
                );
              } catch (e) {
                // 静默处理
              }
            }, 500);
          });
        });
      };

      // 确保 DOM 准备就绪
      if (document.readyState === "complete") {
        initEmbed();
      } else {
        window.addEventListener("load", initEmbed);
        return () => window.removeEventListener("load", initEmbed);
      }
    } else {
      setIsReady(true);
    }
  }, []);

  // 如果是嵌入环境但还未就绪，显示加载状态
  if (isEmbedded && !isReady) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: backgroundColor,
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "2px solid #f3f3f3",
            borderTop: "2px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
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

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        ${!isEmbedded
          ? `
          html, body, #__next {
            height: 100%;
            overflow: hidden;
          }
        `
          : `
          html, body {
            overflow: visible !important;
            height: auto !important;
          }
          
          #__next {
            overflow: visible !important;
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
          min-height: 250px;
          height: auto;
          padding: 24px 12px;
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
          min-height: 200px;
        }

        .widget-container {
          width: 100%;
          max-width: ${maxWidth};
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 超大屏幕 */
        @media (min-width: 1200px) {
          .widget-page.embedded {
            padding: 32px 20px;
          }

          .widget-container {
            max-width: ${maxWidth};
          }
        }

        /* 大屏幕 */
        @media (min-width: 992px) and (max-width: 1199px) {
          .widget-page.embedded {
            padding: 28px 16px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 95vw);
          }
        }

        /* 平板 */
        @media (min-width: 768px) and (max-width: 991px) {
          .widget-page.embedded {
            padding: 24px 16px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 90vw);
          }
        }

        /* 大手机 */
        @media (min-width: 576px) and (max-width: 767px) {
          .widget-page.embedded {
            padding: 20px 12px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 85vw);
          }
        }

        /* 小手机 */
        @media (max-width: 575px) {
          .widget-page.embedded {
            padding: 16px 8px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 95vw);
          }
        }

        /* 超小屏幕 */
        @media (max-width: 360px) {
          .widget-page.embedded {
            padding: 12px 6px;
          }

          .widget-container {
            max-width: min(${maxWidth}, 98vw);
          }
        }

        /* 确保在所有情况下都居中 */
        @media (orientation: landscape) and (max-height: 500px) {
          .widget-page.embedded {
            padding: 10px 12px;
            align-items: flex-start;
            justify-content: center;
          }

          .widget-main {
            padding-top: 20px;
          }
        }
      `}</style>
    </>
  );
};
