import React, { useEffect, useState, useRef } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // 如果是嵌入环境，进行额外的优化
    if (embedded) {
      // 1. 立即设置初始高度
      document.body.style.minHeight = "250px";
      document.documentElement.style.minHeight = "250px";

      // 2. 确保内容加载完成后通知父页面
      const notifyParentOfSize = () => {
        if (containerRef.current) {
          const height = containerRef.current.offsetHeight;
          const width = containerRef.current.offsetWidth;

          // 发送尺寸信息给父页面（Notion）
          try {
            window.parent.postMessage(
              {
                type: "resize",
                height: Math.max(height + 40, 250), // 至少250px高度
                width: width,
              },
              "*"
            );
          } catch (e) {
            console.log("Unable to communicate with parent frame");
          }
        }
      };

      // 3. 延迟通知，确保渲染完成
      const timer = setTimeout(() => {
        notifyParentOfSize();
        setIsLoaded(true);
      }, 100);

      // 4. 监听窗口大小变化
      const resizeObserver = new ResizeObserver(() => {
        notifyParentOfSize();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
      };
    } else {
      setIsLoaded(true);
    }
  }, []);

  // 为嵌入环境添加额外的样式类
  const pageClasses = [
    "widget-page",
    className,
    isEmbedded ? "embedded" : "",
    isLoaded ? "loaded" : "loading",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={pageClasses} ref={containerRef}>
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

        /* 嵌入环境的特殊处理 */
        ${isEmbedded
          ? `
          html, body {
            min-height: 250px !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          #__next {
            min-height: 250px !important;
            height: auto !important;
            overflow: visible !important;
          }
        `
          : `
          html, body {
            height: 100%;
            overflow: hidden;
          }
          
          #__next {
            height: 100%;
            overflow: hidden;
          }
        `}
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
          min-height: 250px;
          height: auto;
          overflow: visible;
        }

        /* 加载状态处理 */
        .widget-page.embedded.loading {
          min-height: 250px;
          height: 250px; /* 首次加载时固定高度 */
        }

        .widget-page.embedded.loaded {
          height: auto; /* 加载完成后自适应 */
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

        /* 嵌入环境：固定内边距 */
        .widget-page.embedded .widget-main {
          min-height: 250px;
          padding: 30px 20px; /* 增加上下内边距确保拖拽区域 */
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

        /* Notion 嵌入特别优化 */
        .widget-page.embedded {
          /* 确保有足够的拖拽区域 */
          border: 1px solid transparent;
          border-radius: 4px;
        }

        /* 响应式适配 */
        @media screen and (max-width: 768px) {
          .widget-main {
            padding: 16px;
          }

          .widget-page.embedded .widget-main {
            padding: 24px 16px;
            min-height: 220px;
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
            padding: 20px 12px;
            min-height: 200px;
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
            padding: 18px 10px;
            min-height: 180px;
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
            padding: 16px 8px;
            min-height: 160px;
          }
        }
      `}</style>
    </>
  );
};
