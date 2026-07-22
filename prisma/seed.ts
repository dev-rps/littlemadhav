import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const UNSPLASH_RAKHI =
  "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=600&q=80";
const UNSPLASH_JHUMKA =
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80";
const UNSPLASH_COMBO =
  "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80";
const UNSPLASH_GIFT =
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80";

async function main() {
  console.log("🌱 Seeding RangRiwaaz database...");

  // ── Categories ──────────────────────────────────────────────
  const catRakhi = await prisma.category.upsert({
    where: { slug: "rakhi" },
    update: {},
    create: {
      name: "Rakhi",
      slug: "rakhi",
      description: "Handcrafted Rakhis — traditional, designer & more",
      imageUrl: UNSPLASH_RAKHI,
      displayOrder: 1,
    },
  });

  const catJhumka = await prisma.category.upsert({
    where: { slug: "jhumka" },
    update: {},
    create: {
      name: "Jhumka",
      slug: "jhumka",
      description: "Handcrafted earrings — oxidised, kundan, pearl & terracotta",
      imageUrl: UNSPLASH_JHUMKA,
      displayOrder: 2,
    },
  });

  const catCombos = await prisma.category.upsert({
    where: { slug: "combos" },
    update: {},
    create: {
      name: "Combos & Hampers",
      slug: "combos",
      description: "Festive gift sets and hampers",
      imageUrl: UNSPLASH_COMBO,
      displayOrder: 3,
    },
  });

  const catGifting = await prisma.category.upsert({
    where: { slug: "gifting" },
    update: {},
    create: {
      name: "Gift Hampers",
      slug: "gifting",
      description: "Curated gift hampers for every occasion",
      imageUrl: UNSPLASH_GIFT,
      displayOrder: 4,
    },
  });

  // ── Products ─────────────────────────────────────────────────
  const products = [
    // RAKHI
    {
      name: "Lumba Bhaiya Bhabhi Rakhi Set",
      slug: "lumba-bhaiya-bhabhi-set",
      description:
        "A beautifully handcrafted Rakhi set featuring a traditional lumba for bhabhi, adorned with meenakari work and kundan stones. Perfect for celebrating the bond between brother and sister-in-law.",
      price: 349,
      mrp: 499,
      stock: 80,
      categoryId: catRakhi.id,
      isFeatured: true,
      isSale: true,
      material: "Thread, Kundan, Meenakari",
      occasion: "Raksha Bandhan",
      careInstructions: "Keep away from water and perfume. Store in the box provided.",
      shippingInfo: "Ships within 24 hours. Delivered in 3–5 days.",
      tags: "rakhi,lumba,bhaiya-bhabhi,set",
      images: [
        { url: "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=600&q=80", alt: "Lumba Bhaiya Bhabhi Set", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=800&q=80", alt: "Lumba Set Detail" },
      ],
      variants: [
        { name: "Color", value: "Red & Gold", stock: 40, priceAdj: 0 },
        { name: "Color", value: "Maroon & Silver", stock: 40, priceAdj: 0 },
      ],
    },
    {
      name: "Designer Pearl Rakhi",
      slug: "designer-pearl-rakhi",
      description:
        "An elegant designer Rakhi adorned with lustrous freshwater pearls and delicate gold-plated charms. A timeless gift for your brother.",
      price: 199,
      mrp: 299,
      stock: 120,
      categoryId: catRakhi.id,
      isFeatured: true,
      isNewArrival: false,
      material: "Pearl, Gold-plated metal",
      occasion: "Raksha Bandhan",
      careInstructions: "Avoid moisture. Wipe with soft cloth.",
      shippingInfo: "Ships within 24 hours.",
      tags: "rakhi,pearl,designer",
      images: [
        { url: "https://images.unsplash.com/photo-1601250695645-0b1e8a810cde?w=600&q=80", alt: "Pearl Rakhi", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Kids Cartoon Rakhi Set (Pack of 3)",
      slug: "kids-cartoon-rakhi-set",
      description:
        "Adorable cartoon-themed Rakhis for your little brothers! Made with soft thread and non-toxic materials, safe for kids.",
      price: 149,
      mrp: 199,
      stock: 200,
      categoryId: catRakhi.id,
      isSale: true,
      material: "Soft thread, Acrylic",
      occasion: "Raksha Bandhan",
      careInstructions: "Kid-safe, non-toxic. Hand wash gently.",
      shippingInfo: "Ships within 24 hours.",
      tags: "rakhi,kids,cartoon",
      images: [
        { url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80", alt: "Kids Rakhi Set", isPrimary: true },
      ],
      variants: [
        { name: "Theme", value: "Superhero", stock: 100, priceAdj: 0 },
        { name: "Theme", value: "Animal Friends", stock: 100, priceAdj: 0 },
      ],
    },
    {
      name: "Zardosi Work Rakhi",
      slug: "zardosi-work-rakhi",
      description:
        "Luxurious hand-embroidered Rakhi with intricate zardosi work — gold threadwork and stone embellishments on a rich maroon base.",
      price: 299,
      mrp: 449,
      stock: 60,
      categoryId: catRakhi.id,
      isFeatured: true,
      material: "Silk thread, Zardosi, Stones",
      occasion: "Raksha Bandhan",
      careInstructions: "Dry store only. Do not wash.",
      shippingInfo: "Ships within 48 hours.",
      tags: "rakhi,zardosi,premium",
      images: [
        { url: "https://images.unsplash.com/photo-1587467512961-120760940315?w=600&q=80", alt: "Zardosi Rakhi", isPrimary: true },
      ],
      variants: [],
    },
    // JHUMKA
    {
      name: "Oxidised Silver Jhumka",
      slug: "oxidised-silver-jhumka",
      description:
        "Classic oxidised silver jhumkas with a traditional floral pattern. Lightweight yet bold, perfect for kurtis and sarees.",
      price: 249,
      mrp: 399,
      stock: 150,
      categoryId: catJhumka.id,
      isFeatured: true,
      isSale: true,
      material: "Oxidised metal",
      occasion: "Casual, Festive",
      careInstructions: "Keep dry. Polish with soft cloth.",
      shippingInfo: "Ships within 24 hours.",
      tags: "jhumka,oxidised,silver",
      images: [
        { url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80", alt: "Oxidised Jhumka", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80", alt: "Oxidised Jhumka Detail" },
      ],
      variants: [
        { name: "Size", value: "Small", stock: 75, priceAdj: 0 },
        { name: "Size", value: "Large", stock: 75, priceAdj: 30 },
      ],
    },
    {
      name: "Kundan Meenakari Jhumka",
      slug: "kundan-meenakari-jhumka",
      description:
        "Stunning kundan jhumkas with vibrant meenakari enamel work. A bridal favourite that adds colour and elegance to any outfit.",
      price: 549,
      mrp: 799,
      stock: 80,
      categoryId: catJhumka.id,
      isFeatured: true,
      isNewArrival: true,
      material: "Kundan, Meenakari enamel, Brass",
      occasion: "Wedding, Festive",
      careInstructions: "Avoid water. Store in jewellery box.",
      shippingInfo: "Ships within 48 hours.",
      tags: "jhumka,kundan,meenakari,bridal",
      images: [
        { url: "https://images.unsplash.com/photo-1561101085-6e9f89b5b00b?w=600&q=80", alt: "Kundan Jhumka", isPrimary: true },
      ],
      variants: [
        { name: "Color", value: "Red Meena", stock: 40, priceAdj: 0 },
        { name: "Color", value: "Green Meena", stock: 40, priceAdj: 0 },
      ],
    },
    {
      name: "Pearl Drop Jhumka",
      slug: "pearl-drop-jhumka",
      description:
        "Delicate freshwater pearl drop jhumkas in a gold-tone setting. Timeless elegance for sarees, suits, and lehengas.",
      price: 399,
      mrp: 599,
      stock: 100,
      categoryId: catJhumka.id,
      material: "Freshwater Pearl, Gold-tone brass",
      occasion: "Office, Festive, Wedding",
      careInstructions: "Keep dry. Avoid chemicals.",
      shippingInfo: "Ships within 24 hours.",
      tags: "jhumka,pearl,drop",
      images: [
        { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", alt: "Pearl Jhumka", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Terracotta Jhumka (Handpainted)",
      slug: "terracotta-jhumka-handpainted",
      description:
        "Earth-toned terracotta jhumkas, handpainted by artisans in West Bengal. Sustainable, lightweight, and uniquely beautiful.",
      price: 199,
      mrp: 299,
      stock: 90,
      categoryId: catJhumka.id,
      isNewArrival: true,
      material: "Terracotta clay, Natural paint",
      occasion: "Casual, Festive",
      careInstructions: "Avoid water. Handle gently.",
      shippingInfo: "Ships within 48 hours. Extra care in packaging.",
      tags: "jhumka,terracotta,handpainted,sustainable",
      images: [
        { url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80", alt: "Terracotta Jhumka", isPrimary: true },
      ],
      variants: [
        { name: "Color", value: "Rust & White", stock: 45, priceAdj: 0 },
        { name: "Color", value: "Indigo & Gold", stock: 45, priceAdj: 0 },
      ],
    },
    // COMBOS
    {
      name: "Rakhi + Jhumka Combo Gift Set",
      slug: "rakhi-jhumka-combo",
      description:
        "The perfect festive combo — a designer Rakhi for your brother and a beautiful pair of jhumkas for yourself! Comes in a premium gift box.",
      price: 499,
      mrp: 799,
      stock: 60,
      categoryId: catCombos.id,
      isFeatured: true,
      isSale: true,
      material: "Mixed — Thread, Metal, Pearl",
      occasion: "Raksha Bandhan",
      careInstructions: "See individual product care instructions.",
      shippingInfo: "Ships within 48 hours. Premium gift packaging.",
      tags: "combo,rakhi,jhumka,gift",
      images: [
        { url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", alt: "Rakhi Jhumka Combo", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Bhaiya Bhabhi Rakhi Combo with Sweets Box",
      slug: "bhaiya-bhabhi-sweets-combo",
      description:
        "Celebrate Raksha Bandhan in style! This combo includes a Bhaiya Bhabhi Rakhi set, premium dry fruits box, and a handwritten greeting card.",
      price: 799,
      mrp: 1199,
      stock: 40,
      categoryId: catCombos.id,
      isFeatured: true,
      material: "Mixed",
      occasion: "Raksha Bandhan",
      careInstructions: "Consume dry fruits within 3 months.",
      shippingInfo: "Ships within 48 hours. Temperature-controlled packaging for dry fruits.",
      tags: "combo,rakhi,sweets,hamper",
      images: [
        { url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80", alt: "Bhaiya Bhabhi Combo", isPrimary: true },
      ],
      variants: [],
    },
    // GIFTING
    {
      name: "Diwali Jewellery Hamper",
      slug: "diwali-jewellery-hamper",
      description:
        "Spread the light of Diwali with this curated jewellery hamper — includes earrings, a maang tikka, and a festive bracelet, all in a beautiful dibbi box.",
      price: 999,
      mrp: 1499,
      stock: 30,
      categoryId: catGifting.id,
      isSale: true,
      material: "Mixed metals, Kundan, Beads",
      occasion: "Diwali, Wedding",
      careInstructions: "Individual care instructions included in box.",
      shippingInfo: "Ships within 72 hours. Includes premium gift wrap.",
      tags: "hamper,diwali,jewellery,gifting",
      images: [
        { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", alt: "Diwali Hamper", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Karva Chauth Special Set",
      slug: "karva-chauth-special-set",
      description:
        "A thoughtfully curated Karva Chauth gift set — includes a beautiful chandelier jhumka, maang tikka, bindi box, and kumkum set.",
      price: 699,
      mrp: 999,
      stock: 50,
      categoryId: catGifting.id,
      isNewArrival: true,
      material: "Kundan, Silk thread, Metal",
      occasion: "Karva Chauth",
      careInstructions: "See individual product care.",
      shippingInfo: "Ships within 48 hours. Gift-wrapped.",
      tags: "gifting,karva-chauth,set",
      images: [
        { url: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&q=80", alt: "Karva Chauth Set", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Wedding Favors — Jhumka Favors (Set of 10)",
      slug: "wedding-favors-jhumka-set-10",
      description:
        "Elegant jhumka favors for your wedding guests. Each piece comes individually wrapped in a branded organza pouch. Minimum order 10 pairs.",
      price: 1499,
      mrp: 1999,
      stock: 25,
      categoryId: catGifting.id,
      material: "Oxidised metal",
      occasion: "Wedding",
      careInstructions: "Individual care instructions on each pouch.",
      shippingInfo: "Custom bulk orders ship in 5–7 days.",
      tags: "wedding,favors,bulk,gifting",
      images: [
        { url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80", alt: "Wedding Favors", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Under ₹299 — Kundan Stud Set",
      slug: "kundan-stud-set-under-299",
      description:
        "Beautiful kundan stud earrings with a gold-tone base — elegant everyday wear. Under ₹299!",
      price: 249,
      mrp: 349,
      stock: 200,
      categoryId: catJhumka.id,
      isFeatured: true,
      material: "Kundan, Gold-tone brass",
      occasion: "Daily wear, Office, Festive",
      careInstructions: "Keep dry. Store in pouch provided.",
      shippingInfo: "Ships within 24 hours.",
      tags: "jhumka,kundan,stud,budget",
      images: [
        { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", alt: "Kundan Stud", isPrimary: true },
      ],
      variants: [
        { name: "Color", value: "Red Kundan", stock: 100, priceAdj: 0 },
        { name: "Color", value: "White Kundan", stock: 100, priceAdj: 0 },
      ],
    },
    {
      name: "Navratri Special Garba Jhumka",
      slug: "navratri-garba-jhumka",
      description:
        "Bold, colourful jhumkas designed for the garba dance floor! Long drop style with vibrant beads and mirror work.",
      price: 299,
      mrp: 449,
      stock: 100,
      categoryId: catJhumka.id,
      isNewArrival: true,
      isSale: true,
      material: "Beads, Mirror work, Thread",
      occasion: "Navratri, Festive",
      careInstructions: "Avoid water. Handle mirror work gently.",
      shippingInfo: "Ships within 24 hours.",
      tags: "jhumka,navratri,garba,beads",
      images: [
        { url: "https://images.unsplash.com/photo-1561101085-6e9f89b5b00b?w=600&q=80", alt: "Navratri Jhumka", isPrimary: true },
      ],
      variants: [
        { name: "Color", value: "Red & Gold", stock: 50, priceAdj: 0 },
        { name: "Color", value: "Green & Mirror", stock: 50, priceAdj: 0 },
      ],
    },
  ];

  // ── Reviews ──────────────────────────────────────────────────
  const reviews = [
    { reviewerName: "Priya Sharma", rating: 5, comment: "Absolutely gorgeous! The packaging was so beautiful, and the Rakhi quality exceeded my expectations. Will definitely order again!", isVerified: true },
    { reviewerName: "Meera Patel", rating: 5, comment: "Ordered the Jhumka combo — stunning pieces! Arrived 2 days early and the quality is amazing for the price.", isVerified: true },
    { reviewerName: "Ananya Gupta", rating: 4, comment: "Beautiful designs, fast delivery. The oxidised jhumkas are even better in person. Slightly small but very pretty.", isVerified: true },
    { reviewerName: "Sunita Verma", rating: 5, comment: "Gift hamper was perfect for Rakhi! My bhabhi loved the lumba and I loved the jhumkas that came with it ❤️", isVerified: true },
    { reviewerName: "Kavitha R", rating: 5, comment: "Terracotta earrings are so unique and lightweight! Got so many compliments. Will buy more for gifting.", isVerified: true },
  ];

  for (const p of products) {
    const { images, variants, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        images: {
          create: images.map((img, idx) => ({ ...img, order: idx })),
        },
        variants: {
          create: variants,
        },
      },
    });

    // Add reviews to first 5 products
    const pIdx = products.indexOf(p);
    if (pIdx < reviews.length) {
      const r = reviews[pIdx];
      const existingReview = await prisma.review.findFirst({
        where: { productId: product.id, reviewerName: r.reviewerName },
      });
      if (!existingReview) {
        await prisma.review.create({
          data: { ...r, productId: product.id },
        });
      }
    }

    console.log(`  ✅ ${productData.name}`);
  }

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
