import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Search, Star, ShoppingBag } from "lucide-react";
import { ProductList } from "./product-list";

export default async function CustomerProductsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Check authentication
    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    if (session.user.role === "ADMIN") {
        redirect(`/${locale}/admin/products`);
    }

    // Fetch products from database with images
    const products = await prisma.product.findMany({
        where: { isAvailable: true },
        orderBy: { createdAt: "desc" },
        include: {
            images: {
                orderBy: { order: "asc" },
                take: 1,
            },
        },
    });

    // Convert Decimal to number for JSON serialization
    const serializedProducts = products.map(product => ({
        ...product,
        pricePerDay: Number(product.pricePerDay),
    }));

    const pageTitle = locale === "th" ? "เลือกชุดคอสเพลย์" : "Browse Costumes";

    return (
        <CustomerLayout pageTitle={pageTitle}>
            {/* Search Bar */}
            <div style={{ marginBottom: "24px" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder={locale === "th" ? "ค้นหาชุดคอสเพลย์..." : "Search costumes..."}
                        style={{
                            background: "none",
                            border: "none",
                            outline: "none",
                            color: "var(--text-primary)",
                            fontSize: "14px",
                            width: "100%",
                        }}
                    />
                </div>
            </div>

            {/* Products Grid */}
            {serializedProducts.length > 0 ? (
                <ProductList products={serializedProducts} locale={locale} />
            ) : (
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-color)",
                }}>
                    <div style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto 16px",
                        backgroundColor: "rgba(147, 112, 219, 0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <ShoppingBag size={28} color="#9370DB" />
                    </div>
                    <h3 style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                    }}>
                        {locale === "th" ? "ยังไม่มีชุดคอสเพลย์" : "No costumes yet"}
                    </h3>
                    <p style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                    }}>
                        {locale === "th"
                            ? "ชุดคอสเพลย์จะปรากฏที่นี่เมื่อมีการเพิ่มเข้ามา"
                            : "Costumes will appear here when available"
                        }
                    </p>
                </div>
            )}
        </CustomerLayout>
    );
}
