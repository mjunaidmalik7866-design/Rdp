# YBT Store - Full-Stack E-commerce Website

A complete, production-ready e-commerce website built with HTML, CSS, JavaScript, and Firebase. Features user authentication, shopping cart, checkout process, payment integration, and comprehensive user management.

![YBT Store](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop)

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse products by categories (Electronics, Phones, Laptops, Headphones)
- **Product Search**: Real-time search functionality
- **Product Details**: Detailed product pages with images, features, and stock information
- **Shopping Cart**: Add, remove, update quantities with persistent storage
- **Checkout Process**: Complete order flow with shipping and payment details
- **Order Management**: Track orders and view order history

### User Authentication & Management
- **Firebase Authentication**: Secure user registration and login
- **Password Reset**: Email-based password recovery
- **User Profile**: Manage personal information and addresses
- **User Dashboard**: View orders, statistics, and quick actions
- **Protected Routes**: Secure access to user-specific features

### Payment Integration
- **Multiple Payment Methods**:
  - JazzCash
  - EasyPaisa
  - Bank Transfer
  - Cash on Delivery

### Modern UI/UX
- **Responsive Design**: Mobile-first, works on all devices
- **Modern Animations**: Smooth transitions and hover effects
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Professional loading indicators
- **Modal System**: Clean popup interfaces

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore Database)
- **Styling**: Custom CSS with modern animations and responsive design
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)
- **Storage**: LocalStorage for cart persistence

## 📋 Prerequisites

Before running this project, make sure you have:

1. A modern web browser (Chrome, Firefox, Safari, Edge)
2. A Firebase account
3. Basic knowledge of HTML, CSS, and JavaScript

## 🔧 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "ybt-store")
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### Step 3: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Done

### Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>)
4. Register your app with a name
5. Copy the Firebase configuration object

### Step 5: Configure the Application

1. Open `firebase-config.js`
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Step 6: Set Firestore Security Rules (Optional for Production)

In Firestore Database > Rules, use these rules for better security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Products are read-only for all users
    match /products/{productId} {
      allow read: if true;
    }
  }
}
```

## 🚀 Installation & Setup

### Method 1: Direct File Opening
1. Download all project files
2. Update `firebase-config.js` with your Firebase configuration
3. Open `index.html` in your web browser

### Method 2: Local Server (Recommended)
1. Download all project files
2. Update `firebase-config.js` with your Firebase configuration
3. Use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

4. Open `http://localhost:8000` in your browser

## 📁 Project Structure

```
ybt-store/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles and animations
├── script.js               # Main JavaScript functionality
├── firebase-config.js      # Firebase configuration and auth
└── README.md              # This file
```

## 🎯 Usage Guide

### For Users

1. **Browse Products**: Visit the homepage to see featured products and categories
2. **Search**: Use the search bar to find specific products
3. **Product Details**: Click "View Details" on any product for more information
4. **Add to Cart**: Click "Add to Cart" to add products to your shopping cart
5. **Register/Login**: Create an account or login to access checkout and profile features
6. **Checkout**: Complete your purchase with shipping and payment information
7. **Track Orders**: View your order history in the dashboard

### For Developers

#### Adding New Products
Edit the `products` array in `script.js`:

```javascript
const products = [
    {
        id: 9, // Unique ID
        name: "Product Name",
        description: "Product description",
        price: 50000, // Price in smallest currency unit
        originalPrice: 60000, // Optional original price for discounts
        image: "https://example.com/image.jpg",
        category: "electronics", // Category for filtering
        stock: 20,
        rating: 4.5,
        features: ["Feature 1", "Feature 2", "Feature 3"]
    }
];
```

#### Customizing Styles
- Main colors can be changed in the CSS variables
- Animations can be modified in the keyframes sections
- Responsive breakpoints are at 768px and 480px

#### Adding New Pages
Use the routing system in `script.js`:

```javascript
function handleRouting() {
    const hash = window.location.hash.slice(1) || 'home';
    
    switch(hash) {
        case 'your-new-page':
            showYourNewPage();
            break;
        // ... other cases
    }
}
```

## 🎨 Customization

### Colors
The main color scheme can be customized by modifying these CSS variables:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #00ff88;
    --error-color: #ff4757;
    --warning-color: #ffa502;
}
```

### Fonts
Change the font by updating the Google Fonts import and CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap');

body {
    font-family: 'YourFont', sans-serif;
}
```

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Input Validation**: Client-side and server-side validation
- **Protected Routes**: Authentication required for sensitive pages
- **Secure Data Storage**: User data stored securely in Firestore
- **HTTPS Ready**: Works with HTTPS for production deployment

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout and touch-friendly interface
- **Mobile**: Mobile-first design with optimized navigation

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize hosting:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Other Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for static sites
- **Any web server**: Upload files to your web server

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not working**:
   - Check if you've updated `firebase-config.js` with your actual Firebase config
   - Ensure Firebase Authentication and Firestore are enabled
   - Check browser console for error messages

2. **Products not loading**:
   - Check if images are accessible
   - Verify JavaScript console for errors
   - Ensure proper internet connection

3. **Authentication issues**:
   - Verify Firebase Authentication is properly configured
   - Check if email/password provider is enabled
   - Ensure security rules allow user operations

4. **Cart not persisting**:
   - Check if localStorage is enabled in browser
   - Verify browser supports localStorage
   - Clear browser cache and try again

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by YBT Store Team

## 🙏 Acknowledgments

- Firebase for backend services
- Font Awesome for icons
- Google Fonts for typography
- Unsplash for product images
- The open-source community for inspiration

## 📞 Support

If you need help or have questions:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information
4. Contact support at info@ybtstore.com

---

**Happy Shopping! 🛍️**