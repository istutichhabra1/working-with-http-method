document.getElementById('search-btn').addEventListener('click', fetchProducts);

async function fetchProducts() {
    const category = document.getElementById('category').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const productsContainer = document.getElementById('products');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error');

    productsContainer.innerHTML = '';
    errorMsg.classList.add('hidden');
    loading.classList.remove('hidden');

    let apiUrl = `https://mockapi.io/products?category=${category}`;
    if (minPrice) apiUrl += `&min_price=${minPrice}`;
    if (maxPrice) apiUrl += `&max_price=${maxPrice}`;
    apiUrl += `&sort=asc`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const products = await response.json();
        loading.classList.add('hidden');
        displayProducts(products);
    } catch (error) {
        loading.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}

function displayProducts(products) {
    const container = document.getElementById('products');
    container.innerHTML = products.length
        ? products.map(productToHTML).join('')
        : '<p>No products found</p>';
}

function productToHTML(product) {
    return `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
        </div>
    `;
}
