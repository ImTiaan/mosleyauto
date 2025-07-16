// Main JavaScript for Mosley Auto website

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatMileage(mileage) {
    return new Intl.NumberFormat('en-US').format(mileage);
}

// Stock page functionality
if (document.getElementById('stock-grid')) {
    loadStock();
}

// Team page functionality
if (document.getElementById('team-grid')) {
    loadTeam();
}

async function loadStock() {
    const stockGrid = document.getElementById('stock-grid');
    const loadingEl = document.getElementById('loading');
    const noStockEl = document.getElementById('no-stock');
    
    try {
        const response = await fetch('/api/stock');
        const data = await response.json();
        
        if (loadingEl) loadingEl.style.display = 'none';
        
        if (data.success && data.vehicles && data.vehicles.length > 0) {
            stockGrid.innerHTML = data.vehicles.map(vehicle => `
                <div class="car-card">
                    <div class="car-image">
                        <img src="${vehicle.image || '/assets/images/placeholder-car.jpg'}" 
                             alt="${vehicle.year} ${vehicle.make} ${vehicle.model}"
                             onerror="this.src='/assets/images/placeholder-car.jpg'">
                        <div class="price-tag">${formatPrice(vehicle.price)}</div>
                    </div>
                    <div class="car-info">
                        <h3 class="car-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
                        <div class="car-details">
                            <div class="detail-item">
                                <span class="detail-label">Mileage:</span>
                                <span class="detail-value">${formatMileage(vehicle.mileage)} miles</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Color:</span>
                                <span class="detail-value">${vehicle.color}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Transmission:</span>
                                <span class="detail-value">${vehicle.transmission}</span>
                            </div>
                        </div>
                        ${vehicle.description ? `<p class="car-description">${vehicle.description}</p>` : ''}
                        <div class="car-actions">
                            <button class="cta-button" onclick="contactAboutCar('${vehicle.year} ${vehicle.make} ${vehicle.model}')">
                                🚗 INQUIRE NOW!
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            if (noStockEl) noStockEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading stock:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        stockGrid.innerHTML = `
            <div class="error-message">
                <h3>🚫 OOPS! Something went wrong!</h3>
                <p>We're having trouble loading our amazing cars right now. Please try again later!</p>
            </div>
        `;
    }
}

async function loadTeam() {
    const teamGrid = document.getElementById('team-grid');
    const loadingEl = document.getElementById('loading');
    const noTeamEl = document.getElementById('no-team');
    
    try {
        const response = await fetch('/api/team');
        const data = await response.json();
        
        if (loadingEl) loadingEl.style.display = 'none';
        
        if (data.success && data.team && data.team.length > 0) {
            teamGrid.innerHTML = data.team.map(member => `
                <div class="team-card">
                    <div class="team-photo">
                        <img src="${member.photo || '/assets/images/placeholder-person.jpg'}" 
                             alt="${member.name}"
                             onerror="this.src='/assets/images/placeholder-person.jpg'">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">${member.name}</h3>
                        <p class="team-role">${member.role}</p>
                        ${member.bio ? `<p class="team-bio">${member.bio}</p>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            if (noTeamEl) noTeamEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading team:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        teamGrid.innerHTML = `
            <div class="error-message">
                <h3>🚫 OOPS! Something went wrong!</h3>
                <p>We're having trouble loading our amazing team right now. Please try again later!</p>
            </div>
        `;
    }
}

// Contact about specific car
function contactAboutCar(carName) {
    const subject = encodeURIComponent(`Inquiry about ${carName}`);
    const body = encodeURIComponent(`Hi! I'm interested in learning more about the ${carName}. Please contact me with more details.\n\nThanks!`);
    
    // Try to open email client
    window.location.href = `mailto:sales@mosleyauto.com?subject=${subject}&body=${body}`;
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add some fun animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe car cards and team cards
    const cards = document.querySelectorAll('.car-card, .team-card, .feature-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add some retro sound effects (optional)
function playClickSound() {
    // You could add a retro click sound here if desired
    // const audio = new Audio('/assets/sounds/click.mp3');
    // audio.play().catch(() => {});
}

// Add click sound to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .cta-button, .nav-link');
    buttons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });
});

// Console easter egg
console.log(`
🚗 WELCOME TO MOSLEY AUTO! 🚗

Looking for a great deal on wheels?
You've come to the right place!

★ BEST CARS IN TOWN! ★
`);