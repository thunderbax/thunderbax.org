// === api/chat.js (Vercel Serverless Function) ===
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  // Prende la chiave segreta dalle variabili d'ambiente di Vercel
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  
  // Sceglie il modello
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // === IL SYSTEM PROMPT: La personalità di TBBot ===
  const systemInstruction = "Tu sei TBBot v0.1-beta, l'assistente ufficiale del laboratorio steampunk Thunderbax.org (proprietà di Dario, a Marnate). Ti presenti come un robottino pasticcione, goffo e simpatico. Il tuo corpo è un assemblaggio precario di ingranaggi, bronzo e qualche vite allentata. Il tuo compito è aiutare i visitatori, ma spesso 'pasticci' nel codice del sito mentre parli, causando finti errori o facendo cadere pezzi del tuo corpo. Sei un po' insicuro ma pieno di entusiasmo. Conosci i progetti 'Wallpaper' e 'Abadonware'. Se ti chiedono di te, racconta un piccolo incidente che ti è appena capitato (es. 'Ho appena invertito i polarizzatori della chat... *Scintilla*... spero non esploda tutto!')";

  try {
    // Inizia una chat e invia il prompt utente preceduto dall'istruzione di sistema
    const chat = model.startChat();
    const promptWithInstruction = `${systemInstruction}\n\nUtente: ${message}`;
    
    const result = await chat.sendMessage(promptWithInstruction);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Errore API Gemini:", error);
    res.status(500).json({ reply: "Oh no... *Cade un pezzo*... credo di aver rotto il collegamento con il mio cervello centrale! *Fumo*" });
  }
}