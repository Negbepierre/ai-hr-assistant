import { useState } from 'react'
import MessageBubble from './MessageBubble'

const HR_POLICY_CONTEXT = `
You are an HR assistant for a company. You have access to the following HR policies:

HOLIDAY POLICY:
- Full time employees receive 25 days holiday per year plus bank holidays
- Holiday must be approved by your line manager at least 2 weeks in advance
- Maximum 2 weeks consecutive holiday allowed without director approval
- Holiday year runs January to December, unused days cannot be carried over

PARENTAL LEAVE:
- Maternity leave: up to 52 weeks, first 26 weeks full pay, remaining statutory pay
- Paternity leave: 2 weeks full pay within 8 weeks of birth
- Shared parental leave available, contact HR for details

SICK LEAVE:
- First 3 days self-certified, from day 4 a doctors note is required
- Full pay for first 4 weeks, then statutory sick pay
- Return to work meeting required after any absence over 5 days

REMOTE WORKING:
- Hybrid working available, minimum 2 days per week in office
- Remote working requests must be submitted to line manager
- Full remote working requires director approval

EXPENSES:
- All expenses must be submitted within 30 days of being incurred
- Receipts required for all claims over 10 pounds
- Travel expenses reimbursed at standard HMRC rates
- Submit expenses via the company expenses portal

Always be helpful, professional and empathetic. If you do not know the answer, say so clearly and direct the employee to contact HR directly at hr@company.com
`

function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am your HR assistant. I can answer questions about company policies, help you submit requests, or point you in the right direction. How can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://ai-hr-assistant-production-1c18.up.railway.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: input }
          ]
        })
      })

      const data = await response.json()
      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.content
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact HR directly at hr@company.com'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-indigo-600">HR</span>
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about HR policies..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Press Enter to send</p>
      </div>

    </div>
  )
}

export default ChatWindow