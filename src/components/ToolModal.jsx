import { useEffect } from 'react'

export default function ToolModal({ tool, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!tool) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{tool.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{tool.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Current connections */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wider mb-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Active Connections
              <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium normal-case tracking-normal">
                {tool.current.length}
              </span>
            </h3>
            {tool.current.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No active connections yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {tool.current.map((conn, i) => (
                  <div key={i} className="rounded-lg border-l-4 border-l-green-500 bg-green-50 px-4 py-3">
                    <p className="font-semibold text-gray-900 text-sm">{conn.target}</p>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{conn.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Suggested connections */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Suggested Integrations
              <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium normal-case tracking-normal">
                {tool.suggested.length}
              </span>
            </h3>
            {tool.suggested.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No suggestions yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {tool.suggested.map((conn, i) => (
                  <div key={i} className="rounded-lg border-l-4 border-l-purple-500 bg-purple-50 px-4 py-3">
                    <p className="font-semibold text-gray-900 text-sm">{conn.target}</p>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{conn.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
