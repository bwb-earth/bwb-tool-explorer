import { useState, useEffect } from 'react'

function ConnectionCard({ connection, type }) {
  const isActive = type === 'current'
  return (
    <div
      className={`rounded-lg p-4 border-l-4 bg-white shadow-sm ${
        isActive ? 'border-l-green-500' : 'border-l-purple-500'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{connection.target}</p>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{connection.detail}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {isActive ? 'Active' : 'Suggested'}
        </span>
      </div>
    </div>
  )
}

export default function App() {
  const [tools, setTools] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/tools.json')
      .then((r) => r.json())
      .then((data) => {
        setTools(data.tools)
        setLoading(false)
      })
  }, [])

  const activeTool = tools.find((t) => t.id === selected)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="mb-3">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              BWB Tool Ecosystem Explorer
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Select a tool to explore its current and suggested integrations
            </p>
          </div>
          {/* Tool chips */}
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelected(selected === tool.id ? null : tool.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border cursor-pointer ${
                  selected === tool.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {!activeTool ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Select a tool to get started</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Click any tool chip above to see its active connections and suggested future integrations.
            </p>
          </div>
        ) : (
          <div>
            {/* Tool header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{activeTool.name}</h2>
                <span className="text-gray-500 text-sm font-normal">{activeTool.description}</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 align-middle"></span>
                  {activeTool.current.length} active connection{activeTool.current.length !== 1 ? 's' : ''}
                </span>
                <span>
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1.5 align-middle"></span>
                  {activeTool.suggested.length} possible future integration{activeTool.suggested.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current connections */}
              <section>
                <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Current Connections
                </h3>
                {activeTool.current.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
                    <p className="text-gray-400 text-sm">No active integrations yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {activeTool.current.map((conn, i) => (
                      <ConnectionCard key={i} connection={conn} type="current" />
                    ))}
                  </div>
                )}
              </section>

              {/* Suggested integrations */}
              <section>
                <h3 className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                  Possible Future Integrations
                </h3>
                {activeTool.suggested.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center">
                    <p className="text-gray-400 text-sm">No suggestions yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {activeTool.suggested.map((conn, i) => (
                      <ConnectionCard key={i} connection={conn} type="suggested" />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
