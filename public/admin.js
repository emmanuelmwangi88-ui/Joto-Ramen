/* ========================================
   JOTO RAMEN - Admin Panel JavaScript
   ======================================== */

// Data
let menuItems = [];
let customerReviews = [];
let galleryImages = [];
let reservations = [];
let orders = [];
let customers = [];

// Load data from localStorage
function loadData() {
    try {
        const storedMenu = localStorage.getItem('joto_menu');
        if (storedMenu) menuItems = JSON.parse(storedMenu);
        
        const storedReviews = localStorage.getItem('joto_customer_reviews');
        if (storedReviews) customerReviews = JSON.parse(storedReviews);
        
        const storedGallery = localStorage.getItem('joto_gallery');
        if (storedGallery) galleryImages = JSON.parse(storedGallery);
        
        const storedReservations = localStorage.getItem('joto_reservations');
        if (storedReservations) reservations = JSON.parse(storedReservations);
        
        const storedOrders = localStorage.getItem('joto_orders');
        if (storedOrders) orders = JSON.parse(storedOrders);
        
        const storedCustomers = localStorage.getItem('joto_customers');
        if (storedCustomers) customers = JSON.parse(storedCustomers);
    } catch (e) {
        console.log('No stored data');
    }
}

// Save all data
function saveData() {
    localStorage.setItem('joto_menu', JSON.stringify(menuItems));
    localStorage.setItem('joto_customer_reviews', JSON.stringify(customerReviews));
    localStorage.setItem('joto_gallery', JSON.stringify(galleryImages));
    localStorage.setItem('joto_reservations', JSON.stringify(reservations));
    localStorage.setItem('joto_orders', JSON.stringify(orders));
    localStorage.setItem('joto_customers', JSON.stringify(customers));
}

// Auth
function checkAuth() {
    const isLoggedIn = localStorage.getItem('joto_admin_logged_in');
    const loginScreen = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    if (!loginScreen || !adminDashboard) return;
    
    if (isLoggedIn === 'true') {
        loginScreen.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        init();
    } else {
        loginScreen.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    }
}

function handleLogin(event) {
    if (event) event.preventDefault();
    
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    
    if (!usernameInput || !passwordInput) return;
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    // Check stored password or default
    const storedPassword = localStorage.getItem('joto_admin_password') || 'admin123';
    
    if (username === 'admin' && password === storedPassword) {
        localStorage.setItem('joto_admin_logged_in', 'true');
        showToast('Welcome back!', 'success');
        checkAuth();
    } else {
        showToast('Invalid credentials!', 'error');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('joto_admin_logged_in');
        showToast('Logged out!', 'info');
        checkAuth();
    }
}

function handleChangePassword(event) {
    if (event) event.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    const storedPassword = localStorage.getItem('joto_admin_password') || 'admin123';
    
    if (currentPassword !== storedPassword) {
        showToast('Current password is incorrect', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 4) {
        showToast('Password must be at least 4 characters', 'error');
        return;
    }
    
    localStorage.setItem('joto_admin_password', newPassword);
    showToast('Password changed successfully!', 'success');
    
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Navigation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section-content');
    const navItems = document.querySelectorAll('.nav-item');
    
    sections.forEach(section => section.classList.remove('active'));
    navItems.forEach(btn => btn.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId + '-section');
    const targetNav = document.querySelector('[data-section="' + sectionId + '"]');
    
    if (targetSection) targetSection.classList.add('active');
    if (targetNav) targetNav.classList.add('active');
    
    const titles = {
        dashboard: 'Dashboard',
        menu: 'Menu Manager',
        orders: 'Customer Orders',
        reviews: 'Customer Reviews',
        gallery: 'Gallery Manager',
        reservations: 'Reservations',
        customers: 'Registered Customers',
        settings: 'Settings'
    };
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = titles[sectionId] || 'Dashboard';
    
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    if (sectionId === 'dashboard') loadDashboard();
    else if (sectionId === 'menu') renderMenu();
    else if (sectionId === 'orders') renderOrders();
    else if (sectionId === 'reviews') renderReviews();
    else if (sectionId === 'gallery') renderGallery();
    else if (sectionId === 'reservations') loadReservations();
    else if (sectionId === 'customers') loadCustomers();
}

// Dashboard
function loadDashboard() {
    const statMenu = document.getElementById('stat-menu');
    const statOrders = document.getElementById('stat-orders');
    const statReviews = document.getElementById('stat-reviews');
    const statGallery = document.getElementById('stat-gallery');
    const statReservations = document.getElementById('stat-reservations');
    const statCustomers = document.getElementById('stat-customers');
    
    if (statMenu) statMenu.textContent = menuItems.filter(i => i.available).length;
    if (statOrders) statOrders.textContent = orders.filter(o => o.status === 'pending').length;
    if (statReviews) statReviews.textContent = customerReviews.filter(r => !r.approved).length;
    if (statGallery) statGallery.textContent = galleryImages.length;
    if (statReservations) statReservations.textContent = reservations.length;
    if (statCustomers) statCustomers.textContent = customers.length;
    
    // Update badges
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const pendingOrdersBadge = document.getElementById('pending-orders-badge');
    if (pendingOrdersBadge) {
        pendingOrdersBadge.textContent = pendingOrders;
        pendingOrdersBadge.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
    }
    
    const pendingReviews = customerReviews.filter(r => !r.approved).length;
    const pendingReviewsBadge = document.getElementById('pending-reviews-badge');
    if (pendingReviewsBadge) {
        pendingReviewsBadge.textContent = pendingReviews;
        pendingReviewsBadge.style.display = pendingReviews > 0 ? 'inline-block' : 'none';
    }
    
    // Recent orders
    const recentOrders = orders.slice(-3).reverse();
    const dashboardOrders = document.getElementById('dashboard-recent-orders');
    if (dashboardOrders) {
        if (recentOrders.length === 0) {
            dashboardOrders.innerHTML = '<div class="p-6 text-center text-parchment/60">No orders yet</div>';
        } else {
            dashboardOrders.innerHTML = recentOrders.map(order => `
                <div class="p-4 hover:bg-white/5 transition-colors">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-parchment font-semibold">Order #${order.id} - ${order.customerName}</p>
                            <p class="text-parchment/60 text-sm">${order.items.length} items | KSh ${order.total.toLocaleString()}</p>
                        </div>
                        <span class="badge badge-${getStatusColor(order.status)}">${capitalize(order.status)}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Pending reviews
    const pendingReviewsList = customerReviews.filter(r => !r.approved).slice(0, 3);
    const dashboardReviews = document.getElementById('dashboard-pending-reviews');
    if (dashboardReviews) {
        if (pendingReviewsList.length === 0) {
            dashboardReviews.innerHTML = '<div class="p-6 text-center text-parchment/60">No pending reviews</div>';
        } else {
            dashboardReviews.innerHTML = pendingReviewsList.map(review => `
                <div class="p-4 hover:bg-white/5 transition-colors">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-parchment font-semibold">${review.name}</p>
                            <p class="text-parchment/60 text-sm">${review.text.substring(0, 80)}...</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="approveReview(${review.id})" class="text-green-500 hover:text-green-400" title="Approve">✓</button>
                            <button onclick="deleteReview(${review.id})" class="text-red-500 hover:text-red-400" title="Delete">✕</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Menu
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    
    const categoryFilter = document.getElementById('menu-filter-category');
    const category = categoryFilter ? categoryFilter.value : 'all';
    
    let filtered = menuItems;
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-parchment/60 py-12">No items found</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(item => {
        const tags = item.tags.map(tag => {
            const colors = { signature: 'bg-yellow-500/20 text-yellow-500', popular: 'bg-red-500/20 text-red-500', vegan: 'bg-green-500/20 text-green-500', spicy: 'bg-orange-500/20 text-orange-500', chef: 'bg-purple-500/20 text-purple-500' };
            return '<span class="badge ' + (colors[tag] || 'bg-white/10') + '">' + capitalize(tag) + '</span>';
        }).join('');
        
        return `
            <div class="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                <div class="aspect-video relative">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                    <div class="absolute top-2 right-2 flex gap-1">
                        <button onclick="editMenuItem(${item.id})" class="w-8 h-8 bg-blue-500/80 rounded-full flex items-center justify-center hover:bg-blue-500">✏️</button>
                        <button onclick="toggleMenuItem(${item.id})" class="w-8 h-8 ${item.available ? 'bg-green-500/80' : 'bg-gray-500/80'} rounded-full flex items-center justify-center hover:opacity-80">${item.available ? '✓' : '✕'}</button>
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="text-parchment font-semibold">${item.name}</h4>
                            ${item.nameJP ? '<p class="text-muted-gold text-sm">' + item.nameJP + '</p>' : ''}
                        </div>
                        <span class="text-lantern-red font-bold">KSh ${item.price.toLocaleString()}</span>
                    </div>
                    <p class="text-parchment/60 text-sm mb-3">${item.description}</p>
                    <div class="flex flex-wrap gap-1 mb-3">${tags}</div>
                    <div class="flex gap-2">
                        <button onclick="editMenuItem(${item.id})" class="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm">Edit</button>
                        <button onclick="deleteMenuItem(${item.id})" class="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openMenuModal() {
    const modal = document.getElementById('menu-modal');
    if (!modal) return;
    
    document.getElementById('menu-modal-title').textContent = 'Add Menu Item';
    document.getElementById('menu-id').value = '';
    document.getElementById('menu-name').value = '';
    document.getElementById('menu-name-jp').value = '';
    document.getElementById('menu-description').value = '';
    document.getElementById('menu-price').value = '';
    document.getElementById('menu-category').value = 'ramen';
    document.getElementById('menu-image-url').value = '';
    document.getElementById('menu-spicy').value = 0;
    
    const checkboxes = document.querySelectorAll('input[name="menu-tags"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    const preview = document.getElementById('menu-image-preview');
    if (preview) preview.classList.add('hidden');
    
    modal.classList.add('active');
}

function closeMenuModal() {
    const modal = document.getElementById('menu-modal');
    if (modal) modal.classList.remove('active');
}

function editMenuItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    
    const modal = document.getElementById('menu-modal');
    if (!modal) return;
    
    document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
    document.getElementById('menu-id').value = item.id;
    document.getElementById('menu-name').value = item.name;
    document.getElementById('menu-name-jp').value = item.nameJP || '';
    document.getElementById('menu-description').value = item.description;
    document.getElementById('menu-price').value = item.price;
    document.getElementById('menu-category').value = item.category;
    document.getElementById('menu-image-url').value = item.image || '';
    document.getElementById('menu-spicy').value = item.spicy || 0;
    
    const checkboxes = document.querySelectorAll('input[name="menu-tags"]');
    checkboxes.forEach(cb => {
        cb.checked = item.tags.includes(cb.value);
    });
    
    modal.classList.add('active');
}

function handleMenuSubmit(event) {
    if (event) event.preventDefault();
    
    const id = document.getElementById('menu-id').value;
    const checkboxes = document.querySelectorAll('input[name="menu-tags"]:checked');
    const tags = Array.from(checkboxes).map(cb => cb.value);
    const imageUrl = document.getElementById('menu-image-url').value;
    const imageFile = document.getElementById('menu-image-file').files[0];
    
    const processMenuItem = (finalImageUrl) => {
        const menuItem = {
            name: document.getElementById('menu-name').value,
            nameJP: document.getElementById('menu-name-jp').value,
            description: document.getElementById('menu-description').value,
            price: parseInt(document.getElementById('menu-price').value),
            category: document.getElementById('menu-category').value,
            image: finalImageUrl,
            spicy: parseInt(document.getElementById('menu-spicy').value),
            tags: tags,
            available: true
        };
        
        if (id) {
            const index = menuItems.findIndex(i => i.id == id);
            if (index !== -1) {
                menuItems[index] = { ...menuItems[index], ...menuItem };
                showToast('Menu item updated!', 'success');
            }
        } else {
            menuItem.id = Math.max(...menuItems.map(i => i.id), 0) + 1;
            menuItems.push(menuItem);
            showToast('Menu item added!', 'success');
        }
        
        saveData();
        closeMenuModal();
        renderMenu();
        loadDashboard();
    };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processMenuItem(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
        processMenuItem(imageUrl);
    } else {
        processMenuItem('https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600');
    }
}

function deleteMenuItem(id) {
    if (!confirm('Delete this item?')) return;
    menuItems = menuItems.filter(i => i.id !== id);
    saveData();
    renderMenu();
    loadDashboard();
    showToast('Item deleted!', 'success');
}

function toggleMenuItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (item) {
        item.available = !item.available;
        saveData();
        renderMenu();
        loadDashboard();
        showToast(item.available ? 'Item enabled!' : 'Item disabled!', 'info');
    }
}

// Orders
function renderOrders() {
    const list = document.getElementById('orders-list');
    if (!list) return;
    
    const filter = document.getElementById('order-filter');
    const filterValue = filter ? filter.value : 'all';
    
    let filtered = orders;
    if (filterValue !== 'all') {
        filtered = orders.filter(o => o.status === filterValue);
    }
    
    if (filtered.length === 0) {
        list.innerHTML = '<div class="text-center text-parchment/60 py-12">No orders found</div>';
        return;
    }
    
    list.innerHTML = filtered.map(order => {
        const itemsList = order.items.map(item => item.quantity + 'x ' + item.name).join(', ');
        
        return `
            <div class="order-card-admin">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h4 class="text-parchment font-semibold text-lg">Order #${order.id}</h4>
                        <p class="text-parchment/60 text-sm">${order.customerName} | ${order.customerPhone}</p>
                        <p class="text-muted-gold text-sm">${order.customerEmail}</p>
                    </div>
                    <div class="text-right">
                        <span class="badge badge-${getStatusColor(order.status)}">${capitalize(order.status)}</span>
                        <p class="text-lantern-red font-bold text-lg mt-2">KSh ${order.total.toLocaleString()}</p>
                    </div>
                </div>
                <div class="bg-white/5 rounded-lg p-3 mb-3">
                    <p class="text-parchment/80 text-sm"><strong>Items:</strong> ${itemsList}</p>
                    <p class="text-parchment/60 text-sm"><strong>Type:</strong> ${capitalize(order.orderType)}</p>
                    ${order.specialNotes ? '<p class="text-parchment/60 text-sm"><strong>Notes:</strong> ' + order.specialNotes + '</p>' : ''}
                </div>
                ${order.status === 'pending' ? `
                    <div class="flex gap-2">
                        <button onclick="updateOrderStatus(${order.id}, 'confirmed')" class="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm">✓ Confirm</button>
                        <button onclick="updateOrderStatus(${order.id}, 'cancelled')" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">✕ Cancel</button>
                        <button onclick="deleteOrder(${order.id})" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">🗑️ Delete</button>
                    </div>
                ` : order.status === 'confirmed' ? `
                    <div class="flex gap-2">
                        <button onclick="updateOrderStatus(${order.id}, 'completed')" class="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm">✓ Complete</button>
                        <button onclick="deleteOrder(${order.id})" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">🗑️ Delete</button>
                    </div>
                ` : `<button onclick="deleteOrder(${order.id})" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">🗑️ Delete</button>`}
            </div>
        `;
    }).join('');
}

function updateOrderStatus(id, status) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        saveData();
        renderOrders();
        loadDashboard();
        showToast('Order ' + status + '!', 'success');
    }
}

function deleteOrder(id) {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    orders = orders.filter(o => o.id !== id);
    saveData();
    renderOrders();
    loadDashboard();
    showToast('Order deleted!', 'success');
}

// Reviews
function renderReviews() {
    const list = document.getElementById('reviews-list');
    if (!list) return;
    
    const filter = document.getElementById('review-filter');
    const filterValue = filter ? filter.value : 'all';
    
    let filtered = customerReviews;
    if (filterValue === 'pending') {
        filtered = customerReviews.filter(r => !r.approved);
    } else if (filterValue === 'approved') {
        filtered = customerReviews.filter(r => r.approved);
    }
    
    if (filtered.length === 0) {
        list.innerHTML = '<div class="text-center text-parchment/60 py-12">No reviews found</div>';
        return;
    }
    
    list.innerHTML = filtered.map(review => `
        <div class="review-card-admin">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h4 class="text-parchment font-semibold">${review.name}</h4>
                    <p class="text-parchment/60 text-sm">${review.email}</p>
                    ${review.dish ? '<p class="text-muted-gold text-sm">Favorite: ' + review.dish + '</p>' : ''}
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-muted-gold">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                    <span class="badge badge-${review.approved ? 'success' : 'warning'}">${review.approved ? 'Approved' : 'Pending'}</span>
                </div>
            </div>
            <p class="text-parchment/80 mb-3">"${review.text}"</p>
            <p class="text-parchment/40 text-xs mb-3">${new Date(review.date).toLocaleDateString('en-KE')}</p>
            ${!review.approved ? `
                <div class="flex gap-2">
                    <button onclick="approveReview(${review.id})" class="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm">✓ Approve</button>
                    <button onclick="deleteReview(${review.id})" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">✕ Delete</button>
                </div>
            ` : `
                <button onclick="deleteReview(${review.id})" class="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">🗑️ Delete</button>
            `}
        </div>
    `).join('');
}

function approveReview(id) {
    const review = customerReviews.find(r => r.id === id);
    if (review) {
        review.approved = true;
        saveData();
        renderReviews();
        loadDashboard();
        showToast('Review approved!', 'success');
    }
}

function deleteReview(id) {
    if (!confirm('Delete this review?')) return;
    customerReviews = customerReviews.filter(r => r.id !== id);
    saveData();
    renderReviews();
    loadDashboard();
    showToast('Review deleted!', 'success');
}

// Gallery
function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    if (galleryImages.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-parchment/60 py-12">No images</div>';
        return;
    }
    
    grid.innerHTML = galleryImages.map(image => `
        <div class="gallery-item-admin relative group">
            <img src="${image.src}" alt="${image.alt}" class="w-full h-full object-cover rounded-lg" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button onclick="deleteGalleryImage(${image.id})" class="w-10 h-10 bg-red-500/80 rounded-full">🗑️</button>
            </div>
            <p class="text-parchment/60 text-xs mt-2 text-center">${image.alt}</p>
        </div>
    `).join('');
}

function openGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;
    
    document.getElementById('gallery-image-url').value = '';
    document.getElementById('gallery-image-file').value = '';
    document.getElementById('gallery-image-alt').value = '';
    
    const preview = document.getElementById('gallery-image-preview');
    if (preview) preview.classList.add('hidden');
    
    modal.classList.add('active');
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) modal.classList.remove('active');
}

function handleGallerySubmit(event) {
    if (event) event.preventDefault();
    
    const imageUrl = document.getElementById('gallery-image-url').value;
    const imageFile = document.getElementById('gallery-image-file').files[0];
    const alt = document.getElementById('gallery-image-alt').value || 'Gallery image';
    
    const processImage = (finalImageUrl) => {
        const image = {
            id: Math.max(...galleryImages.map(i => i.id), 0) + 1,
            src: finalImageUrl,
            alt: alt
        };
        
        galleryImages.push(image);
        saveData();
        closeGalleryModal();
        renderGallery();
        loadDashboard();
        showToast('Image added!', 'success');
    };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
        processImage(imageUrl);
    } else {
        showToast('Please provide image URL or upload file', 'error');
    }
}

function deleteGalleryImage(id) {
    if (!confirm('Delete this image?')) return;
    galleryImages = galleryImages.filter(i => i.id !== id);
    saveData();
    renderGallery();
    loadDashboard();
    showToast('Image deleted!', 'success');
}

// Reservations
function loadReservations() {
    const tbody = document.getElementById('reservations-body');
    if (!tbody) return;
    
    const filter = document.getElementById('reservation-filter');
    const filterValue = filter ? filter.value : 'all';
    
    let filtered = reservations;
    if (filterValue !== 'all') {
        filtered = reservations.filter(r => r.status === filterValue);
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-parchment/60 py-8">No reservations</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(res => `
        <tr>
            <td class="text-parchment/60">#${res.id}</td>
            <td class="text-parchment">${res.name}</td>
            <td class="text-parchment/80">
                <div>${res.email}</div>
                <div class="text-sm">${res.phone}</div>
            </td>
            <td class="text-parchment/80">${res.date} at ${res.time}</td>
            <td class="text-parchment/80">${res.guests}</td>
            <td class="text-parchment/80">${res.location}</td>
            <td><span class="badge badge-${getStatusColor(res.status)}">${capitalize(res.status)}</span></td>
            <td>
                ${res.status === 'pending' ? `
                    <button onclick="updateReservationStatus(${res.id}, 'confirmed')" class="action-btn badge badge-success mr-1">✓</button>
                    <button onclick="updateReservationStatus(${res.id}, 'cancelled')" class="action-btn badge badge-danger">✕</button>
                ` : '<span class="text-parchment/40 text-sm">-</span>'}
            </td>
        </tr>
    `).join('');
}

function updateReservationStatus(id, status) {
    const res = reservations.find(r => r.id === id);
    if (res) {
        res.status = status;
        saveData();
        loadReservations();
        loadDashboard();
        showToast('Reservation ' + status + '!', 'success');
    }
}

// Customers
function loadCustomers() {
    const tbody = document.getElementById('customers-body');
    if (!tbody) return;
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-parchment/60 py-8">No registered customers</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map(customer => {
        const orderCount = customer.orders ? customer.orders.length : 0;
        
        return `
            <tr>
                <td class="text-parchment">${customer.name}</td>
                <td class="text-parchment/80">${customer.email}</td>
                <td class="text-parchment/80">${customer.phone}</td>
                <td class="text-parchment/60 text-sm">${new Date(customer.registeredAt).toLocaleDateString('en-KE')}</td>
                <td><span class="badge badge-info">${orderCount} orders</span></td>
            </tr>
        `;
    }).join('');
}

// Utilities
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusColor(status) {
    const colors = { pending: 'warning', confirmed: 'success', completed: 'info', cancelled: 'danger' };
    return colors[status] || 'info';
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast toast-' + type + ' show';
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 16px 24px; border-radius: 8px; z-index: 2000; background: ' + (type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#3b82f6') + '; color: white; font-weight: 500;';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (preview && input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function refreshData() {
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
        const sectionId = activeNav.dataset.section;
        loadSectionData(sectionId);
        showToast('Data refreshed!', 'info');
    }
}

function saveSettings() {
    showToast('Settings saved!', 'success');
}

function setCurrentDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-KE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize
function init() {
    loadData();
    setCurrentDate();
    loadDashboard();
}

// Check auth on load
checkAuth();

// Initialize
init();

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

