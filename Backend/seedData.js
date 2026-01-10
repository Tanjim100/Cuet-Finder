const mongoose = require("mongoose");
const dotenv = require("dotenv");
const reportlost = require("./Models/reportlost");
const postfound = require("./Models/postfound");
const userlist = require("./Models/userlist");
const bcrypt = require("bcryptjs");

dotenv.config();

// CUET-specific locations
const cuetLocations = [
  "Academic Building 1",
  "Academic Building 2",
  "Central Library",
  "Cafeteria",
  "Shaheed Minar",
  "CSE Department",
  "EEE Department",
  "ME Department",
  "CE Department",
  "Auditorium",
  "Main Gate",
  "Student Dormitory (Hall 1)",
  "Student Dormitory (Hall 2)",
  "Student Dormitory (Hall 3)",
  "Girls Hostel",
  "University Bus Stop",
  "Sports Ground",
  "Gymnasium",
  "Computer Lab",
  "Physics Lab",
  "Chemistry Lab",
  "Workshop",
  "Administrative Building",
  "Medical Center",
  "Parking Area",
];

// Sample CUET student names (common Bangladeshi names)
const sampleNames = [
  "Rafiq Ahmed",
  "Tasnim Akter",
  "Mehedi Hasan",
  "Fatema Begum",
  "Shakib Rahman",
  "Nusrat Jahan",
  "Imran Khan",
  "Maliha Islam",
  "Sabbir Hossain",
  "Ayesha Siddika",
  "Tanvir Alam",
  "Sadia Rahman",
  "Rakib Uddin",
  "Lamia Ahmed",
  "Fahim Chowdhury",
];

// Lost items data - realistic items CUET students might lose
const lostItemsData = [
  {
    item: "Student ID Card",
    description:
      "CUET student ID card. Name: Rafiq Ahmed, Roll: 1804001, CSE Department. Blue lanyard attached.",
    category: "Documents",
    contact: "01712345678",
  },
  {
    item: "Scientific Calculator",
    description:
      "Casio fx-991EX scientific calculator. Has my name written on the back with marker. Lost during exam.",
    category: "Electronics",
    contact: "01812345679",
  },
  {
    item: "Laptop Charger",
    description:
      "Dell laptop charger, 65W. Black color. Left in Computer Lab after project work.",
    category: "Electronics",
    contact: "01912345680",
  },
  {
    item: "Engineering Drawing Set",
    description:
      "Complete drawing instrument set in black case. Contains compass, divider, protractor, set squares.",
    category: "Stationery",
    contact: "01612345681",
  },
  {
    item: "Lab Coat",
    description:
      "White lab coat, medium size. Has CSE embroidery on pocket. Name tag inside says Tasnim.",
    category: "Clothing",
    contact: "01512345682",
  },
  {
    item: "Wireless Earbuds",
    description:
      "Black JBL wireless earbuds in white charging case. Lost somewhere between library and cafeteria.",
    category: "Electronics",
    contact: "01712345683",
  },
  {
    item: "Wallet",
    description:
      "Brown leather wallet containing NID card, some cash, and university library card. Very important documents inside.",
    category: "Accessories",
    contact: "01812345684",
  },
  {
    item: "Umbrella",
    description:
      "Large black umbrella with wooden handle. Auto-open mechanism. Left in Academic Building 1 ground floor.",
    category: "Accessories",
    contact: "01912345685",
  },
  {
    item: "Fluid Mechanics Textbook",
    description:
      "Fluid Mechanics by Cengel & Cimbala, 4th edition. Has highlighted notes. Name written on first page.",
    category: "Documents",
    contact: "01612345686",
  },
  {
    item: "Power Bank",
    description:
      "Xiaomi 20000mAh power bank, white color. Has scratch marks on one side. Lost in library reading room.",
    category: "Electronics",
    contact: "01512345687",
  },
  {
    item: "Bicycle Key",
    description:
      "Small silver key with red keychain. Key for Hero bicycle parked near CSE building.",
    category: "Keys",
    contact: "01712345688",
  },
  {
    item: "Prescription Glasses",
    description:
      "Black rectangular frame glasses in brown case. Power: -2.5 both eyes. Very urgent need.",
    category: "Accessories",
    contact: "01812345689",
  },
  {
    item: "USB Pendrive",
    description:
      "Sandisk 32GB pendrive with important thesis files. Has red cap. Name: Mehedi written with marker.",
    category: "Electronics",
    contact: "01912345690",
  },
  {
    item: "Backpack",
    description:
      "Navy blue Asus laptop backpack. Contains notebooks and some personal items. Lost near Main Gate.",
    category: "Accessories",
    contact: "01612345691",
  },
  {
    item: "Water Bottle",
    description:
      "Steel water bottle, 1 liter, blue cap. Has stickers on it. Left in gymnasium.",
    category: "Sports",
    contact: "01512345692",
  },
  {
    item: "ATM Card",
    description:
      "Dutch Bangla Bank debit card. Already blocked but need to return for records.",
    category: "Cards",
    contact: "01712345693",
  },
  {
    item: "Wrist Watch",
    description:
      "Casio digital watch, black strap. Sentimental value as it was a gift. Lost during football practice.",
    category: "Accessories",
    contact: "01812345694",
  },
  {
    item: "Notebook",
    description:
      "A4 size spiral notebook with Data Structures notes. Brown cover. Entire semester notes inside.",
    category: "Stationery",
    contact: "01912345695",
  },
];

// Found items data - realistic items CUET students might find
const foundItemsData = [
  {
    item: "Student ID Card",
    description:
      "Found CUET ID card near Shaheed Minar. Student from EEE department, 2019 batch.",
    category: "Documents",
    contact: "01712345700",
  },
  {
    item: "Smartphone",
    description:
      "Found a Xiaomi smartphone with cracked screen protector near cafeteria. Has blue back cover.",
    category: "Electronics",
    contact: "01812345701",
  },
  {
    item: "Bunch of Keys",
    description:
      "Found 4 keys on a ring with a small teddy keychain. Found on bench near library entrance.",
    category: "Keys",
    contact: "01912345702",
  },
  {
    item: "Engineering Notebook",
    description:
      "Found brown notebook with Thermodynamics notes. Has name Sabbir on first page. Very detailed notes.",
    category: "Stationery",
    contact: "01612345703",
  },
  {
    item: "Earphones",
    description:
      "Found wired earphones (realme brand) in Computer Lab. White color with tangled wire.",
    category: "Electronics",
    contact: "01512345704",
  },
  {
    item: "Calculator",
    description:
      "Found Casio fx-82MS calculator in exam hall. No name marked on it.",
    category: "Electronics",
    contact: "01712345705",
  },
  {
    item: "Jacket",
    description:
      "Found black hooded jacket in Auditorium after cultural program. Size L, has no brand tag.",
    category: "Clothing",
    contact: "01812345706",
  },
  {
    item: "Wallet",
    description:
      "Found small black wallet near ATM booth. Contains some cash and a bKash card. No ID inside.",
    category: "Accessories",
    contact: "01912345707",
  },
  {
    item: "Library Card",
    description:
      "Found CUET central library card near reading room. Can identify by photo on card.",
    category: "Cards",
    contact: "01612345708",
  },
  {
    item: "Charger Cable",
    description:
      "Found Type-C charging cable in Academic Building 2, Room 301. Samsung brand.",
    category: "Electronics",
    contact: "01512345709",
  },
  {
    item: "Spectacles",
    description:
      "Found reading glasses with golden frame in Central Library. Was kept on study table.",
    category: "Accessories",
    contact: "01712345710",
  },
  {
    item: "Lab Report",
    description:
      "Found Chemistry Lab report file. Contains multiple lab reports. Student from CE department.",
    category: "Documents",
    contact: "01812345711",
  },
  {
    item: "Sports Shoes",
    description:
      "Found pair of Nike sports shoes near Sports Ground. White and blue color, size 42.",
    category: "Sports",
    contact: "01912345712",
  },
  {
    item: "Pendrive",
    description:
      "Found HP pendrive (16GB) in Physics Lab computer. Has some PDF files and project folders.",
    category: "Electronics",
    contact: "01612345713",
  },
  {
    item: "Headphones",
    description:
      "Found over-ear headphones (boat brand) on university bus. Black color with cushioned ear pads.",
    category: "Electronics",
    contact: "01512345714",
  },
  {
    item: "Geometry Box",
    description:
      "Found complete geometry box near Workshop. Has compass, protractor, and drawing tools.",
    category: "Stationery",
    contact: "01712345715",
  },
];

// Helper function to get random element from array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random date within last 30 days
const getRandomRecentDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  return new Date(now - daysAgo * 24 * 60 * 60 * 1000);
};

// Main seed function
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ Connected to MongoDB");

    // Create sample users first
    const existingUsers = await userlist.countDocuments();
    let users = [];

    if (existingUsers < 5) {
      console.log("Creating sample users...");
      const salt = await bcrypt.genSalt(10);

      for (let i = 0; i < 5; i++) {
        const hashedPassword = await bcrypt.hash("password123", salt);
        const user = await userlist.create({
          name: sampleNames[i],
          email: `student${i + 1}@cuet.ac.bd`,
          password: hashedPassword,
          mobile: `0171234567${i}`,
          address: getRandomElement(cuetLocations),
        });
        users.push(user);
      }
      console.log("✓ Sample users created");
    } else {
      users = await userlist.find().limit(5);
      console.log("Using existing users");
    }

    // Clear existing sample data (optional - comment out if you want to keep existing)
    // await reportlost.deleteMany({});
    // await postfound.deleteMany({});

    // Seed lost items
    console.log("Creating lost items...");
    for (const itemData of lostItemsData) {
      const randomUser = getRandomElement(users);
      const randomName = getRandomElement(sampleNames);
      const randomLocation = getRandomElement(cuetLocations);
      const randomDate = getRandomRecentDate();

      await reportlost.create({
        name: randomName,
        item: itemData.item,
        location: randomLocation,
        date: randomDate,
        description: itemData.description,
        contact: itemData.contact,
        category: itemData.category,
        user: randomUser._id,
        status: "active",
        views: Math.floor(Math.random() * 50),
        bookmarkCount: Math.floor(Math.random() * 10),
      });
    }
    console.log(`✓ ${lostItemsData.length} lost items created`);

    // Seed found items
    console.log("Creating found items...");
    for (const itemData of foundItemsData) {
      const randomUser = getRandomElement(users);
      const randomName = getRandomElement(sampleNames);
      const randomLocation = getRandomElement(cuetLocations);
      const randomDate = getRandomRecentDate();

      await postfound.create({
        name: randomName,
        item: itemData.item,
        location: randomLocation,
        date: randomDate,
        description: itemData.description,
        contact: itemData.contact,
        category: itemData.category,
        user: randomUser._id,
        status: "active",
        views: Math.floor(Math.random() * 50),
        bookmarkCount: Math.floor(Math.random() * 10),
      });
    }
    console.log(`✓ ${foundItemsData.length} found items created`);

    console.log("\n✅ Database seeded successfully!");
    console.log("Sample login credentials:");
    console.log("  Email: student1@cuet.ac.bd");
    console.log("  Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
