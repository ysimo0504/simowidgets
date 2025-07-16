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

// 完整的货币转换器组件
export const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [convertedAmount, setConvertedAmount] = useState("7.17");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
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
              background: "#f8f8f7",
              borderRadius: "10px",
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

          <span style={{ fontSize: "16px", color: "#999", flexShrink: 0 }}>
            ⇄
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f8f8f7",
              borderRadius: "10px",
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

      <style jsx>{`
        .card-image.exchange {
          width: 100%;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #000;
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
          width: 80px;
          max-width: 80px;
        }

        .amount-input:focus,
        .converted-amount-input:focus {
          background: white;
          box-shadow: 0 0 0 2px #007bff;
        }

        @media (max-width: 768px) {
          .amount-input,
          .converted-amount-input {
            max-width: 55px;
            font-size: 14px;
          }
        }
      `}</style>

      <style jsx global>{`
        .currency-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 8px;
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
        }

        .currency-code {
          color: #333;
          font-weight: 600;
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

        .currency-name {
          font-size: 12px;
          color: #666;
          margin-left: auto;
        }
      `}</style>
    </>
  );
};
