import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/prisma";
import { ProductView } from "@/components/products/product-view";

// Revalidate data every hour
export const revalidate = 3600;

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
    const { locale } = await params;
    const { q, category, page } = await searchParams;
    setRequestLocale(locale);

    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    // Build filter query
    const where: any = {};
    if (q) {
        where.OR = [
            { nameEn: { contains: q } },
            { nameTh: { contains: q } },
            { anime: { contains: q } },
            { character: { contains: q } },
        ];
    }
    if (category) {
        where.categoryId = category;
    }

    // Fetch total count for pagination
    const totalCount = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Fetch products from DB
    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: ITEMS_PER_PAGE,
        include: {
            images: {
                orderBy: { order: "asc" },
                take: 1,
            },
        },
    });

    // Fetch categories for filter
    const categories = await prisma.category.findMany({
        orderBy: { nameEn: "asc" },
    });

    // Serialize decimal to number for client component
    const sanitizedProducts = products.map(p => ({
        ...p,
        pricePerDay: Number(p.pricePerDay),
    }));

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* Hero Banner */}
            <section
                style={{
                    paddingTop: "100px",
                    paddingBottom: "40px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
                }}
            >
                <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "bold", marginBottom: "16px" }}>
                        <span className="text-gradient">
                            {locale === "th" ? "ชุดคอสเพลย์ทั้งหมด" : "All Costumes"}
                        </span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
                        {locale === "th"
                            ? "เลือกชุดคอสเพลย์ที่คุณชื่นชอบจากคอลเลคชันของเรา"
                            : "Choose your favorite costume from our collection"}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section style={{ padding: "0 16px 40px", flex: 1 }}>
                <div style={{
                    maxWidth: "1200px",
                    margin: "-28px auto 0",
                    position: "relative",
                    zIndex: 2,
                    backgroundColor: "transparent"
                }}>
                    <ProductView
                        products={sanitizedProducts}
                        categories={categories}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        locale={locale}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}
