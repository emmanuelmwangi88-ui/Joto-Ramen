/* ========================================
   JOTO RAMEN - Website JavaScript
   ======================================== */

// Data
let menuItems = [];
let galleryImages = [];
let customerReviews = [];
let shoppingCart = [];
let currentCustomer = null;

// Load data from localStorage
function loadData() {
    try {
        const storedMenu = localStorage.getItem('joto_menu');
        if (storedMenu) menuItems = JSON.parse(storedMenu);
        
        const storedGallery = localStorage.getItem('joto_gallery');
        if (storedGallery) galleryImages = JSON.parse(storedGallery);
        
        const storedReviews = localStorage.getItem('joto_customer_reviews');
        if (storedReviews) customerReviews = JSON.parse(storedReviews);
        
        const storedCustomer = localStorage.getItem('joto_current_customer');
        if (storedCustomer) currentCustomer = JSON.parse(storedCustomer);
    } catch (e) {
        console.log('No stored data');
    }
}

// Navigation
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (!mobileMenu) return;
    
    mobileMenu.classList.toggle('hidden');
    if (menuIcon) menuIcon.classList.toggle('hidden');
    if (closeIcon) closeIcon.classList.toggle('hidden');
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Steam Particles
function createSteamParticles() {
    const container = document.getElementById('steam-container');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'steam-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(particle);
    }
}

// Menu
function createMenuItemHTML(item, index) {
    const tags = item.tags.map(tag => {
        const colors = { 
            signature: 'bg-yellow-500/20 text-yellow-500', 
            popular: 'bg-red-500/20 text-red-500', 
            vegan: 'bg-green-500/20 text-green-500', 
            spicy: 'bg-orange-500/20 text-orange-500', 
            chef: 'bg-purple-500/20 text-purple-500' 
        };
        return '<span class="menu-tag ' + (colors[tag] || 'bg-white/10') + '">' + capitalize(tag) + '</span>';
    }).join('');
    
    let spiceIndicator = '';
    if (item.spicy > 0) {
        spiceIndicator = '<div class="flex gap-1 mt-2">' + '🌶️'.repeat(item.spicy) + '</div>';
    }
    
    return `
        <div class="menu-item-card group relative bg-white/5 rounded-2xl overflow-hidden">
            <div class="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent"></div>
                <div class="absolute top-3 left-3 flex gap-2 flex-wrap">${tags}</div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="text-xl font-bold text-parchment">${item.name}</h3>
                        <p class="text-sm text-muted-gold japanese-font">${item.nameJP || ''}</p>
                    </div>
                    <span class="text-lg font-bold text-lantern-red">KSh ${item.price.toLocaleString()}</span>
                </div>
                <p class="text-parchment/70 text-sm leading-relaxed">${item.description}</p>
                ${spiceIndicator}
                <button onclick="addToCart(${item.id})" class="mt-4 w-full py-3 bg-lantern-red/20 text-lantern-red rounded-lg font-semibold hover:bg-lantern-red hover:text-white transition-all flex items-center justify-center gap-2">
                    <span>🛒</span> Add to Order
                </button>
            </div>
        </div>
    `;
}

function renderMenuItems(category = 'all') {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    
    let filtered = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);
    grid.innerHTML = filtered.map((item, index) => createMenuItemHTML(item, index)).join('');
}

function filterMenu(category) {
    const buttons = document.querySelectorAll('.menu-filter-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent === 'All Items'));
    });
    renderMenuItems(category);
}

// Cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existing = shoppingCart.find(i => i.id === itemId);
    if (existing) {
        existing.quantity++;
    } else {
        shoppingCart.push({ ...item, quantity: 1 });
    }
    
    updateCartDisplay();
    showToast(item.name + ' added to cart!', 'success');
}

function updateCartDisplay() {
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    const cartButton = document.getElementById('order-cart');
    
    if (!cartCountEl || !cartTotalEl || !cartButton) return;
    
    const count = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCountEl.textContent = count;
    cartTotalEl.textContent = total.toLocaleString();
    cartButton.classList.toggle('hidden', count === 0);
}

function toggleCart() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else {
        renderCartItems();
        modal.classList.add('active');
    }
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('active');
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    const orderTotal = document.getElementById('order-total');
    
    if (!cartItems || !orderTotal) return;
    
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = '<p class="text-parchment/60 text-center py-4">Your cart is empty</p>';
        orderTotal.textContent = '0';
        return;
    }
    
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = shoppingCart.map(item => `
        <div class="flex justify-between items-center bg-white/5 rounded-lg p-3">
            <div class="flex-1">
                <p class="text-parchment font-semibold">${item.name}</p>
                <p class="text-muted-gold text-sm">KSh ${item.price.toLocaleString()} × ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 bg-white/10 rounded-lg hover:bg-white/20">-</button>
                <span class="text-parchment w-6 text-center">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 bg-white/10 rounded-lg hover:bg-white/20">+</button>
                <button onclick="removeFromCart(${item.id})" class="ml-2 text-red-400 hover:text-red-300">🗑️</button>
            </div>
        </div>
    `).join('');
    
    orderTotal.textContent = total.toLocaleString();
}

function updateQuantity(itemId, change) {
    const item = shoppingCart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
        renderCartItems();
    }
}

function removeFromCart(itemId) {
    shoppingCart = shoppingCart.filter(i => i.id !== itemId);
    updateCartDisplay();
    renderCartItems();
}

function handleOrderSubmit(event) {
    event.preventDefault();
    
    if (shoppingCart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    const order = {
        id: Date.now(),
        items: JSON.parse(JSON.stringify(shoppingCart)),
        total: shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        customerName: currentCustomer ? currentCustomer.name : document.getElementById('order-name').value,
        customerEmail: currentCustomer ? currentCustomer.email : document.getElementById('order-email').value,
        customerPhone: currentCustomer ? currentCustomer.phone : document.getElementById('order-phone').value,
        orderType: document.getElementById('order-type').value,
        deliveryAddress: document.getElementById('order-address').value || '',
        specialNotes: document.getElementById('order-notes').value || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        customerId: currentCustomer ? currentCustomer.id : null
    };
    
    let orders = [];
    try {
        const stored = localStorage.getItem('joto_orders');
        if (stored) orders = JSON.parse(stored);
    } catch (e) {}
    
    orders.push(order);
    localStorage.setItem('joto_orders', JSON.stringify(orders));
    
    if (currentCustomer) {
        let customers = [];
        try {
            const stored = localStorage.getItem('joto_customers');
            if (stored) customers = JSON.parse(stored);
        } catch (e) {}
        
        const index = customers.findIndex(c => c.id === currentCustomer.id);
        if (index !== -1) {
            if (!customers[index].orders) customers[index].orders = [];
            customers[index].orders.push(order.id);
            localStorage.setItem('joto_customers', JSON.stringify(customers));
        }
    }
    
    shoppingCart = [];
    updateCartDisplay();
    closeOrderModal();
    event.target.reset();
    
    showToast('🎉 Order placed successfully!', 'success');
}

// Gallery
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    grid.innerHTML = galleryImages.map((image, index) => `
        <div class="gallery-item ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} fade-in-section" onclick="openLightbox('${image.src}')">
            <img src="${image.src}" alt="${image.alt}">
            <div class="overlay"><p>${image.alt}</p></div>
        </div>
    `).join('');
}

function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

// Reviews
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const ratingInput = document.getElementById('review-rating');
    if (ratingInput) ratingInput.value = rating;
    
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
        star.classList.toggle('text-muted-gold', index < rating);
        star.classList.toggle('text-parchment/40', index >= rating);
    });
}

function renderCustomerReviews() {
    const list = document.getElementById('customer-reviews-list');
    if (!list) return;
    
    const approved = customerReviews.filter(r => r.approved);
    
    if (approved.length === 0) {
        list.innerHTML = '<div class="text-center text-parchment/60 py-12">No reviews yet. Be the first!</div>';
        return;
    }
    
    list.innerHTML = approved.map(review => `
        <div class="review-card fade-in-section">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <h4 class="text-parchment font-semibold">${review.name}</h4>
                    ${review.dish ? '<p class="text-muted-gold text-sm">Favorite: ' + review.dish + '</p>' : ''}
                </div>
                <div class="flex">${Array(review.rating).fill('<span class="text-muted-gold">★</span>').join('')}${Array(5 - review.rating).fill('<span class="text-parchment/40">☆</span>').join('')}</div>
            </div>
            <p class="text-parchment/80 text-sm leading-relaxed">"${review.text}"</p>
            <p class="text-parchment/40 text-xs mt-3">${new Date(review.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    `).join('');
}

function handleReviewSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('review-name');
    const emailInput = document.getElementById('review-email');
    const textInput = document.getElementById('review-text');
    const dishInput = document.getElementById('review-dish');
    
    if (!nameInput || !emailInput || !textInput) return;
    if (currentRating === 0) {
        showToast('Please select a rating!', 'error');
        return;
    }
    
    const review = {
        id: Date.now(),
        name: nameInput.value,
        email: emailInput.value,
        rating: currentRating,
        text: textInput.value,
        dish: dishInput ? dishInput.value : '',
        date: new Date().toISOString().split('T')[0],
        approved: true
    };
    
    customerReviews.unshift(review);
    localStorage.setItem('joto_customer_reviews', JSON.stringify(customerReviews));
    
    event.target.reset();
    setRating(0);
    renderCustomerReviews();
    
    showToast('Thank you! Your review has been posted.', 'success');
}

// Customer Login
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    
    if (currentCustomer) {
        if (confirm('Do you want to logout?')) {
            currentCustomer = null;
            localStorage.removeItem('joto_current_customer');
            updateLoginButton();
            showToast('Logged out!', 'info');
        }
    } else {
        modal.classList.add('active');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('active');
}

function showSignupForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-modal-title').textContent = 'Create Account';
}

function showLoginForm() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('login-modal-title').textContent = 'Customer Login';
}

function handleCustomerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('customer-email').value;
    const password = document.getElementById('customer-password').value;
    
    let customers = [];
    try {
        const stored = localStorage.getItem('joto_customers');
        if (stored) customers = JSON.parse(stored);
    } catch (e) {}
    
    const customer = customers.find(c => c.email === email && c.password === password);
    
    if (customer) {
        currentCustomer = customer;
        localStorage.setItem('joto_current_customer', JSON.stringify(customer));
        updateLoginButton();
        closeLoginModal();
        showToast('Welcome back, ' + customer.name + '!', 'success');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleCustomerSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    
    let customers = [];
    try {
        const stored = localStorage.getItem('joto_customers');
        if (stored) customers = JSON.parse(stored);
    } catch (e) {}
    
    if (customers.find(c => c.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }
    
    const customer = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        registeredAt: new Date().toISOString(),
        orders: []
    };
    
    customers.push(customer);
    localStorage.setItem('joto_customers', JSON.stringify(customers));
    
    currentCustomer = customer;
    localStorage.setItem('joto_current_customer', JSON.stringify(customer));
    updateLoginButton();
    closeLoginModal();
    showToast('Account created! Welcome, ' + name + '!', 'success');
}

function updateLoginButton() {
    const loginBtnText = document.getElementById('login-btn-text');
    if (loginBtnText) {
        loginBtnText.textContent = currentCustomer ? currentCustomer.name.split(' ')[0] : 'Login';
    }
}

// Forms
function handleReservation(event) {
    event.preventDefault();
    alert('🎉 Reservation request submitted! We\'ll confirm via WhatsApp/DM within 24 hours.');
    if (event.target) event.target.reset();
}

function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput && emailInput.value) {
        alert('🎉 Thank you for subscribing!');
        emailInput.value = '';
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => observer.observe(section));
}

// Utilities
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 16px 24px; border-radius: 8px; z-index: 2000; background: ' + (type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#3b82f6') + '; color: white; font-weight: 500;';
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.remove(); }, 3000);
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize
function init() {
    loadData();
    
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    updateLoginButton();
    createSteamParticles();
    renderMenuItems();
    renderGallery();
    renderCustomerReviews();
    initScrollAnimations();
    
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
    
    console.log('🍜 Joto Ramen loaded!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
