import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [convertedValue, setConvertedValue] = useState("7.1676");
  const [isButtonCopied, setIsButtonCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 防抖函数
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const updateRate = async () => {
    try {
      setIsLoading(true);
      const numAmount = parseFloat(amount) || 1;

      if (numAmount <= 0) {
        setConvertedValue("0");
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${numAmount}&from=${fromCurrency}&to=${toCurrency}`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();
      const rate = data.rates[toCurrency];

      if (rate !== undefined) {
        setConvertedValue(rate.toFixed(4));
      }
    } catch (error) {
      console.error("Rate fetch error:", error);
      setConvertedValue("Error");
    } finally {
      setIsLoading(false);
    }
  };

  // 创建防抖的 updateRate 函数
  const debouncedUpdateRate = useCallback(debounce(updateRate, 300), [
    amount,
    fromCurrency,
    toCurrency,
  ]);

  useEffect(() => {
    debouncedUpdateRate();
  }, [amount, fromCurrency, toCurrency, debouncedUpdateRate]);

  const handleCopyClick = () => {
    setIsButtonCopied(true);
    setTimeout(() => {
      setIsButtonCopied(false);
    }, 2000);
  };

  // 处理输入框变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 只允许数字和小数点
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // 处理输入框失焦
  const handleAmountBlur = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmount("1");
    } else {
      // 格式化数字，去掉多余的零
      setAmount(numAmount.toString());
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
            "Apple Color Emoji", Arial, sans-serif;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.5;
        }

        .header {
          background: white;
          border-bottom: 1px solid #e1e5e9;
          padding: 16px 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 32px;
          height: 32px;
          background: #000;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 600;
          color: #000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .card {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          position: relative;
          width: 100%;
          max-width: 400px;
          margin-left: 0;
        }

        .card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .card-image {
          height: 200px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #e1e5e9;
          position: relative;
        }

        .card-image.exchange {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 12px;
          background: #fff;
          color: #000;
        }

        .demo-content {
          font-size: 14px;
          color: #666;
          text-align: center;
        }

        .exchange-demo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          font-family: monospace;
          font-size: 20px;
          font-weight: bold;
          color: #000;
        }

        .card-content {
          padding: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin-bottom: 4px;
        }

        .card-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
        }

        .card-price {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin-bottom: 12px;
        }

        .card-button {
          width: 100%;
          background: #000;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .card-button:hover {
          background: #333;
        }

        .card-button:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .footer {
          text-align: center;
          padding: 24px;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #e1e5e9;
          background: white;
        }

        .loading {
          color: #999;
          font-style: italic;
        }

        .input-container {
          position: relative;
        }

        .input-container input:focus {
          outline: 2px solid #007bff;
          outline-offset: 1px;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .container {
            padding: 24px 16px;
          }
        }
      `}</style>

      <header className="header">
        <div className="header-content">
          <div className="logo">🧩</div>
          <div className="brand-name">Simo Widgets</div>
        </div>
      </header>

      <div className="container">
        <div className="grid">
          {/* 汇率换算器 */}
          <div className="card">
            <div className="card-image exchange">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f6f7fa",
                    borderRadius: "10px",
                    overflow: "hidden",
                    padding: "8px 12px",
                  }}
                >
                  <img
                    src="https://flagcdn.com/us.svg"
                    alt="US"
                    style={{
                      width: "24px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                      }}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="JPY">JPY</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                  <div className="input-container">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      onBlur={handleAmountBlur}
                      placeholder="1"
                      style={{
                        marginLeft: "16px",
                        fontSize: "16px",
                        width: "60px",
                        textAlign: "right",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: "18px", color: "#999" }}>⇄</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f6f7fa",
                    borderRadius: "10px",
                    overflow: "hidden",
                    padding: "8px 12px",
                  }}
                >
                  <img
                    src="https://flagcdn.com/cn.svg"
                    alt="CNY"
                    style={{
                      width: "24px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                      }}
                    >
                      <option value="CNY">CNY</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                  <span
                    style={{
                      marginLeft: "16px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                    className={isLoading ? "loading" : ""}
                  >
                    {isLoading ? "..." : convertedValue}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="card-description">
                A simple, embeddable currency converter for your workspace
              </div>
              <button className="card-button" onClick={handleCopyClick}>
                {isButtonCopied ? "Copied!" : "Copy Embed Link"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2024 Simo Widgets</p>
      </footer>
    </>
  );
}
