/**
 * MAIN APPLICATION - Initialize all systems and components
 */

class UnicofApp {
  constructor() {
    this.init();
  }

  // Initialize app
  init() {
    console.log('🚀 Initializing Unicof Application...');
    
    this.setupEventListeners();
    this.setupMobileMenu();
    this.setupCart();
    this.setupProducts();
    this.setupSearch();
    this.setupScroll();
    this.setupTheme();
    this.setupNotifications();
    
    console.log('✅ Application initialized successfully');
  }

  // Setup event listeners
  setupEventListeners() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        categoryFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        const category = filter.dataset.category || 'all';
        productManager.filterByCategory(category);
        analytics.trackCategoryFilter(category);
      });
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          productManager.searchProducts(e.target.value);
          if (e.target.value) {
            analytics.trackSearch(e.target.value);
          }
        }, 300);
      });
    }

    // Cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => this.openCart());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }

    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => this.handleClearCart());
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletter(e));
    }
  }

  // Setup mobile menu
  setupMobileMenu() {
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuBtn && nav) {
      menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
      });

      // Close menu on link click
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          menuBtn.classList.remove('active');
        });
      });
    }
  }

  // Setup cart
  setupCart() {
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'none';
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  }

  // Setup products
  setupProducts() {
    productManager.renderProducts();
  }

  // Setup search
  setupSearch() {
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.getElementById('search-input');

    if (searchIcon && searchInput) {
      searchIcon.addEventListener('click', () => {
        searchInput.focus();
      });
    }
  }

  // Setup scroll
  setupScroll() {
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollTopBtn.style.display = 'block';
        } else {
          scrollTopBtn.style.display = 'none';
        }
      });

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Setup theme toggle
  setupTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = userBehavior.preferences.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        userBehavior.setTheme(newTheme);
      });
    }
  }

  // Setup notifications
  setupNotifications() {
    // Show welcome message for new users
    if (!localStorage.getItem('unicof_visited')) {
      setTimeout(() => {
        notificationSystem.showToast('👋 Selamat datang di Unicof! Nikmati kopi premium kami', 'info', 5000);
        localStorage.setItem('unicof_visited', 'true');
      }, 2000);
    }

    // Show promotional notification
    setTimeout(() => {
      notificationSystem.showPromotion(
        '🎉 Promo Spesial',
        'Beli 2 gratis 1 untuk semua minuman hari ini!',
        'Lihat Promo',
        '#menu'
      );
    }, 5000);
  }

  // Open cart
  openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
      cartModal.style.display = 'block';
      analytics.trackEvent('cart_opened');
    }
  }

  // Handle checkout
  handleCheckout() {
    if (cartManager.cart.length === 0) {
      notificationSystem.showToast('Keranjang Anda kosong', 'warning');
      return;
    }

    const checkoutData = cartManager.getCheckoutData();
    analytics.trackCheckout(checkoutData.total, checkoutData.itemCount);

    notificationSystem.showModal(
      'Konfirmasi Pesanan',
      `Total: Rp ${checkoutData.total.toLocaleString('id-ID')}\n\nLanjutkan ke pembayaran?`,
      'info',
      ['Lanjutkan', 'Batal']
    ).then((choice) => {
      if (choice === 0) {
        this.processCheckout(checkoutData);
      }
    });
  }

  // Process checkout
  processCheckout(checkoutData) {
    const orderId = 'ORD-' + Date.now();
    
    notificationSystem.showLoading('Memproses pesanan...', 3000);

    setTimeout(() => {
      analytics.trackPurchase(orderId, checkoutData.total, checkoutData.itemCount);
      notificationSystem.showToast('✅ Pesanan berhasil! ID: ' + orderId, 'success');
      
      // Simulate order status updates
      this.simulateOrderStatus(orderId);
      
      cartManager.clearCart();
      const cartModal = document.getElementById('cart-modal');
      if (cartModal) cartModal.style.display = 'none';
    }, 2000);
  }

  // Simulate order status
  simulateOrderStatus(orderId) {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    let currentStatus = 0;

    const statusInterval = setInterval(() => {
      if (currentStatus < statuses.length) {
        notificationSystem.showOrderNotification(orderId, statuses[currentStatus]);
        currentStatus++;
      } else {
        clearInterval(statusInterval);
      }
    }, 3000);
  }

  // Handle clear cart
  handleClearCart() {
    notificationSystem.showModal(
      'Kosongkan Keranjang',
      'Apakah Anda yakin ingin mengosongkan keranjang?',
      'warning',
      ['Ya, Kosongkan', 'Batal']
    ).then((choice) => {
      if (choice === 0) {
        cartManager.clearCart();
      }
    });
  }

  // Handle newsletter
  handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email) {
      notificationSystem.showToast('Masukkan email yang valid', 'error');
      return;
    }

    analytics.trackFormSubmit('newsletter');
    notificationSystem.showToast('Terima kasih! Cek email untuk kode diskon', 'success');
    e.target.reset();
  }

  // Show performance stats
  showPerformanceStats() {
    console.group('📊 Unicof Performance Stats');
    console.log('Performance Score:', performanceMonitor.getPerformanceScore() + '/100');
    console.log('User Engagement:', userBehavior.getEngagementScore() + '/100');
    console.log('SEO Score:', seoOptimizer.getSEOScore() + '/100');
    console.log('Analytics Events:', analytics.events.length);
    console.log('Cart Items:', cartManager.getItemsCount());
    console.groupEnd();
  }

  // Show app info
  showAppInfo() {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║         🚀 UNICOF APPLICATION 🚀          ║
    ║    Premium Coffee & Snack Delivery         ║
    ╚════════════════════════════════════════════╝
    
    Modules Loaded:
    ✅ Cart Manager
    ✅ Product Manager
    ✅ Analytics System
    ✅ Performance Monitor
    ✅ User Behavior Tracker
    ✅ Notification System
    ✅ SEO Optimizer
    
    Available Commands:
    • app.showPerformanceStats()
    • app.showAppInfo()
    • analytics.generateReport()
    • performanceMonitor.generateReport()
    • userBehavior.generateReport()
    • seoOptimizer.generateSEOReport()
    
    Version: 1.0.0
    Last Updated: 2025
    `);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new UnicofApp();
  app.showAppInfo();
});

// Export for global use
window.UnicofApp = UnicofApp;

