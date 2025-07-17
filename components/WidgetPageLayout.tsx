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

    const embedded = checkIfEmbedded();
    setIsEmbedded(embedded);

    // 如果是嵌入环境，采用简洁的优化策略
    if (embedded) {
      // 1. 只在初始化时设置一次
      document.documentElement.style.height = "auto";
      document.body.style.height = "auto";
      document.body.style.margin = "0";
      document.body.style.padding = "0";

      // 2. 简单的一次性尺寸通知（仅在组件挂载时）
      const timer = setTimeout(() => {
        try {
          window.parent.postMessage(
            {
              type: "setHeight",
              height: document.body.scrollHeight,
            },
            "*"
          );
        } catch (e) {
          // 静默失败，不影响功能
        }
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
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
        /* 全局重置 - 简洁版本 */
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        /* 非嵌入环境的样式 */
        ${!isEmbedded
          ? `
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
        }

        /* 独立页面模式 */
        .widget-page:not(.embedded) {
          height: 100vh;
          overflow: hidden;
        }

        /* 嵌入模式 - 关键优化 */
        .widget-page.embedded {
          /* 让 Notion 控制尺寸，不强制设置高度 */
          min-height: 200px;
          padding: 20px;
          /* 移除所有可能干扰的样式 */
        }

        .widget-main {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 独立页面 */
        .widget-page:not(.embedded) .widget-main {
          height: 100%;
          padding: 20px;
        }

        /* 嵌入页面 - 简化布局 */
        .widget-page.embedded .widget-main {
          padding: 0;
          min-height: 160px;
        }

        .widget-container {
          width: 100%;
          max-width: ${maxWidth};
          margin: 0 auto;
        }

        /* 响应式优化 - 简化版本 */
        @media (max-width: 768px) {
          .widget-page.embedded {
            padding: 16px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.9);
          }
        }

        @media (max-width: 480px) {
          .widget-page.embedded {
            padding: 12px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.85);
          }
        }
      `}</style>
    </>
  );
};
