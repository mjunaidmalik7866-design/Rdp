// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "ybt-store-ecommerce.firebaseapp.com",
  projectId: "ybt-store-ecommerce",
  storageBucket: "ybt-store-ecommerce.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signUp = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      photoUrl: user.photoURL || '',
      address: '',
      phone: '',
      createdAt: new Date().toISOString(),
      role: 'user'
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email,
        photoUrl: user.photoURL || '',
        address: '',
        phone: '',
        createdAt: new Date().toISOString(),
        role: 'user'
      });
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Database functions
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const cartRef = collection(db, 'cart');
    await addDoc(cartRef, {
      userId,
      productId,
      quantity,
      addedAt: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

export const getCartItems = async (userId) => {
  try {
    const cartRef = collection(db, 'cart');
    const q = query(cartRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const cartItems = [];
    querySnapshot.forEach((doc) => {
      cartItems.push({ id: doc.id, ...doc.data() });
    });
    
    return cartItems;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      orderDate: new Date().toISOString(),
      status: 'Pending'
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};