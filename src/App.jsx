import { useState, useEffect } from 'react'
import ConnectionCard from './components/ConnectionCard'
import GraphView from './components/GraphView'

export default function App() {
  const [tools, setTools] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('main') // 'main' | 'graph'

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tools.json`)
      .then(r => r.json())
      .then(data => {
        setTools(data.tools)
        setLoading(false)
      })
  }, [])

  const activeTool = tools.find(t => t.id === selected)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <img src={`${import.meta.env.BASE_URL}bwb-logo.png`} alt="BwB Logo" className="h-25 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">BwB Tool Ecosystem Explorer</h1>
                <p className="text-gray-500 text-sm mt-0.5">Select a tool to explore its current and suggested integrations</p>
              </div>
            </div>
            <button
              onClick={() => setView(v => v === 'main' ? 'graph' : 'main')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              {view === 'main' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Visualize
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List View
                </>
              )}
            </button>
          </div>

          {view === 'main' && (
            <div className="flex flex-wrap gap-2">
              {tools.map(tool => (
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
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === 'graph' ? (
          <GraphView tools={tools} />
        ) : !activeTool ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Select a tool to get started</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Click any tool chip above to see its active connections and suggested future integrations.
            </p>
          </div>
        ) : (
          <div>
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
                    {activeTool.current.map((conn, i) => <ConnectionCard key={i} connection={conn} type="current" />)}
                  </div>
                )}
              </section>

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
                    {activeTool.suggested.map((conn, i) => <ConnectionCard key={i} connection={conn} type="suggested" />)}
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
