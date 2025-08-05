// Firebase Configuration
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com", 
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();
const db = firebase.firestore();

// Auth state observer
let currentUser = null;

auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUIForAuthState(user);
    if (user) {
        console.log('User signed in:', user.email);
        // Save user data to Firestore
        saveUserToFirestore(user);
    } else {
        console.log('User signed out');
    }
});

// Save user data to Firestore
async function saveUserToFirestore(user) {
    try {
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            // Create new user document
            await userRef.set({
                uid: user.uid,
                email: user.email,
                name: user.displayName || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                addresses: [],
                orderHistory: []
            });
        }
    } catch (error) {
        console.error('Error saving user to Firestore:', error);
    }
}

// Authentication functions
const authFunctions = {
    // Sign up with email and password
    async signUp(email, password, name) {
        try {
            showLoading(true);
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Update user profile with name
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            showToast('Account created successfully!', 'success');
            return userCredential.user;
        } catch (error) {
            console.error('Signup error:', error);
            showToast(getAuthErrorMessage(error.code), 'error');
            throw error;
        } finally {
            showLoading(false);
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            showLoading(true);
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            showToast('Welcome back!', 'success');
            return userCredential.user;
        } catch (error) {
            console.error('Signin error:', error);
            showToast(getAuthErrorMessage(error.code), 'error');
            throw error;
        } finally {
            showLoading(false);
        }
    },

    // Sign out
    async signOut() {
        try {
            await auth.signOut();
            showToast('Signed out successfully', 'success');
            // Clear cart and redirect to home
            cart.clear();
            window.location.href = '#home';
        } catch (error) {
            console.error('Signout error:', error);
            showToast('Error signing out', 'error');
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            showLoading(true);
            await auth.sendPasswordResetEmail(email);
            showToast('Password reset email sent!', 'success');
        } catch (error) {
            console.error('Password reset error:', error);
            showToast(getAuthErrorMessage(error.code), 'error');
            throw error;
        } finally {
            showLoading(false);
        }
    },

    // Get current user
    getCurrentUser() {
        return currentUser;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return currentUser !== null;
    }
};

// Update UI based on authentication state
function updateUIForAuthState(user) {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const profileLink = document.getElementById('profileLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');

    if (user) {
        // User is signed in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'block';
    } else {
        // User is signed out
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Get user-friendly error messages
function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/requires-recent-login': 'Please sign in again to complete this action.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// Firestore helper functions
const firestoreHelpers = {
    // Save user profile
    async saveUserProfile(userId, profileData) {
        try {
            await db.collection('users').doc(userId).update(profileData);
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Error updating profile', 'error');
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    },

    // Save order
    async saveOrder(orderData) {
        try {
            const orderRef = await db.collection('orders').add({
                ...orderData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });
            
            // Update user's order history
            if (currentUser) {
                await db.collection('users').doc(currentUser.uid).update({
                    orderHistory: firebase.firestore.FieldValue.arrayUnion(orderRef.id)
                });
            }
            
            return orderRef.id;
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    },

    // Get user orders
    async getUserOrders(userId) {
        try {
            const snapshot = await db.collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user orders:', error);
            return [];
        }
    },

    // Add address
    async addAddress(userId, address) {
        try {
            await db.collection('users').doc(userId).update({
                addresses: firebase.firestore.FieldValue.arrayUnion(address)
            });
            showToast('Address added successfully!', 'success');
        } catch (error) {
            console.error('Error adding address:', error);
            showToast('Error adding address', 'error');
        }
    },

    // Update address
    async updateAddresses(userId, addresses) {
        try {
            await db.collection('users').doc(userId).update({
                addresses: addresses
            });
            showToast('Addresses updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating addresses:', error);
            showToast('Error updating addresses', 'error');
        }
    }
};

// Export for use in other files
window.authFunctions = authFunctions;
window.firestoreHelpers = firestoreHelpers;
window.currentUser = () => currentUser;