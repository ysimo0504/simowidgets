import React from "react";

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
  return (
    <>
      <div className={`widget-page ${className}`}>
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
          height: 100%;
          overflow: hidden; /* 防止任何滚动 */
        }

        #__next {
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .widget-page {
          width: 100%;
          height: 100vh;
          background: ${backgroundColor};
          position: relative;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        .widget-main {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          margin: 0;
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

          .widget-container {
            max-width: calc(${maxWidth} * 0.9);
          }
        }

        @media screen and (max-width: 480px) {
          .widget-main {
            padding: 12px 8px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.8);
          }
        }

        @media screen and (max-width: 360px) {
          .widget-main {
            padding: 10px 6px;
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

        @media screen and (max-height: 500px) and (orientation: landscape) {
          .widget-main {
            padding: 8px;
          }
        }
      `}</style>
    </>
  );
};
