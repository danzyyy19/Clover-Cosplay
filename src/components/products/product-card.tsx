"use client";

import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
    id: string;
    nameEn: string;
    nameTh: string;
    anime: string;
    character: string;
    pricePerDay: number;
    size: string;
    rating: number;
    isAvailable: boolean;
    locale: string;
    image?: string;
}

export function ProductCard({
    id,
    nameEn,
    nameTh,
    anime,
    character,
    pricePerDay,
    size,
    rating,
    isAvailable,
    locale,
    image,
    baseUrl,
}: ProductCardProps & { baseUrl?: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const linkPath = baseUrl ? `${baseUrl}/${id}` : `/${locale}/products/${id}`;

    return (
        <Link href={linkPath} style={{ textDecoration: "none" }}>
            <div
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: `2px solid ${isHovered ? "var(--color-clover-lavender)" : "var(--border-color)"}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "3/4",
                        backgroundColor: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {image ? (
                        <img
                            src={image}
                            alt={locale === "th" ? nameTh : nameEn}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                                transform: isHovered ? "scale(1.05)" : "scale(1)"
                            }}
                        />
                    ) : (
                        <ShoppingBag size={48} color="var(--text-secondary)" style={{ opacity: 0.3 }} />
                    )}

                    {/* Availability Badge */}
                    <div
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: isAvailable ? "rgba(127, 255, 212, 0.2)" : "rgba(255, 182, 193, 0.2)",
                            color: isAvailable ? "#7FFFD4" : "#FFB6C1",
                            border: `1px solid ${isAvailable ? "#7FFFD4" : "#FFB6C1"}`,
                        }}
                    >
                        {isAvailable
                            ? (locale === "th" ? "ว่าง" : "Available")
                            : (locale === "th" ? "ไม่ว่าง" : "Unavailable")
                        }
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Anime Tag */}
                    <span
                        style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            backgroundColor: "rgba(147, 112, 219, 0.2)",
                            color: "#9370DB",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            marginBottom: "8px",
                            alignSelf: "flex-start",
                        }}
                    >
                        {anime}
                    </span>

                    {/* Name */}
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                        {locale === "th" ? nameTh : nameEn}
                    </h3>

                    {/* Character & Size */}
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px", flex: 1 }}>
                        {locale === "th" ? "ตัวละคร" : "Character"}: {character} • {locale === "th" ? "ขนาด" : "Size"}: {size}
                    </p>

                    {/* Rating & Price */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Star size={16} fill="#F0E68C" color="#F0E68C" />
                            <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>
                                {rating}
                            </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "18px", fontWeight: "bold", color: "var(--color-clover-purple)" }}>
                                ฿{pricePerDay.toLocaleString()}
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                /{locale === "th" ? "วัน" : "day"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
