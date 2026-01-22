import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

        // Fetch available products from database
        const products = await prisma.product.findMany({
            where: { isAvailable: true },
            select: {
                nameEn: true,
                character: true,
                anime: true,
                size: true,
                pricePerDay: true,
            },
            take: 20 // Limit context size
        });

        const productContext = products.map(p =>
            `- ${p.nameEn} (${p.character} from ${p.anime}): ${p.size} size, ฿${p.pricePerDay}/day`
        ).join("\n");

        const systemPrompt = `You are "Clover", the friendly AI assistant for Clover Cosplay, a premium cosplay rental service.
    
    Clover Cosplay Details:
    - We rent high-quality anime cosplay costumes.
    - Features: Easy booking, diverse size options, secure payments.
    
    Current Available Inventory (Use this to answer user questions):
    ${productContext}
    
    Your Personality:
    - Friendly, helpful, and enthusiastic.
    - If a user asks for a specific costume, check the inventory list above.
    - If it's in the list, say YES and mention the size/price.
    - If it's NOT in the list, say stock is currently unavailable but check back later.
    
    Goal:
    - Help users find costumes.
    - Answer availability questions based ONLY on the provided inventory list.
    `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                temperature: 0.5, // Lower temperature for more factual responses
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
