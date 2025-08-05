// Firebase Configuration
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Auth State Observer
let currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI(user);
    if (user) {
        // User is signed in
        console.log('User signed in:', user);
        loadUserData(user);
    } else {
        // User is signed out
        console.log('User signed out');
        clearUserData();
    }
});

// Update Authentication UI
function updateAuthUI(user) {
    const authButtons = document.getElementById('authButtons');
    const userActions = document.getElementById('userActions');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const dashboardUserName = document.getElementById('dashboardUserName');
    const userEmail = document.getElementById('userEmail');

    if (user) {
        // User is logged in
        authButtons.style.display = 'none';
        userActions.style.display = 'block';
        userInfo.style.display = 'flex';
        
        if (userName) userName.textContent = user.displayName || user.email;
        if (userAvatar) userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
        if (dashboardUserName) dashboardUserName.textContent = user.displayName || 'User';
        if (userEmail) userEmail.textContent = user.email;
    } else {
        // User is logged out
        authButtons.style.display = 'flex';
        userActions.style.display = 'none';
        userInfo.style.display = 'none';
    }
}

// Load User Data
async function loadUserData(user) {
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            // Update UI with user data
            console.log('User data loaded:', userData);
        } else {
            // Create user document if it doesn't exist
            await createUserDocument(user);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Create User Document
async function createUserDocument(user) {
    try {
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            addresses: [],
            orderHistory: [],
            wishlist: []
        });
        console.log('User document created');
    } catch (error) {
        console.error('Error creating user document:', error);
    }
}

// Clear User Data
function clearUserData() {
    // Clear any cached user data
    localStorage.removeItem('userCart');
    localStorage.removeItem('userWishlist');
}

// Authentication Functions
async function signUpWithEmail(email, password, displayName) {
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({
            displayName: displayName
        });
        await createUserDocument(result.user);
        showToast('Account created successfully!', 'success');
        return result.user;
    } catch (error) {
        console.error('Sign up error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

async function signInWithEmail(email, password) {
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        showToast('Signed in successfully!', 'success');
        return result.user;
    } catch (error) {
        console.error('Sign in error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // Check if user document exists, create if not
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            await createUserDocument(user);
        }
        
        showToast('Signed in with Google successfully!', 'success');
        return user;
    } catch (error) {
        console.error('Google sign in error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

async function signOut() {
    try {
        await auth.signOut();
        showToast('Signed out successfully!', 'success');
    } catch (error) {
        console.error('Sign out error:', error);
        showToast(error.message, 'error');
    }
}

async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('Password reset email sent!', 'success');
    } catch (error) {
        console.error('Password reset error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

// User Profile Functions
async function updateUserProfile(data) {
    if (!currentUser) return;
    
    try {
        // Update Firebase Auth profile
        if (data.displayName) {
            await currentUser.updateProfile({
                displayName: data.displayName
            });
        }
        
        // Update Firestore document
        await db.collection('users').doc(currentUser.uid).update({
            displayName: data.displayName || currentUser.displayName,
            phone: data.phone || '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('Profile updated successfully!', 'success');
        updateAuthUI(currentUser);
    } catch (error) {
        console.error('Profile update error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

// Address Management
async function addUserAddress(address) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            addresses: firebase.firestore.FieldValue.arrayUnion(address)
        });
        showToast('Address added successfully!', 'success');
    } catch (error) {
        console.error('Add address error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

async function getUserAddresses() {
    if (!currentUser) return [];
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            return userDoc.data().addresses || [];
        }
        return [];
    } catch (error) {
        console.error('Get addresses error:', error);
        return [];
    }
}

// Order Management
async function createOrder(orderData) {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
        const order = {
            ...orderData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            orderId: generateOrderId()
        };
        
        const docRef = await db.collection('orders').add(order);
        
        // Update user's order history
        await db.collection('users').doc(currentUser.uid).update({
            orderHistory: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        });
        
        showToast('Order placed successfully!', 'success');
        return { id: docRef.id, ...order };
    } catch (error) {
        console.error('Create order error:', error);
        showToast(error.message, 'error');
        throw error;
    }
}

async function getUserOrders() {
    if (!currentUser) return [];
    
    try {
        const ordersSnapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        return ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Get orders error:', error);
        return [];
    }
}

// Utility Functions
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Export functions for use in other files
window.firebaseAuth = {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    addUserAddress,
    getUserAddresses,
    createOrder,
    getUserOrders,
    getCurrentUser: () => currentUser
};