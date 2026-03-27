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