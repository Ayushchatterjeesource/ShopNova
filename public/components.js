function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// HOME
// ===============================

export function renderHome(products) {

    const featured =
        products.slice(0, 4);

    return `

        <section class="hero">

            <h1>
                Welcome to
                <span>ShopNova</span>
            </h1>

            <p>
                Discover quality products,
                great prices and a simple
                modern shopping experience.
            </p>

            <a
                href="#/products"
                class="hero-btn"
            >
                Explore Products
            </a>

        </section>


        <div class="section-title">

            <h2>
                Featured Products
            </h2>

            <a href="#/products">
                View All →
            </a>

        </div>


        ${renderProductGrid(featured)}

    `;
}


// ===============================
// PRODUCT GRID
// ===============================

export function renderProductGrid(products) {

    if (!products.length) {

        return `
            <div class="empty">
                <h3>No products found</h3>

                <p>
                    Try another search.
                </p>
            </div>
        `;
    }

    return `

        <div class="products-grid">

            ${products
                .map(renderProductCard)
                .join("")}

        </div>
    `;
}


// ===============================
// PRODUCT CARD
// ===============================

export function renderProductCard(product) {

    return `

        <article class="product-card">

            <a href="#/product/${product.id}">

                <img
                    class="product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

            </a>


            <div class="product-content">

                <div class="product-category">
                    ${escapeHTML(product.category)}
                </div>

                <h3 class="product-title">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>


                <div class="product-bottom">

                    <span class="price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </span>

                    <button
                        class="btn btn-primary add-cart"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `;
}


// ===============================
// PRODUCTS PAGE
// ===============================

export function renderProducts(products) {

    return `

        <div class="section-title">

            <h2>
                All Products
            </h2>

            <span>
                ${products.length} products
            </span>

        </div>

        ${renderProductGrid(products)}

    `;
}


// ===============================
// PRODUCT DETAILS
// ===============================

export function renderProductDetails(product) {

    if (!product) {

        return `
            <div class="empty">
                <h2>Product not found</h2>

                <a href="#/products">
                    Back to Products
                </a>
            </div>
        `;
    }

    return `

        <section class="details">

            <div>

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >

            </div>


            <div class="details-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h1>
                    ${escapeHTML(product.name)}
                </h1>

                <div class="price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </div>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="stock">
                    ${product.stock > 0
                        ? `${product.stock} items available`
                        : "Out of stock"}
                </div>

                <div>

                    <button
                        class="btn btn-primary add-cart"
                        data-id="${product.id}"
                        ${product.stock <= 0 ? "disabled" : ""}
                    >
                        Add to Cart
                    </button>

                    <a
                        href="#/products"
                        class="btn btn-secondary"
                    >
                        Back
                    </a>

                </div>

            </div>

        </section>

    `;
}


// ===============================
// CART
// ===============================

export function renderCart(cart) {

    if (!cart.length) {

        return `

            <div class="empty">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some products to
                    start shopping.
                </p>

                <br>

                <a
                    href="#/products"
                    class="btn btn-primary"
                >
                    Browse Products
                </a>

            </div>

        `;
    }


    const total =
        cart.reduce(
            (sum, product) =>
                sum +
                Number(product.price),
            0
        );


    return `

        <section class="cart-page">

            <div class="section-title">

                <h2>
                    Shopping Cart
                </h2>

            </div>


            ${cart.map(product => `

                <div class="cart-item">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >


                    <div class="cart-info">

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <p>
                            ${escapeHTML(product.category)}
                        </p>

                        <strong>
                            ₹${Number(product.price).toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <button
                        class="remove-btn remove-cart"
                        data-id="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            `).join("")}


            <div class="cart-total">

                Total:
                ₹${total.toLocaleString("en-IN")}

            </div>

        </section>

    `;
}
