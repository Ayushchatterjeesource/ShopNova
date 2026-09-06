const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


// ===============================
// DATABASE HELPERS
// ===============================

function ensureDatabase() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(PRODUCTS_FILE)) {
        fs.writeFileSync(PRODUCTS_FILE, "[]");
    }
}

function getProducts() {
    ensureDatabase();

    try {
        const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveProducts(products) {
    ensureDatabase();

    fs.writeFileSync(
        PRODUCTS_FILE,
        JSON.stringify(products, null, 2)
    );
}


// ===============================
// ADMIN LOGIN
// ===============================

const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@shopnova.com";
const ADMIN_PASSWORD = "1234";


// Demo token system
const ADMIN_TOKEN = "SHOPNOVA_ADMIN_2026";


// ===============================
// AUTH MIDDLEWARE
// ===============================

function adminAuth(req, res, next) {
    const token = req.headers.authorization;

    if (token !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access."
        });
    }

    next();
}


// ===============================
// LOGIN API
// ===============================

app.post("/api/admin/login", (req, res) => {

    const { username, email, password } = req.body;

    const loginValue = username || email;

    const validUser =
        loginValue === ADMIN_USERNAME ||
        loginValue === ADMIN_EMAIL;

    const validPassword =
        password === ADMIN_PASSWORD;

    if (validUser && validPassword) {

        return res.json({
            success: true,
            message: "Login successful.",
            token: ADMIN_TOKEN,
            admin: {
                username: ADMIN_USERNAME,
                email: ADMIN_EMAIL
            }
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid username/email or password."
    });
});


// ===============================
// GET ALL PRODUCTS
// ===============================

app.get("/api/products", (req, res) => {

    const products = getProducts();

    res.json({
        success: true,
        products
    });
});


// ===============================
// GET SINGLE PRODUCT
// ===============================

app.get("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const products = getProducts();

    const product = products.find(
        item => item.id === id
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    res.json({
        success: true,
        product
    });
});


// ===============================
// ADD PRODUCT
// ===============================

app.post("/api/products", adminAuth, (req, res) => {

    const {
        name,
        price,
        category,
        image,
        description,
        stock
    } = req.body;

    if (
        !name ||
        price === undefined ||
        !category ||
        !image ||
        !description
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }

    const products = getProducts();

    const newId =
        products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1;

    const newProduct = {
        id: newId,
        name: String(name),
        price: Number(price),
        category: String(category),
        image: String(image),
        description: String(description),
        stock: Number(stock || 0)
    };

    products.push(newProduct);

    saveProducts(products);

    res.status(201).json({
        success: true,
        message: "Product added successfully.",
        product: newProduct
    });
});


// ===============================
// UPDATE PRODUCT
// ===============================

app.put("/api/products/:id", adminAuth, (req, res) => {

    const id = Number(req.params.id);

    const products = getProducts();

    const index = products.findIndex(
        product => product.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    const oldProduct = products[index];

    const updatedProduct = {
        id,
        name: req.body.name ?? oldProduct.name,
        price: Number(req.body.price ?? oldProduct.price),
        category: req.body.category ?? oldProduct.category,
        image: req.body.image ?? oldProduct.image,
        description: req.body.description ?? oldProduct.description,
        stock: Number(req.body.stock ?? oldProduct.stock)
    };

    products[index] = updatedProduct;

    saveProducts(products);

    res.json({
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct
    });
});


// ===============================
// DELETE PRODUCT
// ===============================

app.delete("/api/products/:id", adminAuth, (req, res) => {

    const id = Number(req.params.id);

    const products = getProducts();

    const index = products.findIndex(
        product => product.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    const deletedProduct = products[index];

    products.splice(index, 1);

    saveProducts(products);

    res.json({
        success: true,
        message: "Product deleted successfully.",
        product: deletedProduct
    });
});


// ===============================
// ADMIN DASHBOARD STATS
// ===============================

app.get("/api/admin/stats", adminAuth, (req, res) => {

    const products = getProducts();

    const totalProducts = products.length;

    const totalStock = products.reduce(
        (total, product) =>
            total + Number(product.stock || 0),
        0
    );

    const categories = [
        ...new Set(
            products.map(product => product.category)
        )
    ];

    res.json({
        success: true,
        stats: {
            totalProducts,
            totalStock,
            totalCategories: categories.length
        }
    });
});


// ===============================
// ADMIN PAGE
// ===============================

app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "admin.html")
    );
});


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "ShopNova backend is running.",
        time: new Date().toISOString()
    });
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("       SHOPNOVA SERVER");
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
    console.log("=================================");
    console.log("");
});
