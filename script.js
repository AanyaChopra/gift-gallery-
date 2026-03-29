// Gift Data
let gifts = [];

// Load from localStorage
function loadGifts() {
    const saved = localStorage.getItem('giftWishlist');
    if (saved) {
        gifts = JSON.parse(saved);
    } else {
        // Sample gifts
        gifts = [
            { id: 1, name: "Polaroid Camera", price: "₹2999", link: "", priority: "high", gifted: false },
            { id: 2, name: "Harry Potter Book Set", price: "₹1599", link: "", priority: "high", gifted: false },
            { id: 3, name: "Scented Candles Set", price: "₹899", link: "", priority: "medium", gifted: false },
            { id: 4, name: "Cozy Blanket", price: "₹1299", link: "", priority: "medium", gifted: false },
            { id: 5, name: "Succulent Plant", price: "₹299", link: "", priority: "low", gifted: true }
        ];
    }
    renderGifts();
    updateStats();
}

// Save to localStorage
function saveGifts() {
    localStorage.setItem('giftWishlist', JSON.stringify(gifts));
}

// Add gift
function addGift() {
    const name = document.getElementById('giftName').value;
    const price = document.getElementById('giftPrice').value;
    const link = document.getElementById('giftLink').value;
    const priority = document.getElementById('giftPriority').value;
    
    if (!name || !price) {
        showMessage('Please fill gift name and price!', 'error');
        return;
    }
    
    const newGift = {
        id: Date.now(),
        name: name,
        price: price,
        link: link,
        priority: priority,
        gifted: false
    };
    
    gifts.push(newGift);
    saveGifts();
    renderGifts();
    updateStats();
    showMessage(`🎁 Added ${name} to wishlist!`, 'success');
    
    // Clear form
    document.getElementById('giftName').value = '';
    document.getElementById('giftPrice').value = '';
    document.getElementById('giftLink').value = '';
}

// Mark as gifted
function markAsGifted(id) {
    const gift = gifts.find(g => g.id === id);
    if (gift) {
        gift.gifted = true;
        saveGifts();
        renderGifts();
        updateStats();
        showMessage(`🎉 ${gift.name} has been gifted! 🎉`, 'success');
    }
}

// Undo gifted
function undoGifted(id) {
    const gift = gifts.find(g => g.id === id);
    if (gift) {
        gift.gifted = false;
        saveGifts();
        renderGifts();
        updateStats();
        showMessage(`↩️ ${gift.name} marked as not gifted yet`, 'info');
    }
}

// Delete gift
function deleteGift(id) {
    const gift = gifts.find(g => g.id === id);
    if (confirm(`Remove ${gift.name} from wishlist?`)) {
        gifts = gifts.filter(g => g.id !== id);
        saveGifts();
        renderGifts();
        updateStats();
        showMessage(`🗑️ Removed ${gift.name}`, 'info');
    }
}

// Render gifts
function renderGifts() {
    const filter = document.querySelector('.filter-btn.active').dataset.filter;
    let filtered = [...gifts];
    
    if (filter === 'high') {
        filtered = filtered.filter(g => g.priority === 'high' && !g.gifted);
    } else if (filter === 'medium') {
        filtered = filtered.filter(g => g.priority === 'medium' && !g.gifted);
    } else if (filter === 'low') {
        filtered = filtered.filter(g => g.priority === 'low' && !g.gifted);
    } else if (filter === 'gifted') {
        filtered = filtered.filter(g => g.gifted === true);
    }
    
    const grid = document.getElementById('giftGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #888;">No gifts found ✨<br>Add some gifts to your wishlist!</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(gift => `
        <div class="gift-card ${gift.priority} ${gift.gifted ? 'gifted' : ''}">
            <div class="gift-header">
                <span class="gift-name">${gift.name}</span>
                <span class="gift-priority">
                    ${gift.priority === 'high' ? '🔥 High' : gift.priority === 'medium' ? '⭐ Medium' : '💭 Low'}
                </span>
            </div>
            <div class="gift-price">💰 ${gift.price}</div>
            ${gift.link ? `<a href="${gift.link}" target="_blank" class="gift-link">🔗 View item →</a>` : ''}
            <div class="gift-actions">
                ${!gift.gifted ? 
                    `<button class="gift-btn gift" onclick="markAsGifted(${gift.id})">✅ Got it!</button>` :
                    `<button class="gift-btn undo" onclick="undoGifted(${gift.id})">↩️ Undo</button>`
                }
                <button class="gift-btn delete" onclick="deleteGift(${gift.id})">🗑️ Remove</button>
            </div>
        </div>
    `).join('');
}

// Update stats
function updateStats() {
    const total = gifts.length;
    const gifted = gifts.filter(g => g.gifted).length;
    
    // Calculate total value (remove ₹ symbol and sum)
    let totalValue = 0;
    gifts.forEach(gift => {
        const priceNum = parseInt(gift.price.replace(/[^0-9]/g, ''));
        if (!isNaN(priceNum)) totalValue += priceNum;
    });
    
    document.getElementById('totalCount').innerText = total;
    document.getElementById('giftedCount').innerText = gifted;
    document.getElementById('totalValue').innerText = `₹${totalValue.toLocaleString()}`;
}

// Show message
function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    messageDiv.className = 'message show';
    messageDiv.style.background = type === 'error' ? '#ffebee' : type === 'success' ? '#e8f5e9' : '#fff3e0';
    messageDiv.style.color = type === 'error' ? '#c62828' : type === 'success' ? '#2e7d32' : '#ed6c02';
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 2000);
}

// Share wishlist
function shareWishlist() {
    const wishlistText = gifts.map(g => {
        const status = g.gifted ? '✅ Gifted' : '🎁 Wanted';
        return `${status} ${g.name} - ${g.price}`;
    }).join('\n');
    
    const message = `🎁 My Gift Wishlist 🎁\n\n${wishlistText}\n\nCreated with ❤️`;
    
    navigator.clipboard.writeText(message);
    showMessage('📋 Wishlist copied to clipboard! Share with friends!', 'success');
}

// Event Listeners
document.getElementById('addGiftBtn').addEventListener('click', addGift);
document.getElementById('shareBtn').addEventListener('click', shareWishlist);

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGifts();
    });
});

// Enter key to add gift
document.getElementById('giftName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGift();
});
document.getElementById('giftPrice').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGift();
});

// Initialize
loadGifts();

// ========== CONTINUOUS NEW FEATURES ==========

// 1. Edit Gift Feature
function editGift(id) {
    const gift = gifts.find(g => g.id === id);
    if (!gift) return;
    
    const newName = prompt("Edit gift name:", gift.name);
    const newPrice = prompt("Edit price:", gift.price);
    const newLink = prompt("Edit link (optional):", gift.link);
    const newPriority = prompt("Edit priority (high/medium/low):", gift.priority);
    
    if (newName && newName.trim()) gift.name = newName.trim();
    if (newPrice && newPrice.trim()) gift.price = newPrice.trim();
    if (newLink !== null) gift.link = newLink;
    if (newPriority && ['high', 'medium', 'low'].includes(newPriority.toLowerCase())) {
        gift.priority = newPriority.toLowerCase();
    }
    
    saveGifts();
    renderGifts();
    updateStats();
    showMessage(`✏️ Gift updated!`, 'success');
}

// 2. Clear All Gifts
function clearAllGifts() {
    if (gifts.length === 0) {
        showMessage("Wishlist is already empty!", 'info');
        return;
    }
    
    if (confirm("⚠️ Are you sure you want to delete ALL gifts? This cannot be undone!")) {
        gifts = [];
        saveGifts();
        renderGifts();
        updateStats();
        showMessage("🗑️ All gifts removed from wishlist", 'info');
    }
}

// 3. Export Wishlist as JSON
function exportWishlist() {
    if (gifts.length === 0) {
        showMessage("No gifts to export!", 'error');
        return;
    }
    
    const dataStr = JSON.stringify(gifts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wishlist_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage("📥 Wishlist exported successfully!", 'success');
}

// 4. Import Wishlist from JSON
function importWishlist() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    gifts = [...gifts, ...imported];
                    saveGifts();
                    renderGifts();
                    updateStats();
                    showMessage(`📤 Imported ${imported.length} gifts!`, 'success');
                } else {
                    showMessage("Invalid file format!", 'error');
                }
            } catch (err) {
                showMessage("Error reading file!", 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// 5. Search Gifts
function searchGifts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (!searchTerm) {
        renderGifts();
        return;
    }
    
    const filtered = gifts.filter(g => 
        g.name.toLowerCase().includes(searchTerm) || 
        g.price.toLowerCase().includes(searchTerm)
    );
    
    const grid = document.getElementById('giftGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #888;">🔍 No matching gifts found</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(gift => `
        <div class="gift-card ${gift.priority} ${gift.gifted ? 'gifted' : ''}">
            <div class="gift-header">
                <span class="gift-name">${gift.name}</span>
                <span class="gift-priority">
                    ${gift.priority === 'high' ? '🔥 High' : gift.priority === 'medium' ? '⭐ Medium' : '💭 Low'}
                </span>
            </div>
            <div class="gift-price">💰 ${gift.price}</div>
            ${gift.link ? `<a href="${gift.link}" target="_blank" class="gift-link">🔗 View item →</a>` : ''}
            <div class="gift-actions">
                <button class="gift-btn edit" onclick="editGift(${gift.id})">✏️ Edit</button>
                ${!gift.gifted ? 
                    `<button class="gift-btn gift" onclick="markAsGifted(${gift.id})">✅ Got it!</button>` :
                    `<button class="gift-btn undo" onclick="undoGifted(${gift.id})">↩️ Undo</button>`
                }
                <button class="gift-btn delete" onclick="deleteGift(${gift.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// 6. Add Search Bar to UI
function addSearchBar() {
    const container = document.querySelector('.filter-tabs');
    if (container && !document.getElementById('searchInput')) {
        const searchHTML = `
            <div style="margin: 1rem 0; text-align: center;">
                <input type="text" id="searchInput" placeholder="🔍 Search gifts..." style="padding: 8px 15px; border-radius: 25px; border: 2px solid #667eea; width: 80%; max-width: 300px; font-family: 'Poppins', sans-serif;">
            </div>
        `;
        container.insertAdjacentHTML('afterend', searchHTML);
        document.getElementById('searchInput').addEventListener('input', searchGifts);
    }
}

// 7. Add Sort Feature
let sortBy = 'default';

function sortGifts() {
    if (sortBy === 'price-low') {
        gifts.sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            return priceA - priceB;
        });
    } else if (sortBy === 'price-high') {
        gifts.sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            return priceB - priceA;
        });
    } else if (sortBy === 'name') {
        gifts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        gifts.sort((a, b) => a.id - b.id);
    }
    
    saveGifts();
    renderGifts();
}

function addSortDropdown() {
    const statsDiv = document.querySelector('.stats');
    if (statsDiv && !document.getElementById('sortSelect')) {
        const sortHTML = `
            <div style="margin: 1rem 0; text-align: center;">
                <select id="sortSelect" style="padding: 8px 15px; border-radius: 25px; border: 2px solid #667eea; font-family: 'Poppins', sans-serif; background: white;">
                    <option value="default">📋 Sort by: Default</option>
                    <option value="name">🔤 Sort by Name</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💰 Price: High to Low</option>
                </select>
            </div>
        `;
        statsDiv.insertAdjacentHTML('afterend', sortHTML);
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            sortBy = e.target.value;
            sortGifts();
        });
    }
}

// 8. Add Quick Add Buttons (Sample Gifts)
function addSampleGifts() {
    const samples = [
        { name: "Wireless Headphones", price: "₹3999", priority: "high" },
        { name: "Coffee Mug Set", price: "₹599", priority: "low" },
        { name: "Fitness Band", price: "₹2499", priority: "medium" },
        { name: "Novel Collection", price: "₹1299", priority: "medium" },
        { name: "Desk Organizer", price: "₹799", priority: "low" }
    ];
    
    samples.forEach(sample => {
        const newGift = {
            id: Date.now() + Math.random(),
            name: sample.name,
            price: sample.price,
            link: "",
            priority: sample.priority,
            gifted: false
        };
        gifts.push(newGift);
    });
    
    saveGifts();
    renderGifts();
    updateStats();
    showMessage(`✨ Added 5 sample gifts!`, 'success');
}

// 9. Add Wishlist Summary
function showSummary() {
    const total = gifts.length;
    const gifted = gifts.filter(g => g.gifted).length;
    const pending = total - gifted;
    const highPriority = gifts.filter(g => g.priority === 'high' && !g.gifted).length;
    const totalValue = gifts.reduce((sum, g) => {
        const priceNum = parseInt(g.price.replace(/[^0-9]/g, ''));
        return sum + (isNaN(priceNum) ? 0 : priceNum);
    }, 0);
    
    const summaryMsg = `📊 WISHLIST SUMMARY 📊\n\n` +
        `🎁 Total Gifts: ${total}\n` +
        `✅ Gifted: ${gifted}\n` +
        `⏳ Pending: ${pending}\n` +
        `🔥 High Priority Pending: ${highPriority}\n` +
        `💰 Total Value: ₹${totalValue.toLocaleString()}\n\n` +
        `Keep adding to your wishlist! 🎁✨`;
    
    alert(summaryMsg);
}

// 10. Add Summary Button
function addSummaryButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn && !document.getElementById('summaryBtn')) {
        const summaryBtn = document.createElement('button');
        summaryBtn.id = 'summaryBtn';
        summaryBtn.textContent = '📊 View Summary';
        summaryBtn.className = 'share-btn';
        summaryBtn.style.marginTop = '10px';
        summaryBtn.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
        summaryBtn.onclick = showSummary;
        shareBtn.insertAdjacentElement('afterend', summaryBtn);
    }
}

// 11. Add Clear All Button
function addClearAllButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn && !document.getElementById('clearAllBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearAllBtn';
        clearBtn.textContent = '🗑️ Clear All Gifts';
        clearBtn.className = 'share-btn';
        clearBtn.style.marginTop = '10px';
        clearBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
        clearBtn.onclick = clearAllGifts;
        shareBtn.insertAdjacentElement('afterend', clearBtn);
    }
}

// 12. Add Export/Import Buttons
function addExportImportButtons() {
    const container = document.querySelector('.add-gift');
    if (container && !document.getElementById('exportImportDiv')) {
        const btnDiv = document.createElement('div');
        btnDiv.id = 'exportImportDiv';
        btnDiv.style.display = 'flex';
        btnDiv.style.gap = '10px';
        btnDiv.style.marginTop = '10px';
        btnDiv.innerHTML = `
            <button id="exportBtn" style="flex:1; background: #4caf50; color: white; border: none; padding: 10px; border-radius: 12px; cursor: pointer; font-weight: 500;">📥 Export</button>
            <button id="importBtn" style="flex:1; background: #ff9800; color: white; border: none; padding: 10px; border-radius: 12px; cursor: pointer; font-weight: 500;">📤 Import</button>
            <button id="sampleBtn" style="flex:1; background: #9c27b0; color: white; border: none; padding: 10px; border-radius: 12px; cursor: pointer; font-weight: 500;">✨ Sample Gifts</button>
        `;
        container.appendChild(btnDiv);
        
        document.getElementById('exportBtn').addEventListener('click', exportWishlist);
        document.getElementById('importBtn').addEventListener('click', importWishlist);
        document.getElementById('sampleBtn').addEventListener('click', addSampleGifts);
    }
}

// 13. Add Animation on Gift Added
function animateNewGift() {
    const cards = document.querySelectorAll('.gift-card');
    const lastCard = cards[cards.length - 1];
    if (lastCard) {
        lastCard.style.transform = 'scale(1.05)';
        lastCard.style.transition = 'transform 0.3s';
        setTimeout(() => {
            lastCard.style.transform = 'scale(1)';
        }, 300);
    }
}

// Override addGift to include animation
const originalAddGift = addGift;
window.addGift = function() {
    originalAddGift();
    setTimeout(animateNewGift, 100);
};

// 14. Add Birthday Mode
let birthdayMode = false;

function toggleBirthdayMode() {
    birthdayMode = !birthdayMode;
    const container = document.querySelector('.container');
    if (birthdayMode) {
        container.style.background = 'linear-gradient(135deg, #ffe6f0, #ffd1dc)';
        container.style.boxShadow = '0 20px 50px rgba(255,105,180,0.3)';
        showMessage("🎂 Birthday Mode Activated! 🎉", 'success');
    } else {
        container.style.background = 'white';
        container.style.boxShadow = '0 20px 50px rgba(0,0,0,0.2)';
        showMessage("Normal Mode", 'info');
    }
}

// 15. Add Birthday Mode Button
function addBirthdayButton() {
    const header = document.querySelector('header');
    if (header && !document.getElementById('birthdayBtn')) {
        const birthdayBtn = document.createElement('button');
        birthdayBtn.id = 'birthdayBtn';
        birthdayBtn.textContent = '🎂 Birthday Mode';
        birthdayBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #ff69b4;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.8rem;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        birthdayBtn.onclick = toggleBirthdayMode;
        document.body.appendChild(birthdayBtn);
    }
}

// 16. Add Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'A' to focus on add gift name field
    if (e.key === 'a' || e.key === 'A') {
        document.getElementById('giftName').focus();
        showMessage("⌨️ Type gift name...", 'info');
    }
    // Press 'S' to show summary
    if (e.key === 's' || e.key === 'S') {
        showSummary();
    }
    // Press '?' to show shortcuts
    if (e.key === '?') {
        alert("⌨️ KEYBOARD SHORTCUTS ⌨️\n\nA - Focus on Add Gift\nS - Show Summary\n? - Show this help\n\nHappy gifting! 🎁");
    }
});

// 17. Add Progress Ring to Stats
function updateProgressRing() {
    const total = gifts.length;
    const gifted = gifts.filter(g => g.gifted).length;
    const percent = total === 0 ? 0 : (gifted / total) * 100;
    
    const statsDiv = document.querySelector('.stats');
    if (statsDiv && !document.querySelector('.progress-ring')) {
        const progressHTML = `
            <div class="stat-card" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24);">
                <span>📈 Progress</span>
                <strong id="progressPercent">${Math.round(percent)}%</strong>
            </div>
        `;
        statsDiv.insertAdjacentHTML('beforeend', progressHTML);
    } else {
        const progressElem = document.getElementById('progressPercent');
        if (progressElem) progressElem.innerText = Math.round(percent) + '%';
    }
}

// Override updateStats to include progress
const originalUpdateStats = updateStats;
window.updateStats = function() {
    originalUpdateStats();
    updateProgressRing();
};

// 18. Initialize All New Features
setTimeout(() => {
    addSearchBar();
    addSortDropdown();
    addSummaryButton();
    addClearAllButton();
    addExportImportButtons();
    addBirthdayButton();
    updateProgressRing();
    
    // Add Edit button to existing gift cards (update render function)
    console.log("✨ Gift Wishlist enhanced with new features!");
}, 100);