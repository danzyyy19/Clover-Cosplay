"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Upload, X, Save, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
    id: string;
    nameEn: string;
    nameTh: string | null;
}

export default function AdminEditProductPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const locale = useLocale();
    const router = useRouter();
    const [id, setId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        nameEn: "",
        nameTh: "",
        descriptionEn: "",
        descriptionTh: "",
        anime: "",
        character: "",
        pricePerDay: "",
        stock: "1",
        categoryId: "",
        sizes: "",
    });

    useEffect(() => {
        // Unwrap params
        params.then((p) => {
            setId(p.id);
            fetchProductData(p.id);
        });

        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data || []))
            .catch(() => { });
    }, [params]);

    const fetchProductData = async (productId: string) => {
        try {
            const res = await fetch(`/api/products/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    nameEn: data.nameEn || "",
                    nameTh: data.nameTh || "",
                    descriptionEn: data.descriptionEn || "",
                    descriptionTh: data.descriptionTh || "",
                    anime: data.anime || "",
                    character: data.character || "",
                    pricePerDay: data.pricePerDay?.toString() || "",
                    stock: data.stock?.toString() || "1",
                    categoryId: data.categoryId || "",
                    sizes: data.size || "",
                });

                if (data.images && Array.isArray(data.images)) {
                    setImages(data.images.map((img: any) => img.url));
                }
            } else {
                toast.error("Failed to load product");
                router.push(`/${locale}/admin/products`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading product");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleImageRemove = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    pricePerDay: parseFloat(formData.pricePerDay),
                    stock: parseInt(formData.stock),
                    images,
                    sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
                }),
            });

            if (res.ok) {
                toast.success("Product updated successfully!");
                router.refresh(); // Refresh data
                router.push(`/${locale}/admin/products`);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update product");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Product deleted successfully");
                router.push(`/${locale}/admin/products`);
            } else {
                toast.error("Failed to delete product");
            }
        } catch {
            toast.error("Error deleting product");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <AdminLayout pageTitle="Edit Product">
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                    <div className="animate-spin" style={{ width: "24px", height: "24px", border: "2px solid #9370DB", borderTopColor: "transparent", borderRadius: "50%" }}></div>
                </div>
            </AdminLayout>
        );
    }

    const inputStyle = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "13px",
        outline: "none",
    };

    const labelStyle = {
        display: "block",
        fontSize: "12px",
        fontWeight: "500" as const,
        color: "var(--text-secondary)",
        marginBottom: "6px",
    };

    return (
        <AdminLayout pageTitle="Edit Product">
            <Link href={`/${locale}/admin/products`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px", textDecoration: "none" }}>
                <ArrowLeft size={16} />
                Back to Products
            </Link>

            <form onSubmit={handleSubmit} style={{ maxWidth: "900px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    {/* Main Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Basic Info */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Basic Information</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>Name (English) *</label>
                                    <input name="nameEn" value={formData.nameEn} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Name (Thai)</label>
                                    <input name="nameTh" value={formData.nameTh} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Anime/Series *</label>
                                    <input name="anime" value={formData.anime} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Character *</label>
                                    <input name="character" value={formData.character} onChange={handleChange} style={inputStyle} required />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Description</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>Description (English)</label>
                                    <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Description (Thai)</label>
                                    <textarea name="descriptionTh" value={formData.descriptionTh} onChange={handleChange} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Images</h3>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {images.map((img, index) => (
                                    <div key={index} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden" }}>
                                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <button type="button" onClick={() => handleImageRemove(index)} style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#FFB6C1", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <X size={12} color="white" />
                                        </button>
                                    </div>
                                ))}

                                <label style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "8px",
                                    border: "2px dashed var(--border-color)",
                                    backgroundColor: "var(--bg-secondary)",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                    color: "var(--text-secondary)",
                                    position: "relative"
                                }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        // turbo-ignore
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            try {
                                                const formData = new FormData();
                                                formData.append("file", file);

                                                const res = await fetch("/api/upload", {
                                                    method: "POST",
                                                    body: formData,
                                                });

                                                if (res.ok) {
                                                    const data = await res.json();
                                                    setImages([...images, data.url]);
                                                } else {
                                                    toast.error("Failed to upload image");
                                                }
                                            } catch (error) {
                                                console.error("Upload error:", error);
                                                toast.error("Error uploading image");
                                            }
                                        }}
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            opacity: 0,
                                            cursor: "pointer"
                                        }}
                                    />
                                    <Upload size={18} />
                                    <span style={{ fontSize: "10px" }}>Upload</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Pricing */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Pricing</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>Price per Day (฿) *</label>
                                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Stock *</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} style={inputStyle} required />
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Category</h3>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} style={inputStyle}>
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sizes */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Sizes</h3>
                            <label style={labelStyle}>Available Sizes (comma separated)</label>
                            <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="S, M, L, XL" style={inputStyle} />
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "14px", justifyContent: "center" }}>
                            <Save size={16} />
                            {loading ? "Saving..." : "Update Product"}
                        </button>

                        <button type="button" onClick={handleDelete} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "12px", border: "1px solid #FFB6C1", backgroundColor: "rgba(255, 182, 193, 0.1)", color: "#FFB6C1", cursor: "pointer", fontWeight: 600 }}>
                            <Trash2 size={16} />
                            Delete Product
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
