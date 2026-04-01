import { useState, useEffect } from 'react'

function Dashboard() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/conversations')
      const data = await response.json()
      setConversations(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load conversations')
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="text-gray-500 mt-3 text-sm">Loading conversations...</p>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-600 font-medium">{error}</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Conversation Log</h2>
          <p className="text-sm text-gray-500 mt-1">{conversations.length} conversations logged</p>
        </div>
        <button
          onClick={fetchConversations}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No conversations yet. Start chatting to see logs here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div key={conv.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {conv.sessionId}
                </span>
                <span className="text-xs text-gray-400">{conv.timestamp}</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-xs font-medium text-gray-500 w-16 shrink-0 pt-0.5">Employee</span>
                  <p className="text-sm text-gray-800">{conv.question}</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-medium text-indigo-500 w-16 shrink-0 pt-0.5">AI Reply</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{conv.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard