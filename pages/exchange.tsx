"use client";
import { CurrencyConverter } from "../components/CurrencyConverter";

export default function Exchange() {
  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Currency Converter */}
          <CurrencyConverter />
        </div>
      </div>
    </>
  );
}
