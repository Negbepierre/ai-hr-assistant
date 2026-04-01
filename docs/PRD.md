# Product Requirements Document
## AI HR Assistant
**Version:** 1.0  
**Author:** Inegbenose Pierre  
**Date:** April 2026  
**Status:** In Development

---

## 1. Problem Statement

Employees waste significant time finding answers to routine HR questions —
holiday entitlement, sick leave policy, expense rules, parental leave. HR
teams spend a disproportionate amount of time answering the same questions
repeatedly. This tool gives employees instant, accurate answers 24/7 while
giving HR teams a log of every query for pattern analysis.

---

## 2. Goal

Build an AI-powered HR assistant that:
- Answers employee HR questions instantly using company policy context
- Maintains a full conversation log for HR teams to review
- Provides a manager dashboard showing all interactions in real time
- Demonstrates a RAG pattern using injected policy documents

---

## 3. Target Users

| User | Need |
|------|------|
| Employee | Get instant answers to HR policy questions without waiting |
| HR manager | Review all employee queries and identify common issues |
| System tester | Verify the tool works correctly end to end |

---

## 4. Core Features

### 4.1 AI Chat Interface
- Clean React chat UI accessible in any browser
- Employee types a question in natural language
- Claude AI responds using injected company HR policy context
- Conversation history maintained within the session
- Typing indicator shown while AI is generating a response

### 4.2 HR Policy Context (RAG Pattern)
- Company HR policies stored as structured text in the server
- Policies injected into every Claude API call as system context
- Claude answers only from provided policy content
- If information is not in the policy, Claude directs to HR directly
- Policies currently cover: holiday, parental leave, sick leave, remote
  working, and expenses

### 4.3 Conversation Logging
- Every employee question and AI response logged to Airtable
- Logs include: timestamp, question, response, session ID
- Logging happens automatically after every AI response
- Runs asynchronously so it does not slow down the user experience

### 4.4 Manager Dashboard
- Separate dashboard view showing all logged conversations
- Conversations sorted by most recent first
- Each entry shows: session ID, timestamp, question, full AI response
- Live refresh button to pull latest data from Airtable
- Shows total conversation count

---

## 5. Technical Architecture
```
[React Frontend — Chat UI]
        ↓ POST /api/chat
[Node.js Express Backend]
        ↓ Anthropic SDK
[Claude API — claude-sonnet-4-5]
        ↓ Response
[Node.js — log to Airtable]     [Return response to frontend]
        ↓
[Airtable — Conversations table]
        ↑ GET /api/conversations
[React Frontend — Dashboard]
```

---

## 6. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite | Component-based UI, industry standard |
| Styling | Tailwind CSS | Rapid UI development |
| Backend | Node.js + Express | Lightweight API server |
| AI | Anthropic Claude API | Best-in-class instruction following |
| Database | Airtable | No-code database with REST API |
| Hosting (frontend) | Netlify | Free, Git-connected deployment |
| Hosting (backend) | Railway | Free tier, Node.js support |
| Version control | Git + GitHub | Professional commit history |

---

## 7. RAG Pattern Implementation

RAG stands for Retrieval Augmented Generation. Instead of relying on
Claude's general training data, we inject specific company documents into
the prompt before each API call. This ensures Claude answers only from
authoritative company sources.

In this implementation the policy documents are stored as a constant in
the server. In a production system these would be stored in a vector
database such as Pinecone, with semantic search used to retrieve only the
most relevant sections for each query.

---

## 8. Success Criteria

- [ ] Employee can ask an HR question and receive an accurate answer
- [ ] Answer is grounded in injected company policy, not general knowledge
- [ ] Every conversation is logged to Airtable automatically
- [ ] Dashboard shows all conversations sorted by most recent
- [ ] Application is live at a public URL
- [ ] GitHub repo has clear commit history

---

## 9. Out of Scope (Version 1)

- User authentication or employee login
- HR request submission and approval workflow
- Email notifications
- Vector database for dynamic policy retrieval
- Multiple company support

---

## 10. Future Improvements (Version 2)

- Replace static policy text with a vector database for dynamic retrieval
- Add employee authentication so conversations are tied to individuals
- Build a request submission flow with manager approval
- Add email notifications when new requests are submitted
- Connect to an HRIS system for live employee data
- Slack integration so employees can ask HR questions without leaving Slack

---

## 11. Key Concepts Demonstrated

**RAG pattern** — injecting company-specific context into LLM prompts to
ground responses in authoritative data rather than general training.

**Full stack architecture** — React frontend communicating with a Node.js
backend, which calls external APIs and writes to a database.

**API security** — API keys stored server-side only, never exposed to the
browser. Frontend calls a private backend endpoint, not the AI API directly.

**Async logging** — database writes happen asynchronously after the response
is returned, so logging never delays the user experience.

**Component-based UI** — React components with state management using hooks,
conditional rendering, and prop passing between parent and child components.