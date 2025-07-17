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

      <style jsx>{`
        .widget-page {
          width: 100%;
          min-height: 100vh;
          background: ${backgroundColor};
          position: relative;
          overflow-x: hidden;
        }

        .widget-main {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .widget-container {
          width: 100%;
          max-width: ${maxWidth};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        /* 平板适配 */
        @media screen and (max-width: 768px) {
          .widget-main {
            padding: 16px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.9);
          }
        }

        /* 手机适配 */
        @media screen and (max-width: 480px) {
          .widget-main {
            padding: 12px 8px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.8);
          }
        }

        /* 小屏手机适配 */
        @media screen and (max-width: 360px) {
          .widget-main {
            padding: 10px 6px;
          }

          .widget-container {
            max-width: calc(${maxWidth} * 0.75);
          }
        }

        /* 超大屏幕适配 */
        @media screen and (min-width: 1200px) {
          .widget-container {
            max-width: calc(${maxWidth} * 1.07);
          }
        }

        /* 横屏手机适配 */
        @media screen and (max-height: 500px) and (orientation: landscape) {
          .widget-main {
            padding: 8px;
            min-height: 100vh;
          }
        }
      `}</style>
    </>
  );
};
