// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentStep = 1;
let products = [];

// Sample Product Data
const sampleProducts = [
    {
        id: 1,
        name: "Samsung Galaxy S24",
        description: "Latest flagship smartphone with advanced AI features and stunning camera",
        price: 999,
        originalPrice: 1199,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        category: "phones",
        stock: 15,
        rating: 4.8,
        discount: 17
    },
    {
        id: 2,
        name: "iPhone 14 Pro Max",
        description: "Premium iPhone with Dynamic Island and Pro camera system",
        price: 1099,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
        category: "phones",
        stock: 12,
        rating: 4.9,
        discount: 15
    },
    {
        id: 3,
        name: "MacBook Pro 16\"",
        description: "Powerful laptop with M3 chip for professional workflows",
        price: 2499,
        originalPrice: 2799,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        category: "laptops",
        stock: 8,
        rating: 4.7,
        discount: 11
    },
    {
        id: 4,
        name: "Dell XPS 13",
        description: "Ultra-portable laptop with stunning InfinityEdge display",
        price: 1299,
        originalPrice: 1499,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        category: "laptops",
        stock: 10,
        rating: 4.6,
        discount: 13
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling wireless headphones",
        price: 399,
        originalPrice: 449,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        category: "headphones",
        stock: 20,
        rating: 4.8,
        discount: 11
    },
    {
        id: 6,
        name: "AirPods Pro 2",
        description: "Active noise cancellation with spatial audio",
        price: 249,
        originalPrice: 299,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
        category: "headphones",
        stock: 25,
        rating: 4.7,
        discount: 17
    },
    {
        id: 7,
        name: "iPad Pro 12.9\"",
        description: "Ultimate iPad experience with M2 chip and Liquid Retina display",
        price: 1099,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        category: "electronics",
        stock: 14,
        rating: 4.8,
        discount: 15
    },
    {
        id: 8,
        name: "Apple Watch Series 9",
        description: "Advanced health monitoring and fitness tracking",
        price: 399,
        originalPrice: 449,
        image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=300&fit=crop",
        category: "electronics",
        stock: 18,
        rating: 4.6,
        discount: 11
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    products = sampleProducts;
    initializeApp();
});

function initializeApp() {
    loadProducts();
    updateCartUI();
    setupEventListeners();
    setupNavigation();
    updateCartCount();
}

// Navigation Functions
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Special handling for dashboard
        if (sectionId === 'dashboard') {
            loadDashboardData();
        }
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Product Functions
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card fade-in" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="add-to-wishlist" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart${wishlist.includes(product.id) ? '' : '-o'}"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    // Update filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load filtered products
    loadProducts(category);
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase();
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    const productsGrid = document.getElementById('productsGrid');
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
    } else {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                        ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="add-to-wishlist" onclick="toggleWishlist(${product.id})">
                            <i class="fas fa-heart${wishlist.includes(product.id) ? '' : '-o'}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    updateCartCount();
    saveCart();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateCartCount();
    saveCart();
    showToast('Item removed from cart', 'info');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    updateCartCount();
    saveCart();
    showToast('Cart cleared', 'info');
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartSubtotal) cartSubtotal.textContent = '$0.00';
        if (cartShipping) cartShipping.textContent = '$0.00';
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;
    
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartShipping) cartShipping.textContent = `$${shipping.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`${product.name} removed from wishlist`, 'info');
    } else {
        wishlist.push(productId);
        showToast(`${product.name} added to wishlist!`, 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadProducts(); // Refresh to update heart icons
}

// Authentication Functions
function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.classList.toggle('show');
}

function showLogin() {
    const loginModal = document.getElementById('loginModal');
    loginModal.classList.add('show');
    closeUserMenu();
}

function showRegister() {
    const registerModal = document.getElementById('registerModal');
    registerModal.classList.add('show');
    closeUserMenu();
}

function showProfile() {
    const profileModal = document.getElementById('profileModal');
    profileModal.classList.add('show');
    closeUserMenu();
    loadProfileData();
}

function closeUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.classList.remove('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function switchToRegister() {
    closeModal('loginModal');
    showRegister();
}

function switchToLogin() {
    closeModal('registerModal');
    showLogin();
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading();
    try {
        await firebaseAuth.signInWithEmail(email, password);
        closeModal('loginModal');
        document.getElementById('loginForm').reset();
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    showLoading();
    try {
        await firebaseAuth.signUpWithEmail(email, password, name);
        closeModal('registerModal');
        document.getElementById('registerForm').reset();
    } catch (error) {
        console.error('Register error:', error);
    } finally {
        hideLoading();
    }
}

async function loginWithGoogle() {
    showLoading();
    try {
        await firebaseAuth.signInWithGoogle();
        closeModal('loginModal');
        closeModal('registerModal');
    } catch (error) {
        console.error('Google login error:', error);
    } finally {
        hideLoading();
    }
}

async function registerWithGoogle() {
    await loginWithGoogle();
}

async function logout() {
    try {
        await firebaseAuth.signOut();
        closeUserMenu();
        showSection('home');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showForgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        firebaseAuth.resetPassword(email);
    }
}

// Profile Functions
async function loadProfileData() {
    const user = firebaseAuth.getCurrentUser();
    if (user) {
        document.getElementById('profileName').value = user.displayName || '';
        document.getElementById('profileEmail').value = user.email || '';
        
        // Load addresses
        const addresses = await firebaseAuth.getUserAddresses();
        displayAddresses(addresses);
        
        // Load order history
        const orders = await firebaseAuth.getUserOrders();
        displayOrders(orders);
    }
}

async function updateProfile(event) {
    event.preventDefault();
    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    
    try {
        await firebaseAuth.updateUserProfile({
            displayName: name,
            phone: phone
        });
    } catch (error) {
        console.error('Profile update error:', error);
    }
}

function showTab(tabId) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Show target tab pane
    document.getElementById(tabId).classList.add('active');
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function displayAddresses(addresses) {
    const addressesList = document.getElementById('addressesList');
    if (addresses.length === 0) {
        addressesList.innerHTML = '<p>No addresses saved yet.</p>';
    } else {
        addressesList.innerHTML = addresses.map((address, index) => `
            <div class="address-item">
                <h4>${address.name}</h4>
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} ${address.postal}</p>
                <p>${address.country}</p>
                <button onclick="editAddress(${index})">Edit</button>
                <button onclick="deleteAddress(${index})">Delete</button>
            </div>
        `).join('');
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
    } else {
        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <h4>Order #${order.orderId}</h4>
                <p>Status: <span class="order-status">${order.status}</span></p>
                <p>Total: $${order.total}</p>
                <p>Date: ${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p>
            </div>
        `).join('');
    }
}

function addNewAddress() {
    // Implementation for adding new address
    showToast('Add address functionality coming soon!', 'info');
}

// Dashboard Functions
async function loadDashboardData() {
    const user = firebaseAuth.getCurrentUser();
    if (!user) {
        showSection('home');
        showToast('Please login to access dashboard', 'warning');
        return;
    }
    
    // Load recent orders
    const orders = await firebaseAuth.getUserOrders();
    const recentOrders = orders.slice(0, 3);
    
    const recentOrdersContainer = document.getElementById('recentOrders');
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p>No recent orders found.</p>';
    } else {
        recentOrdersContainer.innerHTML = recentOrders.map(order => `
            <div class="order-summary">
                <h4>Order #${order.orderId}</h4>
                <p>Status: ${order.status}</p>
                <p>Total: $${order.total}</p>
            </div>
        `).join('');
    }
    
    // Load wishlist items
    const wishlistContainer = document.getElementById('wishlistItems');
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    } else {
        const wishlistProducts = products.filter(p => wishlist.includes(p.id));
        wishlistContainer.innerHTML = wishlistProducts.map(product => `
            <div class="wishlist-item">
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div>
                    <h5>${product.name}</h5>
                    <p>$${product.price}</p>
                </div>
            </div>
        `).join('');
    }
}

function showOrders() {
    showProfile();
    setTimeout(() => {
        showTab('order-history');
    }, 100);
}

// Checkout Functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    const user = firebaseAuth.getCurrentUser();
    if (!user) {
        showToast('Please login to proceed with checkout', 'warning');
        showLogin();
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('show');
    toggleCart(); // Close cart sidebar
    
    // Pre-fill user information
    if (user) {
        document.getElementById('shippingName').value = user.displayName || '';
        document.getElementById('shippingEmail').value = user.email || '';
    }
    
    updateOrderSummary();
}

function nextCheckoutStep() {
    if (currentStep === 1) {
        // Validate shipping form
        const form = document.getElementById('shippingForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        currentStep = 2;
    } else if (currentStep === 2) {
        // Validate payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (!paymentMethod) {
            showToast('Please select a payment method', 'warning');
            return;
        }
        currentStep = 3;
        updateOrderSummary();
    }
    
    updateCheckoutStep();
}

function prevCheckoutStep() {
    if (currentStep > 1) {
        currentStep--;
        updateCheckoutStep();
    }
}

function updateCheckoutStep() {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Show/hide step content
    const stepContents = document.querySelectorAll('.checkout-step');
    stepContents.forEach((content, index) => {
        if (index + 1 === currentStep) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function updateOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTax = document.getElementById('summaryTax');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (summaryItems) {
        summaryItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryShipping) summaryShipping.textContent = `$${shipping.toFixed(2)}`;
    if (summaryTax) summaryTax.textContent = `$${tax.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
}

async function placeOrder() {
    showLoading();
    
    try {
        const shippingInfo = {
            name: document.getElementById('shippingName').value,
            email: document.getElementById('shippingEmail').value,
            phone: document.getElementById('shippingPhone').value,
            address: document.getElementById('shippingAddress').value,
            city: document.getElementById('shippingCity').value,
            state: document.getElementById('shippingState').value,
            postal: document.getElementById('shippingPostal').value,
            country: document.getElementById('shippingCountry').value
        };
        
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;
        
        const orderData = {
            items: cart,
            shippingInfo,
            paymentMethod,
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
        
        const order = await firebaseAuth.createOrder(orderData);
        
        // Process payment based on method
        await processPayment(paymentMethod, total, order.orderId);
        
        // Clear cart and close modal
        clearCart();
        closeModal('checkoutModal');
        currentStep = 1;
        updateCheckoutStep();
        
        showToast('Order placed successfully! Check your email for confirmation.', 'success');
        
    } catch (error) {
        console.error('Order placement error:', error);
        showToast('Failed to place order. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function processPayment(method, amount, orderId) {
    // Simulate payment processing
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Processing ${method} payment of $${amount} for order ${orderId}`);
            resolve();
        }, 2000);
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchProducts, 300));
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
        
        // Close user dropdown when clicking outside
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        if (!userMenu.contains(event.target)) {
            userDropdown.classList.remove('show');
        }
        
        // Close cart when clicking outside
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBtn = document.querySelector('.cart-btn');
        if (!cartSidebar.contains(event.target) && !cartBtn.contains(event.target)) {
            cartSidebar.classList.remove('open');
        }
    });
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            showPaymentDetails(this.value);
        });
    });
}

function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    let content = '';
    
    switch (method) {
        case 'jazzcash':
            content = `
                <div class="payment-form">
                    <h5>JazzCash Payment</h5>
                    <div class="form-group">
                        <label>Mobile Number</label>
                        <input type="tel" placeholder="03xxxxxxxxx" required>
                    </div>
                    <div class="form-group">
                        <label>PIN</label>
                        <input type="password" placeholder="Enter your JazzCash PIN" required>
                    </div>
                </div>
            `;
            break;
        case 'easypaisa':
            content = `
                <div class="payment-form">
                    <h5>EasyPaisa Payment</h5>
                    <div class="form-group">
                        <label>Mobile Number</label>
                        <input type="tel" placeholder="03xxxxxxxxx" required>
                    </div>
                    <div class="form-group">
                        <label>PIN</label>
                        <input type="password" placeholder="Enter your EasyPaisa PIN" required>
                    </div>
                </div>
            `;
            break;
        case 'bank':
            content = `
                <div class="payment-form">
                    <h5>Bank Transfer Details</h5>
                    <div class="bank-details">
                        <p><strong>Bank:</strong> YBT Bank</p>
                        <p><strong>Account Name:</strong> YBT Store</p>
                        <p><strong>Account Number:</strong> 1234567890</p>
                        <p><strong>IBAN:</strong> PK12YBTB1234567890</p>
                    </div>
                    <div class="form-group">
                        <label>Transaction Reference</label>
                        <input type="text" placeholder="Enter transaction reference" required>
                    </div>
                </div>
            `;
            break;
        case 'cod':
            content = `
                <div class="payment-form">
                    <h5>Cash on Delivery</h5>
                    <p>You will pay when your order is delivered.</p>
                    <p><strong>Note:</strong> Please have exact change ready.</p>
                </div>
            `;
            break;
    }
    
    paymentDetails.innerHTML = content;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('show');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    let icon = 'fas fa-info-circle';
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
    }
    
    toastIcon.className = `toast-icon ${icon}`;
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update TODO status
document.addEventListener('DOMContentLoaded', function() {
    // Mark todos as completed
    if (typeof todo_write === 'function') {
        todo_write({
            merge: true,
            todos: [
                {id: "create-main-html", status: "completed"},
                {id: "create-css-styles", status: "completed"},
                {id: "create-javascript-functionality", status: "completed"},
                {id: "create-firebase-config", status: "completed"}
            ]
        });
    }
});