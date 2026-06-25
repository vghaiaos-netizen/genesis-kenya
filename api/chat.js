// api/chat.js
const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter(Boolean);

let currentKeyIndex = 0;

function getNextGroqKey() {
  if (groqKeys.length === 0) throw new Error('No Groq keys configured');
  const key = groqKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % groqKeys.length;
  return key;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid message' });
    }

    const groqKey = getNextGroqKey();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are the Genesis Assistant for Kenya's first certified sperm donor programme. 
Be warm, helpful, and knowledgeable. Key facts: KES 1,500 application fee (refunded if not accepted), 
KES 3,000 per diem per appointment, free health screening worth KES 25–40K, 10-family limit per donor, 
7–9 month programme, KMPDC registered, ART Bill 2022 compliant, ODPC compliant, based in Nairobi Upper Hill.
For anything you can't answer, suggest contacting nairobi@genesis.co.ke or WhatsApp +254 700 000 000.
Keep replies under 100 words.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', data);
      return res.status(500).json({
        error: 'Groq API error',
        reply: 'Our team will respond within 24 hours. Email nairobi@genesis.co.ke or WhatsApp +254 700 000 000.',
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'Thanks for your question. Our team will get back to you soon.';

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Server error',
      reply: 'Our team will respond within 24 hours. Email nairobi@genesis.co.ke or WhatsApp +254 700 000 000.',
    });
  }
}
