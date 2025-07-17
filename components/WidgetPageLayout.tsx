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

  useEffect(() => {
    // 检测是否在 iframe 中运行
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
      <div
        className={`widget-page ${className} ${isEmbedded ? "embedded" : ""}`}
      >
        <main className="widget-main">
          <div className="widget-container">{children}</div>
        </main>
      </div>

      <style jsx global>{`
        /* 重置浏览器默认样式 */
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        /* 非嵌入环境的全局样式 */
        ${!isEmbedded
          ? `
          html, body {
            height: 100%;
            overflow: hidden;
          }
          
          #__next {
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
          margin: 0;
          padding: 0;
        }

        /* 非嵌入环境：全屏布局 */
        .widget-page:not(.embedded) {
          height: 100vh;
          overflow: hidden;
        }

        /* 嵌入环境：自适应布局 */
        .widget-page.embedded {
          min-height: 200px;
          height: auto;
          overflow: visible;
        }

        .widget-main {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          margin: 0;
        }

        /* 非嵌入环境：全高度 */
        .widget-page:not(.embedded) .widget-main {
          height: 100%;
          padding: 20px;
        }

        /* 嵌入环境：自适应高度 */
        .widget-page.embedded .widget-main {
          min-height: 200px;
          padding: 24px 20px;
        }

        .widget-container {
          width: 100%;
          max-width: ${maxWidth};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          padding: 0;
        }

        /* 响应式适配 */
        @media screen and (max-width: 768px) {
          .widget-main {
            padding: 16px;
          }

          .widget-page.embedded .widget-main {
            padding: 20px 16px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.9);
          }
        }

        @media screen and (max-width: 480px) {
          .widget-main {
            padding: 12px 8px;
          }

          .widget-page.embedded .widget-main {
            padding: 16px 12px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.8);
          }
        }

        @media screen and (max-width: 360px) {
          .widget-main {
            padding: 10px 6px;
          }

          .widget-page.embedded .widget-main {
            padding: 14px 10px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.75);
          }
        }

        @media screen and (min-width: 1200px) {
          .widget-container {
            max-width: calc(${maxWidth} * 1.07);
          }
        }

        /* 横屏优化 */
        @media screen and (max-height: 500px) and (orientation: landscape) {
          .widget-main {
            padding: 8px;
          }

          .widget-page.embedded .widget-main {
            padding: 12px 8px;
          }
        }

        /* 嵌入环境的额外优化 */
        .widget-page.embedded {
          /* 确保在小容器中也能正常显示 */
          @media screen and (max-height: 300px) {
            .widget-main {
              padding: 8px;
              min-height: 150px;
            }
          }
        }
      `}</style>
    </>
  );
};
