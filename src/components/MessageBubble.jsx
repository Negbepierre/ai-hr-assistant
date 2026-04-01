function MessageBubble({ role, content }) {
    const isUser = role === 'user'
  
    return (
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-indigo-600' : 'bg-indigo-100'
        }`}>
          <span className={`text-xs font-medium ${
            isUser ? 'text-white' : 'text-indigo-600'
          }`}>
            {isUser ? 'You' : 'HR'}
          </span>
        </div>
        <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    )
  }
  
  export default MessageBubble