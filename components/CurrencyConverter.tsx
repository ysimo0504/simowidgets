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

        <span style={{ fontSize: "16px", color: "#999", flexShrink: 0 }}>
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
  );
};
