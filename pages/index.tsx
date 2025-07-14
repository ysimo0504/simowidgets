import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

// Currency to country code mapping
const currencyFlags: { [key: string]: string } = {
  USD: "us",
  EUR: "eu",
  JPY: "jp",
  CNY: "cn",
  GBP: "gb",
  AUD: "au",
  CAD: "ca",
  CHF: "ch",
  KRW: "kr",
};

export default function Home() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [amount, setAmount] = useState(1);
  const [convertedValue, setConvertedValue] = useState("7.1676");

  const updateRate = async () => {
    try {
      const response = await fetch(
        `https://api.frankfurter.dev/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setConvertedValue(rate.toFixed(4));
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
    }
  };

  useEffect(() => {
    updateRate();
  }, [fromCurrency, toCurrency, amount]);

  const handleCopy = async (url: string, index: number) => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAmountChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setAmount(num);
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

        input[type="number"] {
          -moz-appearance: textfield;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        ::selection {
          background-color: #e5e5e5;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-100">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white font-bold text-lg">
              🧩
            </div>
            <div className="text-lg font-semibold text-black">Simo Widgets</div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Currency Converter Card */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 relative w-full max-w-md mx-auto">
              {/* Card Image */}
              <div
                className="w-full h-45 flex items-center justify-center border border-gray-300 rounded-xl bg-white mx-4 my-4"
                style={{ height: "180px" }}
              >
                <div className="flex w-full justify-center items-center gap-6">
                  {/* From Currency */}
                  <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden px-3 py-2">
                    <img
                      src={`https://flagcdn.com/${
                        currencyFlags[fromCurrency] || "us"
                      }.svg`}
                      alt={fromCurrency}
                      className="w-6 h-4 mr-2"
                    />
                    <div className="flex flex-col">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="font-semibold text-sm border-none bg-transparent outline-none"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="JPY">JPY</option>
                        <option value="CNY">CNY</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="CHF">CHF</option>
                        <option value="KRW">KRW</option>
                      </select>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="ml-4 text-base w-15 text-right border-none bg-transparent outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Exchange Icon */}
                  <span className="text-lg text-gray-400">⇄</span>

                  {/* To Currency */}
                  <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden px-3 py-2">
                    <img
                      src={`https://flagcdn.com/${
                        currencyFlags[toCurrency] || "cn"
                      }.svg`}
                      alt={toCurrency}
                      className="w-6 h-4 mr-2"
                    />
                    <div className="flex flex-col">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="font-semibold text-sm border-none bg-transparent outline-none"
                      >
                        <option value="CNY">CNY</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="JPY">JPY</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="CHF">CHF</option>
                        <option value="KRW">KRW</option>
                      </select>
                    </div>
                    <span className="ml-4 text-base font-bold">
                      {convertedValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="text-sm text-gray-600 mb-4">
                  A simple, embeddable currency converter for your workspace
                </div>
                <button
                  onClick={() =>
                    handleCopy("https://widgets.heysimo.com/exchange", 0)
                  }
                  className="w-full bg-black text-white border-none px-4 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-gray-800"
                >
                  {copiedIndex === 0 ? (
                    <>
                      <Check size={14} className="inline mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="inline mr-2" />
                      Copy Embed Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-600 text-sm border-t border-gray-200 bg-white">
          <p>© 2024 Simo Widgets</p>
        </footer>
      </main>
    </>
  );
}
