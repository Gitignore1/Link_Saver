// background.js

chrome.runtime.onInstalled.addListener(() => {
   // Initialize storage with an empty categories list if it doesn't exist
   chrome.storage.sync.get(['categories'], (data) => {
     if (!data.categories) {
       chrome.storage.sync.set({ categories: [] });
     }
   });
 
   console.log('Extension installed and initialized!');
 });
 
 // Listen for runtime messages if needed
 chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (message.type === 'getCategories') {
     chrome.storage.sync.get(['categories'], (data) => {
       sendResponse({ categories: data.categories || [] });
     });
     return true; // Keep the message channel open for async response
   }
 
   if (message.type === 'addCategory') {
     const newCategory = message.payload;
     chrome.storage.sync.get(['categories'], (data) => {
       const categories = data.categories || [];
       if (!categories.includes(newCategory)) {
         categories.push(newCategory);
         chrome.storage.sync.set({ categories });
         sendResponse({ success: true, categories });
       } else {
         sendResponse({ success: false, error: 'Category already exists.' });
       }
     });
     return true;
   }
 });
 