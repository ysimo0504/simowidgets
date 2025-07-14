"use client";
import { useEffect, useState } from "react";

export default function Exchange() {
  const [rate, setRate] = useState<number | null>(null);
  const [usd, setUsd] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setRate(data.rates.JPY);
        setLastUpdated(
          new Date().toLocaleString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      });
  }, []);

  const handleUsdChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setUsd(num);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-black mb-1">💱 汇率换算</h1>
          <p className="text-sm text-gray-600">美元 → 日元</p>
        </div>

        {/* Exchange Widget */}
        <div className="border border-gray-200 bg-white">
          <div className="p-6">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                美元 (USD)
              </label>
              <input
                type="number"
                value={usd}
                onChange={(e) => handleUsdChange(e.target.value)}
                className="w-full text-2xl font-mono border-none outline-none bg-transparent"
                placeholder="1.00"
                min="0"
                step="0.01"
              />
              <div className="h-px bg-gray-200 mt-2"></div>
            </div>

            {/* Arrow */}
            <div className="text-center mb-6">
              <div className="text-gray-400">↓</div>
            </div>

            {/* Output Section */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                日元 (JPY)
              </label>
              <div className="text-2xl font-mono text-black">
                {rate ? `¥${(usd * rate).toFixed(2)}` : "加载中..."}
              </div>
              <div className="h-px bg-gray-200 mt-2"></div>
            </div>

            {/* Rate Info */}
            {rate && (
              <div className="text-xs text-gray-500 space-y-1">
                <div>汇率：1 USD = {rate.toFixed(2)} JPY</div>
                {lastUpdated && <div>更新：{lastUpdated}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">数据来源：ExchangeRate-API</p>
        </div>
      </div>
    </div>
  );
}
