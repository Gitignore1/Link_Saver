// popup.js

document.addEventListener('DOMContentLoaded', () => {
   const linkInput = document.getElementById('linkInput');
   const categorySelect = document.getElementById('categorySelect');
   const saveLinkButton = document.getElementById('saveLinkButton');
   const viewCategorySelect = document.getElementById('viewCategorySelect');
   const linkList = document.getElementById('linkList');
 
   // Load categories into both dropdowns
   chrome.storage.sync.get(['categories'], (data) => {
     const categories = data.categories || [];
     categories.forEach((category) => {
       const option = document.createElement('option');
       option.value = category;
       option.textContent = category;
       categorySelect.appendChild(option);
 
       const viewOption = document.createElement('option');
       viewOption.value = category;
       viewOption.textContent = category;
       viewCategorySelect.appendChild(viewOption);
     });
   });
 
   // Save a new link to the selected category
   saveLinkButton.addEventListener('click', () => {
     const link = linkInput.value.trim();
     const category = categorySelect.value;
 
     if (!link || !category) {
       alert('Please enter a valid link and select a category.');
       return;
     }
 
     chrome.storage.sync.get(['links'], (data) => {
       const links = data.links || {};
       if (!links[category]) {
         links[category] = [];
       }
       links[category].push(link);
 
       chrome.storage.sync.set({ links }, () => {
         alert('Link saved successfully!');
         linkInput.value = '';
       });
     });
   });
   
   // Add new category
   newCategoryBtn.addEventListener('click', () => {
      const newCategory = prompt('Enter new category name:');
      if (newCategory) {
        chrome.storage.sync.get(['categories'], (data) => {
          const categories = data.categories || [];
          if (!categories.includes(newCategory)) {
            categories.push(newCategory);
            chrome.storage.sync.set({ categories });
            const option = document.createElement('option');
            option.value = newCategory;
            option.textContent = newCategory;
            categorySelect.appendChild(option);
          } else {
            alert('Category already exists.');
          }
        });
      }
    });
   // View links for the selected category
   viewCategorySelect.addEventListener('change', () => {
     const category = viewCategorySelect.value;
     linkList.innerHTML = ''; // Clear previous links
 
     if (!category) return;
 
     chrome.storage.sync.get(['links'], (data) => {
       const links = data.links || {};
       const categoryLinks = links[category] || [];
 
       categoryLinks.forEach((link) => {
         const li = document.createElement('li');
         const a = document.createElement('a');
         a.href = link;
         a.textContent = link;
         a.target = '_blank'; // Open link in a new tab
         li.appendChild(a);
         linkList.appendChild(li);
       });
     });
   });
 });
 