import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Cleaning Mourika database...");
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🌱 Seeding Mourika categories with authentic folder photos...");

  // 1. Devotees collection
  const catDevotees = await prisma.category.create({
    data: {
      name: "Devotees collection",
      slug: "devotees-collection",
      description: "Beautiful devotional combo collections for modern devotees.",
      imageUrl: "/products/devotees/img1.jpg",
      displayOrder: 1,
    },
  });

  // 2. Laddu Gopal Dresses
  const catDresses = await prisma.category.create({
    data: {
      name: "Laddu Gopal Dresses",
      slug: "laddu-gopal-dresses",
      description: "Handcrafted dresses for Bal Gopal — luxe silks, soft pastels, cottons & woollens.",
      imageUrl: "/products/dresses/img1.jpg",
      displayOrder: 2,
    },
  });

  // 3. Festive Home Decor
  const catDecor = await prisma.category.create({
    data: {
      name: "Festive Home Decor",
      slug: "festive-home-decor",
      description: "Traditional hangings, rangolis, torans & decorative covers.",
      imageUrl: "/products/decor/img1.jpg",
      displayOrder: 3,
    },
  });

  // 4. Festive Products
  const catProducts = await prisma.category.create({
    data: {
      name: "Festive Products",
      slug: "festive-products",
      description: "Occasion-specific items for Janmashtami, Rakhi, Karwa Chauth, Navratri & Diwali.",
      imageUrl: "/products/festive/img1.jpg",
      displayOrder: 4,
    },
  });

  // 5. Jewellery & Accessories
  const catJewellery = await prisma.category.create({
    data: {
      name: "Jewellery & Accessories",
      slug: "jewellery-accessories",
      description: "Premium hair, earrings, kangan, bansuri & shringar accessories for deity worship.",
      imageUrl: "/products/jewellery/img1.jpg",
      displayOrder: 5,
    },
  });

  console.log("🌱 Seeding Mourika products...");

  const productsData = [
    // ── Devotees collection ──────────────────────────────────────
    {
      name: "Complete Devotional Puja Combo Box",
      slug: "complete-devotional-puja-combo",
      description: "An all-in-one divine combo featuring a brass puja thali, copper aarti lamp, premium incense sticks, natural roli-chawal, and a detailed step-by-step puja guide.",
      price: 699,
      mrp: 999,
      stock: 45,
      categoryId: catDevotees.id,
      isFeatured: true,
      isSale: true,
      material: "Brass, Copper, Natural resins",
      occasion: "Daily Puja, Gifting",
      careInstructions: "Clean brass utensils with pitambari powder. Keep incense dry.",
      shippingInfo: "Ships within 24 hours.",
      tags: "combo,devotee,puja,gifting",
      folder: "devotees",
      variants: [],
    },
    {
      name: "Deluxe Devotee Aarti & Bhakti Gift Set",
      slug: "deluxe-devotee-aarti-bhakti-gift-set",
      description: "Deluxe spiritual gift hamper containing carved brass bell, kamal diya, natural attar oil, and velvet thali cover.",
      price: 899,
      mrp: 1299,
      stock: 35,
      categoryId: catDevotees.id,
      isFeatured: true,
      material: "Brass, Velvet, Pure oils",
      occasion: "Spiritual Gifting, Housewarming",
      careInstructions: "Wipe brass with dry cloth.",
      shippingInfo: "Ships within 24 hours.",
      tags: "combo,devotee,gift,aarti",
      folder: "devotees",
      variants: [],
    },
    {
      name: "Shringar & Puja Divine Combo Hamper",
      slug: "shringar-puja-divine-combo-hamper",
      description: "Curated combo featuring deity dress, kangan, mukut, and bansuri accessories with puja samagri.",
      price: 549,
      mrp: 799,
      stock: 50,
      categoryId: catDevotees.id,
      isSale: true,
      material: "Silk, Alloy, Brass",
      occasion: "Festive Puja & Shringar",
      careInstructions: "Store in cool dry place.",
      shippingInfo: "Ships in 24 hours.",
      tags: "combo,shringar,hamper",
      folder: "devotees",
      variants: [],
    },
    {
      name: "Supreme Devotional Ritual Box",
      slug: "supreme-devotional-ritual-box",
      description: "Complete ritual box featuring premium incense, kapoor thali, sandalwood paste, and brass snan patra.",
      price: 749,
      mrp: 1099,
      stock: 30,
      categoryId: catDevotees.id,
      material: "Brass, Pure Sandalwood",
      occasion: "Special Festivals, Rituals",
      careInstructions: "Keep liquids separate from brass.",
      shippingInfo: "Ships in 24 hours.",
      tags: "combo,ritual,puja",
      folder: "devotees",
      variants: [],
    },

    // ── Laddu Gopal Dresses ──────────────────────────────────────
    {
      name: "Luxe Embroidered Silk Dress",
      slug: "luxe-embroidered-silk-dress",
      description: "Intricately designed heavy silk dress for Laddu Gopal, detailed with high-grade golden zari embroidery, micro beads, and mirror-work. Perfect for festivals like Janmashtami.",
      price: 349,
      mrp: 499,
      stock: 60,
      categoryId: catDresses.id,
      isFeatured: true,
      isSale: true,
      material: "Banarasi Silk, Zari thread",
      occasion: "Festive, Daily Shringar",
      careInstructions: "Dry clean only. Do not iron directly on zari.",
      shippingInfo: "Ships within 24 hours.",
      tags: "dresses,luxe,silk,laddu-gopal",
      folder: "dresses",
      variants: [
        { name: "Color", value: "Red Kundan", stock: 30, priceAdj: 0 },
        { name: "Color", value: "White Kundan", stock: 30, priceAdj: 0 },
      ],
    },
    {
      name: "Soft Pastel Floral Dress",
      slug: "soft-pastel-floral-dress",
      description: "Comfortable and soothing soft pastel shaded dress for Laddu Gopal. Light fabrics printed with delicate floral block prints.",
      price: 249,
      mrp: 349,
      stock: 80,
      categoryId: catDresses.id,
      isNewArrival: true,
      material: "Premium Cotton Mulmul",
      occasion: "Summer, Daily wear",
      careInstructions: "Gentle hand wash with cold water.",
      shippingInfo: "Ships in 24-48 hours.",
      tags: "dresses,pastel,summer,cotton",
      folder: "dresses",
      variants: [
        { name: "Color", value: "Peach Pearl", stock: 40, priceAdj: 0 },
        { name: "Color", value: "Mint Green", stock: 40, priceAdj: 0 },
      ],
    },
    {
      name: "Summer Collection Block Print Dress",
      slug: "summer-collection-block-print-dress",
      description: "Pure cotton breathable block print dress from our summer collection. Specially cut to keep the deity cool during hot summer days.",
      price: 199,
      mrp: 299,
      stock: 120,
      categoryId: catDresses.id,
      material: "100% Organic Cotton",
      occasion: "Summer Daily Wear",
      careInstructions: "Wash with mild detergent. Hang dry.",
      shippingInfo: "Ships within 24 hours.",
      tags: "dresses,summer,cotton,block-print",
      folder: "dresses",
      variants: [],
    },
    {
      name: "Woollen Winter Dress & Cap Set",
      slug: "woollen-winter-dress-cap-set",
      description: "Keep Laddu Gopal cozy in winters with this hand-knitted soft wool dress and matching cap. Made from baby-soft wool to avoid skin irritation.",
      price: 299,
      mrp: 399,
      stock: 50,
      categoryId: catDresses.id,
      isSale: true,
      material: "Premium Soft Wool",
      occasion: "Winter Season",
      careInstructions: "Hand wash in warm water using woolen wash detergent.",
      shippingInfo: "Ships within 24 hours.",
      tags: "dresses,winter,woollen,set",
      folder: "dresses",
      variants: [],
    },
    {
      name: "Radha Rani Divine Silk Dress Set",
      slug: "radha-rani-divine-silk-dress-set",
      description: "Handcrafted royal silk poshaak set for Radha Rani & Laddu Gopal, detailed with gold lace border.",
      price: 499,
      mrp: 749,
      stock: 45,
      categoryId: catDresses.id,
      isFeatured: true,
      material: "Silk, Zari lace",
      occasion: "Special Festivals, Janmashtami",
      careInstructions: "Dry clean only.",
      shippingInfo: "Ships in 24 hours.",
      tags: "dresses,radharani,poshaak,silk",
      folder: "radharani",
      variants: [],
    },

    // ── Festive Home Decor ───────────────────────────────────────
    {
      name: "Torans / Bandhanwal Hanging",
      slug: "torans-bandhanwal-hanging",
      description: "Beautiful festive main entrance door hanging (Toran) decorated with synthetic mango leaves, marigold flowers, and small brass bells to invite auspiciousness.",
      price: 249,
      mrp: 399,
      stock: 100,
      categoryId: catDecor.id,
      isFeatured: true,
      material: "Beads, Polyester marigold, Brass bells",
      occasion: "Diwali, Griha Pravesh, Festivals",
      careInstructions: "Gently wipe with dry cloth. Do not wash.",
      shippingInfo: "Ships within 24 hours.",
      tags: "decor,toran,hanging,door",
      folder: "bandhanwal",
      variants: [],
    },
    {
      name: "Decorative Rangoli Acrylic Set",
      slug: "decorative-rangoli-acrylic-set",
      description: "A gorgeous multi-piece reusable acrylic rangoli set. Place them in various layouts around diyas on your floor to create beautiful patterns instantly.",
      price: 349,
      mrp: 549,
      stock: 80,
      categoryId: catDecor.id,
      isSale: true,
      material: "Acrylic sheet, Stones, Pearl beads",
      occasion: "Festivals, Diwali, Puja rooms",
      careInstructions: "Store flat in box. Clean with dry cloth only.",
      shippingInfo: "Ships within 24 hours.",
      tags: "decor,rangoli,reusable,floor",
      folder: "decor",
      variants: [],
    },
    {
      name: "Shubh Labh Door Hanging Accent",
      slug: "shubh-labh-door-hanging-accent",
      description: "Ornate wall and door hanging tablets displaying Shubh and Labh symbols. Adorned with gold lace border, beads, and hanging jhumki accents.",
      price: 199,
      mrp: 299,
      stock: 150,
      categoryId: catDecor.id,
      material: "Wood base, Silk fabric, Gold thread",
      occasion: "Entrance Door Decor",
      careInstructions: "Dust gently. Avoid contact with moisture.",
      shippingInfo: "Ships in 24-48 hours.",
      tags: "decor,shubh-labh,accent,hanging",
      folder: "decor",
      variants: [],
    },
    {
      name: "Embroidered Pooja Thali Cover",
      slug: "embroidered-pooja-thali-cover",
      description: "Rich red satin circular cover designed to drape beautifully over your Pooja Thali. Finished with intricate golden zari leaf designs and golden tassel borders.",
      price: 149,
      mrp: 249,
      stock: 130,
      categoryId: catDecor.id,
      isNewArrival: true,
      material: "Satin, Silk, Zari thread",
      occasion: "Puja rituals, Aarti, Gifting",
      careInstructions: "Hand wash gently in cold water.",
      tags: "decor,thali-cover,silk,embroidery",
      folder: "decor",
      variants: [],
    },

    // ── Festive Products ─────────────────────────────────────────
    {
      name: "Janmashtami Bal Gopal Swing (Jhula)",
      slug: "janmashtami-bal-gopal-jhula",
      description: "An elegantly hand-carved golden-finish wooden swing designed for deity seating and rocking ceremonies during Janmashtami celebrations.",
      price: 799,
      mrp: 1299,
      stock: 25,
      categoryId: catProducts.id,
      isFeatured: true,
      material: "Teakwood, Non-toxic metal plating",
      occasion: "Janmashtami, Deity swing",
      careInstructions: "Wipe with dry flannel cloth. Keep away from fire.",
      shippingInfo: "Ships in heavy box with padding.",
      tags: "festive,jhula,swing,janmashtami",
      folder: "festive",
      variants: [],
    },
    {
      name: "Designer Pearl Rakhi Set",
      slug: "designer-pearl-rakhi-set",
      description: "Exquisite pair of handcrafted rakhis made of natural freshwater pearl lines and golden spacers. A symbol of pure brotherly love.",
      price: 189,
      mrp: 299,
      stock: 200,
      categoryId: catProducts.id,
      isSale: true,
      material: "Freshwater Pearls, Cotton thread",
      occasion: "Raksha Bandhan",
      careInstructions: "Keep dry. Wipe pearls with dry tissue.",
      shippingInfo: "Ships in 24 hours.",
      tags: "festive,rakhi,pearl,designer",
      folder: "festive",
      variants: [],
    },
    {
      name: "Karwa Chauth Pooja Thali Set",
      slug: "karwa-chauth-pooja-thali-set",
      description: "An elegant red velvet wrapped Karwa Chauth set. Includes one steel thali, one chalni (sieve), and a decorated copper Lota (pot) for the moon ritual.",
      price: 599,
      mrp: 899,
      stock: 40,
      categoryId: catProducts.id,
      isNewArrival: true,
      material: "Stainless steel, Copper, Velvet wrapping",
      occasion: "Karwa Chauth Vrat",
      careInstructions: "Wash internals with water. Avoid soaking the outer velvet decoration.",
      shippingInfo: "Ships within 24 hours.",
      tags: "festive,karwa-chauth,thali-set",
      folder: "festive",
      variants: [],
    },
    {
      name: "Navratri Hand-painted Dandiya Sticks",
      slug: "navratri-hand-painted-dandiya-sticks",
      description: "Vibrant matching pair of solid wood dandiya sticks, handpainted in ethnic colors and wrapped with zari cords, finished with hanging ghungroo bells.",
      price: 129,
      mrp: 199,
      stock: 120,
      categoryId: catProducts.id,
      material: "Teakwood, Cotton thread, Metal bells",
      occasion: "Navratri Garba",
      careInstructions: "Store in dry place. Clean with damp cloth.",
      shippingInfo: "Ships in 24 hours.",
      tags: "festive,navratri,dandiya,garba",
      folder: "festive",
      variants: [],
    },
    {
      name: "Diwali Clay Terracotta Diyas (Pack of 6)",
      slug: "diwali-clay-terracotta-diyas-6pack",
      description: "Earthen clay diyas handcrafted by local potters. Beautifully painted in gold, red, and yellow, perfect for light decoration on Diwali.",
      price: 149,
      mrp: 249,
      stock: 180,
      categoryId: catProducts.id,
      isSale: true,
      material: "Natural Terracotta Clay",
      occasion: "Diwali Festival of Lights",
      careInstructions: "Slightly wet clay diyas before oil fill.",
      shippingInfo: "Ships in shock-absorbent eco-packaging.",
      tags: "festive,diyas,diwali,clay",
      folder: "upcoming",
      variants: [],
    },

    // ── Jewellery & Accessories ──────────────────────────────────
    {
      name: "Premium Curly Deity Hair Wig",
      slug: "premium-curly-deity-hair-wig",
      description: "Soft synthetic dark curls wig for Bal Gopal deity hair shringar. Comes with a tiny elastic grip backing.",
      price: 89,
      mrp: 149,
      stock: 100,
      categoryId: catJewellery.id,
      material: "Synthetic high-grade fibers",
      occasion: "Daily deity shringar",
      careInstructions: "Brush gently with a baby comb if messy.",
      shippingInfo: "Ships in 24 hours.",
      tags: "jewellery,hair,wig,accessory",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Miniature Gold Kundan Jhumka",
      slug: "miniature-gold-kundan-jhumka",
      description: "Exquisite tiny drop jhumka earrings featuring kundan gemstones and white seed pearls, perfectly sized for deities.",
      price: 119,
      mrp: 199,
      stock: 85,
      categoryId: catJewellery.id,
      isFeatured: true,
      material: "Gold-tone alloy, Kundan, Seed pearls",
      occasion: "Festive Shringar",
      careInstructions: "Keep in airtight pouches when not in use.",
      tags: "jewellery,earrings,jhumka,accessory",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Stone Studded Deity Kangan Pair",
      slug: "stone-studded-deity-kangan-pair",
      description: "A pair of gold-toned openable kangan (bangles) decorated with colorful red and green stones, ideal for Bal Gopal sizes 1-6.",
      price: 99,
      mrp: 149,
      stock: 90,
      categoryId: catJewellery.id,
      material: "Brass, Colored rhinestones",
      occasion: "Shringar Accessory",
      careInstructions: "Do not wet. Clean with cotton.",
      tags: "jewellery,kangan,bangles,accessory",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Deity Pearl & Ruby Haar / Necklace Set",
      slug: "deity-pearl-ruby-haar-necklace",
      description: "A double-layered necklace featuring imitation rubies and tiny pearls. Comes with a matching gold cord for neck adjustment.",
      price: 169,
      mrp: 299,
      stock: 75,
      categoryId: catJewellery.id,
      isSale: true,
      material: "Faux rubies, Glass pearls, Zari cord",
      occasion: "Festive Shringar",
      careInstructions: "Store in zip pouches. Avoid water.",
      tags: "jewellery,necklace,haar,ruby",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Deity Golden Stone-set Bansuri (Flute)",
      slug: "deity-golden-stone-set-bansuri",
      description: "Decorative metallic flute accessory for Bal Gopal, studded with tiny emerald rhinestones and finished with a hanging bead ghungroo.",
      price: 59,
      mrp: 99,
      stock: 140,
      categoryId: catJewellery.id,
      material: "Metal, Emerald rhinestones",
      occasion: "Bal Gopal Accessory",
      careInstructions: "Dust with dry cotton cloth.",
      tags: "jewellery,flute,bansuri,accessory",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Stone Adjustable Deity Kamar Band",
      slug: "stone-adjustable-deity-kamar-band",
      description: "Exquisite stone waistband (Kamar Band) designed to give a royal look to the deity. Featuring a flexible chain with hanging beads.",
      price: 99,
      mrp: 149,
      stock: 80,
      categoryId: catJewellery.id,
      material: "Alloy, Crystals",
      occasion: "Royal Shringar",
      careInstructions: "Keep in a dry, dark storage box.",
      tags: "jewellery,kamarband,waistband,accessory",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Fragrant Natural Attar / Ittar Set",
      slug: "fragrant-natural-attar-ittar-set",
      description: "A premium combo of 3 non-alcoholic oil-based natural fragrances (Gulaab, Chandan, Khas). Highly concentrated, long-lasting.",
      price: 199,
      mrp: 299,
      stock: 95,
      categoryId: catJewellery.id,
      isNewArrival: true,
      material: "Natural essential oils, Alcohol-free",
      occasion: "Fragrance worship, Deity bath, Daily refresh",
      careInstructions: "Keep bottle caps tightly closed when not in use.",
      shippingInfo: "Ships in glass bottles inside cardboard sleeves.",
      tags: "accessory,attar,ittar,fragrance",
      folder: "jewellery",
      variants: [],
    },
    {
      name: "Brass Deity Snan Bathtub",
      slug: "brass-deity-snan-bathtub",
      description: "Solid brass bathtub (Snan Patra) designed with traditional floral border engravings, perfect for the daily bathing ritual of Bal Gopal.",
      price: 249,
      mrp: 399,
      stock: 60,
      categoryId: catJewellery.id,
      isFeatured: true,
      material: "100% Pure Brass",
      occasion: "Deity Snan / Bathing ritual",
      careInstructions: "Clean with lemon or pitambari to retain shine.",
      shippingInfo: "Ships within 24 hours.",
      tags: "accessory,brass,bathtub,snan",
      folder: "jewellery",
      variants: [],
    },
  ];

  // ── Reviews ──────────────────────────────────────────────────
  const reviews = [
    { reviewerName: "Karan Johar", rating: 5, comment: "Exceptional quality for the deity dress! Fits my Laddu Gopal perfectly. The velvet and embroidery are highly royal. Very impressed by Mourika!", isVerified: true },
    { reviewerName: "Rani Mukherjee", rating: 5, comment: "I ordered the Toran and Shubh Labh door decorations. They look so elegant and welcoming at my entrance. Fast delivery!", isVerified: true },
    { reviewerName: "Sanjay Dutt", rating: 5, comment: "Perfect brass snan patra and natural attars. The sandalwood attar has an amazing divine scent. Highly recommended!", isVerified: true },
    { reviewerName: "Madhuri Dixit", rating: 4, comment: "The design is very cute, especially the tiny bansuri flute. Beautifully crafted with fine beads. Thanks Mourika team!", isVerified: true },
    { reviewerName: "Kajol Devgan", rating: 5, comment: "Stunning kundu jhumkas. Small but very detailed shringar jewellery. Will buy more sets for festive gifting.", isVerified: true },
  ];

  for (let idx = 0; idx < productsData.length; idx++) {
    const p = productsData[idx];
    const { folder, variants, ...productData } = p;

    // Build 4 distinct images from the product's exact folder
    const images = [
      { url: `/products/${folder}/img1.jpg`, alt: `${productData.name} Angle 1`, isPrimary: true },
      { url: `/products/${folder}/img2.jpg`, alt: `${productData.name} Angle 2`, isPrimary: false },
      { url: `/products/${folder}/img3.jpg`, alt: `${productData.name} Angle 3`, isPrimary: false },
      { url: `/products/${folder}/img4.jpg`, alt: `${productData.name} Angle 4`, isPrimary: false },
    ];

    const baseVariants = variants.filter((v: any) => v.name !== "Size");
    const sizeVariants = [
      { name: "Size", value: "1", stock: 15, priceAdj: 0 },
      { name: "Size", value: "2", stock: 15, priceAdj: 0 },
      { name: "Size", value: "3", stock: 15, priceAdj: 0 },
      { name: "Size", value: "4", stock: 15, priceAdj: 0 },
      { name: "Size", value: "5", stock: 15, priceAdj: 0 },
    ];

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((img, orderIdx) => ({ ...img, order: orderIdx })),
        },
        variants: {
          create: [...baseVariants, ...sizeVariants],
        },
      },
    });

    // Add review
    if (idx < reviews.length) {
      const r = reviews[idx];
      await prisma.review.create({
        data: { ...r, productId: product.id },
      });
    }

    console.log(`  ✅ [${folder.toUpperCase()}] ${productData.name}`);
  }

  console.log("\n🎉 Mourika Database 100% synchronized & seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
