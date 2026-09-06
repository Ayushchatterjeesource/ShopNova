const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const loginForm =
    document.getElementById("loginForm");

const loginValue =
    document.getElementById("loginValue");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const productForm =
    document.getElementById("productForm");

const productId =
    document.getElementById("productId");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productCategory =
    document.getElementById("productCategory");

const productImage =
    document.getElementById("productImage");

const productDescription =
    document.getElementById("productDescription");

const productStock =
    document.getElementById("productStock");

const submitProductBtn =
    document.getElementById(
        "submitProductBtn"
    );

const cancelEditBtn =
    document.getElementById(
        "cancelEditBtn"
    );

const productMessage =
    document.getElementById(
        "productMessage"
    );

const adminProducts =
    document.getElementById(
        "adminProducts"
    );

const totalProducts =
    document.getElementById(
        "totalProducts"
    );

const totalStock =
    document.getElementById(
        "totalStock"
    );

const totalCategories =
    document.getElementById(
        "totalCategories"
    );


let products = [];


// ===============================
// AUTH
// ===============================

function getToken() {

    return localStorage.getItem(
        "shopnova_admin_token"
    );
}


function setToken(token) {

    localStorage.setItem(
        "shopnova_admin_token",
        token
    );
}


function removeToken() {

    localStorage.removeItem(
        "shopnova_admin_token"
    );
}


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        loginMessage.textContent =
            "Logging in...";


        const value =
            loginValue.value.trim();

        const password =
            loginPassword.value;


        const body =
            value.includes("@")
                ? {
                    email: value,
                    password
                }
                : {
                    username: value,
                    password
                };


        try {

            const response =
                await fetch(
                    "/api/admin/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Login failed."
                );
            }


            setToken(data.token);

            showDashboard();

        } catch (error) {

            loginMessage.textContent =
                error.message;

        }

    }
);


// ===============================
// SHOW DASHBOARD
// ===============================

function showDashboard() {

    loginPage.classList.add("hidden");

    dashboardPage.classList.remove(
        "hidden"
    );

    loadDashboard();
}


// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener(
    "click",
    () => {

        removeToken();

        dashboardPage.classList.add(
            "hidden"
        );

        loginPage.classList.remove(
            "hidden"
        );

        loginForm.reset();
    }
);


// ===============================
// API HEADERS
// ===============================

function authHeaders() {

    return {
        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${getToken()}`
    };
}


// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    await loadStats();

    await loadProducts();
}


// ===============================
// LOAD STATS
// ===============================

async function loadStats() {

    try {

        const response =
            await fetch(
                "/api/admin/stats",
                {
                    headers:
                        authHeaders()
                }
            );


        if (response.status === 401) {
            handleUnauthorized();
            return;
        }


        const data =
            await response.json();


        totalProducts.textContent =
            data.stats.totalProducts;

        totalStock.textContent =
            data.stats.totalStock;

        totalCategories.textContent =
            data.stats.totalCategories;

    } catch (error) {

        console.error(error);

    }
}


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "/api/products"
            );


        const data =
            await response.json();


        products =
            data.products || [];


        renderAdminProducts();

    } catch (error) {

        console.error(error);

    }
}


// ===============================
// RENDER PRODUCTS
// ===============================

function renderAdminProducts() {

    if (!products.length) {

        adminProducts.innerHTML = `
            <p>
                No products available.
            </p>
        `;

        return;
    }


    adminProducts.innerHTML =
        products.map(product => `

            <div class="admin-product">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >


                <div class="admin-product-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p>
                        ${escapeHTML(product.category)}
                        • Stock:
                        ${product.stock}
                    </p>

                    <div class="product-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>

                </div>


                <div class="product-actions">

                    <button
                        class="edit-btn"
                        onclick="editProduct(${product.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("");
}


// ===============================
// ADD / EDIT PRODUCT
// ===============================

productForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const id =
            productId.value;


        const productData = {

            name:
                productName.value.trim(),

            price:
                Number(productPrice.value),

            category:
                productCategory.value.trim(),

            image:
                productImage.value.trim(),

            description:
                productDescription.value.trim(),

            stock:
                Number(productStock.value)

        };


        try {

            let response;


            if (id) {

                response =
                    await fetch(
                        `/api/products/${id}`,
                        {
                            method: "PUT",

                            headers:
                                authHeaders(),

                            body:
                                JSON.stringify(
                                    productData
                                )
                        }
                    );

            } else {

                response =
                    await fetch(
                        "/api/products",
                        {
                            method: "POST",

                            headers:
                                authHeaders(),

                            body:
                                JSON.stringify(
                                    productData
                                )
                        }
                    );
            }


            if (response.status === 401) {

                handleUnauthorized();

                return;
            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Operation failed."
                );
            }


            productMessage.textContent =
                data.message;


            resetForm();

            await loadDashboard();


        } catch (error) {

            productMessage.textContent =
                error.message;

        }

    }
);


// ===============================
// EDIT PRODUCT
// ===============================

window.editProduct =
    function(id) {

        const product =
            products.find(
                item => item.id === id
            );


        if (!product) {
            return;
        }


        productId.value =
            product.id;

        productName.value =
            product.name;

        productPrice.value =
            product.price;

        productCategory.value =
            product.category;

        productImage.value =
            product.image;

        productDescription.value =
            product.description;

        productStock.value =
            product.stock;


        submitProductBtn.textContent =
            "Update Product";

        cancelEditBtn.classList.remove(
            "hidden"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


// ===============================
// DELETE PRODUCT
// ===============================

window.deleteProduct =
    async function(id) {

        const product =
            products.find(
                item => item.id === id
            );


        if (!product) {
            return;
        }


        const confirmed =
            confirm(
                `Delete "${product.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/products/${id}`,
                    {
                        method: "DELETE",

                        headers:
                            authHeaders()
                    }
                );


            if (response.status === 401) {

                handleUnauthorized();

                return;
            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message
                );
            }


            await loadDashboard();


        } catch (error) {

            alert(
                error.message
            );

        }

    };


// ===============================
// CANCEL EDIT
// ===============================

cancelEditBtn.addEventListener(
    "click",
    resetForm
);


// ===============================
// RESET FORM
// ===============================

function resetForm() {

    productForm.reset();

    productId.value = "";

    submitProductBtn.textContent =
        "Add Product";

    cancelEditBtn.classList.add(
        "hidden"
    );
}


// ===============================
// UNAUTHORIZED
// ===============================

function handleUnauthorized() {

    removeToken();

    dashboardPage.classList.add(
        "hidden"
    );

    loginPage.classList.remove(
        "hidden"
    );

    loginMessage.textContent =
        "Session expired. Please login again.";
}


// ===============================
// HTML ESCAPE
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// AUTO LOGIN
// ===============================

if (getToken()) {

    showDashboard();

}
