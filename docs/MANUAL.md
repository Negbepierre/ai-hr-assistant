# User Manual
## AI HR Assistant

**Live URL:** Coming soon  
**GitHub:** https://github.com/Negbepierre/ai-hr-assistant  
**Built by:** Inegbenose Pierre

---

## What This Tool Does

The AI HR Assistant is a chat interface that answers employee HR policy
questions instantly using Claude AI. Every conversation is automatically
logged to a database and visible in a manager dashboard.

---

## How to Use It

### Chat Interface

**Step 1** — Go to the live URL

**Step 2** — Type an HR question in the input box at the bottom

Example questions to try:
- How many days holiday do I get per year?
- Do I need a doctors note for sick leave?
- What is the paternity leave policy?
- How do I submit an expense claim?
- Can I work fully remotely?

**Step 3** — Press Enter or click Send

**Step 4** — Claude AI responds within a few seconds using the company
HR policy documents

---

### Dashboard

**Step 1** — Click the Dashboard tab at the top right

**Step 2** — All logged conversations appear sorted by most recent first

**Step 3** — Each entry shows the session ID, timestamp, employee question
and full AI response

**Step 4** — Click Refresh to pull the latest conversations from the database

---

## What Happens Behind the Scenes

1. User types a question and clicks Send
2. React frontend sends a POST request to the Node.js backend
3. Backend injects the company HR policy documents into the prompt
4. Prompt is sent to the Claude API
5. Claude generates a response grounded in the policy documents
6. Response is returned to the frontend and displayed in the chat
7. Question and response are logged to Airtable asynchronously
8. Dashboard fetches all logs from Airtable via a GET request

---

## Technical Concepts Demonstrated

| Concept | Implementation |
|---------|---------------|
| React components | ChatWindow, MessageBubble, Dashboard |
| React state | useState for messages, input, loading |
| React effects | useEffect to fetch dashboard data on mount |
| REST API | Express endpoints for chat and conversations |
| RAG pattern | HR policies injected as Claude system prompt |
| API security | Keys stored server-side, never in frontend |
| Async logging | Airtable write happens after response is sent |
| Database reads | Dashboard fetches live data from Airtable |

---

## Running Locally

### Prerequisites
- Node.js v18 or above
- Anthropic API key
- Airtable account with token and base ID

### Setup

**1 — Clone the repo**
```bash
git clone https://github.com/Negbepierre/ai-hr-assistant.git
cd ai-hr-assistant
```

**2 — Install frontend dependencies**
```bash
npm install
```

**3 — Install backend dependencies**
```bash
cd server
npm install
```

**4 — Create server environment file**
```bash
touch server/.env
```

Add these values:
```
ANTHROPIC_API_KEY=your_key_here
AIRTABLE_TOKEN=your_token_here
AIRTABLE_BASE_ID=your_base_id_here
PORT=3001
```

**5 — Start the backend**
```bash
cd server
node index.js
```

**6 — Start the frontend (new terminal tab)**
```bash
cd ai-hr-assistant
npm run dev
```

**7 — Open the app**

Go to http://localhost:5173 in your browser.