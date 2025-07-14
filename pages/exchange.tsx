
'use client'
import { useEffect, useState } from 'react'

export default function Exchange() {
  const [rate, setRate] = useState<number | null>(null)
  const [usd, setUsd] = useState(1)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => setRate(data.rates.JPY))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="p-4 w-[300px] bg-gray-50 shadow-xl rounded-xl font-mono text-center">
        <h1 className="text-lg mb-2">💱 USD ➜ JPY</h1>
        <input
          type="number"
          value={usd}
          onChange={e => setUsd(Number(e.target.value))}
          className="border rounded px-2 py-1 w-24 text-center"
        />
        <p className="mt-2 text-xl">
          {rate ? `≈ ¥${(usd * rate).toFixed(2)}` : '加载中...'}
        </p>
      </div>
    </div>
  )
}
