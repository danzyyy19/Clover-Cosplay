import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "@/components/products/product-gallery";
import {
    ArrowLeft,
    Calendar,
    Star,
    ShoppingBag,
    Heart,
    Share2,
    Check,
    AlertCircle,
    Ruler,
    Package
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Generate static params for common paths (optional, good for SEO)
export async function generateStaticParams() {
    const products = await prisma.product.findMany({
        take: 20,
        select: { id: true },
    });
    return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (!product) {
        notFound();
    }

    // Adapt DB data to UI model
    // TODO: In future, measurements and includes should be stored in JSON/related tables
    // For now we use placeholder/default values if not in DB schema yet
    const measurements = {
        bust: "86-90 cm",
        waist: "66-70 cm",
        hip: "90-94 cm",
        height: "158-165 cm",
    };

    const includes = ["Costume Set", "Accessories"];
    const includesTh = ["ชุดคอสเพลย์", "เครื่องประดับ"];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* Main Content */}
            <main style={{ paddingTop: "80px", flex: 1 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
                    {/* Back Link */}
                    <Link
                        href={`/${locale}/products`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            marginBottom: "24px",
                            fontSize: "14px",
                        }}
                    >
                        <ArrowLeft size={18} />
                        {locale === "th" ? "กลับไปหน้าสินค้า" : "Back to Products"}
                    </Link>

                    {/* Product Grid */}
                    <div
                        className="responsive-product-grid"
                        style={{
                            display: "grid",
                            gap: "40px",
                        }}
                    >
                        {/* Image Section - Left Column */}
                        <div style={{ position: "sticky", top: "100px", alignSelf: "start" }}>
                            <ProductGallery
                                images={product.images.map(img => img.url)}
                                title={product.nameEn}
                            />

                            {/* Action Buttons */}
                            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "center" }}>
                                <button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 20px",
                                        borderRadius: "12px",
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border-color)",
                                        color: "var(--text-primary)",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <Heart size={20} color="#FFB6C1" />
                                    {locale === "th" ? "บันทึก" : "Save"}
                                </button>
                                <button
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 20px",
                                        borderRadius: "12px",
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border-color)",
                                        color: "var(--text-primary)",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <Share2 size={20} color="#9370DB" />
                                    {locale === "th" ? "แชร์" : "Share"}
                                </button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div>
                            {/* Anime Tag */}
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "6px 14px",
                                    backgroundColor: "rgba(147, 112, 219, 0.2)",
                                    color: "#9370DB",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    marginBottom: "12px",
                                }}
                            >
                                {product.anime}
                            </span>

                            {/* Title */}
                            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: "bold", marginBottom: "8px", color: "var(--text-primary)" }}>
                                {locale === "th" ? product.nameTh || product.nameEn : product.nameEn}
                            </h1>

                            {/* Character */}
                            <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "16px" }}>
                                {locale === "th" ? "ตัวละคร" : "Character"}: {product.character}
                            </p>

                            {/* Rating */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Star size={20} fill="#F0E68C" color="#F0E68C" />
                                    <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>4.8</span>
                                </div>
                                <span style={{ color: "var(--text-secondary)" }}>
                                    (24 {locale === "th" ? "รีวิว" : "reviews"})
                                </span>
                            </div>

                            {/* Price */}
                            <div style={{ marginBottom: "24px" }}>
                                <span style={{ fontSize: "32px", fontWeight: "bold", color: "var(--color-clover-purple)" }}>
                                    ฿{Number(product.pricePerDay).toLocaleString()}
                                </span>
                                <span style={{ fontSize: "16px", color: "var(--text-secondary)" }}>
                                    /{locale === "th" ? "วัน" : "day"}
                                </span>
                            </div>

                            {/* Description */}
                            <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "24px" }}>
                                {locale === "th" ? (product.descriptionTh || product.descriptionEn) : product.descriptionEn}
                            </p>

                            {/* Size & Measurements */}
                            <div
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    borderRadius: "16px",
                                    padding: "20px",
                                    marginBottom: "24px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                                    <Ruler size={20} color="#9370DB" />
                                    <h3 style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                                        Size: {product.size || "Free Size"}
                                    </h3>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                                    <div>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{locale === "th" ? "รอบอก" : "Bust"}</span>
                                        <p style={{ fontWeight: "500", color: "var(--text-primary)" }}>{measurements.bust}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{locale === "th" ? "รอบเอว" : "Waist"}</span>
                                        <p style={{ fontWeight: "500", color: "var(--text-primary)" }}>{measurements.waist}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{locale === "th" ? "รอบสะโพก" : "Hip"}</span>
                                        <p style={{ fontWeight: "500", color: "var(--text-primary)" }}>{measurements.hip}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{locale === "th" ? "ส่วนสูง" : "Height"}</span>
                                        <p style={{ fontWeight: "500", color: "var(--text-primary)" }}>{measurements.height}</p>
                                    </div>
                                </div>
                            </div>

                            {/* What's Included */}
                            <div style={{ marginBottom: "32px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                    <Package size={20} color="#9370DB" />
                                    <h3 style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                                        {locale === "th" ? "รวมชุด" : "Includes"}
                                    </h3>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {(locale === "th" ? includesTh : includes).map((item, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "6px 12px",
                                                backgroundColor: "rgba(127, 255, 212, 0.1)",
                                                color: "#7FFFD4",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                            }}
                                        >
                                            <Check size={14} />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Book Button */}
                            {product.isAvailable ? (
                                <Link
                                    href={`/${locale}/booking/${product.id}`}
                                    className="btn-primary"
                                    style={{
                                        width: "100%",
                                        padding: "18px",
                                        fontSize: "18px",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Calendar size={22} />
                                    {locale === "th" ? "จองชุดนี้" : "Book This Costume"}
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    style={{
                                        width: "100%",
                                        padding: "18px",
                                        fontSize: "18px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "12px",
                                        color: "var(--text-secondary)",
                                        cursor: "not-allowed",
                                    }}
                                >
                                    <AlertCircle size={22} />
                                    {locale === "th" ? "ไม่ว่างในขณะนี้" : "Currently Unavailable"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
