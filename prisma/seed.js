const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Little Madhav database...");

  const catRakhi = await prisma.category.upsert({ where: { slug: "rakhi" }, update: {}, create: { name: "Rakhi", slug: "rakhi", description: "Handcrafted Rakhis — traditional, designer & more", imageUrl: "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=600&q=80", displayOrder: 1 } });
  const catJhumka = await prisma.category.upsert({ where: { slug: "jhumka" }, update: {}, create: { name: "Jhumka", slug: "jhumka", description: "Handcrafted earrings — oxidised, kundan, pearl & terracotta", imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80", displayOrder: 2 } });
  const catCombos = await prisma.category.upsert({ where: { slug: "combos" }, update: {}, create: { name: "Combos & Hampers", slug: "combos", description: "Festive gift sets and hampers", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", displayOrder: 3 } });
  const catGifting = await prisma.category.upsert({ where: { slug: "gifting" }, update: {}, create: { name: "Gift Hampers", slug: "gifting", description: "Curated gift hampers for every occasion", imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80", displayOrder: 4 } });

  const products = [
    { name: "Lumba Bhaiya Bhabhi Rakhi Set", slug: "lumba-bhaiya-bhabhi-set", description: "A beautifully handcrafted Rakhi set featuring a traditional lumba for bhabhi.", price: 349, mrp: 499, stock: 80, categoryId: catRakhi.id, isFeatured: true, isSale: true, material: "Thread, Kundan, Meenakari", occasion: "Raksha Bandhan", careInstructions: "Keep away from water. Store in box.", shippingInfo: "Ships within 24 hours.", tags: "rakhi,lumba,bhaiya-bhabhi,set", images: [{ url: "https://images.unsplash.com/photo-1627130942770-e78c9d5b8f4e?w=600&q=80", alt: "Lumba Bhaiya Bhabhi Set", isPrimary: true, order: 0 }], variants: [{ name: "Color", value: "Red & Gold", stock: 40, priceAdj: 0 }, { name: "Color", value: "Maroon & Silver", stock: 40, priceAdj: 0 }] },
    { name: "Designer Pearl Rakhi", slug: "designer-pearl-rakhi", description: "Elegant Rakhi adorned with lustrous freshwater pearls and gold-plated charms.", price: 199, mrp: 299, stock: 120, categoryId: catRakhi.id, isFeatured: true, material: "Pearl, Gold-plated metal", occasion: "Raksha Bandhan", careInstructions: "Avoid moisture.", shippingInfo: "Ships within 24 hours.", tags: "rakhi,pearl,designer", images: [{ url: "https://images.unsplash.com/photo-1601250695645-0b1e8a810cde?w=600&q=80", alt: "Pearl Rakhi", isPrimary: true, order: 0 }], variants: [] },
    { name: "Kids Cartoon Rakhi Set (Pack of 3)", slug: "kids-cartoon-rakhi-set", description: "Adorable cartoon Rakhis for little brothers! Non-toxic and kid-safe.", price: 149, mrp: 199, stock: 200, categoryId: catRakhi.id, isSale: true, material: "Soft thread, Acrylic", occasion: "Raksha Bandhan", careInstructions: "Kid-safe. Hand wash gently.", shippingInfo: "Ships within 24 hours.", tags: "rakhi,kids,cartoon", images: [{ url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80", alt: "Kids Rakhi Set", isPrimary: true, order: 0 }], variants: [{ name: "Theme", value: "Superhero", stock: 100, priceAdj: 0 }, { name: "Theme", value: "Animal Friends", stock: 100, priceAdj: 0 }] },
    { name: "Zardosi Work Rakhi", slug: "zardosi-work-rakhi", description: "Luxurious hand-embroidered Rakhi with intricate zardosi gold threadwork.", price: 299, mrp: 449, stock: 60, categoryId: catRakhi.id, isFeatured: true, material: "Silk thread, Zardosi, Stones", occasion: "Raksha Bandhan", careInstructions: "Dry store only.", shippingInfo: "Ships within 48 hours.", tags: "rakhi,zardosi,premium", images: [{ url: "https://images.unsplash.com/photo-1587467512961-120760940315?w=600&q=80", alt: "Zardosi Rakhi", isPrimary: true, order: 0 }], variants: [] },
    { name: "Oxidised Silver Jhumka", slug: "oxidised-silver-jhumka", description: "Classic oxidised silver jhumkas with a traditional floral pattern.", price: 249, mrp: 399, stock: 150, categoryId: catJhumka.id, isFeatured: true, isSale: true, material: "Oxidised metal", occasion: "Casual, Festive", careInstructions: "Keep dry.", shippingInfo: "Ships within 24 hours.", tags: "jhumka,oxidised,silver", images: [{ url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80", alt: "Oxidised Jhumka", isPrimary: true, order: 0 }], variants: [{ name: "Size", value: "Small", stock: 75, priceAdj: 0 }, { name: "Size", value: "Large", stock: 75, priceAdj: 30 }] },
    { name: "Kundan Meenakari Jhumka", slug: "kundan-meenakari-jhumka", description: "Stunning kundan jhumkas with vibrant meenakari enamel work. Bridal favourite.", price: 549, mrp: 799, stock: 80, categoryId: catJhumka.id, isFeatured: true, isNewArrival: true, material: "Kundan, Meenakari enamel, Brass", occasion: "Wedding, Festive", careInstructions: "Avoid water.", shippingInfo: "Ships within 48 hours.", tags: "jhumka,kundan,meenakari,bridal", images: [{ url: "https://images.unsplash.com/photo-1561101085-6e9f89b5b00b?w=600&q=80", alt: "Kundan Jhumka", isPrimary: true, order: 0 }], variants: [{ name: "Color", value: "Red Meena", stock: 40, priceAdj: 0 }, { name: "Color", value: "Green Meena", stock: 40, priceAdj: 0 }] },
    { name: "Pearl Drop Jhumka", slug: "pearl-drop-jhumka", description: "Delicate freshwater pearl drop jhumkas in a gold-tone setting.", price: 399, mrp: 599, stock: 100, categoryId: catJhumka.id, material: "Freshwater Pearl, Gold-tone brass", occasion: "Office, Festive, Wedding", careInstructions: "Keep dry.", shippingInfo: "Ships within 24 hours.", tags: "jhumka,pearl,drop", images: [{ url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", alt: "Pearl Jhumka", isPrimary: true, order: 0 }], variants: [] },
    { name: "Terracotta Jhumka (Handpainted)", slug: "terracotta-jhumka-handpainted", description: "Earth-toned terracotta jhumkas, handpainted by West Bengal artisans.", price: 199, mrp: 299, stock: 90, categoryId: catJhumka.id, isNewArrival: true, material: "Terracotta clay, Natural paint", occasion: "Casual, Festive", careInstructions: "Avoid water.", shippingInfo: "Ships within 48 hours.", tags: "jhumka,terracotta,handpainted", images: [{ url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80", alt: "Terracotta Jhumka", isPrimary: true, order: 0 }], variants: [{ name: "Color", value: "Rust & White", stock: 45, priceAdj: 0 }, { name: "Color", value: "Indigo & Gold", stock: 45, priceAdj: 0 }] },
    { name: "Rakhi + Jhumka Combo Gift Set", slug: "rakhi-jhumka-combo", description: "Perfect festive combo — designer Rakhi + beautiful jhumkas in premium gift box.", price: 499, mrp: 799, stock: 60, categoryId: catCombos.id, isFeatured: true, isSale: true, material: "Mixed", occasion: "Raksha Bandhan", careInstructions: "See individual care.", shippingInfo: "Ships within 48 hours. Premium gift packaging.", tags: "combo,rakhi,jhumka,gift", images: [{ url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80", alt: "Rakhi Jhumka Combo", isPrimary: true, order: 0 }], variants: [] },
    { name: "Bhaiya Bhabhi Rakhi with Sweets Box", slug: "bhaiya-bhabhi-sweets-combo", description: "Bhaiya Bhabhi Rakhi set + premium dry fruits box + handwritten greeting card.", price: 799, mrp: 1199, stock: 40, categoryId: catCombos.id, isFeatured: true, material: "Mixed", occasion: "Raksha Bandhan", careInstructions: "Consume dry fruits within 3 months.", shippingInfo: "Ships within 48 hours.", tags: "combo,rakhi,sweets,hamper", images: [{ url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80", alt: "Bhaiya Bhabhi Combo", isPrimary: true, order: 0 }], variants: [] },
    { name: "Diwali Jewellery Hamper", slug: "diwali-jewellery-hamper", description: "Curated jewellery hamper — earrings, maang tikka, and festive bracelet in a dibbi box.", price: 999, mrp: 1499, stock: 30, categoryId: catGifting.id, isSale: true, material: "Mixed metals, Kundan, Beads", occasion: "Diwali, Wedding", careInstructions: "Care instructions in box.", shippingInfo: "Ships within 72 hours. Premium gift wrap.", tags: "hamper,diwali,jewellery", images: [{ url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", alt: "Diwali Hamper", isPrimary: true, order: 0 }], variants: [] },
    { name: "Karva Chauth Special Set", slug: "karva-chauth-special-set", description: "Chandelier jhumka, maang tikka, bindi box, and kumkum set — gift-wrapped.", price: 699, mrp: 999, stock: 50, categoryId: catGifting.id, isNewArrival: true, material: "Kundan, Silk thread, Metal", occasion: "Karva Chauth", careInstructions: "See individual product care.", shippingInfo: "Ships within 48 hours.", tags: "gifting,karva-chauth,set", images: [{ url: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&q=80", alt: "Karva Chauth Set", isPrimary: true, order: 0 }], variants: [] },
    { name: "Wedding Favors — Jhumka Set (10 pairs)", slug: "wedding-favors-jhumka-set-10", description: "Elegant jhumka favors for wedding guests, wrapped in branded organza pouches.", price: 1499, mrp: 1999, stock: 25, categoryId: catGifting.id, material: "Oxidised metal", occasion: "Wedding", careInstructions: "Care on each pouch.", shippingInfo: "Bulk orders ship in 5–7 days.", tags: "wedding,favors,bulk", images: [{ url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80", alt: "Wedding Favors", isPrimary: true, order: 0 }], variants: [] },
    { name: "Kundan Stud Set (Under ₹299)", slug: "kundan-stud-set-under-299", description: "Beautiful kundan stud earrings — elegant everyday wear under ₹299.", price: 249, mrp: 349, stock: 200, categoryId: catJhumka.id, isFeatured: true, material: "Kundan, Gold-tone brass", occasion: "Daily wear, Office, Festive", careInstructions: "Keep dry.", shippingInfo: "Ships within 24 hours.", tags: "jhumka,kundan,stud,budget", images: [{ url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", alt: "Kundan Stud", isPrimary: true, order: 0 }], variants: [{ name: "Color", value: "Red Kundan", stock: 100, priceAdj: 0 }, { name: "Color", value: "White Kundan", stock: 100, priceAdj: 0 }] },
    { name: "Navratri Special Garba Jhumka", slug: "navratri-garba-jhumka", description: "Bold, colourful jhumkas for the garba dance floor — beads and mirror work.", price: 299, mrp: 449, stock: 100, categoryId: catJhumka.id, isNewArrival: true, isSale: true, material: "Beads, Mirror work, Thread", occasion: "Navratri, Festive", careInstructions: "Avoid water.", shippingInfo: "Ships within 24 hours.", tags: "jhumka,navratri,garba,beads", images: [{ url: "https://images.unsplash.com/photo-1561101085-6e9f89b5b00b?w=600&q=80", alt: "Navratri Jhumka", isPrimary: true, order: 0 }], variants: [{ name: "Color", value: "Red & Gold", stock: 50, priceAdj: 0 }, { name: "Color", value: "Green & Mirror", stock: 50, priceAdj: 0 }] },
  ];

  const reviews = [
    { reviewerName: "Priya Sharma", rating: 5, comment: "Absolutely gorgeous! The packaging was so beautiful, and the Rakhi quality exceeded my expectations. Will definitely order again!" },
    { reviewerName: "Meera Patel", rating: 5, comment: "Ordered the Jhumka combo — stunning pieces! Arrived 2 days early and the quality is amazing for the price." },
    { reviewerName: "Ananya Gupta", rating: 4, comment: "Beautiful designs, fast delivery. The oxidised jhumkas are even better in person. Slightly small but very pretty." },
    { reviewerName: "Sunita Verma", rating: 5, comment: "Gift hamper was perfect for Rakhi! My bhabhi loved the lumba and I loved the jhumkas that came with it ❤️" },
    { reviewerName: "Kavitha R", rating: 5, comment: "Terracotta earrings are so unique and lightweight! Got so many compliments. Will buy more for gifting." },
  ];

  for (let i = 0; i < products.length; i++) {
    const { images, variants, ...productData } = products[i];
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        images: { create: images },
        variants: { create: variants },
      },
    });
    if (i < reviews.length) {
      const existing = await prisma.review.findFirst({ where: { productId: product.id } });
      if (!existing) {
        await prisma.review.create({ data: { ...reviews[i], productId: product.id, isVerified: true } });
      }
    }
    console.log("  ✅", productData.name);
  }
  console.log("\n🎉 Database seeded successfully!");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
