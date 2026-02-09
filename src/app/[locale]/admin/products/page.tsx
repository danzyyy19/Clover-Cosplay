import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Plus, Search, Eye, Edit } from "lucide-react"; // Trash2 removed, used in client component
import { DeleteProductButton } from "@/components/admin/products/delete-product-button";

export default async function AdminProductsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/login`);
    }

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
            images: {
                orderBy: { order: "asc" },
                take: 1,
            },
        },
    });

    return (
        <AdminLayout pageTitle={locale === "th" ? "สินค้า" : "Products"}>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 14px",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        width: "280px",
                    }}>
                        <Search size={16} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder={locale === "th" ? "ค้นหาสินค้า..." : "Search products..."}
                            style={{
                                flex: 1,
                                background: "none",
                                border: "none",
                                outline: "none",
                                color: "var(--text-primary)",
                                fontSize: "13px",
                            }}
                        />
                    </div>
                </div>
                <Link href={`/${locale}/admin/products/new`} className="btn-primary" style={{ padding: "10px 16px", fontSize: "13px" }}>
                    <Plus size={16} />
                    {locale === "th" ? "เพิ่มสินค้า" : "Add Product"}
                </Link>
            </div>

            <div style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                overflow: "hidden",
            }}>
                {/* Desktop Table */}
                <div className="desktop-only">
                    <table className="responsive-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                                {(locale === "th"
                                    ? ["รูปภาพ", "ชื่อ", "หมวดหมู่", "ราคา", "สต็อก", "การดำเนินการ"]
                                    : ["Image", "Name", "Category", "Price", "Stock", "Actions"]
                                ).map((h) => (
                                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                                    <td data-label="Image" style={{ padding: "12px 16px" }}>
                                        <div style={{ width: "50px", height: "50px", borderRadius: "8px", backgroundColor: "var(--bg-secondary)", overflow: "hidden" }}>
                                            {product.images[0] && (
                                                <img src={product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Name" style={{ padding: "12px 16px" }}>
                                        <p style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "13px" }}>{product.nameEn}</p>
                                        <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{product.anime}</p>
                                    </td>
                                    <td data-label="Category" style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-secondary)" }}>
                                        {product.category?.nameEn || "-"}
                                    </td>
                                    <td data-label={locale === "th" ? "ราคา" : "Price"} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#9370DB" }}>
                                        ฿{product.pricePerDay.toLocaleString()}/{locale === "th" ? "วัน" : "day"}
                                    </td>
                                    <td data-label="Stock" style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            padding: "3px 8px",
                                            borderRadius: "5px",
                                            fontSize: "11px",
                                            fontWeight: "600",
                                            backgroundColor: product.stock > 0 ? "rgba(127, 255, 212, 0.2)" : "rgba(255, 182, 193, 0.2)",
                                            color: product.stock > 0 ? "#7FFFD4" : "#FFB6C1",
                                        }}>
                                            {product.stock} {locale === "th" ? "ในสต็อก" : "in stock"}
                                        </span>
                                    </td>
                                    <td data-label="Actions" style={{ padding: "12px 16px" }}>
                                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                            <Link href={`/${locale}/admin/products/${product.id}`} style={{ padding: "6px", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", display: "flex" }}>
                                                <Eye size={14} color="var(--text-secondary)" />
                                            </Link>
                                            <Link href={`/${locale}/admin/products/${product.id}/edit`} style={{ padding: "6px", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", display: "flex" }}>
                                                <Edit size={14} color="#9370DB" />
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-only">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {products.map((product: any) => (
                            <div key={product.id} style={{ padding: "16px", borderBottom: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                                    <div style={{ width: "60px", height: "60px", borderRadius: "8px", backgroundColor: "var(--bg-secondary)", overflow: "hidden", flexShrink: 0 }}>
                                        {product.images[0] && (
                                            <img src={product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px", marginBottom: "2px" }}>{product.nameEn}</p>
                                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{product.anime}</p>
                                            </div>
                                            <span style={{
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                fontSize: "10px",
                                                fontWeight: "600",
                                                backgroundColor: product.stock > 0 ? "rgba(127, 255, 212, 0.2)" : "rgba(255, 182, 193, 0.2)",
                                                color: product.stock > 0 ? "#7FFFD4" : "#FFB6C1",
                                            }}>
                                                {product.stock}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                            <p style={{ fontSize: "14px", fontWeight: "bold", color: "#9370DB" }}>
                                                ฿{product.pricePerDay.toLocaleString()}
                                            </p>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <Link href={`/${locale}/admin/products/${product.id}`} style={{ padding: "6px", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", display: "flex" }}>
                                                    <Eye size={14} color="var(--text-secondary)" />
                                                </Link>
                                                <Link href={`/${locale}/admin/products/${product.id}/edit`} style={{ padding: "6px", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", display: "flex" }}>
                                                    <Edit size={14} color="#9370DB" />
                                                </Link>
                                                <DeleteProductButton id={product.id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {products.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                        <p>{locale === "th" ? "ยังไม่มีสินค้า" : "No products yet"}</p>
                    </div>
                )}
            </div>
        </AdminLayout >
    );
}
