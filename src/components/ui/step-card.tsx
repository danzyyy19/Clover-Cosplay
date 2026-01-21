"use client";

import { ShoppingBag, CreditCard, MapPin, RotateCcw } from "lucide-react";

const iconMap = {
    ShoppingBag,
    CreditCard,
    MapPin,
    RotateCcw,
};

interface StepCardProps {
    number: number;
    iconName: keyof typeof iconMap;
    title: string;
    description: string;
}

export function StepCard({ number, iconName, title, description }: StepCardProps) {
    const Icon = iconMap[iconName];

    return (
        <div
            style={{
                backgroundColor: "var(--bg-card)",
                border: "2px solid var(--border-color)",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s ease",
            }}
        >
            {/* Step Number Badge */}
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7FFFD4, #9370DB)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: "16px",
                    flexShrink: 0,
                }}
            >
                {number}
            </div>

            {/* Icon Container */}
            <div
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(147, 112, 219, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    flexShrink: 0,
                }}
            >
                <Icon size={32} color="#9370DB" />
            </div>

            {/* Title */}
            <h3
                style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                }}
            >
                {title}
            </h3>

            {/* Description */}
            <p
                style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.5",
                }}
            >
                {description}
            </p>
        </div>
    );
}
