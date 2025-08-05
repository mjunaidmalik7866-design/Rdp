// Product Data
const products = [
    {
        id: 1,
        name: "Samsung Galaxy S24 Ultra",
        description: "Latest flagship smartphone with advanced camera system and S Pen",
        price: 450000,
        originalPrice: 500000,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
        category: "phones",
        stock: 15,
        rating: 4.8,
        features: ["8/256GB RAM/Storage", "200MP Camera", "S Pen Included", "5000mAh Battery"]
    },
    {
        id: 2,
        name: "iPhone 14 Pro Max",
        description: "Premium iPhone with Dynamic Island and Pro camera system",
        price: 330000,
        originalPrice: 380000,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
        category: "phones",
        stock: 12,
        rating: 4.9,
        features: ["128GB Storage", "48MP Camera", "A16 Bionic Chip", "Face ID"]
    },
    {
        id: 3,
        name: "MacBook Pro 16-inch",
        description: "Powerful laptop for professionals with M3 Pro chip",
        price: 580000,
        originalPrice: 650000,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
        category: "laptops",
        stock: 8,
        rating: 4.7,
        features: ["M3 Pro Chip", "16GB RAM", "512GB SSD", "16-inch Retina Display"]
    },
    {
        id: 4,
        name: "Dell XPS 13",
        description: "Ultra-portable laptop with stunning display",
        price: 280000,
        originalPrice: 320000,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
        category: "laptops",
        stock: 10,
        rating: 4.6,
        features: ["Intel i7", "16GB RAM", "1TB SSD", "13.4-inch 4K Display"]
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling wireless headphones",
        price: 85000,
        originalPrice: 95000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        category: "headphones",
        stock: 25,
        rating: 4.8,
        features: ["30hr Battery", "Active Noise Canceling", "Quick Charge", "Touch Controls"]
    },
    {
        id: 6,
        name: "AirPods Pro (2nd Gen)",
        description: "Premium wireless earbuds with spatial audio",
        price: 65000,
        originalPrice: 75000,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
        category: "headphones",
        stock: 30,
        rating: 4.7,
        features: ["Spatial Audio", "Active Noise Cancellation", "6hr Battery", "MagSafe Case"]
    },
    {
        id: 7,
        name: "iPad Pro 12.9-inch",
        description: "Ultimate iPad experience with M2 chip",
        price: 420000,
        originalPrice: 480000,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        category: "electronics",
        stock: 6,
        rating: 4.8,
        features: ["M2 Chip", "12.9-inch Display", "Apple Pencil Support", "256GB Storage"]
    },
    {
        id: 8,
        name: "Gaming Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard for gaming",
        price: 25000,
        originalPrice: 30000,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
        category: "electronics",
        stock: 20,
        rating: 4.5,
        features: ["RGB Backlighting", "Mechanical Switches", "Anti-Ghosting", "USB-C"]
    }
];

// Shopping Cart
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartUI();
    }

    add(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.save();
        this.updateCartUI();
        showToast(`${product.name} added to cart!`, 'success');
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartUI();
        showToast('Item removed from cart', 'success');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.remove(productId);
            } else {
                item.quantity = quantity;
                this.save();
                this.updateCartUI();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.save();
        this.updateCartUI();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadProducts();
    setupModals();
    setupSearch();
    setupCategoryFilters();
    
    // Check URL hash for routing
    handleRouting();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleRouting);
}

function setupEventListeners() {
    // Navigation events
    document.getElementById('cartBtn')?.addEventListener('click', showCartModal);
    document.getElementById('loginLink')?.addEventListener('click', showLoginModal);
    document.getElementById('registerLink')?.addEventListener('click', showRegisterModal);
    document.getElementById('profileLink')?.addEventListener('click', showProfile);
    document.getElementById('dashboardLink')?.addEventListener('click', showDashboard);
    document.getElementById('logoutLink')?.addEventListener('click', handleLogout);
    
    // Form submissions
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordForm')?.addEventListener('submit', handleForgotPassword);
    
    // Modal switches
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('loginModal');
        showModal('registerModal');
    });
    
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('registerModal');
        showModal('loginModal');
    });
    
    document.getElementById('showForgotPassword')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('loginModal');
        showModal('forgotPasswordModal');
    });
    
    document.getElementById('backToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('forgotPasswordModal');
        showModal('loginModal');
    });
    
    // Cart actions
    document.getElementById('continueShopping')?.addEventListener('click', () => {
        hideModal('cartModal');
    });
    
    document.getElementById('proceedCheckout')?.addEventListener('click', () => {
        if (authFunctions.isAuthenticated()) {
            hideModal('cartModal');
            showCheckout();
        } else {
            hideModal('cartModal');
            showToast('Please login to proceed with checkout', 'warning');
            showLoginModal();
        }
    });
    
    // Hero CTA
    document.querySelector('.cta-btn')?.addEventListener('click', () => {
        document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
    });
}

function setupModals() {
    // Close modal events
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function setupCategoryFilters() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterProductsByCategory(category);
        });
    });
}

function loadProducts(productsToShow = products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                PKR ${product.price.toLocaleString()}
                ${product.originalPrice ? `<span class="product-original-price">PKR ${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="product-features">
                ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="product-actions">
                <button class="btn btn-success add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn btn-secondary view-details-btn" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        cart.add(product);
    });
    
    card.querySelector('.view-details-btn').addEventListener('click', () => {
        showProductDetails(product);
    });
    
    return card;
}

function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close">&times;</span>
            <div class="product-details">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
                <h2>${product.name}</h2>
                <p style="color: #666; margin-bottom: 20px;">${product.description}</p>
                <div class="product-price" style="font-size: 1.5rem; margin-bottom: 20px;">
                    PKR ${product.price.toLocaleString()}
                    ${product.originalPrice ? `<span class="product-original-price">PKR ${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-features" style="margin-bottom: 20px;">
                    <h4>Features:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="product-stock" style="margin-bottom: 20px;">
                    <span class="stock-info ${product.stock > 5 ? 'in-stock' : 'low-stock'}">
                        ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                </div>
                <div class="quantity-selector" style="margin-bottom: 20px;">
                    <label for="quantity">Quantity:</label>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <button type="button" class="quantity-btn" id="decreaseQty">-</button>
                        <input type="number" id="quantity" value="1" min="1" max="${product.stock}" style="width: 60px; text-align: center;">
                        <button type="button" class="quantity-btn" id="increaseQty">+</button>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-success" id="addToCartBtn" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners for the modal
    const quantityInput = modal.querySelector('#quantity');
    const decreaseBtn = modal.querySelector('#decreaseQty');
    const increaseBtn = modal.querySelector('#increaseQty');
    const addToCartBtn = modal.querySelector('#addToCartBtn');
    const closeBtn = modal.querySelector('.close');
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < product.stock) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        cart.add(product, quantity);
        document.body.removeChild(modal);
    });
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    loadProducts(filteredProducts);
    
    if (filteredProducts.length === 0) {
        document.getElementById('productGrid').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3>No products found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
    }
}

function filterProductsByCategory(category) {
    if (category === 'shopping') {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    loadProducts(filteredProducts);
    
    // Scroll to products section
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

function showLoginModal() {
    showModal('loginModal');
}

function showRegisterModal() {
    showModal('registerModal');
}

function showCartModal() {
    renderCartItems();
    showModal('cartModal');
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.items.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">PKR ${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn decrease-qty" data-product-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-qty" data-product-id="${item.id}">+</button>
                    <button class="remove-btn" data-product-id="${item.id}">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = cart.getTotal().toLocaleString();
    
    // Add event listeners for cart controls
    cartItems.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const item = cart.items.find(item => item.id === productId);
            if (item) {
                cart.updateQuantity(productId, item.quantity - 1);
                renderCartItems();
            }
        });
    });
    
    cartItems.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            const item = cart.items.find(item => item.id === productId);
            if (item) {
                cart.updateQuantity(productId, item.quantity + 1);
                renderCartItems();
            }
        });
    });
    
    cartItems.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            cart.remove(productId);
            renderCartItems();
        });
    });
}

// Authentication handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await authFunctions.signIn(email, password);
        hideModal('loginModal');
        document.getElementById('loginForm').reset();
    } catch (error) {
        // Error handling is done in authFunctions
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    try {
        await authFunctions.signUp(email, password, name);
        hideModal('registerModal');
        document.getElementById('registerForm').reset();
    } catch (error) {
        // Error handling is done in authFunctions
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    try {
        await authFunctions.resetPassword(email);
        hideModal('forgotPasswordModal');
        document.getElementById('forgotPasswordForm').reset();
    } catch (error) {
        // Error handling is done in authFunctions
    }
}

async function handleLogout() {
    await authFunctions.signOut();
}

// Page routing
function handleRouting() {
    const hash = window.location.hash.slice(1) || 'home';
    
    // Hide all sections
    hideAllSections();
    
    switch(hash) {
        case 'home':
            showHomePage();
            break;
        case 'dashboard':
            if (authFunctions.isAuthenticated()) {
                showDashboard();
            } else {
                showToast('Please login to access dashboard', 'warning');
                showLoginModal();
                window.location.hash = 'home';
            }
            break;
        case 'profile':
            if (authFunctions.isAuthenticated()) {
                showProfile();
            } else {
                showToast('Please login to access profile', 'warning');
                showLoginModal();
                window.location.hash = 'home';
            }
            break;
        case 'checkout':
            if (authFunctions.isAuthenticated() && cart.items.length > 0) {
                showCheckout();
            } else if (!authFunctions.isAuthenticated()) {
                showToast('Please login to checkout', 'warning');
                showLoginModal();
                window.location.hash = 'home';
            } else {
                showToast('Your cart is empty', 'warning');
                window.location.hash = 'home';
            }
            break;
        default:
            showHomePage();
    }
}

function hideAllSections() {
    const sections = ['hero', 'categories', 'products', 'footer'];
    sections.forEach(section => {
        const element = document.querySelector(`.${section}`);
        if (element) {
            element.style.display = section === 'hero' || section === 'categories' || section === 'products' || section === 'footer' ? 'block' : 'none';
        }
    });
    
    // Hide custom pages
    const customPages = document.querySelectorAll('.custom-page');
    customPages.forEach(page => page.remove());
}

function showHomePage() {
    // Show main sections
    const sections = ['hero', 'categories', 'products', 'footer'];
    sections.forEach(section => {
        const element = document.querySelector(`.${section}`);
        if (element) {
            element.style.display = 'block';
        }
    });
}

function showDashboard() {
    hideAllSections();
    
    const dashboardHTML = `
        <div class="custom-page dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Dashboard</h1>
                    <p class="dashboard-subtitle">Welcome back! Manage your account and orders</p>
                </div>
                
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <h3 class="card-title">Recent Orders</h3>
                        </div>
                        <div class="card-content">
                            <div id="recentOrders">Loading...</div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <h3 class="card-title">Account Stats</h3>
                        </div>
                        <div class="card-content">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-number" id="totalOrders">0</div>
                                    <div class="stat-label">Total Orders</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number" id="totalSpent">PKR 0</div>
                                    <div class="stat-label">Total Spent</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <h3 class="card-title">Featured Products</h3>
                        </div>
                        <div class="card-content">
                            <div id="featuredProducts"></div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <h3 class="card-title">Quick Actions</h3>
                        </div>
                        <div class="card-content">
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <button class="btn btn-primary" onclick="window.location.hash='profile'">
                                    <i class="fas fa-user-edit"></i> Edit Profile
                                </button>
                                <button class="btn btn-secondary" onclick="showCartModal()">
                                    <i class="fas fa-shopping-cart"></i> View Cart (${cart.getItemCount()})
                                </button>
                                <button class="btn btn-success" onclick="window.location.hash='home'">
                                    <i class="fas fa-shopping-bag"></i> Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    loadDashboardData();
}

async function loadDashboardData() {
    const user = authFunctions.getCurrentUser();
    if (!user) return;
    
    try {
        // Load recent orders
        const orders = await firestoreHelpers.getUserOrders(user.uid);
        const recentOrdersElement = document.getElementById('recentOrders');
        
        if (orders.length === 0) {
            recentOrdersElement.innerHTML = '<p>No orders yet. <a href="#home">Start shopping!</a></p>';
        } else {
            recentOrdersElement.innerHTML = orders.slice(0, 3).map(order => `
                <div class="order-summary">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong>Order #${order.id.slice(-6)}</strong>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                    <div style="color: #666; font-size: 0.9rem;">
                        ${order.items?.length || 0} items • PKR ${order.total?.toLocaleString() || '0'}
                    </div>
                </div>
            `).join('');
        }
        
        // Update stats
        document.getElementById('totalOrders').textContent = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        document.getElementById('totalSpent').textContent = `PKR ${totalSpent.toLocaleString()}`;
        
        // Load featured products
        const featuredProductsElement = document.getElementById('featuredProducts');
        const featuredProducts = products.slice(0, 3);
        featuredProductsElement.innerHTML = featuredProducts.map(product => `
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 10px;">
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 5px;">${product.name}</div>
                    <div style="color: #00ff88; font-weight: 700;">PKR ${product.price.toLocaleString()}</div>
                </div>
                <button class="btn btn-sm btn-success" onclick="cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function showProfile() {
    hideAllSections();
    
    const profileHTML = `
        <div class="custom-page profile">
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h2 id="profileName">Loading...</h2>
                    <p id="profileEmail">Loading...</p>
                </div>
                
                <div class="profile-tabs">
                    <button class="tab-btn active" data-tab="profile">My Profile</button>
                    <button class="tab-btn" data-tab="orders">Order History</button>
                    <button class="tab-btn" data-tab="addresses">Addresses</button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-panel active" id="profile-panel">
                        <h3>Personal Information</h3>
                        <form id="profileForm">
                            <div class="form-group">
                                <label for="profileNameInput">Full Name</label>
                                <input type="text" id="profileNameInput" required>
                            </div>
                            <div class="form-group">
                                <label for="profileEmailInput">Email</label>
                                <input type="email" id="profileEmailInput" disabled>
                            </div>
                            <button type="submit" class="btn btn-primary">Update Profile</button>
                        </form>
                    </div>
                    
                    <div class="tab-panel" id="orders-panel">
                        <h3>Order History</h3>
                        <div id="orderHistory">Loading...</div>
                    </div>
                    
                    <div class="tab-panel" id="addresses-panel">
                        <h3>Saved Addresses</h3>
                        <div id="addressList">Loading...</div>
                        <button class="btn btn-primary" id="addAddressBtn">Add New Address</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', profileHTML);
    setupProfileTabs();
    loadProfileData();
}

function setupProfileTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab panel
            tabPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
    
    // Profile form submission
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
}

async function loadProfileData() {
    const user = authFunctions.getCurrentUser();
    if (!user) return;
    
    try {
        // Load basic profile info
        document.getElementById('profileName').textContent = user.displayName || 'User';
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileNameInput').value = user.displayName || '';
        document.getElementById('profileEmailInput').value = user.email;
        
        // Load user data from Firestore
        const userData = await firestoreHelpers.getUserProfile(user.uid);
        
        // Load order history
        const orders = await firestoreHelpers.getUserOrders(user.uid);
        const orderHistoryElement = document.getElementById('orderHistory');
        
        if (orders.length === 0) {
            orderHistoryElement.innerHTML = '<p>No orders found. <a href="#home">Start shopping!</a></p>';
        } else {
            orderHistoryElement.innerHTML = orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <div>
                            <strong>Order #${order.id.slice(-6)}</strong>
                            <div style="color: #666; font-size: 0.9rem;">
                                ${order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Date not available'}
                            </div>
                        </div>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                    <div class="order-details">
                        <p>${order.items?.length || 0} items • PKR ${order.total?.toLocaleString() || '0'}</p>
                        ${order.items ? order.items.map(item => `
                            <div style="display: flex; align-items: center; margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                                <div>
                                    <div style="font-weight: 600;">${item.name}</div>
                                    <div style="color: #666;">Qty: ${item.quantity} • PKR ${item.price.toLocaleString()}</div>
                                </div>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            `).join('');
        }
        
        // Load addresses
        const addressListElement = document.getElementById('addressList');
        const addresses = userData?.addresses || [];
        
        if (addresses.length === 0) {
            addressListElement.innerHTML = '<p>No saved addresses.</p>';
        } else {
            addressListElement.innerHTML = addresses.map((address, index) => `
                <div class="address-item ${address.isDefault ? 'default' : ''}">
                    ${address.isDefault ? '<div class="default-badge">Default</div>' : ''}
                    <div><strong>${address.name}</strong></div>
                    <div>${address.street}</div>
                    <div>${address.city}, ${address.state} ${address.postalCode}</div>
                    <div>${address.phone}</div>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-sm btn-secondary" onclick="editAddress(${index})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAddress(${index})">Delete</button>
                        ${!address.isDefault ? `<button class="btn btn-sm btn-primary" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
                    </div>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const user = authFunctions.getCurrentUser();
    if (!user) return;
    
    const name = document.getElementById('profileNameInput').value;
    
    try {
        // Update Firebase Auth profile
        await user.updateProfile({ displayName: name });
        
        // Update Firestore
        await firestoreHelpers.saveUserProfile(user.uid, { name });
        
        // Update UI
        document.getElementById('profileName').textContent = name;
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
    }
}

function showCheckout() {
    hideAllSections();
    
    const checkoutHTML = `
        <div class="custom-page checkout">
            <div class="checkout-container">
                <div class="checkout-header">
                    <h1>Checkout</h1>
                    <p>Complete your order</p>
                </div>
                
                <div class="checkout-content">
                    <div class="checkout-form">
                        <form id="checkoutForm">
                            <div class="form-section">
                                <h3>Shipping Information</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="firstName">First Name</label>
                                        <input type="text" id="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName">Last Name</label>
                                        <input type="text" id="lastName" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <input type="tel" id="phone" required>
                                </div>
                                <div class="form-group">
                                    <label for="address">Street Address</label>
                                    <input type="text" id="address" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="city">City</label>
                                        <input type="text" id="city" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="state">State/Province</label>
                                        <input type="text" id="state" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="postalCode">Postal Code</label>
                                        <input type="text" id="postalCode" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="country">Country</label>
                                        <select id="country" required>
                                            <option value="Pakistan">Pakistan</option>
                                            <option value="India">India</option>
                                            <option value="Bangladesh">Bangladesh</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Payment Method</h3>
                                <div class="payment-methods">
                                    <div class="payment-method">
                                        <input type="radio" id="jazzcash" name="payment" value="jazzcash" required>
                                        <label for="jazzcash">
                                            <i class="fas fa-mobile-alt"></i>
                                            JazzCash
                                        </label>
                                    </div>
                                    <div class="payment-method">
                                        <input type="radio" id="easypaisa" name="payment" value="easypaisa" required>
                                        <label for="easypaisa">
                                            <i class="fas fa-wallet"></i>
                                            EasyPaisa
                                        </label>
                                    </div>
                                    <div class="payment-method">
                                        <input type="radio" id="bank" name="payment" value="bank" required>
                                        <label for="bank">
                                            <i class="fas fa-university"></i>
                                            Bank Transfer
                                        </label>
                                    </div>
                                    <div class="payment-method">
                                        <input type="radio" id="cod" name="payment" value="cod" required>
                                        <label for="cod">
                                            <i class="fas fa-hand-holding-usd"></i>
                                            Cash on Delivery
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-success" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                                Place Order
                            </button>
                        </form>
                    </div>
                    
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div id="checkoutItems"></div>
                        <div class="summary-item">
                            <span>Subtotal</span>
                            <span>PKR ${cart.getTotal().toLocaleString()}</span>
                        </div>
                        <div class="summary-item">
                            <span>Shipping</span>
                            <span>PKR 500</span>
                        </div>
                        <div class="summary-item">
                            <span>Tax</span>
                            <span>PKR ${Math.round(cart.getTotal() * 0.05).toLocaleString()}</span>
                        </div>
                        <div class="summary-total">
                            <span>Total</span>
                            <span>PKR ${(cart.getTotal() + 500 + Math.round(cart.getTotal() * 0.05)).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    setupCheckout();
}

function setupCheckout() {
    // Pre-fill user information
    const user = authFunctions.getCurrentUser();
    if (user) {
        document.getElementById('email').value = user.email;
        if (user.displayName) {
            const names = user.displayName.split(' ');
            document.getElementById('firstName').value = names[0] || '';
            document.getElementById('lastName').value = names.slice(1).join(' ') || '';
        }
    }
    
    // Render checkout items
    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = cart.items.map(item => `
        <div style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                <div style="color: #666;">Qty: ${item.quantity}</div>
            </div>
            <div style="font-weight: 700; color: #00ff88;">
                PKR ${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
    
    // Setup payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('selected'));
            e.target.closest('.payment-method').classList.add('selected');
        });
    });
    
    // Setup form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const user = authFunctions.getCurrentUser();
    if (!user) {
        showToast('Please login to complete your order', 'error');
        return;
    }
    
    if (cart.items.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cart.items,
        shippingAddress: {
            firstName: formData.get('firstName') || document.getElementById('firstName').value,
            lastName: formData.get('lastName') || document.getElementById('lastName').value,
            email: formData.get('email') || document.getElementById('email').value,
            phone: formData.get('phone') || document.getElementById('phone').value,
            street: formData.get('address') || document.getElementById('address').value,
            city: formData.get('city') || document.getElementById('city').value,
            state: formData.get('state') || document.getElementById('state').value,
            postalCode: formData.get('postalCode') || document.getElementById('postalCode').value,
            country: formData.get('country') || document.getElementById('country').value
        },
        paymentMethod: formData.get('payment') || document.querySelector('input[name="payment"]:checked')?.value,
        subtotal: cart.getTotal(),
        shipping: 500,
        tax: Math.round(cart.getTotal() * 0.05),
        total: cart.getTotal() + 500 + Math.round(cart.getTotal() * 0.05)
    };
    
    try {
        showLoading(true);
        
        // Save order to Firestore
        const orderId = await firestoreHelpers.saveOrder(orderData);
        
        // Clear cart
        cart.clear();
        
        // Show success message
        showOrderSuccess(orderId);
        
    } catch (error) {
        console.error('Error placing order:', error);
        showToast('Error placing order. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

function showOrderSuccess(orderId) {
    hideAllSections();
    
    const successHTML = `
        <div class="custom-page" style="padding: 120px 0; text-align: center; background: #f8f9fa;">
            <div class="container">
                <div style="background: white; border-radius: 20px; padding: 60px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto;">
                    <div style="color: #00ff88; font-size: 4rem; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h1 style="color: #333; margin-bottom: 20px;">Order Placed Successfully!</h1>
                    <p style="color: #666; font-size: 1.1rem; margin-bottom: 30px;">
                        Thank you for your order. Your order ID is: <strong>#${orderId.slice(-6)}</strong>
                    </p>
                    <p style="color: #666; margin-bottom: 40px;">
                        You will receive an email confirmation shortly. You can track your order in your dashboard.
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="window.location.hash='dashboard'">
                            <i class="fas fa-tachometer-alt"></i> View Dashboard
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.hash='home'">
                            <i class="fas fa-home"></i> Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

// Utility functions
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        if (show) {
            spinner.classList.add('show');
        } else {
            spinner.classList.remove('show');
        }
    }
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: 10px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Address management functions (for profile page)
window.editAddress = function(index) {
    // Implementation for editing address
    showToast('Edit address functionality - to be implemented', 'info');
};

window.deleteAddress = async function(index) {
    const user = authFunctions.getCurrentUser();
    if (!user) return;
    
    try {
        const userData = await firestoreHelpers.getUserProfile(user.uid);
        const addresses = userData?.addresses || [];
        addresses.splice(index, 1);
        
        await firestoreHelpers.updateAddresses(user.uid, addresses);
        loadProfileData(); // Reload profile data
    } catch (error) {
        console.error('Error deleting address:', error);
        showToast('Error deleting address', 'error');
    }
};

window.setDefaultAddress = async function(index) {
    const user = authFunctions.getCurrentUser();
    if (!user) return;
    
    try {
        const userData = await firestoreHelpers.getUserProfile(user.uid);
        const addresses = userData?.addresses || [];
        
        // Remove default from all addresses
        addresses.forEach(addr => addr.isDefault = false);
        // Set new default
        addresses[index].isDefault = true;
        
        await firestoreHelpers.updateAddresses(user.uid, addresses);
        loadProfileData(); // Reload profile data
    } catch (error) {
        console.error('Error setting default address:', error);
        showToast('Error setting default address', 'error');
    }
};

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}