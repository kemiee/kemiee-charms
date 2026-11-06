const observer = new IntersectionObserver(
  (entries) =>
     {
    entries.forEach((entry) => 
      {
      if (entry.isIntersecting)
         {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
const pageLoader = document.querySelector('.page-loader');
const heroVideoBtn = document.querySelector('.hero-video-btn');
const heroPlayBtn = document.querySelector('.hero-play-btn');
const customCursor = document.querySelector('.custom-cursor');
const heroCopy = document.querySelector('.hero-copy');
const heroMedia = document.querySelector('.hero-media');
const heroShapes = Array.from(document.querySelectorAll('.hero-shape'));
const navLinks = Array.from(document.querySelectorAll('.top-nav a'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollProgressFill = document.querySelector('.scroll-progress__fill');
const backToTopBtn = document.querySelector('.back-to-top');
const comparePanel = document.querySelector('#compare-panel');
const compareItemsContainer = document.querySelector('.compare-items');
const clearCompareButton = document.querySelector('.clear-compare');
const footerNewsletterForm = document.querySelector('#footer-newsletter-form');
const footerNewsletterEmail = document.querySelector('#newsletter-email');
const newsletterStatus = document.querySelector('.newsletter-status');
const orderFormStatus = document.querySelector('.order-form-status');
const orderNameInput = document.querySelector('#order-name');
const orderEmailInput = document.querySelector('#order-email');
const orderSubjectInput = document.querySelector('#order-subject');
const orderMessageInput = document.querySelector('#order-message');
const statsSection = document.querySelector('#stats');
const statValues = Array.from(document.querySelectorAll('.stat-value'));

const toggleNav = () => {
  if (!navToggle || !siteNav) return;
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open');
};

const updateActiveNav = () => {
  const sections = ['hero', 'story', 'collections', 'custom', 'contact'];
  let current = 'hero';
  sections.forEach((id) => {
    const section = document.querySelector(`#${id}`);
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      current = id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

const animateHero = () => {
  if (window.gsap && heroCopy) {
    const tl = gsap.timeline();
    tl.from('.hero-copy .eyebrow', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.hero-copy h1', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.hero-copy .hero-superscript', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.65')
      .from('.hero-copy .hero-lead', { y: 24, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55')
      .from('.hero-actions .btn', { y: 24, opacity: 0, stagger: 0.15, duration: 0.55, ease: 'power3.out' }, '-=0.55');
    gsap.to(heroShapes, { y: '+=14', x: '+=6', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
};

window.addEventListener('load', () => {
  if (pageLoader) {
    pageLoader.classList.add('hidden');
  }
  animateHero();
  updateActiveNav();
});

if (navToggle && siteNav) {
  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('open')) {
        toggleNav();
      }
    });

    link.addEventListener('focus', () => link.classList.add('focused'));
    link.addEventListener('blur', () => link.classList.remove('focused'));
  });
}

const orderForm = document.querySelector('#order-form');
const successMessage = document.querySelector('.success-message');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

if (orderForm && successMessage) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = orderNameInput?.value.trim();
    const email = orderEmailInput?.value.trim();
    const subject = orderSubjectInput?.value.trim();
    const message = orderMessageInput?.value.trim();

    if (!name || !email || !subject || !message) {
      orderFormStatus.textContent = 'Please complete all fields before sending your request.';
      orderFormStatus.classList.add('form-status--warning');
      return;
    }

    if (!isValidEmail(email)) {
      orderFormStatus.textContent = 'Please enter a valid email address.';
      orderFormStatus.classList.add('form-status--warning');
      return;
    }

    orderFormStatus.textContent = 'Sending your custom request…';
    orderFormStatus.classList.remove('form-status--warning');
    successMessage.textContent = '';

    window.setTimeout(() => {
      successMessage.textContent = 'Thank you! Your custom request has been submitted. We will reply soon.';
      orderFormStatus.textContent = 'Your message has been received and we will respond within 24 hours.';
      orderForm.reset();
    }, 800);
  });
}

const collectionSearch = document.querySelector('#collection-search');
const productSearch = document.querySelector('#product-search');
const productSuggestions = document.querySelector('#product-suggestions');
const collectionFilters = document.querySelectorAll('#collection-filters .filter-btn');
const productFilters = document.querySelectorAll('#product-filters .filter-btn');
const collectionCards = Array.from(document.querySelectorAll('.collection-card'));
const productCards = Array.from(document.querySelectorAll('.product-card'));
const compareButtons = Array.from(document.querySelectorAll('.compare-btn'));
const cartToggleBtn = document.querySelector('.cart-toggle');
const checkoutPanel = document.querySelector('#checkout-panel');
const closeCartBtn = document.querySelector('.close-cart');
const checkoutItems = document.querySelector('.checkout-items');
const checkoutTotal = document.querySelector('.checkout-total');
const cartBadge = document.querySelector('.badge');
const wishlistBadge = document.querySelector('.wishlist-badge');
const favoriteButtons = Array.from(document.querySelectorAll('.favorite-btn'));
const wishlistItemsContainer = document.querySelector('.wishlist-items');
const wishlistEmptyMessage = document.querySelector('.wishlist-empty-message');
const addCartButtons = document.querySelectorAll('.add-cart');
const checkoutButton = document.querySelector('.btn-checkout');

const CART_STORAGE_KEY = 'kemieeCart';
const WISHLIST_STORAGE_KEY = 'kemieeWishlist';
const RECENT_VIEWS_STORAGE_KEY = 'kemieeRecentViews';
const COMPARE_STORAGE_KEY = 'kemieeCompare';
const cartState = { items: [] };
const wishlistState = { items: [] };
const compareState = { items: [] };
const recentlyViewedState = { items: [] };

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;
    cartState.items = parsed
      .map((item) => ({
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
      }))
      .filter((item) => item.name && item.quantity > 0);
  } catch (error) {
    console.warn('Unable to restore cart from storage.', error);
  }
};

const loadWishlistFromStorage = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;
    // Normalize stored entries to objects { name, price }
    wishlistState.items = parsed
      .map((item) => {
        if (!item) return null;
        if (typeof item === 'string') return { name: item, price: null };
        if (typeof item === 'object' && item.name) return { name: item.name, price: item.price ?? null };
        return null;
      })
      .filter(Boolean);
  } catch (error) {
    console.warn('Unable to restore wishlist from storage.', error);
  }
};

const saveCartToStorage = () => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items));
  } catch (error) {
    console.warn('Unable to save cart to storage.', error);
  }
};

const saveWishlistToStorage = () => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistState.items));
  } catch (error) {
    console.warn('Unable to save wishlist to storage.', error);
  }
};

const loadRecentViewsFromStorage = () => {
  try {
    const stored = localStorage.getItem(RECENT_VIEWS_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;
    recentlyViewedState.items = parsed.filter((item) => typeof item === 'string' && item.trim().length > 0);
  } catch (error) {
    console.warn('Unable to restore recently viewed items from storage.', error);
  }
};

const saveRecentViewsToStorage = () => {
  try {
    localStorage.setItem(RECENT_VIEWS_STORAGE_KEY, JSON.stringify(recentlyViewedState.items));
  } catch (error) {
    console.warn('Unable to save recently viewed items to storage.', error);
  }
};

const getProductPreviewClass = (productName) => {
  const card = document.querySelector(`.product-card[data-product="${CSS.escape(productName)}"]`);
  return card?.querySelector('.product-preview')?.className || 'product-preview';
};

const addRecentlyViewed = (productName) => {
  if (!productName) return;
  recentlyViewedState.items = recentlyViewedState.items.filter((item) => item !== productName);
  recentlyViewedState.items.unshift(productName);
  recentlyViewedState.items = recentlyViewedState.items.slice(0, 4);
  renderRecentlyViewed();
  saveRecentViewsToStorage();
};

const renderRecentlyViewed = () => {
  const section = document.querySelector('#recently-viewed');
  const container = document.querySelector('.recently-viewed-grid');
  if (!section || !container) return;

  if (recentlyViewedState.items.length === 0) {
    section.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  section.classList.remove('hidden');
  container.innerHTML = recentlyViewedState.items
    .map((productName) => {
      const productCard = document.querySelector(`.product-card[data-product="${CSS.escape(productName)}"]`);
      if (!productCard) return '';
      const price = productCard.dataset.price || '0';
      const previewClass = productCard.querySelector('.product-preview')?.className || 'product-preview';
      return `
        <article class="recent-item-card">
          <div class="recent-item-preview ${previewClass}"></div>
          <div class="recent-item-copy">
            <h3>${productName}</h3>
            <span class="recent-item-price">${formatPrice(Number(price))} Tsh</span>
          </div>
        </article>
      `;
    })
    .join('');
};

const getToastContainer = () => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

const showToast = (message, type = 'info') => {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  const removeToast = () => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  };

  const timeoutId = window.setTimeout(removeToast, 3200);
  toast.addEventListener('click', () => {
    window.clearTimeout(timeoutId);
    removeToast();
  });
};

const isFavorited = (productName) => wishlistState.items.some((it) => it.name === productName);

const updateFavoriteButtons = () => {
  favoriteButtons.forEach((button) => {
    const productCard = button.closest('.product-card');
    const productName = productCard?.dataset.product;
    if (!productName || !productCard) return;
    const favorited = isFavorited(productName);
    button.classList.toggle('favorited', favorited);
    productCard.classList.toggle('favorited', favorited);
    button.setAttribute('aria-label', favorited
      ? `Remove ${productName} from favorites`
      : `Save ${productName} to your wishlist`);
    button.setAttribute('title', favorited
      ? `Remove ${productName} from favorites`
      : `Save ${productName} to your wishlist`);
    button.textContent = favorited ? '♥' : '♡';
  });
};

const addToWishlist = (productName, price = null) => {
  if (!productName || isFavorited(productName)) return;
  wishlistState.items.push({ name: productName, price: price != null ? String(price) : null });
  syncWishlistState();
  showToast(`${productName} was added to your wishlist.`, 'success');
};

const removeFromWishlist = (productName) => {
  if (!productName) return;
  wishlistState.items = wishlistState.items.filter((item) => item.name !== productName);
  syncWishlistState();
  showToast(`${productName} was removed from your wishlist.`, 'warning');
};

const formatPrice = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

const updateCartBadge = () => {
  if (!cartBadge) return;
  const totalCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalCount;
  cartBadge.classList.toggle('hidden', totalCount === 0);
};

const updateWishlistBadge = () => {
  if (!wishlistBadge) return;
  const totalCount = wishlistState.items.length;
  wishlistBadge.textContent = totalCount;
  wishlistBadge.classList.toggle('hidden', totalCount === 0);
};

const syncWishlistState = () => {
  updateWishlistBadge();
  saveWishlistToStorage();
  updateFavoriteButtons();
  renderWishlistPage();
};

const updateCartAfterChange = () => {
  updateCartBadge();
  saveCartToStorage();
  renderCart();
};

const renderCart = () => {
  if (!checkoutItems || !checkoutTotal) return;
  checkoutItems.innerHTML = '';
  let total = 0;

  if (cartState.items.length === 0) {
    checkoutItems.innerHTML = '<p class="checkout-empty">Your cart is cozy and waiting for a first treat.</p>';
  } else {
    cartState.items.forEach((item) => {
      total += item.price * item.quantity;
      const itemEl = document.createElement('div');
      itemEl.className = 'checkout-item';
      itemEl.innerHTML = `
        <div class="item-copy">
          <strong>${item.name}</strong>
          <span>${item.quantity} × ${formatPrice(item.price)}Tsh</span>
        </div>
        <div class="quantity-controls">
          <button class="icon-btn quantity-decrement" type="button" data-product="${item.name}" aria-label="Decrease quantity of ${item.name}">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="icon-btn quantity-increment" type="button" data-product="${item.name}" aria-label="Increase quantity of ${item.name}">+</button>
        </div>
        <button class="icon-btn remove-item" type="button" data-product="${item.name}" aria-label="Remove ${item.name}">×</button>
      `;
      checkoutItems.appendChild(itemEl);
    });

    checkoutItems.querySelectorAll('.quantity-decrement').forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        const item = cartState.items.find((cartItem) => cartItem.name === productName);
        if (!item) return;
        item.quantity = Math.max(1, item.quantity - 1);
        updateCartAfterChange();
      });
    });

    checkoutItems.querySelectorAll('.quantity-increment').forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        const item = cartState.items.find((cartItem) => cartItem.name === productName);
        if (!item) return;
        item.quantity += 1;
        updateCartAfterChange();
      });
    });

    checkoutItems.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        cartState.items = cartState.items.filter((item) => item.name !== productName);
        updateCartAfterChange();
      });
    });
  }

  checkoutTotal.textContent = formatPrice(total);
};

const openCart = () => {
  if (!checkoutPanel) return;
  checkoutPanel.classList.remove('hidden');
  renderCart();
};

const closeCart = () => {
  if (!checkoutPanel) return;
  checkoutPanel.classList.add('hidden');
};

const addToCart = (name, price) => {
  const existing = cartState.items.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.items.push({ name, price: Number(price), quantity: 1 });
  }
  updateCartBadge();
  renderCart();
  saveCartToStorage();
  openCart();
};

if (cartToggleBtn) {
  cartToggleBtn.addEventListener('click', openCart);
}

if (closeCartBtn) {
  closeCartBtn.addEventListener('click', closeCart);
}

if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    if (cartState.items.length === 0) {
      showToast('Add something to your cart before checking out.', 'warning');
      return;
    }
    showToast('Thank you! Your order is ready for finalization.', 'success');
    cartState.items = [];
    updateCartBadge();
    renderCart();
    saveCartToStorage();
    closeCart();
  });
}

favoriteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const productName = productCard?.dataset.product;
    const price = productCard?.dataset.price ?? null;
    if (!productName) return;
    if (isFavorited(productName)) {
      removeFromWishlist(productName);
    } else {
      addToWishlist(productName, price);
    }
  });
});

addCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.product;
    const price = button.dataset.price;
    if (name && price) {
      addToCart(name, price);
    }
  });
});

const renderWishlistPage = () => {
  if (!wishlistItemsContainer || !wishlistEmptyMessage) return;
  const isWishlistPage = Boolean(wishlistItemsContainer);

  wishlistItemsContainer.innerHTML = '';
  if (wishlistState.items.length === 0) {
    wishlistEmptyMessage.classList.remove('hidden');
    return;
  }

  wishlistEmptyMessage.classList.add('hidden');
  wishlistState.items.forEach((entry) => {
    const productName = entry.name;
    const price = entry.price;
    const productCard = document.querySelector(`.product-card[data-product="${CSS.escape(productName)}"]`);
    const itemEl = document.createElement('article');
    itemEl.className = 'wishlist-item';
    itemEl.innerHTML = `
      <div class="wishlist-item-copy">
        <h3>${productName}</h3>
        <div class="wishlist-actions">
          <button class="btn btn-secondary add-to-cart-from-wishlist" type="button" data-product="${productName}">Add to Cart</button>
          <button class="icon-btn remove-wishlist-item" type="button" data-product="${productName}" aria-label="Remove ${productName} from wishlist">×</button>
        </div>
      </div>
    `;

    // Prefer product card data for badge/price when available
    if (productCard) {
      const cardPrice = productCard.dataset.price;
      const badge = productCard.querySelector('.product-badge')?.outerHTML || '';
      itemEl.querySelector('.wishlist-item-copy').insertAdjacentHTML('afterbegin', `
        <div class="wishlist-item-detail">
          ${badge}
          <p>${cardPrice ? `${formatPrice(Number(cardPrice))} Tsh` : ''}</p>
        </div>
      `);
    } else if (price) {
      itemEl.querySelector('.wishlist-item-copy').insertAdjacentHTML('afterbegin', `
        <div class="wishlist-item-detail">
          <p>${formatPrice(Number(price))} Tsh</p>
        </div>
      `);
    }

    wishlistItemsContainer.appendChild(itemEl);
  });

  wishlistItemsContainer.querySelectorAll('.remove-wishlist-item').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      removeFromWishlist(productName);
    });
  });

  wishlistItemsContainer.querySelectorAll('.add-to-cart-from-wishlist').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      const productCard = document.querySelector(`.product-card[data-product="${CSS.escape(productName)}"]`);
      let price = productCard?.dataset.price;
      if (!price) {
        // Try to find stored price in wishlistState
        const stored = wishlistState.items.find((it) => it.name === productName);
        price = stored?.price ?? null;
      }
      if (productName && price) {
        addToCart(productName, price);
        showToast(`${productName} was added to your cart.`, 'success');
      }
    });
  });
};

const applyFilter = (cards, searchValue, activeFilter) => {
  cards.forEach((card) => {
    const title = (card.dataset.product || card.querySelector('h3')?.textContent || '').toLowerCase();
    const category = (card.dataset.category || 'all').toLowerCase();
    const matchesSearch = !searchValue || title.includes(searchValue);
    const matchesFilter = activeFilter === 'all' || category === activeFilter;
    card.style.display = matchesSearch && matchesFilter ? '' : 'none';
  });
};

const updateCollectionFilter = () => {
  const searchValue = collectionSearch?.value.toLowerCase().trim() || '';
  const activeFilter = Array.from(collectionFilters).find((button) => button.classList.contains('active'))?.dataset.filter || 'all';
  applyFilter(collectionCards, searchValue, activeFilter);
};

const updateProductFilter = () => {
  const searchValue = productSearch?.value.toLowerCase().trim() || '';
  const activeFilter = Array.from(productFilters).find((button) => button.classList.contains('active'))?.dataset.filter || 'all';
  applyFilter(productCards, searchValue, activeFilter);
};

const syncCompareButtons = () => {
  compareButtons.forEach((button) => {
    const productName = button.dataset.product;
    const active = productName && compareState.items.includes(productName);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(Boolean(active)));
    button.textContent = active ? 'Selected' : 'Compare';
  });
};

const saveCompareToStorage = () => {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareState.items));
  } catch (error) {
    console.warn('Unable to save compare list to storage.', error);
  }
};

const loadCompareFromStorage = () => {
  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;
    compareState.items = parsed.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, 3);
  } catch (error) {
    console.warn('Unable to restore compare list from storage.', error);
  }
};

const updateComparePanel = () => {
  if (!comparePanel || !compareItemsContainer) return;
  compareItemsContainer.innerHTML = '';
  if (compareState.items.length === 0) {
    comparePanel.classList.add('hidden');
    return;
  }

  comparePanel.classList.remove('hidden');
  compareItemsContainer.innerHTML = compareState.items
    .map((productName) => {
      const productCard = document.querySelector(`.product-card[data-product="${CSS.escape(productName)}"]`);
      const price = productCard?.dataset.price ? `${formatPrice(Number(productCard.dataset.price))} Tsh` : 'Price unavailable';
      return `
        <div class="compare-item">
          <span>${productName}</span>
          <strong>${price}</strong>
        </div>
      `;
    })
    .join('');
};

const addProductToCompare = (productName) => {
  if (!productName) return;
  if (compareState.items.includes(productName)) {
    compareState.items = compareState.items.filter((item) => item !== productName);
    showToast(`${productName} removed from your compare list.`, 'warning');
    return;
  }
  if (compareState.items.length >= 3) {
    showToast('Compare is limited to 3 items. Remove one to add another.', 'warning');
    return;
  }
  compareState.items.push(productName);
  showToast(`${productName} added to compare.`, 'success');
};

const clearCompareSelection = () => {
  compareState.items = [];
  updateComparePanel();
  syncCompareButtons();
  saveCompareToStorage();
  showToast('Compare list cleared.', 'info');
};

const animateStats = () => {
  statValues.forEach((valueEl) => {
    const target = Number(valueEl.dataset.target) || 0;
    if (prefersReducedMotion) {
      valueEl.textContent = target;
      return;
    }

    let start = 0;
    const duration = 900;
    const stepTime = Math.max(20, duration / target);
    const increment = Math.ceil(target / (duration / stepTime));
    const counter = window.setInterval(() => {
      start += increment;
      if (start >= target) {
        valueEl.textContent = target;
        window.clearInterval(counter);
        return;
      }
      valueEl.textContent = start;
    }, stepTime);
  });
};

const updateScrollProgress = () => {
  if (!scrollProgressFill) return;
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
  scrollProgressFill.style.transform = `scaleX(${progress})`;
};

const updateBackToTopVisibility = () => {
  if (!backToTopBtn) return;
  const visible = window.scrollY > 420;
  backToTopBtn.classList.toggle('visible', visible);
};

const handleNewsletterSubmit = (event) => {
  event.preventDefault();
  const email = footerNewsletterEmail?.value.trim() || '';

  if (!email || !isValidEmail(email)) {
    newsletterStatus.textContent = 'Enter a valid email address to join our list.';
    newsletterStatus.classList.add('status-warning');
    return;
  }

  newsletterStatus.textContent = 'Welcome to our insider circle! Expect the next collection note soon.';
  newsletterStatus.classList.remove('status-warning');
  footerNewsletterForm.reset();
  window.setTimeout(() => {
    newsletterStatus.textContent = '';
  }, 5000);
};

const observeStatsSection = () => {
  if (!statsSection || statValues.length === 0 || prefersReducedMotion) {
    animateStats();
    return;
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
};

const initCompareControls = () => {
  compareButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      if (!productName) return;
      addProductToCompare(productName);
      syncCompareButtons();
      updateComparePanel();
      saveCompareToStorage();
    });
  });

  clearCompareButton?.addEventListener('click', clearCompareSelection);
};

const initNewsletterControls = () => {
  footerNewsletterForm?.addEventListener('submit', handleNewsletterSubmit);
};

const initBackToTop = () => {
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
};

const initPageMotion = () => {
  updateScrollProgress();
  updateBackToTopVisibility();
  observeStatsSection();
};

const restoreCompareState = () => {
  loadCompareFromStorage();
  syncCompareButtons();
  updateComparePanel();
};

const initInteractionEnhancements = () => {
  initCompareControls();
  initNewsletterControls();
  initBackToTop();
  initPageMotion();
};

const updateProductSuggestions = () => {
  if (!productSearch || !productSuggestions) return;
  const query = productSearch.value.trim();
  if (!query) {
    productSuggestions.classList.add('hidden');
    productSuggestions.innerHTML = '';
    return;
  }

  const matches = Array.from(new Set(productCards.map((card) => card.dataset.product?.trim()).filter(Boolean)))
    .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  if (matches.length === 0) {
    productSuggestions.innerHTML = '<div class="suggestion-empty">No matching products found</div>';
    productSuggestions.classList.remove('hidden');
    return;
  }

  productSuggestions.innerHTML = matches
    .map((name) => `<button type="button" class="suggestion-item" role="option">${name}</button>`)
    .join('');
  productSuggestions.classList.remove('hidden');

  productSuggestions.querySelectorAll('.suggestion-item').forEach((button) => {
    button.addEventListener('click', () => {
      productSearch.value = button.textContent || '';
      updateProductFilter();
      productSuggestions.classList.add('hidden');
    });
  });
};

collectionSearch?.addEventListener('input', updateCollectionFilter);
productSearch?.addEventListener('input', () => {
  updateProductFilter();
  updateProductSuggestions();
});
productSearch?.addEventListener('focus', updateProductSuggestions);
productSearch?.addEventListener('blur', () => {
  window.setTimeout(() => {
    productSuggestions?.classList.add('hidden');
  }, 120);
});

collectionFilters.forEach((button) => {
  button.addEventListener('click', () => {
    collectionFilters.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateCollectionFilter();
  });
});

productFilters.forEach((button) => {
  button.addEventListener('click', () => {
    productFilters.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateProductFilter();
  });
});

const reviewSlides = Array.from(document.querySelectorAll('.review-slide'));
const reviewDots = Array.from(document.querySelectorAll('.dot'));
const prevSlideButton = document.querySelector('.carousel-nav--prev');
const nextSlideButton = document.querySelector('.carousel-nav--next');
let currentReviewIndex = 0;
let reviewInterval;

const setReviewSlide = (index) => {
  currentReviewIndex = index;
  reviewSlides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  reviewDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
};

const startReviewAutoplay = () => {
  if (reviewInterval) clearInterval(reviewInterval);
  reviewInterval = setInterval(() => {
    const nextIndex = (currentReviewIndex + 1) % reviewSlides.length;
    setReviewSlide(nextIndex);
  }, 6500);
};

prevSlideButton?.addEventListener('click', () => {
  setReviewSlide((currentReviewIndex - 1 + reviewSlides.length) % reviewSlides.length);
  startReviewAutoplay();
});

nextSlideButton?.addEventListener('click', () => {
  setReviewSlide((currentReviewIndex + 1) % reviewSlides.length);
  startReviewAutoplay();
});

reviewDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    setReviewSlide(Number(dot.dataset.index));
    startReviewAutoplay();
  });
});

if (reviewSlides.length > 0) {
  setReviewSlide(0);
  startReviewAutoplay();
}

const heroPlayButton = document.querySelector('.play-button');
const videoLightbox = document.querySelector('#video-lightbox');
const heroVideo = document.querySelector('#hero-video');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
const lightboxClose = document.querySelector('.lightbox-close');

const openVideoLightbox = () => {
  if (!videoLightbox || !heroVideo) return;
  heroVideo.currentTime = 0;
  heroVideo.play().catch(() => {});
  videoLightbox.classList.remove('hidden');
  document.body.classList.add('no-scroll');
};

const closeVideoLightbox = () => {
  if (!videoLightbox || !heroVideo) return;
  heroVideo.pause();
  heroVideo.currentTime = 0;
  videoLightbox.classList.add('hidden');
  document.body.classList.remove('no-scroll');
};

heroPlayButton?.addEventListener('click', openVideoLightbox);
heroVideoBtn?.addEventListener('click', openVideoLightbox);
heroPlayBtn?.addEventListener('click', () => {
  const heroVideo = document.querySelector('#hero-video');
  if (!heroVideo) return;

  if (heroVideo.paused) {
    heroVideo.play().catch(() => {});
    heroPlayBtn.textContent = '❚❚';
    heroPlayBtn.setAttribute('aria-label', 'Pause hero video');
  } else {
    heroVideo.pause();
    heroPlayBtn.textContent = '▶';
    heroPlayBtn.setAttribute('aria-label', 'Play hero video');
  }
});
lightboxClose?.addEventListener('click', closeVideoLightbox);
lightboxBackdrop?.addEventListener('click', closeVideoLightbox);

const quickViewModal = document.querySelector('#quick-view-modal');
const quickViewBackdrop = document.querySelector('.quickview-backdrop');
const quickViewClose = document.querySelector('.quickview-close');
const quickViewImage = document.querySelector('.quickview-image');
const quickViewTitle = document.querySelector('.quickview-title');
const quickViewPrice = document.querySelector('.quickview-price');
const quickViewDescription = document.querySelector('.quickview-description');
const quickViewBadge = document.querySelector('.quickview-badge');
const quickViewReviewCount = document.querySelector('.quickview-review-count');
const quickViewAddToCart = document.querySelector('.quickview-add-to-cart');
const quickViewFavorite = document.querySelector('.quickview-favorite');

const reviewDetails = {
  'Signature Charm Bracelet': { reviews: 124, stars: '★★★★★' },
  'Crochet Scrunchie Set': { reviews: 98, stars: '★★★★★' },
  'Cupcake Delight Pack': { reviews: 76, stars: '★★★★★' },
};

const openQuickView = (productCard) => {
  if (!quickViewModal || !productCard) return;

  const name = productCard.dataset.product;
  const price = productCard.dataset.price;
  const description = productCard.dataset.description || 'A beautiful hand-finished item ready for thoughtful gifting.';
  const badgeText = productCard.querySelector('.product-badge')?.textContent || 'Featured';
  const imageClass = productCard.querySelector('.product-preview')?.className || '';
  const reviewInfo = reviewDetails[name] || { reviews: 34, stars: '★★★★☆' };

  quickViewTitle.textContent = name;
  quickViewPrice.textContent = `${formatPrice(Number(price))} Tsh`;
  quickViewDescription.textContent = description;
  quickViewBadge.textContent = badgeText;
  quickViewReviewCount.textContent = `${reviewInfo.reviews} reviews`;
  quickViewImage.style.backgroundImage = `url(images/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg)`;
  quickViewImage.className = `quickview-image ${imageClass}`;
  quickViewFavorite.textContent = isFavorited(name) ? 'Saved' : 'Save';

  quickViewAddToCart.dataset.product = name;
  quickViewAddToCart.dataset.price = price;
  quickViewFavorite.dataset.product = name;

  addRecentlyViewed(name);
  quickViewModal.classList.remove('hidden');
  document.body.classList.add('no-scroll');
};

const closeQuickView = () => {
  if (!quickViewModal) return;
  quickViewModal.classList.add('hidden');
  document.body.classList.remove('no-scroll');
};

const quickViewButtons = Array.from(document.querySelectorAll('.quick-view'));
quickViewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    openQuickView(productCard);
  });
});

quickViewClose?.addEventListener('click', closeQuickView);
quickViewBackdrop?.addEventListener('click', closeQuickView);

quickViewAddToCart?.addEventListener('click', () => {
  const name = quickViewAddToCart.dataset.product;
  const price = quickViewAddToCart.dataset.price;
  if (name && price) {
    addToCart(name, price);
    showToast(`${name} was added to your cart.`, 'success');
    closeQuickView();
  }
});

quickViewFavorite?.addEventListener('click', () => {
  const productName = quickViewFavorite.dataset.product;
  if (!productName) return;
  if (isFavorited(productName)) {
    removeFromWishlist(productName);
    quickViewFavorite.textContent = 'Save';
  } else {
    const price = quickViewAddToCart?.dataset.price ?? null;
    addToWishlist(productName, price);
    quickViewFavorite.textContent = 'Saved';
  }
});

window.addEventListener('scroll', () => {
  updateActiveNav();
  updateScrollProgress();
  updateBackToTopVisibility();

  if (!prefersReducedMotion) {
    if (heroMedia) {
      const offset = window.scrollY * 0.12;
      heroMedia.style.transform = `translateY(${offset}px) scale(1.02)`;
    }
    heroShapes.forEach((shape, index) => {
      if (!shape) return;
      const drift = window.scrollY * (0.02 + index * 0.01);
      shape.style.transform = `translate3d(0, ${drift}px, 0)`;
    });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (quickViewModal && !quickViewModal.classList.contains('hidden')) {
      closeQuickView();
      return;
    }
    if (videoLightbox && !videoLightbox.classList.contains('hidden')) {
      closeVideoLightbox();
    }
  }
});

loadCartFromStorage();
loadWishlistFromStorage();
loadRecentViewsFromStorage();
restoreCompareState();
updateCartBadge();
updateWishlistBadge();
updateFavoriteButtons();
renderCart();
renderWishlistPage();
renderRecentlyViewed();
initInteractionEnhancements();
