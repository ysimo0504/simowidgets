import Head from "next/head";

export default function TestSimple() {
  return (
    <>
      <Head>
        <title>Simple Test Widget</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 🚀 立即执行的iframe通信脚本
              (function() {
                if (window.self !== window.top) {
                  function sendSize() {
                    try {
                      const height = Math.max(document.body.scrollHeight, 200);
                      window.parent.postMessage({ type: "ready" }, "*");
                      window.parent.postMessage({ type: "resize", height: height }, "*");
                      window.parent.postMessage({ type: "setHeight", height: height }, "*");
                      window.parent.postMessage({ frameHeight: height }, "*");
                    } catch(e) {}
                  }
                  
                  // DOMContentLoaded时发送
                  document.addEventListener("DOMContentLoaded", sendSize);
                  window.addEventListener("load", sendSize);
                  window.addEventListener("resize", sendSize);
                  
                  // 立即发送
                  sendSize();
                }
              })();
            `,
          }}
        />
      </Head>

      <div
        style={{
          margin: 0,
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "white",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            border: "2px solid #e1e5e9",
            borderRadius: "8px",
            background: "#f8f9fa",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>简单测试组件</h2>
          <p style={{ margin: 0, color: "#666" }}>
            这是一个简单的测试页面，用于验证Notion嵌入
          </p>
        </div>
      </div>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: auto !important;
          overflow: visible !important;
          box-sizing: border-box;
        }

        #__next {
          height: auto !important;
          overflow: visible !important;
        }
      `}</style>
    </>
  );
}
