import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// 17 Bandarwar & Toran products (each has 3 photos: 1 main + 2 preview angles)
const bandarwarProducts = [
  {
    name: "Traditional Marigold & Gota Patti Bandarwar",
    price: 2499,
    mrp: 3499,
    description: "Handcrafted traditional marigold flower bandarwar (42 inches) with shimmering gota patti embellishments. Brings auspicious warmth and welcoming festive elegance to your main entrance.",
    material: "Cotton Thread, Artificial Marigold, Gota Patti, Bells | 42 Inches",
    occasion: "Diwali, Navratri, Griha Pravesh, Weddings",
  },
  {
    name: "Festive Velvet & Gold Zari Door Toran",
    price: 5499,
    mrp: 7499,
    description: "Luxurious royal velvet door toran (42 inches) adorned with intricate gold zari thread embroidery and hanging pearl tassels. Crafted by master artisans for a grand entryway.",
    material: "Royal Velvet, Gold Zari, Pearl Beads, Tassels | 42 Inches",
    occasion: "Diwali, New Year, Weddings, Temple Decor",
  },
  {
    name: "Auspicious Mango Leaf Kundan Bandarwar",
    price: 2499,
    mrp: 3499,
    description: "Sacred mango leaf motif toran (42 inches) embellished with sparkling Kundan stones and golden ghungroo bells. Symbolizes abundance, purity, and festive joy.",
    material: "Fabric, Kundan Stones, Metal Ghungroo, Golden Beads | 42 Inches",
    occasion: "Pooja, Griha Pravesh, Diwali, Festivals",
  },
  {
    name: "Royal Rajasthani Elephant Motif Toran",
    price: 3499,
    mrp: 4999,
    description: "Vibrant Rajasthani hand-stitched elephant motif toran (42 inches) featuring colorful patchwork, mirror work, and auspicious brass bells. A majestic statement piece for your home.",
    material: "Cotton Fabric, Mirror Work, Brass Bells, Tassels | 42 Inches",
    occasion: "Housewarming, Festive Celebrations, Mandir Entry",
  },
  {
    name: "Handcrafted Silk Pom-Pom & Pearl Bandarwar",
    price: 1299,
    mrp: 1899,
    description: "Delightful handcrafted door hanging (42 inches) featuring multicolor soft silk pom-poms interspersed with luminous pearl beads and golden ring accents.",
    material: "Silk Yarn, Pearl Beads, Golden Rings | 42 Inches",
    occasion: "Daily Entrance Decor, Janmashtami, Diwali, Festive Gifting",
  },
  {
    name: "Shubh Labh Floral Door Hanging Toran",
    price: 1099,
    mrp: 1599,
    description: "Traditional Shubh Labh auspicious entrance bandarwar (42 inches) featuring delicate floral designs, auspicious symbols, and golden hanging bells to bless your dwelling.",
    material: "Embroidered Fabric, Brass Bells, Golden Beads | 42 Inches",
    occasion: "Diwali, Laxmi Puja, New Year, Griha Pravesh",
  },
  {
    name: "Mirror Work Brass Ghungroo Festive Bandarwar",
    price: 1199,
    mrp: 1699,
    description: "Authentic Gujarati mirror-work toran (42 inches) with resounding musical brass ghungroos that chime gently in the doorway. Reflects positive energy into the home.",
    material: "Kutch Embroidered Fabric, Real Mirrors, Brass Ghungroo | 42 Inches",
    occasion: "Navratri, Diwali, Cultural Celebrations, Home Decor",
  },
  {
    name: "Auspicious Om & Swastik Zari Bandarwar",
    price: 1199,
    mrp: 1699,
    description: "Sacred Om and Swastik symbols hand-embroidered with heavy metallic gold zari on a rich crimson backdrop, flanked by handcrafted golden drops (42 inches).",
    material: "Raw Silk, Heavy Zari, Metallic Drops | 42 Inches",
    occasion: "Pooja Room Entry, Griha Pravesh, Diwali, Daily Puja",
  },
  {
    name: "Multicolour Banarasi Silk Entrance Toran",
    price: 1099,
    mrp: 1599,
    description: "Exquisite Banarasi silk weave doorway toran (42 inches) with brocade floral vine motifs and handcrafted silk thread tassels. Adds quintessential Indian grandeur.",
    material: "Banarasi Silk Brocade, Gold Laces, Thread Tassels | 42 Inches",
    occasion: "Weddings, Diwali, Anniversaries, Temple Entrance",
  },
  {
    name: "Luxury Golden Beads & Pearl Door Bandarwar",
    price: 1199,
    mrp: 1699,
    description: "Contemporary luxury doorway hanging (42 inches) crafted with hand-strung golden beads, lustrous faux pearls, and floral metallic medallions. Fits standard doors.",
    material: "Glass Pearls, Gold Plated Beads, Metallic Medallions | 42 Inches",
    occasion: "Modern Living, Festive Season, Housewarming Gift",
  },
  {
    name: "Traditional Meenakari Work Peacock Toran",
    price: 899,
    mrp: 1299,
    description: "Magnificent peacock design doorway toran (42 inches) featuring enameled Meenakari hand-painted metal charms, vibrant feathers styling, and pearl hangings.",
    material: "Meenakari Metal Charms, Velvet, Pearl Drops | 42 Inches",
    occasion: "Janmashtami, Diwali, Royal Wedding Decor",
  },
  {
    name: "Vibrant Jaipuri Block Print Door Hanging",
    price: 799,
    mrp: 1199,
    description: "Artisanal hand block-printed cotton toran (42 inches) made with organic vegetable dyes in heritage Jaipuri floral prints, finished with fine golden border lace.",
    material: "100% Pure Cotton, Natural Dyes, Gota Lace | 42 Inches",
    occasion: "Eco-Friendly Living, Daily Entrance, Festive Decor",
  },
  {
    name: "Bridal Rose & Lotus Motif Velvet Bandarwar",
    price: 799,
    mrp: 1199,
    description: "Romantic Indian bridal entrance toran (42 inches) with handcrafted 3D velvet roses and sacred pink lotus appliques, bordered by delicate pearl string valances.",
    material: "Micro Velvet, 3D Flower Appliques, Faux Pearls | 42 Inches",
    occasion: "Bridal Room, Weddings, Engagement, Karva Chauth",
  },
  {
    name: "Divine Chanderi Silk Tassel Toran",
    price: 799,
    mrp: 1199,
    description: "Subtle and sophisticated Chanderi silk toran (42 inches) featuring golden zari border piping and cascade of dual-tone pastel silk tassels.",
    material: "Chanderi Silk, Golden Zari Piping, Silken Tassels | 42 Inches",
    occasion: "Festive Occasions, Living Room, Puja Altar Entry",
  },
  {
    name: "Hand Embroidered Aari Work Festive Bandarwar",
    price: 899,
    mrp: 1299,
    description: "Masterful Kashmiri Aari needlework door toran (42 inches) with floral creeper embroidery in rich festive hues. Finished with artisan bead dangles.",
    material: "Handloom Wool-Cotton Blend, Aari Embroidery, Beads | 42 Inches",
    occasion: "Winter Festivities, Diwali, Grand Entryways",
  },
  {
    name: "Heritage Banarasi Brocade Door Hanging",
    price: 899,
    mrp: 1299,
    description: "Pure heirloom-quality brocade toran (42 inches) woven in sacred Varanasi looms with intricate kalash and flower motifs. An auspicious heirloom for your family entryway.",
    material: "Banarasi Katan Brocade, Gold Thread, Metal Bells | 42 Inches",
    occasion: "Griha Pravesh, Diwali, New Home Blessing, Weddings",
  },
  {
    name: "Laxmi Feet Shubh Labh Auspicious Bandarwar",
    price: 899,
    mrp: 1299,
    description: "Sacred Goddess Laxmi Charan Paduka and Shubh Labh motifs handcrafted with sparkling gemstones and velvet backing (42 inches). Invites prosperity and fortune.",
    material: "Velvet, Acrylic Stones, Metal Coins, Bells | 42 Inches",
    occasion: "Diwali Dhanteras, Laxmi Puja, New Venture, Griha Pravesh",
  },
];

// 6 Table Runner products (each has 2 photos: 1 main + 1 preview angle)
const tableRunnerProducts = [
  {
    name: "Royal Velvet & Gold Zari Border Festive Table Runner",
    price: 1299,
    mrp: 1899,
    description: "Rich maroon velvet table runner with exquisite gold zari border and tassel ends. Elevates your festive dining table and center coffee table with royal flair.",
    material: "Royal Velvet, Gold Zari Lace, Thread Tassels",
    occasion: "Diwali Dinners, Festive Feasts, Wedding Receptions",
  },
  {
    name: "Handcrafted Silk Brocade Dining Table Runner",
    price: 899,
    mrp: 1299,
    description: "Lustrous raw silk brocade runner featuring intricate floral paisley weaving and padded lining for smooth drape and table surface protection.",
    material: "Silk Brocade, Cotton Lining, Zari Piping",
    occasion: "Formal Dinners, Festive Gathering, Everyday Luxury",
  },
  {
    name: "Traditional Rajasthani Embroidered Table Runner",
    price: 999,
    mrp: 1499,
    description: "Colorful hand-embroidered ethnic runner with traditional Rajasthani geometric motifs and mirror-work highlights. Gives an earthy artisanal touch to any table.",
    material: "Cotton Slub, Embroidery Thread, Acrylic Mirrors",
    occasion: "Ethnic Brunches, Diwali Decor, Gifting",
  },
  {
    name: "Luxury Banarasi Floral Festive Table Runner",
    price: 799,
    mrp: 1199,
    description: "Opulent Banarasi woven table runner with shimmering golden floral vines and corner latkan tassels. A stunning centerpiece for festival feasts.",
    material: "Banarasi Jacquard Woven Fabric, Silk Latkans",
    occasion: "Diwali, Family Gatherings, Festive Centerpiece",
  },
  {
    name: "Boho Tassel & Mirror Work Designer Table Runner",
    price: 999,
    mrp: 1499,
    description: "Chic contemporary runner featuring boho geometric thread embroidery, mini mirrors, and playful fringe tassels on both ends.",
    material: "Heavy Woven Cotton Canvas, Fringe Tassels",
    occasion: "Festive Parties, Living Room Tables, Buffet Spread",
  },
  {
    name: "Auspicious Diwali Special Jacquard Table Runner",
    price: 999,
    mrp: 1499,
    description: "Special edition festive jacquard runner woven with sacred motifs and deep festive colors, resistant to light spills and easy to maintain.",
    material: "Poly-Jacquard Blend, Spill-Resistant Finish",
    occasion: "Diwali, Bhai Dooj, Festive Dining",
  },
];

// 6 Karva Chauth Thaali products (each has 1 photo)
const karvaProducts = [
  {
    name: "Shringaar Velvet Embroidered Karva Chauth Thali Set",
    price: 800,
    mrp: 1199,
    description: "Exquisite Karva Chauth puja thali set covered in auspicious crimson velvet, adorned with golden gotta lace, stone embroidery, and matching accessories.",
    material: "Stainless Steel Thali, Velvet Fabric, Kundan Stones, Laces",
    occasion: "Karva Chauth Puja, Festive Gifting, Bridal Shringaar",
  },
  {
    name: "Bridal Royal Red & Gold Karva Chauth Puja Thali",
    price: 1499,
    mrp: 2199,
    description: "Premium handcrafted bridal thali set with heavy gota patti work, floral embellishments, and sacred red-gold accents for an unforgettable Karva Chauth ritual.",
    material: "Metal Thali, Brocade Silk, Pearl Hangings, Gota Patti",
    occasion: "First Karva Chauth, Bridal Puja, Gifting to Bahu/Beti",
  },
  {
    name: "Traditional Kundan & Pearl Decorated Karva Thali Set",
    price: 1499,
    mrp: 2199,
    description: "Artisan-crafted designer thali adorned with glistening Kundan stones, delicate flower motifs, and lustrous pearl border work. Comes with matching diya and chalni cover.",
    material: "Stainless Steel, Handset Kundan Stones, Glass Pearls",
    occasion: "Karva Chauth, Ahoi Ashtami, Diwali Puja",
  },
  {
    name: "Handcrafted Meenakari Brass Karva Chauth Thali",
    price: 1400,
    mrp: 1999,
    description: "Traditional pure brass thali with hand-enameled Meenakari peacock artwork and engraved edges. Durable, sacred, and timeless for year-after-year use.",
    material: "Pure Brass, Enamel Meenakari Work",
    occasion: "Karva Chauth, Daily Puja, Festive Aarti",
  },
  {
    name: "Festive Gota Patti Decorated Thali with Chalni & Lota",
    price: 1499,
    mrp: 2199,
    description: "Complete Karva Chauth set including decorated puja thali, channi (chalni/sieve), lota (water pot), and diya, all coordinated with royal gota patti craft.",
    material: "Steel Base, Gota Patti Lace, Mirror Accents",
    occasion: "Complete Karva Chauth Ritual, Premium Gifting",
  },
  {
    name: "Premium Designer Velvet Karva Chauth Complete Hamper",
    price: 1499,
    mrp: 2199,
    description: "Luxury Karva Chauth set featuring royal velvet handcrafted thali, embellished sieve, decorative lota, velvet potli pouch, and decorative pooja diya.",
    material: "Premium Velvet, Heavy Zari, Brass & Steel Utensils",
    occasion: "Gift for Wife, Premium Bridal Gift Set, Festive Ritual",
  },
];

const reviewTexts = [
  { reviewerName: "Priya Sharma", rating: 5, comment: "Absolutely gorgeous! The craftsmanship and multiple preview photos matched the real product 100%. Perfect for our main door." },
  { reviewerName: "Meera Patel", rating: 5, comment: "Beautiful design, arrived securely packed in pristine condition. Highly recommended!" },
  { reviewerName: "Ananya Gupta", rating: 4, comment: "Lovely design, vibrant colors, looks so auspicious and royal on our entrance." },
  { reviewerName: "Sunita Verma", rating: 5, comment: "Everyone in the family and guests showered compliments on this festive piece. Great quality!" },
  { reviewerName: "Kavitha R", rating: 5, comment: "Authentic handcrafted quality. It feels so premium and durable. Worth every rupee." },
  { reviewerName: "Nidhi Agarwal", rating: 4, comment: "Really beautiful embroidery and finishing. Added such a divine festive look." },
  { reviewerName: "Rekha Joshi", rating: 5, comment: "Ordered for my daughter's housewarming and Diwali. She was overjoyed!" },
  { reviewerName: "Pallavi Singh", rating: 5, comment: "Fast dispatch, superb packaging, and looks even better in real life than photos." },
  { reviewerName: "Deepa Nair", rating: 4, comment: "Very elegant, neat stitching and high quality bells and tassels. Very pleased." },
  { reviewerName: "Ritu Khanna", rating: 5, comment: "Mourika never disappoints. Will definitely order more for upcoming festivities." },
];

async function main() {
  console.log("Seeding Mourika database with 29 real products (17 Bandarwar, 6 Table Runner, 6 Karva Chauth)...");

  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("Old data cleared");

  const catBandarwar = await prisma.category.create({
    data: {
      name: "Bandarwar and Toran",
      slug: "bandarwar-toran",
      description: "Handcrafted door hangings, torans, and bandarwars to welcome prosperity and positive energy into your home.",
      imageUrl: "/products/bandarwar-toran/p1-1.jpg",
      displayOrder: 1,
    },
  });

  const catTableRunner = await prisma.category.create({
    data: {
      name: "Table Runner",
      slug: "table-runner",
      description: "Elegant festive table runners and center decor to elevate dining and living spaces.",
      imageUrl: "/products/table-runner/p1-1.jpg",
      displayOrder: 2,
    },
  });

  const catKarvaChauth = await prisma.category.create({
    data: {
      name: "Karva Chauth Thaali",
      slug: "karva-chauth-thaali",
      description: "Beautiful handcrafted Karva Chauth thali sets, chalni, and auspicious puja essentials.",
      imageUrl: "/products/karva-chauth-thaali/p1-1.jpeg",
      displayOrder: 3,
    },
  });
  console.log("Categories created");

  // 1. Seed 17 Bandarwar products (each with 3 photos: 1 main + 2 preview angles)
  for (let i = 0; i < bandarwarProducts.length; i++) {
    const item = bandarwarProducts[i];
    const productNum = i + 1;
    const slug = slugify(item.name) + "-" + productNum;

    await prisma.product.create({
      data: {
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        mrp: item.mrp,
        stock: 20 + ((i * 7) % 25),
        categoryId: catBandarwar.id,
        isFeatured: i < 6,
        isNewArrival: i >= 4 && i < 10,
        isSale: i % 4 === 0,
        material: item.material,
        occasion: item.occasion,
        careInstructions: "Gently wipe with dry cloth or soft brush. Keep away from moisture and water.",
        shippingInfo: "Ships within 2-3 business days. Free shipping across India on orders above Rs.499.",
        tags: "bandarwar,toran,door-hanging,festive,entrance,auspicious",
        images: {
          create: [
            {
              url: `/products/bandarwar-toran/p${productNum}-1.jpg`,
              alt: `${item.name} - Front View`,
              isPrimary: true,
              order: 0,
            },
            {
              url: `/products/bandarwar-toran/p${productNum}-2.jpg`,
              alt: `${item.name} - Angle View`,
              isPrimary: false,
              order: 1,
            },
            {
              url: `/products/bandarwar-toran/p${productNum}-3.jpg`,
              alt: `${item.name} - Close-up Detail`,
              isPrimary: false,
              order: 2,
            },
          ],
        },
        variants: {
          create: [
            { name: "Length", value: "42 Inches (Standard)", stock: 25, priceAdj: 0 },
          ],
        },
      },
    });
    console.log(`  ... Bandarwar product ${productNum}/17 seeded with 3 images`);
  }
  console.log("17 Bandarwar products seeded with 51 total images");

  // 2. Seed 6 Table Runner products (each with 2 photos: 1 main + 1 angle preview)
  for (let i = 0; i < tableRunnerProducts.length; i++) {
    const item = tableRunnerProducts[i];
    const productNum = i + 1;
    const slug = slugify(item.name) + "-" + productNum;

    await prisma.product.create({
      data: {
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        mrp: item.mrp,
        stock: 18 + ((i * 5) % 15),
        categoryId: catTableRunner.id,
        isFeatured: i < 3,
        isNewArrival: i >= 2,
        isSale: i % 2 === 0,
        material: item.material,
        occasion: item.occasion,
        careInstructions: "Dry clean or spot clean with mild detergent. Do not bleach or tumble dry.",
        shippingInfo: "Ships within 2-3 business days. Free shipping across India on orders above Rs.499.",
        tags: "table-runner,home-decor,dining,festive,centerpiece",
        images: {
          create: [
            {
              url: `/products/table-runner/p${productNum}-1.jpg`,
              alt: `${item.name} - Flat Display View`,
              isPrimary: true,
              order: 0,
            },
            {
              url: `/products/table-runner/p${productNum}-2.jpg`,
              alt: `${item.name} - Texture & Angle View`,
              isPrimary: false,
              order: 1,
            },
          ],
        },
        variants: {
          create: [
            { name: "Size", value: "4 Seater (12x60 inch)", stock: 12, priceAdj: 0 },
            { name: "Size", value: "6 Seater (12x72 inch)", stock: 10, priceAdj: 80 },
            { name: "Size", value: "8 Seater (12x90 inch)", stock: 8, priceAdj: 150 },
          ],
        },
      },
    });
    console.log(`  ... Table Runner product ${productNum}/6 seeded with 2 images`);
  }
  console.log("6 Table Runner products seeded with 12 total images");

  // 3. Seed 6 Karva Chauth Thaali products (each with 1 photo)
  for (let i = 0; i < karvaProducts.length; i++) {
    const item = karvaProducts[i];
    const productNum = i + 1;
    const slug = slugify(item.name) + "-" + productNum;

    await prisma.product.create({
      data: {
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        mrp: item.mrp,
        stock: 15 + ((i * 3) % 10),
        categoryId: catKarvaChauth.id,
        isFeatured: i < 3,
        isNewArrival: i === 0,
        isSale: false,
        material: item.material,
        occasion: item.occasion,
        careInstructions: "Wipe with soft cotton cloth. Do not soak velvet or decorative elements in water.",
        shippingInfo: "Ships within 1-2 business days with protective bubble packaging for secure transit.",
        tags: "karva-chauth,thali-set,puja,festive,chalni,lota,bridal",
        images: {
          create: [
            {
              url: `/products/karva-chauth-thaali/p${productNum}-1.jpeg`,
              alt: `${item.name} - Complete Set`,
              isPrimary: true,
              order: 0,
            },
          ],
        },
        variants: {
          create: [
            { name: "Set Option", value: "Standard Thali Set", stock: 10, priceAdj: 0 },
            { name: "Set Option", value: "Complete Puja Set with Lota & Chalni", stock: 8, priceAdj: 250 },
          ],
        },
      },
    });
    console.log(`  ... Karva Chauth product ${productNum}/6 seeded with 1 image`);
  }
  console.log("6 Karva Chauth products seeded with 6 total images");

  // Reviews
  const featured = await prisma.product.findMany({ where: { isFeatured: true }, take: 12 });
  for (let i = 0; i < featured.length; i++) {
    const r = reviewTexts[i % reviewTexts.length];
    await prisma.review.create({
      data: { ...r, productId: featured[i].id, isVerified: true },
    });
  }
  console.log("Reviews added");

  const total = await prisma.product.count();
  const cats = await prisma.category.count();
  const totalImgs = await prisma.productImage.count();
  console.log(`Seeding complete: ${total} products across ${cats} categories with ${totalImgs} real photos!`);
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