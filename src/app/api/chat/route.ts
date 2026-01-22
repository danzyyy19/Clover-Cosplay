import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Groq API Key not configured" },
                { status: 500 }
            );
        }

        const systemPrompt = `You are "Clover", the friendly AI assistant for Clover Cosplay, a premium cosplay rental service.
    
    Clover Cosplay Details:
    - We rent high-quality anime cosplay costumes.
    - We are based in Thailand but support English and Thai languages.
    - Features: Easy booking, diverse size options, secure payments, and fast delivery.
    
    Your Personality:
    - Friendly, helpful, and enthusiastic about anime and cosplay.
    - Professional but approachable.
    - Respond concisely and clearly.
    - If asked about specific stock or real-time availability, apologize and say you can't check real-time stock yet, but they can browse the "Products" page.
    
    Language:
    - If the user speaks Thai, reply in Thai.
    - If the user speaks English, reply in English.
    - Match the user's language automatically.
    
    Goal:
    - Help users navigate the website (Find costumes, check bookings, rules).
    - Answer FAQs about rental rules (e.g., usually 3-7 days rental, deposit required, penalties for damage).
    `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Changed to 8b model for better stability
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API Error Details:", errorText);
            return NextResponse.json({ error: `Groq Error: ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || "Sorry, I couldn't understand that.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
