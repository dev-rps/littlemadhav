const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: "file:" + dbPath });
const prisma = new PrismaClient({ adapter });

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const bandarwarNames = [
  "Traditional Marigold Bandarwar Toran","Festive Zari Border Door Toran","Kundan Embellished Bandarwar",
  "Velvet and Gold Zari Toran","Classic Rajasthani Bandarwar","Silk Thread Work Door Hanging",
  "Shubh Labh Bandarwar Toran","Colorful Pom-Pom Toran","Beaded Brass Bell Bandarwar",
  "Mango Motif Festive Toran","Designer Floral Bandarwar","Mirror Work Door Toran",
  "Auspicious Om Bandarwar","Rajasthani Gota Patti Toran","Multicolor Thread Bandarwar",
  "Diwali Special Hanging Toran","Navratri Festive Bandarwar","Wedding Entrance Door Toran",
  "Leaf and Flower Bandarwar","Hand-Embroidered Toran","Golden Zari Festive Toran",
  "Traditional Meenakari Bandarwar","Peacock Design Toran","Handcrafted Tassel Bandarwar",
  "Brass Ghungroo Toran","Cotton Batik Print Bandarwar","Luxury Silk Bandarwar Toran",
  "Parrot Motif Festive Toran","Elephant and Leaf Bandarwar","Ombre Dyed Thread Toran",
  "Classic Bandarwar with Bells","Embroidered Patchwork Toran","Chanderi Silk Bandarwar",
  "Festive Red and Gold Toran","Block Print Bandarwar","Sequin and Bead Work Toran",
  "Jaipuri Printed Bandarwar","Crochet Lace Toran","Terracotta Motif Bandarwar",
  "Handwoven Banarasi Toran","Floral Applique Bandarwar","Durga Puja Special Toran",
  "Triple Layer Festive Bandarwar","Aari Work Embroidered Toran","Janmashtami Special Bandarwar",
  "Cotton Style Toran","Antique Gold Bead Bandarwar","Rose and Lotus Motif Toran",
  "Bridal Home Decor Bandarwar","Laxmi Feet Shubh Labh Toran","Heritage Handloom Bandarwar"
];

const tableRunnerNames = [
  "Festive Embroidered Table Runner","Golden Zari Border Table Runner","Traditional Rangoli Print Table Runner",
  "Boho Tassel Table Runner","Silk Brocade Festive Runner","Handwoven Khadi Table Runner",
  "Diwali Special Gold Table Runner","Ikat Print Table Runner","Block Print Cotton Runner",
  "Velvet Festive Table Runner","Mirror Work Table Runner","Rajasthani Embroidered Runner"
];

const karvaNames = [
  "Karva Chauth Thali Set Classic","Designer Karva Chauth Thali with Chalni","Bridal Karva Chauth Puja Thali",
  "Traditional Brass Karva Chauth Set","Meenakari Karva Chauth Thali","Premium Karva Chauth Gift Hamper"
];

const bandarwarPrices = [299,349,399,449,399,499,349,279,449,399,349,499,379,299,359,499,449,649,399,549,449,399,599,329,379,299,799,499,449,349,299,499,699,449,329,549,399,349,299,899,449,549,699,599,449,299,649,399,999,379,749];
const tableRunnerPrices = [299,399,349,249,549,299,449,329,279,499,399,349];
const karvaPrices = [599,899,1299,799,1099,1499];
const karvaMrps = [899,1299,1899,1199,1599,2199];

const reviewTexts = [
  { reviewerName:"Priya Sharma", rating:5, comment:"Absolutely gorgeous! Quality exceeded expectations. Perfect for Diwali decor." },
  { reviewerName:"Meera Patel", rating:5, comment:"Beautiful craftsmanship. Arrived well-packed. Will order again!" },
  { reviewerName:"Ananya Gupta", rating:4, comment:"Lovely design, good quality. Looks stunning on our door." },
  { reviewerName:"Sunita Verma", rating:5, comment:"Family loved it! Perfect festive decor. Fast delivery." },
  { reviewerName:"Kavitha R", rating:5, comment:"Unique and well-made! Got so many compliments. Worth every rupee." },
  { reviewerName:"Nidhi Agarwal", rating:4, comment:"Really beautiful. Vibrant colours and great quality for the price." },
  { reviewerName:"Rekha Joshi", rating:5, comment:"Ordered for daughter's wedding. Everyone asked where I got it!" },
  { reviewerName:"Pallavi Singh", rating:5, comment:"Great quality and super fast delivery! Looks better in person." },
  { reviewerName:"Deepa Nair", rating:4, comment:"Nice product, well-crafted. Packaging was secure. Very happy." },
  { reviewerName:"Ritu Khanna", rating:5, comment:"Excellent quality! Will definitely shop from Mourika again." }
];

async function main() {
  console.log("Seeding Mourika database with real products...");

  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("Old data cleared");

  const catBandarwar = await prisma.category.create({
    data: { name:"Bandarwar and Toran", slug:"bandarwar-toran", description:"Handcrafted door hangings, torans, and bandarwars to welcome prosperity into your home.", imageUrl:"/products/bandhanwal/img1.jpg", displayOrder:1 }
  });
  const catTableRunner = await prisma.category.create({
    data: { name:"Table Runner", slug:"table-runner", description:"Elegant festive table runners for every occasion.", imageUrl:"/products/decor/img1.jpg", displayOrder:2 }
  });
  const catKarvaChauth = await prisma.category.create({
    data: { name:"Karva Chauth Thaali", slug:"karva-chauth-thaali", description:"Beautiful Karva Chauth thali sets and puja accessories.", imageUrl:"/products/festive/img1.jpg", displayOrder:3 }
  });
  console.log("Categories created");

  for (let i = 0; i < 51; i++) {
    const name = bandarwarNames[i];
    const slug = slugify(name) + "-" + (i + 1);
    const price = bandarwarPrices[i];
    const mrp = Math.round(price * 1.4 / 10) * 10;
    await prisma.product.create({ data: {
      name, slug,
      description: name + " - a beautifully handcrafted piece perfect for festive decoration. Made with premium materials by skilled artisans.",
      price, mrp, stock: 20 + (i % 30), categoryId: catBandarwar.id,
      isFeatured: i < 8, isNewArrival: i >= 5 && i < 12, isSale: i % 7 === 0,
      material:"Cotton, Zari, Beads, Thread", occasion:"Diwali, Navratri, Weddings, Puja",
      careInstructions:"Dry clean only. Keep away from moisture.",
      shippingInfo:"Ships within 2-3 business days. Free shipping above Rs.499.",
      tags:"bandarwar,toran,door-hanging,festive",
      images: { create: [{ url:"/products/bandarwar-toran/product-"+(i+1)+".jpg", alt:name, isPrimary:true, order:0 }] },
      variants: { create: [
        { name:"Size", value:"Standard (18 inch)", stock:15, priceAdj:0 },
        { name:"Size", value:"Large (24 inch)", stock:10, priceAdj:100 }
      ]}
    }});
  }
  console.log("51 Bandarwar products seeded");

  for (let i = 0; i < 12; i++) {
    const name = tableRunnerNames[i];
    const slug = slugify(name) + "-" + (i + 1);
    const price = tableRunnerPrices[i];
    const mrp = Math.round(price * 1.4 / 10) * 10;
    await prisma.product.create({ data: {
      name, slug,
      description: name + " - add elegance to your dining table with this beautifully crafted festive runner.",
      price, mrp, stock: 25 + (i % 20), categoryId: catTableRunner.id,
      isFeatured: i < 4, isNewArrival: i >= 3 && i < 7, isSale: i % 4 === 0,
      material:"Cotton, Silk, Embroidery Thread", occasion:"Diwali, Weddings, Parties, Everyday",
      careInstructions:"Hand wash in cold water. Do not bleach.",
      shippingInfo:"Ships within 2-3 business days. Free shipping above Rs.499.",
      tags:"table-runner,home-decor,festive",
      images: { create: [{ url:"/products/table-runner/product-"+(i+1)+".jpg", alt:name, isPrimary:true, order:0 }] },
      variants: { create: [
        { name:"Size", value:"13x72 inches", stock:15, priceAdj:0 },
        { name:"Size", value:"13x108 inches", stock:10, priceAdj:80 }
      ]}
    }});
  }
  console.log("12 Table Runner products seeded");

  for (let i = 0; i < 6; i++) {
    const name = karvaNames[i];
    const slug = slugify(name) + "-" + (i + 1);
    await prisma.product.create({ data: {
      name, slug,
      description: name + " - a complete and beautiful thali set for Karva Chauth puja.",
      price: karvaPrices[i], mrp: karvaMrps[i], stock: 15 + (i % 10), categoryId: catKarvaChauth.id,
      isFeatured: i < 3, isNewArrival: i === 0, isSale: false,
      material:"Brass, Metal, Fabric", occasion:"Karva Chauth, Puja, Gifting",
      careInstructions:"Wipe with dry cloth. Avoid moisture.",
      shippingInfo:"Ships within 2-3 business days. Premium packaging available.",
      tags:"karva-chauth,thali,puja,festive,gifting",
      images: { create: [{ url:"/products/karva-chauth-thaali/product-"+(i+1)+".jpeg", alt:name, isPrimary:true, order:0 }] },
      variants: { create: [] }
    }});
  }
  console.log("6 Karva Chauth Thaali products seeded");

  const featured = await prisma.product.findMany({ where:{ isFeatured:true }, take:10 });
  for (let i = 0; i < featured.length; i++) {
    const r = reviewTexts[i % reviewTexts.length];
    await prisma.review.create({ data: { ...r, productId:featured[i].id, isVerified:true } });
  }
  console.log("Reviews added");

  const total = await prisma.product.count();
  const cats = await prisma.category.count();
  console.log("Done! " + total + " products across " + cats + " categories");
}

main().then(async () => { await prisma.$disconnect(); }).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });