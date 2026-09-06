export function getRoute() {

    const hash = window.location.hash || "#/";

    const cleanHash = hash.replace("#", "");

    if (
        cleanHash === "" ||
        cleanHash === "/"
    ) {
        return {
            page: "home"
        };
    }

    if (cleanHash === "/products") {
        return {
            page: "products"
        };
    }

    if (cleanHash === "/cart") {
        return {
            page: "cart"
        };
    }

    if (cleanHash.startsWith("/product/")) {

        const id =
            cleanHash.split("/")[2];

        return {
            page: "product",
            id: Number(id)
        };
    }

    return {
        page: "home"
    };
}
