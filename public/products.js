let productsCache = [];


export async function getProducts() {

    try {

        const response =
            await fetch("/api/products");

        const data =
            await response.json();

        if (!data.success) {
            throw new Error(
                "Unable to load products."
            );
        }

        productsCache = data.products;

        return productsCache;

    } catch (error) {

        console.error(error);

        return [];
    }
}


export async function getProductById(id) {

    try {

        const response =
            await fetch(`/api/products/${id}`);

        const data =
            await response.json();

        if (!data.success) {
            return null;
        }

        return data.product;

    } catch (error) {

        console.error(error);

        return null;
    }
}


export function searchProducts(
    products,
    query
) {

    const search =
        query.trim().toLowerCase();

    if (!search) {
        return products;
    }

    return products.filter(product => {

        return (
            product.name
                .toLowerCase()
                .includes(search) ||

            product.category
                .toLowerCase()
                .includes(search) ||

            product.description
                .toLowerCase()
                .includes(search)
        );
    });
}
