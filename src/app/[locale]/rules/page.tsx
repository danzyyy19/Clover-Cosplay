import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
    AlertTriangle,
    FileText,
    ShieldCheck,
    Package
} from "lucide-react";

export default async function RulesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const rules = [
        {
            icon: ShieldCheck,
            titleEn: "Identity Verification",
            titleTh: "ยืนยันตัวตน",
            descEn: "Valid ID card or passport is required for all rentals. We will take a photo for security purposes.",
            descTh: "ต้องแสดงบัตรประชาชนหรือหนังสือเดินทางที่ยังไม่หมดอายุ เราจะถ่ายรูปเพื่อความปลอดภัย",
        },
        {
            icon: CreditCard,
            titleEn: "Deposit Required",
            titleTh: "ต้องวางมัดจำ",
            descEn: "A deposit of 50% of the costume value is required. This will be refunded upon return of the costume in good condition.",
            descTh: "ต้องวางมัดจำ 50% ของมูลค่าชุด มัดจำจะคืนเมื่อส่งคืนชุดในสภาพดี",
        },
        {
            icon: Clock,
            titleEn: "Rental Period",
            titleTh: "ระยะเวลาเช่า",
            descEn: "Minimum rental period is 1 day. Return by 6:00 PM on the due date to avoid late fees.",
            descTh: "เช่าขั้นต่ำ 1 วัน ส่งคืนภายใน 18:00 น. ของวันกำหนดส่งเพื่อหลีกเลี่ยงค่าปรับ",
        },
        {
            icon: Package,
            titleEn: "Costume Care",
            titleTh: "การดูแลชุด",
            descEn: "Do not wash the costume. Return in the same condition as received. Minor wear is acceptable.",
            descTh: "ห้ามซักชุด ส่งคืนในสภาพเดิมที่ได้รับ การสึกหรอเล็กน้อยยอมรับได้",
        },
    ];

    const cancellationPolicy = [
        { periodEn: "More than 7 days before rental", periodTh: "มากกว่า 7 วันก่อนเช่า", refund: "100%" },
        { periodEn: "3-7 days before rental", periodTh: "3-7 วันก่อนเช่า", refund: "50%" },
        { periodEn: "Less than 3 days before rental", periodTh: "น้อยกว่า 3 วันก่อนเช่า", refund: "0%" },
        { periodEn: "No-show", periodTh: "ไม่มาตามนัด", refund: "0% + Warning" },
    ];

    const lateFees = [
        { periodEn: "1-3 days late", periodTh: "สาย 1-3 วัน", feeEn: "50% of daily rate per day", feeTh: "50% ของราคาต่อวัน" },
        { periodEn: "4-7 days late", periodTh: "สาย 4-7 วัน", feeEn: "100% of daily rate per day", feeTh: "100% ของราคาต่อวัน" },
        { periodEn: "More than 7 days", periodTh: "มากกว่า 7 วัน", feeEn: "Full costume price + legal action", feeTh: "ชำระราคาเต็ม + ดำเนินการทางกฎหมาย" },
    ];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* Hero */}
            <section
                style={{
                    paddingTop: "100px",
                    paddingBottom: "40px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
                }}
            >
                <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                    <FileText size={48} color="#9370DB" style={{ marginBottom: "16px" }} />
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "bold", marginBottom: "16px" }}>
                        <span className="text-gradient">
                            {locale === "th" ? "กฎและข้อกำหนดการเช่า" : "Rental Rules & Terms"}
                        </span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
                        {locale === "th"
                            ? "กรุณาอ่านกฎและข้อกำหนดการเช่าอย่างละเอียดก่อนทำการจอง"
                            : "Please read our rental rules and terms carefully before booking"}
                    </p>
                </div>
            </section>

            {/* Main Rules */}
            <section style={{ padding: "60px 16px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
                        <span className="text-gradient">{locale === "th" ? "กฎการเช่า" : "Rental Rules"}</span>
                    </h2>

                    <div style={{ display: "grid", gap: "20px" }}>
                        {rules.map((rule, index) => {
                            const Icon = rule.icon;
                            return (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: "var(--bg-card)",
                                        border: "2px solid var(--border-color)",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        display: "flex",
                                        gap: "20px",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "12px",
                                            backgroundColor: "rgba(147, 112, 219, 0.15)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Icon size={24} color="#9370DB" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                                            {locale === "th" ? rule.titleTh : rule.titleEn}
                                        </h3>
                                        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                                            {locale === "th" ? rule.descTh : rule.descEn}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Cancellation Policy */}
            <section style={{ padding: "60px 16px", backgroundColor: "var(--bg-secondary)" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
                        <span className="text-gradient">{locale === "th" ? "นโยบายการยกเลิก" : "Cancellation Policy"}</span>
                    </h2>

                    <div
                        style={{
                            backgroundColor: "var(--bg-card)",
                            border: "2px solid var(--border-color)",
                            borderRadius: "16px",
                            overflow: "hidden",
                        }}
                    >
                        {/* Table Header */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                backgroundColor: "rgba(147, 112, 219, 0.1)",
                                padding: "16px 24px",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                            }}
                        >
                            <span>{locale === "th" ? "ช่วงเวลา" : "Timing"}</span>
                            <span style={{ textAlign: "right" }}>{locale === "th" ? "การคืนเงิน" : "Refund"}</span>
                        </div>

                        {/* Table Rows */}
                        {cancellationPolicy.map((row, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    padding: "16px 24px",
                                    borderTop: "1px solid var(--border-color)",
                                }}
                            >
                                <span style={{ color: "var(--text-secondary)" }}>
                                    {locale === "th" ? row.periodTh : row.periodEn}
                                </span>
                                <span
                                    style={{
                                        textAlign: "right",
                                        fontWeight: "600",
                                        color: row.refund === "100%" ? "#7FFFD4" : row.refund === "50%" ? "#F0E68C" : "#FFB6C1",
                                    }}
                                >
                                    {row.refund}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Late Fees */}
            <section style={{ padding: "60px 16px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "32px", textAlign: "center" }}>
                        <span className="text-gradient">{locale === "th" ? "ค่าปรับล่าช้า" : "Late Return Fees"}</span>
                    </h2>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
                        <AlertTriangle size={24} color="#F0E68C" />
                        <p style={{ color: "var(--text-secondary)" }}>
                            {locale === "th"
                                ? "กรุณาส่งคืนชุดตรงเวลาเพื่อหลีกเลี่ยงค่าปรับ"
                                : "Please return costumes on time to avoid late fees"
                            }
                        </p>
                    </div>

                    <div
                        style={{
                            backgroundColor: "var(--bg-card)",
                            border: "2px solid var(--border-color)",
                            borderRadius: "16px",
                            overflow: "hidden",
                        }}
                    >
                        {lateFees.map((row, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    padding: "20px 24px",
                                    borderTop: index > 0 ? "1px solid var(--border-color)" : "none",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                                    {locale === "th" ? row.periodTh : row.periodEn}
                                </span>
                                <span style={{ textAlign: "right", color: "var(--text-secondary)" }}>
                                    {locale === "th" ? row.feeTh : row.feeEn}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agreement Note */}
            <section style={{ padding: "40px 16px 80px", backgroundColor: "var(--bg-secondary)" }}>
                <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
                    <div
                        style={{
                            backgroundColor: "rgba(127, 255, 212, 0.1)",
                            border: "1px solid #7FFFD4",
                            borderRadius: "16px",
                            padding: "24px",
                        }}
                    >
                        <CheckCircle size={32} color="#7FFFD4" style={{ marginBottom: "12px" }} />
                        <p style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "8px" }}>
                            {locale === "th"
                                ? "โดยการจองชุด คุณยอมรับกฎและข้อกำหนดทั้งหมดข้างต้น"
                                : "By booking a costume, you agree to all the rules and terms above"
                            }
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                            {locale === "th"
                                ? "หากมีข้อสงสัย กรุณาติดต่อเราก่อนทำการจอง"
                                : "If you have any questions, please contact us before booking"
                            }
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
