// Global script to support addToCart from static pages
(function(){
  window.addToCart = function(name, price){
    try{
      const key = 'unicof_cart';
      const raw = localStorage.getItem(key);
      const cart = raw ? JSON.parse(raw) : [];

      // try to find item by name
      let item = cart.find(i => i.name === name);
      if(item){
        item.quantity = (item.quantity || 1) + 1;
      } else {
        // create a simple id from name
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-') + '-' + Date.now();
        cart.push({
          id,
          name,
          price: Number(price),
          image: '',
          quantity: 1,
          category: '',
          timestamp: Date.now()
        });
      }

      localStorage.setItem(key, JSON.stringify(cart));

      // update visual cart count if present
      const countEl = document.querySelector('.cart-count') || document.querySelector('.cart-icon span');
      if(countEl) {
        const total = cart.reduce((s, it) => s + (it.quantity || 1), 0);
        countEl.textContent = total;
      }

      // Redirect to cart page
      window.location.href = 'cart.html';
    } catch(e){
      console.error('addToCart error', e);
      window.location.href = 'cart.html';
    }
  };
})();
