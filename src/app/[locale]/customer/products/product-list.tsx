"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { LayoutGrid, List, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    id: string;
    nameEn: string;
    nameTh: string;
    anime: string | null;
    character: string | null;
    pricePerDay: any; // Prisma Decimal
    size: string | null;
    stock: number;
    isAvailable: boolean;
    images: { url: string }[];
}

interface ProductListProps {
    products: Product[];
    locale: string;
}

export function ProductList({ products, locale }: ProductListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div>
            {/* View Toggle */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
            }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                    {products.length} {locale === "th" ? "รายการ" : "items"}
                </p>
                <div style={{
                    display: "flex",
                    gap: "8px",
                    backgroundColor: "var(--bg-card)",
                    padding: "4px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                }}>
                    <button
                        onClick={() => setViewMode("grid")}
                        style={{
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: viewMode === "grid" ? "var(--color-clover-lavender)" : "transparent",
                            color: viewMode === "grid" ? "white" : "var(--text-secondary)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.2s"
                        }}
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        style={{
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: viewMode === "list" ? "var(--color-clover-lavender)" : "transparent",
                            color: viewMode === "list" ? "white" : "var(--text-secondary)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.2s"
                        }}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{
                display: "grid",
                gridTemplateColumns: viewMode === "grid"
                    ? "repeat(auto-fill, minmax(240px, 1fr))" // Larger cards
                    : "1fr",
                gap: "16px",
            }}>
                {products.map((product) => {
                    // Common Data
                    const name = locale === "th" ? product.nameTh : product.nameEn;
                    const price = Number(product.pricePerDay);
                    const image = product.images[0]?.url;

                    if (viewMode === "grid") {
                        // Grid View (Standard Card)
                        return (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                nameEn={product.nameEn}
                                nameTh={product.nameTh}
                                anime={product.anime || ""}
                                character={product.character || ""}
                                pricePerDay={price}
                                size={product.size || "Free"}
                                rating={5.0} // Placeholder
                                isAvailable={product.stock > 0}
                                locale={locale}
                                image={image}
                                baseUrl={`/${locale}/customer/products`}
                            />
                        );
                    } else {
                        // List View (Compact Horizontal Row)
                        return (
                            <Link
                                key={product.id}
                                href={`/${locale}/customer/products/${product.id}`}
                                style={{
                                    display: "flex",
                                    gap: "16px",
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "12px",
                                    textDecoration: "none",
                                    alignItems: "center",
                                    transition: "all 0.2s",
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    backgroundColor: "var(--bg-secondary)",
                                    flexShrink: 0,
                                    position: "relative"
                                }}>
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={name}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <ShoppingBag size={24} color="var(--text-secondary)" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                        <span style={{
                                            fontSize: "10px",
                                            fontWeight: "600",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            backgroundColor: "rgba(147, 112, 219, 0.1)",
                                            color: "#9370DB",
                                        }}>
                                            {product.anime}
                                        </span>
                                        {product.stock > 0 ? (
                                            <span style={{ fontSize: "10px", color: "#10b981" }}>
                                                {locale === "th" ? "พร้อมเช่า" : "Available"}
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: "10px", color: "#ef4444" }}>
                                                {locale === "th" ? "ไม่ว่าง" : "Rented"}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "var(--text-primary)",
                                        marginBottom: "4px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}>
                                        {name}
                                    </h3>

                                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                        {product.character} • Size: {product.size || "Free"}
                                    </p>
                                </div>

                                {/* Price & Action */}
                                <div style={{ textAlign: "right", paddingLeft: "16px", borderLeft: "1px solid var(--border-color)" }}>
                                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "var(--color-clover-purple)" }}>
                                        ฿{price.toLocaleString()}
                                    </p>
                                    <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                                        / {locale === "th" ? "วัน" : "day"}
                                    </p>
                                </div>
                            </Link>
                        );
                    }
                })}
            </div>
        </div>
    );
}
