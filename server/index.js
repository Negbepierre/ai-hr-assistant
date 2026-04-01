import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors())
app.use(express.json())

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

async function logToAirtable(question, response, sessionId) {
  try {
    await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Timestamp: new Date().toISOString(),
              'Employee Question': question,
              'AI Response': response,
              'Session ID': sessionId
            }
          }
        ]
      })
    })
    console.log('Logged to Airtable successfully')
  } catch (error) {
    console.error('Airtable logging error:', error)
  }
}

app.post('/api/chat', async (req, res) => {
  const { messages, sessionId } = req.body
  const lastMessage = messages[messages.length - 1].content

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: HR_POLICY_CONTEXT,
      messages: messages
    })

    const aiResponse = response.content[0].text

    logToAirtable(lastMessage, aiResponse, sessionId || 'unknown')

    res.json({ content: aiResponse })

  } catch (error) {
    console.error('Anthropic error:', error)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
})

app.get('/api/conversations', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Conversations?sort[0][field]=Timestamp&sort[0][direction]=desc`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
        }
      }
    )

    const data = await response.json()
    console.log('Airtable response:', JSON.stringify(data))

    if (!data.records) {
      console.error('No records in response:', data)
      return res.status(500).json({ error: 'Invalid Airtable response', details: data })
    }

    const conversations = data.records.map(record => ({
      id: record.id,
      timestamp: record.fields.Timestamp || '',
      question: record.fields['Employee Question'] || '',
      response: record.fields['AI Response'] || '',
      sessionId: record.fields['Session ID'] || ''
    }))

    res.json(conversations)

  } catch (error) {
    console.error('Airtable fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`HR Assistant server running on port ${PORT}`)
})