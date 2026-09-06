import {
    getProducts,
    getProductById,
    searchProducts
} from "./products.js";

import {
    renderHome,
    renderProducts,
    renderProductDetails,
    renderCart
} from "./components.js";

import {
    getRoute
} from "./router.js";


const app =
    document.getElementById("app");

const cartCount =
    document.getElementById("cartCount");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");


let products = [];

let cart =
    JSON.parse(
        localStorage.getItem(
            "shopnova_cart"
        ) || "[]"
    );


// ===============================
// CART STORAGE
// ===============================

function saveCart() {

    localStorage.setItem(
        "shopnova_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    cartCount.textContent =
        cart.length;
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id) {

    const product =
        products.find(
            item => item.id === Number(id)
        );

    if (!product) {
        return;
    }


    const alreadyExists =
        cart.some(
            item => item.id === product.id
        );

    if (alreadyExists) {

        alert(
            "This product is already in your cart."
        );

        return;
    }


    cart.push(product);

    saveCart();

    alert(
        `${product.name} added to cart.`
    );
}


// ===============================
// REMOVE CART
// ===============================

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== Number(id)
        );

    saveCart();

    render();
}


// ===============================
// EVENT HANDLER
// ===============================

document.addEventListener(
    "click",
    event => {

        const addButton =
            event.target.closest(
                ".add-cart"
            );

        if (addButton) {

            const id =
                addButton.dataset.id;

            addToCart(id);

            return;
        }


        const removeButton =
            event.target.closest(
                ".remove-cart"
            );

        if (removeButton) {

            const id =
                removeButton.dataset.id;

            removeFromCart(id);

            return;
        }

    }
);


// ===============================
// SEARCH
// ===============================

function performSearch() {

    const query =
        searchInput.value;

    const results =
        searchProducts(
            products,
            query
        );

    window.location.hash =
        "#/products";

    app.innerHTML =
        renderProducts(results);
}


searchBtn.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            performSearch();
        }

    }
);


// ===============================
// RENDER
// ===============================

async function render() {

    const route =
        getRoute();


    if (route.page === "home") {

        app.innerHTML =
            renderHome(products);

        return;
    }


    if (route.page === "products") {

        const query =
            searchInput.value;

        const results =
            searchProducts(
                products,
                query
            );

        app.innerHTML =
            renderProducts(results);

        return;
    }


    if (route.page === "product") {

        const product =
            await getProductById(
                route.id
            );

        app.innerHTML =
            renderProductDetails(product);

        return;
    }


    if (route.page === "cart") {

        app.innerHTML =
            renderCart(cart);

        return;
    }

}


// ===============================
// INITIALIZE
// ===============================

async function init() {

    products =
        await getProducts();

    updateCartCount();

    await render();
}


window.addEventListener(
    "hashchange",
    render
);


init();
