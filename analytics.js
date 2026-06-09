/**
 * ANALYTICS SYSTEM - Track User Behavior & Conversions
 * Monitors user interactions, page views, and conversion events
 */

class AnalyticsSystem {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.events = [];
    this.pageViews = [];
    this.startSession();
  }

  // Generate unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track page view
  trackPageView(pageName) {
    const pageView = {
      sessionId: this.sessionId,
      page: pageName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.pageViews.push(pageView);
    console.log('[Analytics] Page View:', pageName);
    this.saveAnalytics();
  }

  // Track custom event
  trackEvent(eventName, eventData = {}) {
    const event = {
      sessionId: this.sessionId,
      eventName: eventName,
      eventData: eventData,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    this.events.push(event);
    console.log('[Analytics] Event:', eventName, eventData);
    this.saveAnalytics();
  }

  // Track product view
  trackProductView(productId, productName) {
    this.trackEvent('product_view', {
      productId: productId,
      productName: productName
    });
  }

  // Track add to cart
  trackAddToCart(productId, productName, price, quantity) {
    this.trackEvent('add_to_cart', {
      productId: productId,
      productName: productName,
      price: price,
      quantity: quantity
    });
  }

  // Track checkout
  trackCheckout(total, itemCount) {
    this.trackEvent('checkout_initiated', {
      total: total,
      itemCount: itemCount
    });
  }

  // Track purchase
  trackPurchase(orderId, total, itemCount) {
    this.trackEvent('purchase_completed', {
      orderId: orderId,
      total: total,
      itemCount: itemCount
    });
  }

  // Track form submission
  trackFormSubmit(formName) {
    this.trackEvent('form_submitted', {
      formName: formName
    });
  }

  // Track search
  trackSearch(query) {
    this.trackEvent('search', {
      query: query
    });
  }

  // Track category filter
  trackCategoryFilter(category) {
    this.trackEvent('category_filter', {
      category: category
    });
  }

  // Track button click
  trackButtonClick(buttonName) {
    this.trackEvent('button_click', {
      button: buttonName
    });
  }

  // Track scroll depth
  trackScrollDepth(percentage) {
    this.trackEvent('scroll_depth', {
      percentage: percentage
    });
  }

  // Start session tracking
  startSession() {
    this.trackPageView(document.title);
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
        if (maxScroll % 25 === 0) {
          this.trackScrollDepth(Math.round(maxScroll));
        }
      }
    });

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('session_pause');
      } else {
        this.trackEvent('session_resume');
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Math.round((Date.now() - this.sessionStart) / 1000);
      this.trackEvent('session_end', {
        duration: sessionDuration
      });
      this.saveAnalytics();
    });
  }

  // Save analytics to localStorage
  saveAnalytics() {
    const analyticsData = {
      sessionId: this.sessionId,
      sessionStart: this.sessionStart,
      events: this.events,
      pageViews: this.pageViews
    };
    localStorage.setItem('analytics_' + this.sessionId, JSON.stringify(analyticsData));
  }

  // Get session analytics
  getSessionAnalytics() {
    return {
      sessionId: this.sessionId,
      duration: Math.round((Date.now() - this.sessionStart) / 1000),
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      lastActivity: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null
    };
  }

  // Generate analytics report
  generateReport() {
    const report = {
      sessionId: this.sessionId,
      sessionDuration: Math.round((Date.now() - this.sessionStart) / 1000),
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      eventsByType: this.groupEventsByType(),
      topProducts: this.getTopProducts(),
      conversionData: this.getConversionData(),
      generatedAt: new Date().toISOString()
    };
    
    console.log('[Analytics Report]', report);
    return report;
  }

  // Group events by type
  groupEventsByType() {
    return this.events.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1;
      return acc;
    }, {});
  }

  // Get top viewed products
  getTopProducts() {
    const productViews = this.events
      .filter(e => e.eventName === 'product_view' || e.eventName === 'add_to_cart')
      .reduce((acc, event) => {
        const productId = event.eventData.productId;
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});
    
    return Object.entries(productViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  // Get conversion data
  getConversionData() {
    const cartEvents = this.events.filter(e => e.eventName === 'add_to_cart').length;
    const checkoutEvents = this.events.filter(e => e.eventName === 'checkout_initiated').length;
    const purchaseEvents = this.events.filter(e => e.eventName === 'purchase_completed').length;

    return {
      addToCartCount: cartEvents,
      checkoutCount: checkoutEvents,
      purchaseCount: purchaseEvents,
      cartConversionRate: cartEvents > 0 ? ((checkoutEvents / cartEvents) * 100).toFixed(2) + '%' : '0%',
      checkoutConversionRate: checkoutEvents > 0 ? ((purchaseEvents / checkoutEvents) * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// Initialize analytics
const analytics = new AnalyticsSystem();
