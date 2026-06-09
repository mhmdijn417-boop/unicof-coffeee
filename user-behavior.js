/**
 * USER BEHAVIOR TRACKING - Engagement & UX Optimization
 * Tracks user interactions, engagement patterns, and personalization
 */

class UserBehaviorTracker {
  constructor() {
    this.userProfile = this.loadUserProfile();
    this.interactions = [];
    this.preferences = {
      favoriteCategories: [],
      viewedProducts: [],
      lastViewedProducts: [],
      theme: this.getThemePreference(),
      language: navigator.language || 'id-ID'
    };
    this.initializeTracking();
  }

  // Initialize behavior tracking
  initializeTracking() {
    // Track clicks
    document.addEventListener('click', (e) => this.trackClick(e), true);

    // Track hover
    document.addEventListener('mouseover', (e) => this.trackHover(e), true);

    // Track form input
    document.addEventListener('input', (e) => this.trackInput(e), true);

    // Track scroll behavior
    this.trackScrollBehavior();

    // Save preferences
    this.savePreferences();
  }

  // Load user profile
  loadUserProfile() {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : this.createNewProfile();
  }

  // Create new user profile
  createNewProfile() {
    return {
      userId: this.generateUserId(),
      firstVisit: new Date().toISOString(),
      visitCount: 1,
      totalSpent: 0,
      preferences: {},
      deviceInfo: {
        type: this.getDeviceType(),
        browser: this.getBrowserInfo(),
        os: navigator.platform
      }
    };
  }

  // Generate unique user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get device type
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobile|Android/.test(ua)) return 'mobile';
    if (/Tablet|iPad/.test(ua)) return 'tablet';
    return 'desktop';
  }

  // Get browser info
  getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    return 'Other';
  }

  // Track click events
  trackClick(e) {
    const target = e.target;
    const clickData = {
      timestamp: new Date().toISOString(),
      element: target.tagName,
      class: target.className,
      text: target.textContent?.substring(0, 50),
      url: window.location.href
    };

    this.interactions.push({
      type: 'click',
      data: clickData
    });

    // Track specific clicks
    if (target.classList.contains('add-to-cart-btn')) {
      this.trackProductInteraction('add_to_cart', target);
    }
    if (target.classList.contains('category-filter')) {
      this.trackCategoryInteraction(target.dataset.category);
    }
  }

  // Track hover events
  trackHover(e) {
    const target = e.target;
    
    if (target.classList.contains('product-card')) {
      this.interactions.push({
        type: 'hover',
        data: {
          element: 'product_card',
          productId: target.dataset.productId,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  // Track input events (searches, form fields)
  trackInput(e) {
    const target = e.target;
    
    if (target.id === 'search-input') {
      this.interactions.push({
        type: 'search',
        data: {
          query: target.value,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  // Track scroll behavior
  trackScrollBehavior() {
    let scrollTimeout;
    let scrollDistance = 0;

    window.addEventListener('scroll', () => {
      scrollDistance = window.scrollY;
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        this.interactions.push({
          type: 'scroll',
          data: {
            scrollY: scrollDistance,
            pageHeight: document.documentElement.scrollHeight,
            timestamp: new Date().toISOString()
          }
        });
      }, 500);
    });
  }

  // Track product interaction
  trackProductInteraction(action, element) {
    const productCard = element.closest('.product-card');
    if (!productCard) return;

    const productId = productCard.dataset.productId;
    
    // Add to viewed products
    if (!this.preferences.viewedProducts.includes(productId)) {
      this.preferences.viewedProducts.push(productId);
      if (this.preferences.viewedProducts.length > 20) {
        this.preferences.viewedProducts.shift();
      }
    }
    
    // Update last viewed
    this.preferences.lastViewedProducts.unshift(productId);
    if (this.preferences.lastViewedProducts.length > 5) {
      this.preferences.lastViewedProducts.pop();
    }
  }

  // Track category interaction
  trackCategoryInteraction(category) {
    if (!this.preferences.favoriteCategories.includes(category)) {
      this.preferences.favoriteCategories.push(category);
    }
  }

  // Get theme preference
  getThemePreference() {
    const saved = localStorage.getItem('theme_preference');
    if (saved) return saved;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Set theme
  setTheme(theme) {
    this.preferences.theme = theme;
    localStorage.setItem('theme_preference', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }

  // Save preferences
  savePreferences() {
    localStorage.setItem('user_preferences', JSON.stringify(this.preferences));
    localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
  }

  // Get personalized recommendations
  getRecommendations() {
    const recommendations = [];
    
    // Based on favorite categories
    if (this.preferences.favoriteCategories.length > 0) {
      const category = this.preferences.favoriteCategories[this.preferences.favoriteCategories.length - 1];
      recommendations.push({
        type: 'category_based',
        category: category,
        message: `Produk baru di kategori ${category}`
      });
    }

    // Based on viewed products
    if (this.preferences.viewedProducts.length > 0) {
      recommendations.push({
        type: 'similar_products',
        message: 'Produk serupa yang mungkin Anda suka'
      });
    }

    // Based on behavior patterns
    if (this.interactions.length > 50) {
      recommendations.push({
        type: 'loyalty',
        message: 'Dapatkan diskon khusus member setia!'
      });
    }

    return recommendations;
  }

  // Get user engagement score
  getEngagementScore() {
    let score = 0;

    // Based on interactions
    score += Math.min(this.interactions.length * 0.5, 20);

    // Based on products viewed
    score += Math.min(this.preferences.viewedProducts.length * 1, 20);

    // Based on categories explored
    score += Math.min(this.preferences.favoriteCategories.length * 5, 20);

    // Based on visit count
    score += Math.min(this.userProfile.visitCount * 2, 20);

    // Based on time on site
    const sessionTime = Math.round((Date.now() - new Date(this.userProfile.firstVisit).getTime()) / 1000 / 60);
    score += Math.min(sessionTime, 20);

    return Math.round(score);
  }

  // Generate user behavior report
  generateReport() {
    const report = {
      userId: this.userProfile.userId,
      deviceInfo: this.userProfile.deviceInfo,
      preferences: this.preferences,
      engagementScore: this.getEngagementScore(),
      totalInteractions: this.interactions.length,
      viewedProducts: this.preferences.viewedProducts.length,
      favoriteCategories: this.preferences.favoriteCategories,
      recommendations: this.getRecommendations(),
      generatedAt: new Date().toISOString()
    };

    console.log('[User Behavior Report]', report);
    return report;
  }

  // Get user segmentation
  getSegmentation() {
    const score = this.getEngagementScore();
    
    if (score > 80) return 'VIP Customer';
    if (score > 60) return 'Loyal Customer';
    if (score > 40) return 'Active User';
    if (score > 20) return 'Regular Visitor';
    return 'New Visitor';
  }
}

// Initialize user behavior tracker
const userBehavior = new UserBehaviorTracker();
