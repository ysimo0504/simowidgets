import { useState, useEffect, useCallback, useRef } from "react";

// 货币到国旗和名称的映射
export const currencyData = {
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

// 货币选择器组件（可导出使用）
export const CurrencySelector = ({
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 完整的货币转换器组件
export const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [convertedAmount, setConvertedAmount] = useState("7.17");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [isLoading, setIsLoading] = useState(false);
  const [lastModified, setLastModified] = useState<"from" | "to">("from");
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // 使用 useRef 存储防抖定时器，避免重新创建
  const debounceRef = useRef<{
    updateToAmount: NodeJS.Timeout | null;
    updateFromAmount: NodeJS.Timeout | null;
  }>({
    updateToAmount: null,
    updateFromAmount: null,
  });

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

  // 检测是否在 iframe 中
  useEffect(() => {
    const checkIfEmbedded = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };
    setIsEmbedded(checkIfEmbedded());
  }, []);

  // 在 iframe 环境中使用更长的防抖延迟
  const debounceDelay = isEmbedded ? 500 : 300;

  // 正向换算：from -> to
  const updateToAmount = useCallback(async () => {
    if (isRequesting) return; // 避免重复请求

    try {
      setIsRequesting(true);
      setIsLoading(true);
      const numAmount = parseFloat(amount) || 1;

      if (numAmount <= 0) {
        setConvertedAmount("0.00");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${numAmount}&from=${fromCurrency}&to=${toCurrency}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();
      const rate = data.rates[toCurrency];

      if (rate !== undefined) {
        setConvertedAmount(rate.toFixed(2));
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Rate fetch error:", error);
        setConvertedAmount("Error");
      }
    } finally {
      setIsLoading(false);
      setIsRequesting(false);
    }
  }, [amount, fromCurrency, toCurrency, isRequesting]);

  // 反向换算：to -> from
  const updateFromAmount = useCallback(async () => {
    if (isRequesting) return; // 避免重复请求

    try {
      setIsRequesting(true);
      setIsLoading(true);
      const numAmount = parseFloat(convertedAmount) || 1;

      if (numAmount <= 0) {
        setAmount("0.00");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${numAmount}&from=${toCurrency}&to=${fromCurrency}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();
      const rate = data.rates[fromCurrency];

      if (rate !== undefined) {
        setAmount(rate.toFixed(2));
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Rate fetch error:", error);
        setAmount("Error");
      }
    } finally {
      setIsLoading(false);
      setIsRequesting(false);
    }
  }, [convertedAmount, fromCurrency, toCurrency, isRequesting]);

  // 修复的防抖函数 - 使用 useRef 避免重新创建
  const debouncedUpdateToAmount = useCallback(() => {
    if (debounceRef.current.updateToAmount) {
      clearTimeout(debounceRef.current.updateToAmount);
    }
    debounceRef.current.updateToAmount = setTimeout(() => {
      updateToAmount();
    }, debounceDelay);
  }, [updateToAmount, debounceDelay]);

  const debouncedUpdateFromAmount = useCallback(() => {
    if (debounceRef.current.updateFromAmount) {
      clearTimeout(debounceRef.current.updateFromAmount);
    }
    debounceRef.current.updateFromAmount = setTimeout(() => {
      updateFromAmount();
    }, debounceDelay);
  }, [updateFromAmount, debounceDelay]);

  // 修复的 useEffect - 简化依赖，避免循环
  useEffect(() => {
    if (lastModified === "from") {
      debouncedUpdateToAmount();
    } else {
      debouncedUpdateFromAmount();
    }
  }, [amount, convertedAmount, fromCurrency, toCurrency, lastModified]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceRef.current.updateToAmount) {
        clearTimeout(debounceRef.current.updateToAmount);
      }
      if (debounceRef.current.updateFromAmount) {
        clearTimeout(debounceRef.current.updateFromAmount);
      }
    };
  }, []);

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
      <div className="card-image exchange">
        <div className="converter-container">
          <div className="input-group">
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
              disabled={isLoading}
            />
          </div>

          <div className="swap-icon">⇄</div>

          <div className="input-group">
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
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-image.exchange {
          width: 100%;
          min-height: 120px;
          max-height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #000;
          padding: 16px;
          margin: 0;
        }

        .converter-container {
          display: flex;
          width: 100%;
          max-width: 400px;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin: 0;
        }

        .input-group {
          display: flex;
          align-items: center;
          background: #f8f8f7;
          border-radius: 10px;
          padding: 6px 10px;
          flex: 1;
          min-width: 0;
          margin: 0;
        }

        .swap-icon {
          font-size: 16px;
          color: #999;
          flex-shrink: 0;
          min-width: 20px;
          text-align: center;
          line-height: 1;
          margin: 0;
          transition: transform 0.3s ease;
        }

        .amount-input,
        .converted-amount-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          font-weight: 600;
          color: #000;
          text-align: right;
          width: 100%;
          min-width: 60px;
          max-width: none;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        .amount-input:disabled,
        .converted-amount-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .amount-input:focus,
        .converted-amount-input:focus {
          background: white;
          box-shadow: 0 0 0 2px #007bff;
          border-radius: 4px;
        }

        /* 手机端 - 垂直布局 */
        @media screen and (max-width: 768px) {
          .card-image.exchange {
            padding: 20px 12px;
            min-height: 160px;
            max-height: 200px;
          }

          .converter-container {
            flex-direction: column;
            gap: 16px;
            max-width: 320px;
          }

          .input-group {
            width: 100%;
            padding: 10px 14px;
          }

          .swap-icon {
            transform: rotate(90deg);
            margin: 0;
          }

          .amount-input,
          .converted-amount-input {
            text-align: center;
          }
        }

        /* 小屏手机 - 只调整间距 */
        @media screen and (max-width: 360px) {
          .card-image.exchange {
            padding: 16px 10px;
            min-height: 150px;
            max-height: 190px;
          }

          .converter-container {
            gap: 14px;
            max-width: 300px;
          }

          .input-group {
            padding: 8px 12px;
          }
        }
      `}</style>

      <style jsx global>{`
        .currency-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .currency-selector-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        .currency-selector-button:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .currency-flag {
          width: 16px;
          height: 12px;
          border-radius: 2px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .currency-code {
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        .currency-arrow {
          color: #666;
          font-size: 10px;
          margin-left: 2px;
        }

        .currency-selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
          margin-top: 4px;
        }

        .currency-selector-dropdown::-webkit-scrollbar {
          display: none;
        }

        .currency-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
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

        /* 手机端 - 保持元素大小不变，只调整间距 */
        @media screen and (max-width: 480px) {
          .currency-selector {
            margin-right: 8px;
          }

          .currency-selector-button {
            padding: 4px 8px;
            gap: 6px;
          }

          .currency-flag {
            width: 16px;
            height: 12px;
          }

          .currency-code {
            font-size: 14px;
          }

          .currency-arrow {
            font-size: 10px;
          }

          .currency-option {
            padding: 8px 12px;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

// 为组件添加静态路径信息
// CurrencyConverter.embedPath = "/exchange";
// CurrencyConverter.displayName = "Currency Converter";
