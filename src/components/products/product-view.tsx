"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter, Grid, List as ListIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./product-card";
// Simple debounce implemented internally - Force Vercel Rebuild
// Actually, I'll implement simple debounce inside/
// For now, let's use standard simple timeout.

interface Category {
    id: string;
    nameEn: string;
    nameTh: string;
}

interface Product {
    id: string;
    nameEn: string | null;
    nameTh: string | null;
    anime: string | null;
    character: string | null;
    pricePerDay: number; // passed as number from server
    size: string | null;
    stock: number;
    images: { url: string }[];
}

interface ProductViewProps {
    products: Product[];
    categories: Category[];
    totalPages: number;
    currentPage: number;
    locale: string;
}

export function ProductView({
    products,
    categories,
    totalPages,
    currentPage,
    locale,
}: ProductViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Local state for UI
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

    // Simple debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQ = searchParams.get("q") || "";
            if (searchQuery !== currentQ) {
                applyFilter("q", searchQuery);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        // Reset to page 1 when filter changes (except when page itself changes)
        if (name !== "page") {
            params.set("page", "1");
        }

        return params.toString();
    };

    const applyFilter = (name: string, value: string) => {
        router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedCategory(val);
        applyFilter("category", val);
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(`${pathname}?${createQueryString("page", page.toString())}`);
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Toolbar */}
            <div style={{
                margin: "0 auto",
                paddingBottom: "24px",
                borderBottom: "1px solid var(--border-color)",
                marginBottom: "40px"
            }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Search */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        flex: "1",
                        minWidth: "200px",
                        maxWidth: "400px",
                    }}>
                        <Search size={20} color="var(--text-secondary)" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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

                    {/* Filter & View Toggle */}
                    <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{ position: "relative" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 16px",
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "12px",
                                color: "var(--text-primary)",
                                fontSize: "14px",
                                cursor: "pointer",
                                minWidth: "160px"
                            }}>
                                <Filter size={18} />
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    style={{
                                        appearance: "none",
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--text-primary)",
                                        fontSize: "14px",
                                        width: "100%",
                                        outline: "none",
                                        cursor: "pointer",
                                        fontWeight: "500"
                                    }}
                                >
                                    <option value="">{locale === "th" ? "ทุกหมวดหมู่" : "All Categories"}</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {locale === "th" ? c.nameTh : c.nameEn}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                            <button
                                onClick={() => setViewMode("grid")}
                                style={{
                                    padding: "12px",
                                    backgroundColor: viewMode === "grid" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                    border: "none",
                                    color: viewMode === "grid" ? "#9370DB" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                <Grid size={18} />
                            </button>
                            <div style={{ width: "1px", backgroundColor: "var(--border-color)" }} />
                            <button
                                onClick={() => setViewMode("list")}
                                style={{
                                    padding: "12px",
                                    backgroundColor: viewMode === "list" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                    border: "none",
                                    color: viewMode === "list" ? "#9370DB" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
                    <p>{locale === "th" ? "ไม่พบสินค้าที่คุณค้นหา" : "No costumes found matching your criteria"}</p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: viewMode === "grid"
                            ? "repeat(auto-fill, minmax(280px, 1fr))"
                            : "1fr",
                        gap: "24px",
                        justifyContent: "center",
                    }}
                >
                    {products.map((product) => (
                        <div key={product.id} style={viewMode === "list" ? { display: "flex", justifyContent: "center" } : {}}>
                            {/* Pass locale and all props. For list view, we might want a different card style, 
                                but standard ProductCard is adaptable enough or we wrap it. 
                                For now, reusing ProductCard. If list view, maybe we can make ProductCard responsive/flexible?
                                Currently ProductCard is quite vertical. 
                                Let's keep it simple: Grid view creates columns, List view creates 1 column of big cards.
                            */}
                            <div style={viewMode === "list" ? { maxWidth: "600px", width: "100%" } : { height: "100%" }}>
                                <ProductCard
                                    id={product.id}
                                    nameEn={product.nameEn || ""}
                                    nameTh={product.nameTh || ""}
                                    anime={product.anime || ""}
                                    character={product.character || ""}
                                    pricePerDay={product.pricePerDay}
                                    size={product.size || "Free Size"}
                                    rating={4.8}
                                    isAvailable={product.stock > 0}
                                    locale={locale}
                                    image={product.images[0]?.url}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: currentPage <= 1 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                border: page === currentPage ? "none" : "1px solid var(--border-color)",
                                background: page === currentPage ? "linear-gradient(135deg, #9370DB, #8A2BE2)" : "var(--bg-card)",
                                color: page === currentPage ? "white" : "var(--text-primary)",
                                cursor: "pointer",
                                fontWeight: "500",
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: currentPage >= totalPages ? 0.5 : 1
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
