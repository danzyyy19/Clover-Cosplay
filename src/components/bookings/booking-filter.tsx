"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function BookingFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const locale = useLocale();

    const currentStatus = searchParams.get("status") || "ALL";

    const statuses = [
        { value: "ALL", labelEn: "All", labelTh: "ทั้งหมด" },
        { value: "PENDING", labelEn: "Pending", labelTh: "รอชำระเงิน" },
        { value: "CONFIRMED", labelEn: "Confirmed", labelTh: "ยืนยันแล้ว" },
        { value: "ACTIVE", labelEn: "Active", labelTh: "กำลังเช่า" },
        { value: "COMPLETED", labelEn: "Completed", labelTh: "เสร็จสิ้น" },
        { value: "CANCELLED", labelEn: "Cancelled", labelTh: "ยกเลิก" },
    ];

    const handleFilterChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status === "ALL") {
            params.delete("status");
        } else {
            params.set("status", status);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px", scrollbarWidth: "none" }}>
            {statuses.map((status) => (
                <button
                    key={status.value}
                    onClick={() => handleFilterChange(status.value)}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: "1px solid",
                        borderColor: currentStatus === status.value ? "#9370DB" : "var(--border-color)",
                        backgroundColor: currentStatus === status.value ? "rgba(147, 112, 219, 0.1)" : "var(--bg-card)",
                        color: currentStatus === status.value ? "#9370DB" : "var(--text-secondary)",
                        fontSize: "13px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                >
                    {locale === "th" ? status.labelTh : status.labelEn}
                </button>
            ))}
        </div>
    );
}
