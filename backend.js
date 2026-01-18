const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// ----------------- MongoDB Connection -----------------
mongoose.connect("mongodb://localhost:27017/skillinheritance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ----------------- Schemas -----------------

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String, // seller or buyer
    address: String,
    phone: String,
});
const User = mongoose.model("User", userSchema);

// Product schema
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    story: String,
    image: String,
    sellerId: mongoose.Schema.Types.ObjectId,
});
const Product = mongoose.model("Product", productSchema);

// Pitch schema
const pitchSchema = new mongoose.Schema({
    title: String,
    description: String,
    funding: Number,
    sellerId: mongoose.Schema.Types.ObjectId,
});
const Pitch = mongoose.model("Pitch", pitchSchema);

// Seller-uploaded Skill schema
const skillSchema = new mongoose.Schema({
    title: String,
    story: String,
    contact: String,
    sellerId: mongoose.Schema.Types.ObjectId,
});
const Skill = mongoose.model("Skill", skillSchema);

// Predefined Skills schema (all states)
const predefinedSkillSchema = new mongoose.Schema({
    state: String,
    district: String,
    skill: String,
    whatsNew: String,
});
const PredefinedSkill = mongoose.model("PredefinedSkill", predefinedSkillSchema);

// Order schema
const orderSchema = new mongoose.Schema({
    itemId: mongoose.Schema.Types.ObjectId,
    itemType: String, // product or skill
    itemTitle: String,
    sellerId: mongoose.Schema.Types.ObjectId,
    buyerName: String,
    buyerEmail: String,
    buyerPhone: String,
    buyerAddress: String,
});
const Order = mongoose.model("Order", orderSchema);

// ----------------- File Upload -----------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ----------------- Auth Middleware -----------------
function auth(req, res, next) {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        req.user = jwt.verify(token, "secret");
        next();
    } catch {
        res.status(401).json({ error: "Unauthorized" });
    }
}

// ----------------- Routes -----------------

// Signup
app.post("/api/signup", async (req, res) => {
    const { name, email, password, role, address, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role, address, phone });
    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, role: user.role, name: user.name });
});

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    console.log(`User logged in: ${user.email}, Role: ${user.role}`);
    console.log("User role (dashboard.js):", user.role);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret");
    console.log(`User logged in: ${user.email}, Role: ${user.role}`);
    console.log("User role (dashboard.js):", user.role);
    res.json({ token, role: user.role, name: user.name, email: user.email, address: user.address, phone: user.phone });

});

// Upload Product (seller only)
app.post("/api/products", auth, upload.single("image"), async (req, res) => {
    const { title, price, story } = req.body;
    const image = `/uploads/${req.file.filename}`;
    await Product.create({ title, price, story, image, sellerId: req.user.id });
    res.json({ message: "Product uploaded" });
});

// Upload Skill (seller-uploaded)
app.post("/api/teach", auth, async (req, res) => {
    const { title, story, contact } = req.body;
    await Skill.create({ title, story, contact, sellerId: req.user.id });
    res.json({ message: "Skill uploaded" });
});

// Upload Pitch (seller only)
app.post("/api/pitches", auth, async (req, res) => {
    const { title, description, funding } = req.body;
    await Pitch.create({ title, description, funding, sellerId: req.user.id });
    res.json({ message: "Pitch uploaded" });
});

// Get all Products
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Get all seller-uploaded Skills
app.get("/api/skills", async (req, res) => {
    const skills = await Skill.find();
    res.json(skills);
});

// Get all Pitches
app.get("/api/pitches", async (req, res) => {
    const pitches = await Pitch.find();
    res.json(pitches);
});

// Place Order
app.post("/api/placeorder", auth, async (req, res) => {
    const { itemId, itemType, itemTitle, buyerName, buyerEmail, buyerPhone, buyerAddress } = req.body;
    let sellerId = null;

    if (itemType === "product") {
        const item = await Product.findById(itemId);
        sellerId = item?.sellerId;
    } else if (itemType === "skill") {
        const item = await Skill.findById(itemId);
        sellerId = item?.sellerId;
    }

    if (!sellerId) return res.status(404).json({ error: "Item not found" });

    await Order.create({ itemId, itemType, itemTitle, buyerName, buyerEmail, buyerPhone, buyerAddress, sellerId });
    res.json({ message: "Order placed" });
});

// Get Seller Orders
app.get("/api/orders", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user.role !== "seller") return res.status(403).json({ error: "Access denied" });

    const orders = await Order.find({ sellerId: user._id });
    res.json(orders);
});
// Get Buyer Orders
app.get("/api/buyer-orders", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "buyer") return res.status(403).json({ error: "Access denied" });

        const orders = await Order.find({ buyerEmail: user.email })
            .sort({ _id: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


// ----------------- Delete Routes -----------------

// Delete Product
app.delete("/api/products/:id", auth, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.sellerId.toString() !== req.user.id) return res.status(403).json({ error: "Access denied" });
    await product.remove();
    res.json({ message: "Product deleted" });
});

// Delete Skill
app.delete("/api/skills/:id", auth, async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    if (skill.sellerId.toString() !== req.user.id) return res.status(403).json({ error: "Access denied" });
    await skill.remove();
    res.json({ message: "Skill deleted" });
});

// Delete Pitch
app.delete("/api/pitches/:id", auth, async (req, res) => {
    const pitch = await Pitch.findById(req.params.id);
    if (!pitch) return res.status(404).json({ error: "Pitch not found" });
    if (pitch.sellerId.toString() !== req.user.id) return res.status(403).json({ error: "Access denied" });
    await pitch.remove();
    res.json({ message: "Pitch deleted" });
});

// ----------------- NEW SEARCH ROUTE -----------------
// Get predefined skills by state (case-insensitive)
app.get("/search-skill", (req, res) => {
    const stateQuery = req.query.state ? req.query.state.toLowerCase() : "";
    PredefinedSkill.find({}, (err, skills) => {
        if (err) return res.status(500).json({ success: false, message: "Server error" });

        const results = skills.filter(
            (s) => s.state.toLowerCase() === stateQuery
        );

        if (results.length === 0) {
            return res.json({ success: false, message: "No results found" });
        }

        // Sort: state first, then districts
        const formatted = results.map((r) => ({
            state: r.state,
            district: r.district,
            skill: r.skill
        }));

        res.json({ success: true, data: formatted });
    });
});

// ----------------- Start Server -----------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
