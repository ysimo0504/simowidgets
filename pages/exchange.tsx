"use client";
import { useEffect, useState } from "react";
import { CurrencySelector } from "../components/CurrencyConverter";

export default function Exchange() {
  const [rate, setRate] = useState<number | null>(null);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("JPY");
  const [lastUpdated, setLastUpdated] = useState<string>("");

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

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(
          `https://api.frankfurter.dev/v1/latest?from=${fromCurrency}&to=${toCurrency}`
        );
        const data = await response.json();
        setRate(data.rates[toCurrency]);
        setLastUpdated(
          new Date().toLocaleString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setAmount(num);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      JPY: "¥",
      CNY: "¥",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      CHF: "Fr",
      KRW: "₩",
    };
    return symbols[currency] || "";
  };

  return (
    <>
      <style jsx global>{`
        /* 自定义货币选择器样式 */
        .currency-selector {
          position: relative;
          display: inline-block;
        }

        .currency-selector-button {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          justify-content: space-between;
        }

        .currency-selector-button:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .currency-flag {
          width: 20px;
          height: 15px;
          margin-right: 8px;
          border-radius: 2px;
        }

        .currency-code {
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }

        .currency-arrow {
          font-size: 10px;
          color: #666;
          margin-left: 6px;
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

        .currency-option .currency-flag {
          width: 20px;
          height: 15px;
          margin-right: 8px;
        }

        .currency-option .currency-code {
          font-weight: 600;
          font-size: 14px;
          margin-right: 8px;
          min-width: 35px;
        }

        .currency-option .currency-name {
          font-size: 12px;
          color: #666;
          flex: 1;
        }
      `}</style>

      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-lg font-medium text-black mb-1">💱 汇率换算</h1>
            <p className="text-sm text-gray-600">
              {fromCurrency} → {toCurrency}
            </p>
          </div>

          {/* Exchange Widget */}
          <div className="border border-gray-200 bg-white">
            <div className="p-6">
              {/* From Currency Section */}
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">
                  源货币
                </label>
                <div className="flex items-center gap-4">
                  <CurrencySelector
                    value={fromCurrency}
                    onChange={setFromCurrency}
                    options={currencies}
                  />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="flex-1 text-2xl font-mono border-none outline-none bg-transparent"
                    placeholder="1.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="h-px bg-gray-200 mt-2"></div>
              </div>

              {/* Arrow */}
              <div className="text-center mb-6">
                <div className="text-gray-400">↓</div>
              </div>

              {/* To Currency Section */}
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">
                  目标货币
                </label>
                <div className="flex items-center gap-4">
                  <CurrencySelector
                    value={toCurrency}
                    onChange={setToCurrency}
                    options={currencies}
                  />
                  <div className="flex-1 text-2xl font-mono text-black">
                    {rate
                      ? `${getCurrencySymbol(toCurrency)}${(
                          amount * rate
                        ).toFixed(2)}`
                      : "加载中..."}
                  </div>
                </div>
                <div className="h-px bg-gray-200 mt-2"></div>
              </div>

              {/* Rate Info */}
              {rate && (
                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    汇率：1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </div>
                  {lastUpdated && <div>更新：{lastUpdated}</div>}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">数据来源：Frankfurter API</p>
          </div>
        </div>
      </div>
    </>
  );
}
