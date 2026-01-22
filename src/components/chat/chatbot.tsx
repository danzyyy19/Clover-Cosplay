"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function Chatbot() {
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: locale === "th"
                ? "สวัสดีครับ! ผม Clover ยินดีต้อนรับสู่ Clover Cosplay มีอะไรให้ช่วยไหมครับ?"
                : "Hello! I'm Clover. Welcome to Clover Cosplay. How can I help you today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message
        const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Server responded with error:", errorData);
                throw new Error(errorData.error || "Failed to fetch");
            }

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: locale === "th" ? "ขออภัย มีปัญหาในการเชื่อมต่อ (Cek Console untuk detail error)" : "Sorry, connection error. Please check console for details." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#9370DB",
                    color: "white",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(147, 112, 219, 0.4)",
                    cursor: "pointer",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: isOpen ? "scale(0.9) rotate(90deg)" : "scale(1) rotate(0deg)",
                }}
                aria-label="Chat with AI"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "100px",
                        right: "24px",
                        width: "350px",
                        height: "500px",
                        backgroundColor: "var(--bg-card)",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        zIndex: 9999,
                        animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: "16px",
                        backgroundColor: "#9370DB",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Bot size={20} color="#9370DB" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Clover AI</h3>
                            <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>{locale === "th" ? "ตอบคำถามทันที" : "Instant Support"}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: "16px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        backgroundColor: "var(--bg-secondary)",
                    }}>
                        {messages.map((msg, index) => {
                            const isUser = msg.role === "user";
                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        flexDirection: isUser ? "row-reverse" : "row",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <div style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "50%",
                                        backgroundColor: isUser ? "#333" : "#9370DB",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        {isUser ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
                                    </div>
                                    <div style={{
                                        padding: "10px 14px",
                                        borderRadius: "12px",
                                        borderBottomRightRadius: isUser ? "2px" : "12px",
                                        borderBottomLeftRadius: isUser ? "12px" : "2px",
                                        backgroundColor: isUser ? "#333" : "var(--bg-card)",
                                        color: isUser ? "white" : "var(--text-primary)",
                                        border: isUser ? "none" : "1px solid var(--border-color)",
                                        maxWidth: "80%",
                                        fontSize: "13px",
                                        lineHeight: "1.5",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                    }}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <div style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    backgroundColor: "#9370DB",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <Bot size={14} color="white" />
                                </div>
                                <div style={{
                                    padding: "8px 12px",
                                    borderRadius: "12px",
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                }}>
                                    <Loader2 size={16} className="animate-spin" color="#9370DB" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            padding: "12px",
                            backgroundColor: "var(--bg-card)",
                            borderTop: "1px solid var(--border-color)",
                            display: "flex",
                            gap: "8px",
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={locale === "th" ? "พิมพ์ข้อความ..." : "Type a message..."}
                            style={{
                                flex: 1,
                                padding: "10px 14px",
                                borderRadius: "20px",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-primary)",
                                fontSize: "13px",
                                outline: "none",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#9370DB",
                                color: "white",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                opacity: isLoading || !input.trim() ? 0.7 : 1,
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </form>

                    {/* Keyframes for animation */}
                    <style jsx global>{`
            @keyframes slideIn {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
                </div>
            )}
        </>
    );
}
