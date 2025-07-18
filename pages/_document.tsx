import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* 🚀 优化13: 添加iframe优化的meta标签 */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* 🚀 优化14: iframe通信优化脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🚀 优化15: 全局iframe通信脚本
              (function() {
                if (window.self !== window.top) {
                  // 在iframe中
                  function notifyParent() {
                    try {
                      const height = Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.documentElement.scrollHeight,
                        250
                      );
                      
                      // 发送ready信号
                      window.parent.postMessage({ type: "ready" }, "*");
                      
                      // 发送尺寸信息
                      window.parent.postMessage({ type: "resize", height: height }, "*");
                      window.parent.postMessage({ type: "setHeight", height: height }, "*");
                      window.parent.postMessage({ frameHeight: height }, "*");
                    } catch(e) {
                      console.log("iframe communication failed:", e);
                    }
                  }
                  
                  // 立即执行
                  if (document.readyState === 'loading') {
                    document.addEventListener("DOMContentLoaded", notifyParent);
                  } else {
                    notifyParent();
                  }
                  
                  window.addEventListener("load", notifyParent);
                  window.addEventListener("resize", notifyParent);
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
