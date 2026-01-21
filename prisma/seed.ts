import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Clear existing data
    // await prisma.payment.deleteMany();
    // await prisma.booking.deleteMany();
    // await prisma.productImage.deleteMany();
    // await prisma.product.deleteMany();

    // Only clear config data that we will re-seed
    await prisma.category.deleteMany();
    await prisma.rentalRule.deleteMany();
    await prisma.bankAccount.deleteMany();
    // await prisma.user.deleteMany(); // Keep users too just in case

    console.log("✓ Cleared existing data");

    // Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.create({
        data: {
            email: "admin@clovercosplay.com",
            password: adminPassword,
            name: "Admin Clover",
            phone: "0812345678",
            role: "ADMIN",
        },
    });
    console.log("✓ Created admin user:", admin.email);

    // Create Customer Users
    const customerPassword = await bcrypt.hash("customer123", 12);
    const customer1 = await prisma.user.create({
        data: {
            email: "john@example.com",
            password: customerPassword,
            name: "John Doe",
            phone: "0823456789",
            role: "CUSTOMER",
        },
    });

    const customer2 = await prisma.user.create({
        data: {
            email: "sakura@example.com",
            password: customerPassword,
            name: "Sakura Tanaka",
            phone: "0834567890",
            role: "CUSTOMER",
        },
    });
    console.log("✓ Created customer users");

    // Create Categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                nameEn: "Magical Girl",
                nameTh: "สาวน้อยเวทมนตร์",
                slug: "magical-girl",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "Shonen",
                nameTh: "โชเน็น",
                slug: "shonen",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "Fantasy",
                nameTh: "แฟนตาซี",
                slug: "fantasy",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "School Uniform",
                nameTh: "ชุดนักเรียน",
                slug: "school-uniform",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "Costumes",
                nameTh: "ชุดคอสเพลย์",
                slug: "costumes",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "Wigs",
                nameTh: "วิกผม",
                slug: "wigs",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "Shoes",
                nameTh: "รองเท้า",
                slug: "shoes",
            },
        }),
        prisma.category.create({
            data: {
                nameEn: "Props",
                nameTh: "อุปกรณ์ประกอบ",
                slug: "props",
            },
        }),
    ]);
    console.log("✓ Created categories");

    // Products and Bookings are skipped for real production use
    console.log("✓ Skipped product and booking creation (User requested real data)");

    console.log("\n✅ Seed completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("   Admin: admin@clovercosplay.com / admin123");
    console.log("   Customer: john@example.com / customer123");
    console.log("   Customer: sakura@example.com / customer123");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
