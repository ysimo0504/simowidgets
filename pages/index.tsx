import { useState, useEffect, useCallback, useRef } from "react";

// 货币到国旗和名称的映射
const currencyData = {
  USD: { flag: "us", name: "US Dollar" },
  EUR: { flag: "eu", name: "Euro" },
  JPY: { flag: "jp", name: "Japanese Yen" },
  CNY: { flag: "cn", name: "Chinese Yuan" },
  GBP: { flag: "gb", name: "British Pound" },
  AUD: { flag: "au", name: "Australian Dollar" },
  CAD: { flag: "ca", name: "Canadian Dollar" },
  CHF: { flag: "ch", name: "Swiss Franc" },
  KRW: { flag: "kr", name: "South Korean Won" },
};

// 自定义下拉菜单组件
const CurrencySelector = ({
  value,
  onChange,
  options,
  style,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  style?: React.CSSProperties;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="currency-selector" ref={dropdownRef} style={style}>
      <div
        className="currency-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={`https://flagcdn.com/${
            currencyData[value as keyof typeof currencyData].flag
          }.svg`}
          alt={value}
          className="currency-flag"
        />
        <span className="currency-code">{value}</span>
        <span className="currency-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="currency-selector-dropdown">
          {options.map((option) => (
            <div
              key={option}
              className={`currency-option ${
                option === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <img
                src={`https://flagcdn.com/${
                  currencyData[option as keyof typeof currencyData].flag
                }.svg`}
                alt={option}
                className="currency-flag"
              />
              <span className="currency-code">{option}</span>
              <span className="currency-name">
                {currencyData[option as keyof typeof currencyData].name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [amount, setAmount] = useState("1");
  const [convertedAmount, setConvertedAmount] = useState("7.17");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [isButtonCopied, setIsButtonCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastModified, setLastModified] = useState<"from" | "to">("from");

  const currencies = [
    "USD",
    "EUR",
    "JPY",
    "CNY",
    "GBP",
    "AUD",
    "CAD",
    "CHF",
    "KRW",
  ];

  // 防抖函数
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // 正向换算：from -> to
  const updateToAmount = async () => {
    try {
      setIsLoading(true);
      const numAmount = parseFloat(amount) || 1;

      if (numAmount <= 0) {
        setConvertedAmount("0.00");
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${numAmount}&from=${fromCurrency}&to=${toCurrency}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();
      const rate = data.rates[toCurrency];

      if (rate !== undefined) {
        setConvertedAmount(rate.toFixed(2));
      }
    } catch (error) {
      console.error("Rate fetch error:", error);
      setConvertedAmount("Error");
    } finally {
      setIsLoading(false);
    }
  };

  // 反向换算：to -> from
  const updateFromAmount = async () => {
    try {
      setIsLoading(true);
      const numAmount = parseFloat(convertedAmount) || 1;

      if (numAmount <= 0) {
        setAmount("0.00");
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${numAmount}&from=${toCurrency}&to=${fromCurrency}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();
      const rate = data.rates[fromCurrency];

      if (rate !== undefined) {
        setAmount(rate.toFixed(2));
      }
    } catch (error) {
      console.error("Rate fetch error:", error);
      setAmount("Error");
    } finally {
      setIsLoading(false);
    }
  };

  // 创建防抖的更新函数
  const debouncedUpdateToAmount = useCallback(debounce(updateToAmount, 300), [
    amount,
    fromCurrency,
    toCurrency,
  ]);

  const debouncedUpdateFromAmount = useCallback(
    debounce(updateFromAmount, 300),
    [convertedAmount, fromCurrency, toCurrency]
  );

  // 根据最后修改的输入框决定换算方向
  useEffect(() => {
    if (lastModified === "from") {
      debouncedUpdateToAmount();
    } else {
      debouncedUpdateFromAmount();
    }
  }, [
    amount,
    convertedAmount,
    fromCurrency,
    toCurrency,
    lastModified,
    debouncedUpdateToAmount,
    debouncedUpdateFromAmount,
  ]);

  // 货币变化时，保持当前lastModified方向的换算
  useEffect(() => {
    if (lastModified === "from") {
      debouncedUpdateToAmount();
    } else {
      debouncedUpdateFromAmount();
    }
  }, [fromCurrency, toCurrency]);

  const handleCopyClick = () => {
    setIsButtonCopied(true);
    setTimeout(() => {
      setIsButtonCopied(false);
    }, 2000);
  };

  // 处理左边输入框变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setLastModified("from");
    }
  };

  // 处理右边输入框变化
  const handleConvertedAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setConvertedAmount(value);
      setLastModified("to");
    }
  };

  // 处理左边输入框失焦
  const handleAmountBlur = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmount("1");
    } else {
      setAmount(numAmount.toFixed(2));
    }
  };

  // 处理右边输入框失焦
  const handleConvertedAmountBlur = () => {
    const numAmount = parseFloat(convertedAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setConvertedAmount("1");
    } else {
      setConvertedAmount(numAmount.toFixed(2));
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
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 28px;
          height: 28px;
          background: #000;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
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
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 12px;
          background: #fff;
          color: #000;
        }

        .card-content {
          padding: 16px;
        }

        .card-description {
          font-size: 14px;
          color: #666;
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

        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #e1e5e9;
          background: white;
        }

        .loading {
          color: #999;
          font-style: italic;
        }

        /* 自定义货币选择器样式 */
        .currency-selector {
          position: relative;
          display: inline-block;
        }

        .currency-selector-button {
          display: flex;
          align-items: center;
          padding: 3px 6px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 65px;
          justify-content: space-between;
        }

        .currency-selector-button:hover {
          background: #f0f0f0;
          border-color: #d0d0d0;
        }

        .currency-flag {
          width: 18px;
          height: 13px;
          margin-right: 5px;
          border-radius: 2px;
        }

        .currency-code {
          font-weight: 600;
          font-size: 13px;
          color: #333;
        }

        .currency-arrow {
          font-size: 9px;
          color: #666;
          margin-left: 3px;
        }

        .currency-selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 2px;
        }

        .currency-option {
          display: flex;
          align-items: center;
          padding: 6px 10px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
        }

        .currency-option:last-child {
          border-bottom: none;
        }

        .currency-option:hover {
          background: #f8f9fa;
        }

        .currency-option.selected {
          background: #e3f2fd;
          color: #1976d2;
        }

        .currency-option .currency-flag {
          width: 18px;
          height: 13px;
          margin-right: 6px;
        }

        .currency-option .currency-code {
          font-weight: 600;
          font-size: 13px;
          margin-right: 6px;
          min-width: 32px;
        }

        .currency-option .currency-name {
          font-size: 11px;
          color: #666;
          flex: 1;
        }

        /* 输入框样式优化 */
        .amount-input {
          margin-left: 8px;
          font-size: 15px;
          font-weight: 500;
          text-align: right;
          border: none;
          background: transparent;
          outline: none;
          min-width: 35px;
          max-width: 70px;
          padding: 2px 3px;
          border-radius: 3px;
          transition: all 0.2s ease;
        }

        .amount-input:focus {
          background: white;
          box-shadow: 0 0 0 2px #007bff;
        }

        .converted-amount-input {
          margin-left: 8px;
          font-size: 15px;
          font-weight: 500;
          text-align: right;
          border: none;
          background: transparent;
          outline: none;
          min-width: 35px;
          max-width: 70px;
          padding: 2px 3px;
          border-radius: 3px;
          transition: all 0.2s ease;
          color: #333;
        }

        .converted-amount-input:focus {
          background: white;
          box-shadow: 0 0 0 2px #007bff;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .container {
            padding: 20px 12px;
          }

          .header {
            padding: 10px 16px;
          }

          .amount-input,
          .converted-amount-input {
            max-width: 55px;
            font-size: 14px;
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
                  gap: "16px",
                  padding: "0 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f6f7fa",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    minWidth: "130px",
                  }}
                >
                  <CurrencySelector
                    value={fromCurrency}
                    onChange={setFromCurrency}
                    options={currencies}
                  />
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    placeholder="1"
                    className="amount-input"
                  />
                </div>

                <span
                  style={{ fontSize: "16px", color: "#999", flexShrink: 0 }}
                >
                  ⇄
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f6f7fa",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    minWidth: "130px",
                  }}
                >
                  <CurrencySelector
                    value={toCurrency}
                    onChange={setToCurrency}
                    options={currencies}
                  />
                  <input
                    type="text"
                    value={convertedAmount}
                    onChange={handleConvertedAmountChange}
                    onBlur={handleConvertedAmountBlur}
                    placeholder="0"
                    className="converted-amount-input"
                  />
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
