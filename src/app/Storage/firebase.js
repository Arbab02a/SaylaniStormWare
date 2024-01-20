'use client'

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCvQqoQO5ZByugnjAQu-_oENTwkVG8oBXo",
    authDomain: "chat-app-c0a94.firebaseapp.com",
    databaseURL: "https://chat-app-c0a94-default-rtdb.firebaseio.com",
    projectId: "chat-app-c0a94",
    storageBucket: "chat-app-c0a94.appspot.com",
    messagingSenderId: "7340805305",
    appId: "1:7340805305:web:00399fb62bc888baea9f68",
    measurementId: "G-GQBGV9986J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);