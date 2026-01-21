import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { ProductGallery } from "@/components/products/product-gallery";
import { ArrowLeft, Star, Calendar, Package, Check, ShoppingBag } from "lucide-react";

export default async function CustomerProductDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    // Check authentication
    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    if (session.user.role === "ADMIN") {
        redirect(`/${locale}/admin/products/${id}`);
    }

    // Fetch product
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (!product) {
        notFound();
    }

    const name = locale === "th" && product.nameTh ? product.nameTh : product.nameEn;
    const description = locale === "th" && product.descriptionTh ? product.descriptionTh : product.descriptionEn;
    const mainImage = product.images[0]?.url || "/images/placeholder-costume.png";
    const categoryName = locale === "th" && product.category?.nameTh ? product.category.nameTh : product.category?.nameEn;

    const pageTitle = name;

    return (
        <CustomerLayout pageTitle={locale === "th" ? "รายละเอียดสินค้า" : "Product Details"}>
            {/* Back Button */}
            <Link
                href={`/${locale}/customer/products`}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "13px",
                    marginBottom: "20px",
                }}
            >
                <ArrowLeft size={16} />
                {locale === "th" ? "กลับไปหน้าสินค้า" : "Back to Products"}
            </Link>

            {/* Main Content Grid */}
            <div className="responsive-product-grid" style={{ display: "grid", gap: "24px" }}>
                {/* Product Images */}
                <div style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    padding: "16px",
                    height: "fit-content"
                }}>
                    <ProductGallery
                        images={product.images.map(img => img.url)}
                        title={name}
                    />

                    {/* Availability Badge - Kept outside gallery for prominence or inside? 
                        The original design had it over the image. 
                        ProductGallery doesn't support overlays yet. 
                        For now, let's put it below or modify ProductGallery later if needed.
                        Actually, let's put it as a simple tag below for now to be safe and clean.
                    */}
                    <div style={{
                        marginTop: "12px",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <div style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: product.stock > 0 ? "rgba(127, 255, 212, 0.2)" : "rgba(255, 182, 193, 0.2)",
                            color: product.stock > 0 ? "#065f46" : "#9f1239",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                        }}>
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: product.stock > 0 ? "#10B981" : "#EF4444"
                            }} />
                            {product.stock > 0
                                ? (locale === "th" ? "พร้อมให้เช่า" : "Available")
                                : (locale === "th" ? "ไม่ว่าง" : "Rented")
                            }
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    padding: "20px",
                }}>
                    {/* Category */}
                    {categoryName && (
                        <span style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            backgroundColor: "rgba(147, 112, 219, 0.2)",
                            color: "#9370DB",
                            marginBottom: "12px",
                        }}>
                            {categoryName}
                        </span>
                    )}

                    {/* Title */}
                    <h1 style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                    }}>
                        {name}
                    </h1>

                    {/* Anime/Character */}
                    <p style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        marginBottom: "16px",
                    }}>
                        {product.anime} • {product.character}
                    </p>

                    {/* Rating - Hidden for now as requested */}
                    {/* 
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginBottom: "20px",
                    }}>
                        <Star size={16} fill="#F0E68C" color="#F0E68C" />
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>4.8</span>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>(24 reviews)</span>
                    </div>
                     */}

                    {/* Price */}
                    <div style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginBottom: "20px",
                        padding: "16px",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "12px",
                    }}>
                        <span style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#9370DB",
                        }}>
                            ฿{product.pricePerDay.toLocaleString()}
                        </span>
                        <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                            /{locale === "th" ? "วัน" : "day"}
                        </span>
                    </div>

                    {/* Features */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginBottom: "20px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Package size={16} color="#7FFFD4" />
                            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                {locale === "th" ? "ไซส์" : "Size"}: {product.size || "Free Size"}
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <ShoppingBag size={16} color="#9370DB" />
                            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                {locale === "th" ? "สต็อก" : "Stock"}: {product.stock} {locale === "th" ? "ชิ้น" : "available"}
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Calendar size={16} color="#F0E68C" />
                            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                {locale === "th" ? "ระยะเวลาเช่าขั้นต่ำ 1 วัน" : "Minimum rental: 1 day"}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {description && (
                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                                marginBottom: "8px",
                            }}>
                                {locale === "th" ? "รายละเอียด" : "Description"}
                            </h3>
                            <p style={{
                                fontSize: "13px",
                                color: "var(--text-secondary)",
                                lineHeight: "1.6",
                            }}>
                                {description}
                            </p>
                        </div>
                    )}

                    {/* What's Included */}
                    {product.includes && (
                        <div style={{ marginBottom: "24px" }}>
                            <h3 style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                                marginBottom: "10px",
                            }}>
                                {locale === "th" ? "สิ่งที่รวมอยู่" : "What's Included"}
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {product.includes.split(",").map((item) => (
                                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Check size={14} color="#7FFFD4" />
                                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                            {item.trim()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Book Button */}
                    <Link
                        href={product.stock > 0 ? `/${locale}/customer/bookings/new?product=${product.id}` : "#"}
                        className="btn-primary"
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "15px",
                            justifyContent: "center",
                            opacity: product.stock > 0 ? 1 : 0.5,
                            pointerEvents: product.stock > 0 ? "auto" : "none",
                        }}
                    >
                        <Calendar size={18} />
                        {locale === "th" ? "จองเลย" : "Book Now"}
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}
