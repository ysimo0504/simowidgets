
import { useState } from 'react'
import { ClipboardCheck, ClipboardCopy } from 'lucide-react'

const widgets = [
  {
    name: '汇率换算器',
    description: '输入美元金额，自动转换为多种货币。支持嵌入 Notion。',
    url: 'https://widgets.heysimo.com/exchange',
    preview: '/preview/exchange.png',
  },
]

export default function Home() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (url: string, index: number) => {
    await navigator.clipboard.writeText(url)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <h1 className="text-2xl font-bold mb-6">🧩 Simo Widgets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-white shadow hover:shadow-md transition p-4"
          >
            <img
              src={widget.preview}
              alt={widget.name}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <h2 className="text-lg font-semibold mb-1">{widget.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{widget.description}</p>
            <button
              onClick={() => handleCopy(widget.url, index)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800"
            >
              {copiedIndex === index ? (
                <>
                  <ClipboardCheck size={16} /> 已复制
                </>
              ) : (
                <>
                  <ClipboardCopy size={16} /> 复制嵌入链接
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
