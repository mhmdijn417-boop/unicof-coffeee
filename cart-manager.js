/**
 * CART MANAGER - Advanced Shopping Cart System
 * Manages cart with localStorage, persists data, real-time calculations
 */

class CartManager {
  constructor() {
    this.cartKey = 'unicof_cart';
    this.cart = this.loadCart();
    this.updateCartUI();
  }

  // Load cart from localStorage
  loadCart() {
    const saved = localStorage.getItem(this.cartKey);
    return saved ? JSON.parse(saved) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        category: product.category,
        timestamp: Date.now()
      });
    }
    
    this.saveCart();
    this.updateCartUI();
    this.showNotification(`${product.name} ditambahkan ke keranjang!`, 'success');
  }

  // Remove item from cart
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }

  // Update quantity
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  // Get cart total
  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart items count
  getItemsCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartUI();
    this.showNotification('Keranjang telah dikosongkan', 'info');
  }

  // Update cart UI elements
  updateCartUI() {
    const cartIcon = document.querySelector('.cart-icon span');
    const cartCount = this.getItemsCount();
    
    if (cartIcon) {
      cartIcon.textContent = cartCount;
      cartIcon.style.display = cartCount > 0 ? 'block' : 'none';
    }

    this.updateCartModal();
  }

  // Update cart modal display
  updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItems) return;

    if (this.cart.length === 0) {
      cartItems.innerHTML = '';
      if (emptyCart) emptyCart.style.display = 'block';
      if (cartTotal) cartTotal.innerHTML = 'Rp 0';
      return;
    }

    if (emptyCart) emptyCart.style.display = 'none';

    cartItems.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="price">Rp ${item.price.toLocaleString('id-ID')}</p>
          <div class="quantity-control">
            <button class="qty-btn minus" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
            <span class="qty">${item.quantity}</span>
            <button class="qty-btn plus" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="cartManager.removeItem('${item.id}')">✕</button>
      </div>
    `).join('');

    if (cartTotal) {
      cartTotal.innerHTML = `Rp ${this.getTotal().toLocaleString('id-ID')}`;
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 4000);
  }

  // Export cart data for checkout
  getCheckoutData() {
    return {
      items: this.cart,
      total: this.getTotal(),
      itemCount: this.getItemsCount(),
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize cart manager
const cartManager = new CartManager();
