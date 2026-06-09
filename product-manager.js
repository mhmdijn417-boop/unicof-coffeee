/**
 * PRODUCT MANAGER - Dynamic Menu Management
 * Handles menu items, filtering, searching, and dynamic rendering
 */

class ProductManager {
  constructor() {
    this.products = this.initializeProducts();
    this.filteredProducts = this.products;
    this.currentCategory = 'all';
    this.currentSearch = '';
  }

  // Initialize products database
  initializeProducts() {
    return [
      // COFFEE CATEGORY
      {
        id: 'coffee-1',
        name: 'Espresso',
        price: 25000,
        category: 'coffee',
        image: 'images/espresso.jpg',
        description: 'Espresso murni dengan cita rasa kuat dan pekat',
        badge: 'Bestseller',
        rating: 4.8,
        reviews: 245
      },
      {
        id: 'coffee-2',
        name: 'Cappuccino',
        price: 35000,
        category: 'coffee',
        image: 'images/cappuccino.jpg',
        description: 'Kombinasi sempurna espresso, steamed milk, dan foam',
        badge: 'Favorit',
        rating: 4.9,
        reviews: 312
      },
      {
        id: 'coffee-3',
        name: 'Latte',
        price: 40000,
        category: 'coffee',
        image: 'images/latte.jpg',
        description: 'Creamy dan smooth dengan milk foam yang lembut',
        badge: null,
        rating: 4.7,
        reviews: 198
      },
      {
        id: 'coffee-4',
        name: 'Americano',
        price: 30000,
        category: 'coffee',
        image: 'images/americano.jpg',
        description: 'Espresso yang dipanjangkan dengan air panas',
        badge: null,
        rating: 4.6,
        reviews: 156
      },
      {
        id: 'coffee-5',
        name: 'Macchiato',
        price: 38000,
        category: 'coffee',
        image: 'images/macchiato.jpg',
        description: 'Espresso dengan sedikit milk foam yang artistik',
        badge: 'Baru',
        rating: 4.8,
        reviews: 89
      },
      {
        id: 'coffee-6',
        name: 'Flat White',
        price: 42000,
        category: 'coffee',
        image: 'images/flat-white.jpg',
        description: 'Smooth microfoam milk dengan espresso yang balanced',
        badge: null,
        rating: 4.9,
        reviews: 203
      },

      // NON-COFFEE CATEGORY
      {
        id: 'noncoffee-1',
        name: 'Matcha Latte',
        price: 45000,
        category: 'non-coffee',
        image: 'images/matcha-latte.jpg',
        description: 'Matcha premium dengan susu hangat yang creamy',
        badge: 'Favorit',
        rating: 4.7,
        reviews: 178
      },
      {
        id: 'noncoffee-2',
        name: 'Iced Tea',
        price: 20000,
        category: 'non-coffee',
        image: 'images/iced-tea.jpg',
        description: 'Teh dingin segar dengan citarasa yang natural',
        badge: null,
        rating: 4.5,
        reviews: 134
      },
      {
        id: 'noncoffee-3',
        name: 'Smoothie Bowl',
        price: 50000,
        category: 'non-coffee',
        image: 'images/smoothie-bowl.jpg',
        description: 'Smoothie kental dengan topping buah dan granola',
        badge: 'Baru',
        rating: 4.8,
        reviews: 92
      },
      {
        id: 'noncoffee-4',
        name: 'Milkshake',
        price: 35000,
        category: 'non-coffee',
        image: 'images/milkshake.jpg',
        description: 'Milkshake creamy dengan berbagai pilihan flavor',
        badge: null,
        rating: 4.6,
        reviews: 201
      },

      // SNACK CATEGORY
      {
        id: 'snack-1',
        name: 'Croissant',
        price: 28000,
        category: 'snack',
        image: 'images/croissant.jpg',
        description: 'Croissant butter yang crispy dan berlapis',
        badge: 'Bestseller',
        rating: 4.9,
        reviews: 267
      },
      {
        id: 'snack-2',
        name: 'Donut Glazed',
        price: 22000,
        category: 'snack',
        image: 'images/donut.jpg',
        description: 'Donut empuk dengan glazed coating yang manis',
        badge: null,
        rating: 4.7,
        reviews: 145
      },
      {
        id: 'snack-3',
        name: 'Chocolate Cake',
        price: 35000,
        category: 'snack',
        image: 'images/cake.jpg',
        description: 'Kue coklat moist dengan frosting yang lezat',
        badge: 'Favorit',
        rating: 4.9,
        reviews: 289
      },
      {
        id: 'snack-4',
        name: 'Blueberry Muffin',
        price: 32000,
        category: 'snack',
        image: 'images/muffin.jpg',
        description: 'Muffin lembut dengan blueberry fresh di dalamnya',
        badge: null,
        rating: 4.6,
        reviews: 118
      },
      {
        id: 'snack-5',
        name: 'Sandwich Ham & Cheese',
        price: 38000,
        category: 'snack',
        image: 'images/sandwich.jpg',
        description: 'Sandwich premium dengan ham dan cheese berkualitas',
        badge: 'Baru',
        rating: 4.8,
        reviews: 76
      },
      {
        id: 'snack-6',
        name: 'Tiramisu Cup',
        price: 45000,
        category: 'snack',
        image: 'images/tiramisu.jpg',
        description: 'Tiramisu tradisional Italia dalam cup mewah',
        badge: null,
        rating: 4.9,
        reviews: 234
      }
    ];
  }

  // Filter by category
  filterByCategory(category) {
    this.currentCategory = category;
    this.applyFilters();
  }

  // Search products
  searchProducts(query) {
    this.currentSearch = query.toLowerCase();
    this.applyFilters();
  }

  // Apply all filters
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchCategory = this.currentCategory === 'all' || product.category === this.currentCategory;
      const matchSearch = product.name.toLowerCase().includes(this.currentSearch) ||
                         product.description.toLowerCase().includes(this.currentSearch);
      return matchCategory && matchSearch;
    });
    
    this.renderProducts();
  }

  // Render products
  renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="no-products">
          <p>Produk tidak ditemukan</p>
          <small>Coba ubah filter atau search term Anda</small>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredProducts.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${product.badge ? `<div class="badge">${product.badge}</div>` : ''}
          <div class="product-rating">
            <span class="stars">★</span>
            <span class="rating-value">${product.rating}</span>
            <span class="reviews">(${product.reviews})</span>
          </div>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="description">${product.description}</p>
          <div class="product-footer">
            <span class="price">Rp ${product.price.toLocaleString('id-ID')}</span>
            <button class="add-to-cart-btn" onclick="productManager.addToCart('${product.id}')">
              + Keranjang
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Add to cart
  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      cartManager.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
    }
  }

  // Get product details
  getProduct(productId) {
    return this.products.find(p => p.id === productId);
  }

  // Get all products by category
  getProductsByCategory(category) {
    return this.products.filter(p => p.category === category);
  }

  // Get featured products (with badges)
  getFeaturedProducts() {
    return this.products.filter(p => p.badge !== null).slice(0, 6);
  }
}

// Initialize product manager
const productManager = new ProductManager();
