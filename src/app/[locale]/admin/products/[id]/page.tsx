import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import Link from "next/link";
import { Package, Edit, ChevronLeft, Calendar, Tag } from "lucide-react";
import { ProductGallery } from "@/components/products/product-gallery";

export default async function AdminProductDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/login`);
    }

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: true,
        },
    });

    if (!product) {
        redirect(`/${locale}/admin/products`);
    }

    return (
        <AdminLayout pageTitle={locale === "th" ? "รายละเอียดสินค้า" : "Product Details"}>
            {/* Back Button */}
            <Link href={`/${locale}/admin/products`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px", textDecoration: "none" }}>
                <ChevronLeft size={16} />
                {locale === "th" ? "กลับไปหน้ารายการสินค้า" : "Back to Products"}
            </Link>

            <div className="admin-detail-grid">
                {/* Main Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Images */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <ProductGallery
                            images={product.images.map((img: { url: string }) => img.url)}
                            title={product.nameEn}
                        />
                    </div>

                    {/* Info */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "8px" }}>
                            {product.nameEn}
                        </h2>
                        {product.nameTh && (
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>{product.nameTh}</p>
                        )}

                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                <Tag size={14} />
                                {product.anime}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                {product.character}
                            </span>
                        </div>

                        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>{locale === "th" ? "รายละเอียด" : "Description"}</h3>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                            {locale === "th" && product.descriptionTh ? product.descriptionTh : (product.descriptionEn || (locale === "th" ? "ไม่มีรายละเอียด" : "No description available"))}
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Pricing */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "12px" }}>{locale === "th" ? "ราคา" : "Pricing"}</h3>
                        <p style={{ fontSize: "28px", fontWeight: "bold", color: "#9370DB" }}>
                            ฿{Number(product.pricePerDay).toLocaleString()}<span style={{ fontSize: "14px", fontWeight: "normal", color: "var(--text-secondary)" }}>/{locale === "th" ? "วัน" : "day"}</span>
                        </p>
                    </div>

                    {/* Stock */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "12px" }}>{locale === "th" ? "สินค้าคงคลัง" : "Inventory"}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                backgroundColor: product.stock > 0 ? "rgba(127, 255, 212, 0.2)" : "rgba(255, 182, 193, 0.2)",
                                color: product.stock > 0 ? "#7FFFD4" : "#FFB6C1",
                            }}>
                                {product.stock} {locale === "th" ? "ในสต็อก" : "in stock"}
                            </span>
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "12px" }}>{locale === "th" ? "หมวดหมู่" : "Category"}</h3>
                        <p style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                            {locale === "th" && product.category?.nameTh ? product.category.nameTh : (product.category?.nameEn || (locale === "th" ? "ไม่มีหมวดหมู่" : "Uncategorized"))}
                        </p>
                    </div>

                    {/* Size */}
                    {product.size && (
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "12px" }}>{locale === "th" ? "ขนาด" : "Size"}</h3>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                                    {product.size}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <Link href={`/${locale}/admin/products/${product.id}/edit`} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "13px", justifyContent: "center" }}>
                        <Edit size={16} />
                        {locale === "th" ? "แก้ไขสินค้า" : "Edit Product"}
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
