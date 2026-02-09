import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { Calendar, Eye, CreditCard, FileText } from "lucide-react";
import { BookingFilter } from "@/components/bookings/booking-filter";
import { BookingStatus } from "@prisma/client";

export default async function CustomerBookingsPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const statusParam = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined;

    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    const whereClause: any = { customerId: session.user.id };

    // Validate status before using it
    if (statusParam && statusParam !== "ALL") {
        if (Object.values(BookingStatus).includes(statusParam as BookingStatus)) {
            whereClause.status = statusParam as BookingStatus;
        }
    }

    const bookings = await prisma.booking.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
            product: { select: { nameEn: true, nameTh: true, images: true } },
        },
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "ACTIVE": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C" };
            case "COMPLETED": return { bg: "rgba(147, 112, 219, 0.2)", color: "#9370DB" };
            case "CANCELLED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1" };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF" };
        }
    };

    const getStatusText = (status: string) => {
        if (locale !== "th") return status;
        switch (status) {
            case "ACTIVE": return "กำลังเช่า";
            case "PENDING": return "รอดำเนินการ";
            case "COMPLETED": return "เสร็จสิ้น";
            case "CANCELLED": return "ยกเลิก";
            case "CONFIRMED": return "ยืนยันแล้ว";
            default: return status;
        }
    };

    const pageTitle = locale === "th" ? "การจองของฉัน" : "My Bookings";

    return (
        <CustomerLayout pageTitle={pageTitle}>
            <BookingFilter />

            {bookings.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {bookings.map((booking) => {
                        const statusStyle = getStatusStyle(booking.status);
                        const productName = locale === "th" && booking.product.nameTh ? booking.product.nameTh : booking.product.nameEn;
                        return (
                            <div
                                key={booking.id}
                                style={{
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "18px",
                                    display: "flex",
                                    gap: "16px",
                                }}
                            >
                                {/* Product Image */}
                                <div style={{ width: "80px", height: "80px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", overflow: "hidden", flexShrink: 0 }}>
                                    {booking.product.images[0] && (
                                        <img src={booking.product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    )}
                                </div>

                                {/* Details */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>#{booking.id.slice(-6).toUpperCase()}</span>
                                        <span style={{ padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "600", backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </div>
                                    <h3 style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px", marginBottom: "6px" }}>
                                        {productName}
                                    </h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "12px" }}>
                                        <Calendar size={12} />
                                        <span>{booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Price and Actions */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#9370DB" }}>
                                        ฿{booking.totalPrice.toLocaleString()}
                                    </span>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <Link href={`/${locale}/customer/bookings/${booking.id}`} style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: "var(--bg-secondary)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontSize: "11px", color: "var(--text-secondary)" }}>
                                            <Eye size={12} /> {locale === "th" ? "ดู" : "View"}
                                        </Link>
                                        {booking.status === "PENDING" && (
                                            <Link href={`/${locale}/customer/bookings/${booking.id}/payment`} style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: "rgba(127, 255, 212, 0.2)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontSize: "11px", color: "#7FFFD4" }}>
                                                <CreditCard size={12} /> {locale === "th" ? "ชำระ" : "Pay"}
                                            </Link>
                                        )}
                                        {booking.status === "COMPLETED" && (
                                            <Link href={`/${locale}/customer/bookings/${booking.id}/receipt`} style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: "rgba(147, 112, 219, 0.2)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontSize: "11px", color: "#9370DB" }}>
                                                <FileText size={12} /> {locale === "th" ? "ใบเสร็จ" : "Receipt"}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "60px", textAlign: "center" }}>
                    <Calendar size={40} color="var(--text-secondary)" style={{ marginBottom: "16px" }} />
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                        {statusParam && statusParam !== "ALL"
                            ? (locale === "th" ? `ไม่พบการจองสถานะ ${statusParam}` : `No ${statusParam.toLowerCase()} bookings found`)
                            : (locale === "th" ? "ยังไม่มีการจอง" : "No bookings yet")}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
                        {locale === "th" ? "เริ่มค้นหาชุดคอสเพลย์ที่คุณชอบ" : "Start browsing costumes you like"}
                    </p>
                    <Link href={`/${locale}/customer/products`} className="btn-primary" style={{ display: "inline-flex", padding: "10px 20px", fontSize: "13px" }}>
                        {locale === "th" ? "ดูสินค้า" : "Browse Products"}
                    </Link>
                </div>
            )}
        </CustomerLayout>
    );
}
