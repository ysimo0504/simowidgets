"use client";
import { CurrencyConverter } from "../components/CurrencyConverter";

export default function Exchange() {
  return (
    <>
      <div className="exchange-page">
        <main className="exchange-main">
          <div className="exchange-container">
            <CurrencyConverter />
          </div>
        </main>
      </div>

      <style jsx>{`
        .exchange-page {
          width: 100%;
          min-height: 100vh;
          background: white;
          position: relative;
          overflow-x: hidden;
        }

        .exchange-main {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .exchange-container {
          width: 100%;
          max-width: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        /* 平板适配 */
        @media screen and (max-width: 768px) {
          .exchange-main {
            padding: 16px;
          }

          .exchange-container {
            max-width: 380px;
          }
        }

        /* 手机适配 */
        @media screen and (max-width: 480px) {
          .exchange-main {
            padding: 12px 8px;
          }

          .exchange-container {
            max-width: 340px;
          }
        }

        /* 小屏手机适配 */
        @media screen and (max-width: 360px) {
          .exchange-main {
            padding: 10px 6px;
          }

          .exchange-container {
            max-width: 320px;
          }
        }

        /* 超大屏幕适配 */
        @media screen and (min-width: 1200px) {
          .exchange-container {
            max-width: 450px;
          }
        }

        /* 横屏手机适配 */
        @media screen and (max-height: 500px) and (orientation: landscape) {
          .exchange-main {
            padding: 8px;
            min-height: 100vh;
          }
        }
      `}</style>
    </>
  );
}
