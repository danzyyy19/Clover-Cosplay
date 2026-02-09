"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Upload, X, Save } from "lucide-react";
import { toast } from "sonner";

interface Category {
    id: string;
    nameEn: string;
    nameTh: string | null;
}

export default function AdminNewProductPage() {
    const locale = useLocale();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        includes: "",
    });

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data || []))
            .catch(() => { });
    }, []);

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
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    pricePerDay: parseFloat(formData.pricePerDay),
                    stock: parseInt(formData.stock),
                    images,
                    sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
                    includes: formData.includes,
                }),
            });

            if (res.ok) {
                toast.success(locale === "th" ? "สร้างสินค้าสำเร็จ!" : "Product created successfully!");
                router.push(`/${locale}/admin/products`);
            } else {
                const data = await res.json();
                toast.error(data.error || (locale === "th" ? "ไม่สามารถสร้างสินค้าได้" : "Failed to create product"));
            }
        } catch {
            toast.error(locale === "th" ? "เกิดข้อผิดพลาด" : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

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
        <AdminLayout pageTitle={locale === "th" ? "เพิ่มสินค้าใหม่" : "Add New Product"}>
            <form onSubmit={handleSubmit} style={{ maxWidth: "900px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    {/* Main Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Basic Info */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "ข้อมูลพื้นฐาน" : "Basic Information"}</h3>
                            <div className="form-row-responsive">
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "ชื่อ (ภาษาอังกฤษ) *" : "Name (English) *"}</label>
                                    <input name="nameEn" value={formData.nameEn} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "ชื่อ (ภาษาไทย)" : "Name (Thai)"}</label>
                                    <input name="nameTh" value={formData.nameTh} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "อนิเมะ/ซีรีส์ *" : "Anime/Series *"}</label>
                                    <input name="anime" value={formData.anime} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "ตัวละคร *" : "Character *"}</label>
                                    <input name="character" value={formData.character} onChange={handleChange} style={inputStyle} required />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "รายละเอียด" : "Description"}</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "รายละเอียด (ภาษาอังกฤษ)" : "Description (English)"}</label>
                                    <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "รายละเอียด (ภาษาไทย)" : "Description (Thai)"}</label>
                                    <textarea name="descriptionTh" value={formData.descriptionTh} onChange={handleChange} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "รูปภาพ" : "Images"}</h3>
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
                                                    toast.error(locale === "th" ? "อัปโหลดรูปภาพไม่สำเร็จ" : "Failed to upload image");
                                                }
                                            } catch (error) {
                                                console.error("Upload error:", error);
                                                toast.error(locale === "th" ? "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" : "Error uploading image");
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
                                    <span style={{ fontSize: "10px" }}>{locale === "th" ? "อัปโหลด" : "Upload"}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Pricing */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "ราคา" : "Pricing"}</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "ราคาต่อวัน (฿) *" : "Price per Day (฿) *"}</label>
                                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>{locale === "th" ? "จำนวนในสต็อก *" : "Stock *"}</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} style={inputStyle} required />
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "หมวดหมู่" : "Category"}</h3>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} style={inputStyle}>
                                <option value="">{locale === "th" ? "เลือกหมวดหมู่" : "Select category"}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sizes */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "ขนาด" : "Sizes"}</h3>
                            <label style={labelStyle}>{locale === "th" ? "ขนาดที่มี (คั่นด้วยจุลภาค)" : "Available Sizes (comma separated)"}</label>
                            <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="S, M, L, XL" style={inputStyle} />
                        </div>

                        {/* Includes */}
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "สิ่งที่รวมอยู่" : "What's Included"}</h3>
                            <label style={labelStyle}>{locale === "th" ? "รายการ (คั่นด้วยจุลภาค)" : "Items (comma separated)"}</label>
                            <textarea name="includes" value={formData.includes} onChange={handleChange} placeholder="Dress, Wig, Shoes..." style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "14px", justifyContent: "center" }}>
                            <Save size={16} />
                            {loading ? (locale === "th" ? "กำลังบันทึก..." : "Saving...") : (locale === "th" ? "สร้างสินค้า" : "Create Product")}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
