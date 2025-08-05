# YBT Store - Complete E-commerce Website

A fully functional, modern e-commerce website built with HTML, CSS, JavaScript, and Firebase authentication. Features a professional design, shopping cart functionality, user authentication, and integrated payment systems.

## 🚀 Features

### 🛍️ E-commerce Core Features
- **Product Catalog**: Browse products by categories (Phones, Laptops, Headphones, Electronics)
- **Search & Filter**: Real-time product search and category filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent cart storage
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔐 Authentication System
- **Firebase Authentication**: Secure user registration and login
- **Google Sign-in**: One-click authentication with Google
- **Password Reset**: Email-based password recovery
- **User Profiles**: Manage personal information and addresses
- **Protected Routes**: Dashboard and checkout require authentication

### 💳 Payment Integration
- **Multiple Payment Methods**:
  - JazzCash mobile wallet
  - EasyPaisa mobile wallet
  - Bank transfer
  - Cash on Delivery (COD)
- **Secure Checkout**: Multi-step checkout process
- **Order Management**: Track orders and view history

### 📱 User Experience
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, loading states, toast notifications
- **Dashboard**: Personal dashboard with order history and account management
- **Real-time Updates**: Cart count, user status, and notifications

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (with animations), Vanilla JavaScript
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)
- **Images**: Unsplash API for product images

## 📋 Prerequisites

Before running this project, make sure you have:

1. A modern web browser (Chrome, Firefox, Safari, Edge)
2. A Firebase project set up
3. Basic knowledge of HTML, CSS, and JavaScript

## 🔧 Setup Instructions

### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd ybt-store

# Or download and extract the ZIP file
```

### 2. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Authentication**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password" and "Google" providers
   - For Google sign-in, add your domain to authorized domains

3. **Set up Firestore Database**:
   - Go to Firestore Database
   - Create database in test mode (or production with proper rules)
   - The app will automatically create necessary collections

4. **Get Firebase Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the configuration object

### 3. Configure the Application

1. **Update Firebase Configuration**:
   - Open `firebase-config.js`
   - Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 4. Run the Application

1. **Local Development**:
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

2. **Access the Application**:
   - Open your browser and go to `http://localhost:8000`
   - The application should load with all features working

## 📖 Usage Guide

### For Customers

1. **Browse Products**:
   - View featured products on the home page
   - Use category filters to find specific product types
   - Search for products using the search bar

2. **Shopping**:
   - Click "Add to Cart" to add products
   - Click the heart icon to add/remove from wishlist
   - View cart by clicking the cart icon in the header
   - Adjust quantities or remove items in the cart

3. **Account Management**:
   - Register a new account or login with existing credentials
   - Use Google Sign-in for quick access
   - Access dashboard to view orders and manage profile
   - Update personal information and addresses

4. **Checkout Process**:
   - Click "Checkout" from the cart
   - Fill in shipping information
   - Select payment method (JazzCash, EasyPaisa, Bank Transfer, or COD)
   - Review order and place it

### For Developers

1. **Customizing Products**:
   - Edit the `sampleProducts` array in `script.js`
   - Add/remove products or modify existing ones
   - Update categories and pricing

2. **Styling**:
   - Modify `styles.css` for design changes
   - Update color scheme by changing CSS custom properties
   - Add new animations or modify existing ones

3. **Functionality**:
   - Extend features by modifying `script.js`
   - Add new payment methods in the checkout process
   - Implement additional user features

## 🎨 Customization

### Changing Colors
Update the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4CAF50;
    --secondary-color: #667eea;
    --accent-color: #ff4757;
}
```

### Adding New Products
Add products to the `sampleProducts` array in `script.js`:
```javascript
{
    id: 9,
    name: "New Product",
    description: "Product description",
    price: 299,
    originalPrice: 399,
    image: "product-image-url",
    category: "category-name",
    stock: 10,
    rating: 4.5,
    discount: 25
}
```

### Adding Payment Methods
Extend the payment options in the checkout process by modifying the `showPaymentDetails()` function in `script.js`.

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Input Validation**: Form validation and sanitization
- **Protected Routes**: Authentication required for sensitive operations
- **Secure Storage**: User data stored securely in Firestore
- **HTTPS Ready**: Compatible with secure hosting

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full features with optimal layout
- **Tablet**: Adapted layout for touch interfaces
- **Mobile**: Mobile-first design with touch-friendly elements

## 🚀 Deployment

### Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

### Other Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for static sites
- **Traditional Web Hosting**: Upload files via FTP

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Errors**:
   - Check if Firebase configuration is correct
   - Ensure authentication methods are enabled
   - Verify Firestore rules allow read/write operations

2. **Products Not Loading**:
   - Check browser console for JavaScript errors
   - Ensure all script files are loaded correctly

3. **Authentication Issues**:
   - Verify Firebase project settings
   - Check if domain is added to authorized domains
   - Ensure popup blockers are disabled for Google sign-in

4. **Styling Issues**:
   - Clear browser cache
   - Check if CSS files are loading correctly
   - Verify Font Awesome and Google Fonts are accessible

## 📞 Support

If you encounter any issues or need help:

1. Check the browser console for error messages
2. Verify Firebase configuration and settings
3. Ensure all files are properly uploaded/hosted
4. Check network connectivity for external resources

## 🔄 Updates and Maintenance

### Regular Updates
- Keep Firebase SDK updated
- Update product information regularly
- Monitor and update external dependencies
- Review and update security rules

### Performance Optimization
- Optimize images for web
- Minify CSS and JavaScript for production
- Enable caching for static assets
- Monitor Firebase usage and costs

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**YBT Store** - Your complete e-commerce solution! 🛍️✨