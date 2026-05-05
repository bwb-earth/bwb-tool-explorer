export default function ConnectionCard({ connection, type }) {
  const isActive = type === 'current'
  return (
    <div className={`rounded-lg p-4 border-l-4 bg-white shadow-sm ${isActive ? 'border-l-green-500' : 'border-l-purple-500'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{connection.target}</p>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{connection.detail}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
          {isActive ? 'Active' : 'Suggested'}
        </span>
      </div>
    </div>
  )
}
