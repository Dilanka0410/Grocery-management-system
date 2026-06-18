const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.model');
const Category = require('./models/Category.model');
const connectDB = require('./config/db');

dotenv.config();

const seedDatabase = async () => {
    try {
        // 1. ඩේටාබේස් එකට කනෙක්ට් වෙමු
        await connectDB();

        // 2. පරණ බඩුයි කැටගරිලයි ඔක්කොම ක්ලීන් කරලා ඉමු (අලුතින්ම දාන්න ඕන නිසා)
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('🗑️ Old data cleared...');

        // 3. මුලින්ම කැටගරි ටික ඩේටාබේස් එකට දාමු
        // 3. මුලින්ම කැටගරි ටික slug එකත් එක්කම ඩේටාබේස් එකට දාමු
        const categoriesData = [
            { name: "Staples", slug: "staples" },
            { name: "Snacks & Confectionery", slug: "snacks-confectionery" },
            { name: "Dairy & Beverages", slug: "dairy-beverages" },
            { name: "Fresh Produce (Fruits)", slug: "fresh-fruits" },
            { name: "Fresh Produce (Vegetables)", slug: "fresh-vegetables" }
        ];
        const createdCategories = await Category.insertMany(categoriesData);
        console.log('📁 Categories created successfully!');

        // 💡 මෙතනදී අපි හැම කැටගරි එකකම ID එක ලස්සනට මැප් කරගන්නවා මචං
        const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

        // 4. දැන් අපේ Pinterest පින්තූර සහ මිල ගණන් එක්ක ප්‍රොඩක්ට් ලිස්ට් එක හදමු
        const productsData = [
            {
                name: "White Sugar",
                price: 270,
                category: getCatId("Staples"),
                description: "Premium local white sugar, ideal for everyday household tea and sweets.",
                image: "https://i.pinimg.com/1200x/00/6a/d3/006ad3308463d739bfbf647580090c00.jpg",
                stock: 100
            },
            {
                name: "Premium Chocolate Bar",
                price: 350,
                category: getCatId("Snacks & Confectionery"),
                description: "Rich and creamy milk chocolate made from finest cocoa particles.",
                image: "https://i.pinimg.com/736x/2c/14/c2/2c14c29abac971fbb216d8a0786de834.jpg",
                stock: 50
            },
            {
                name: "Dark Chocolate Block",
                price: 420,
                category: getCatId("Snacks & Confectionery"),
                description: "Premium dark chocolate block for baking or direct consumption.",
                image: "https://i.pinimg.com/736x/0a/e8/b0/0ae8b0422e31e26bdfbb0bb34ad6b076.jpg",
                stock: 40
            },
            {
                name: "Chocolate Chip Biscuits",
                price: 150,
                category: getCatId("Snacks & Confectionery"),
                description: "Crunchy cookies loaded with rich chocolate chips.",
                image: "https://i.pinimg.com/1200x/ba/64/00/ba6400a7858724ced6c8da3d64048107.jpg",
                stock: 80
            },
            {
                name: "Butter Cookies Pack",
                price: 220,
                category: getCatId("Snacks & Confectionery"),
                description: "Rich butter taste crispy biscuits perfect for evening tea.",
                image: "https://i.pinimg.com/1200x/15/d4/61/15d46141b4dbcb2345da3c680947217b.jpg",
                stock: 60
            },
            {
                name: "Fresh Milk 1L Bottle",
                price: 450,
                category: getCatId("Dairy & Beverages"),
                description: "Pure pasteurized cow milk collected from local dairy farms.",
                image: "https://i.pinimg.com/736x/5c/7c/cb/5c7ccb54a9c3b9832ce2ff78828029f6.jpg",
                stock: 30
            },
            {
                name: "Organic Red Apples Pack",
                price: 600,
                category: getCatId("Fresh Produce (Fruits)"),
                description: "Sweet, juicy and extremely crunchy imported red apples.",
                image: "https://i.pinimg.com/736x/a9/10/f7/a910f76ccc5a6a547078d18eb4a3189d.jpg",
                stock: 25
            },
            {
                name: "Fresh Organic Carrot 1kg",
                price: 320,
                category: getCatId("Fresh Produce (Vegetables)"),
                description: "Freshly harvested premium carrots directly from Nuwara Eliya farms.",
                image: "https://i.pinimg.com/736x/d2/2d/ec/d22decdb822575f4c3be5ec4edffb21a.jpg",
                stock: 45
            }
        ];

        // 5. ප්‍රොඩක්ට් ටික ඩේටාබේස් එකට පුරවමු
        await Product.insertMany(productsData);
        console.log('🚀 MongoDB successfully seeded with Pinterest products!');
        
        // වැඩේ ඉවරයි, කනෙක්ෂන් එක වහමු
        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();