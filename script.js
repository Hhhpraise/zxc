// Create snowflakes
function createSnowflakes() {
    const snowflakeCount = 60;
    const snowflakeChars = ['❄', '❅', '❆'];

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.animationDuration = Math.random() * 5 + 8 + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.fontSize = Math.random() * 15 + 10 + 'px';
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        document.body.appendChild(snowflake);
    }
}

// Preload images for smoother experience
function preloadImages() {
    const imagePaths = [
        'images/first_date.jpg',
        'images/silly_moment.jpg',
        'images/sunset_together.jpg',
        'images/birthday.jpg',
        'images/adventure.jpg',
        'images/spring_day.jpg'
    ];

    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

// Photo modal functionality
function openPhotoModal(photoItem) {
    const modal = document.getElementById('photoModal');
    const modalContent = document.getElementById('modalContent');

    const img = photoItem.querySelector('img');
    const label = photoItem.querySelector('.photo-label');

    if (img && img.src && !img.src.includes('undefined')) {
        // Create a larger version of the image for modal
        const modalImg = new Image();
        modalImg.src = img.src;
        modalImg.classList.add('modal-image');
        modalImg.alt = label.textContent;

        // Show loading state
        modalContent.innerHTML = `
            <div class="modal-loading">Loading...</div>
        `;

        // When image loads, show it
        modalImg.onload = function() {
            modalContent.innerHTML = '';
            modalContent.appendChild(modalImg);
            const labelDiv = document.createElement('div');
            labelDiv.className = 'modal-label';
            labelDiv.textContent = label.textContent;
            modalContent.appendChild(labelDiv);
        };

        // If image fails to load
        modalImg.onerror = function() {
            modalContent.innerHTML = `
                <div class="modal-placeholder">📷</div>
                <div class="modal-label">${label.textContent}</div>
            `;
        };
    } else {
        // No image available, show placeholder
        modalContent.innerHTML = `
            <div class="modal-placeholder">📷</div>
            <div class="modal-label">${label.textContent}</div>
        `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle image loading errors
function setupImageErrorHandling() {
    document.querySelectorAll('.photo-item img').forEach(img => {
        img.onerror = function() {
            // Hide broken image
            this.style.display = 'none';

            // Show placeholder
            const placeholder = this.parentElement.querySelector('.photo-placeholder');
            if (!placeholder) {
                const newPlaceholder = document.createElement('span');
                newPlaceholder.className = 'photo-placeholder';
                newPlaceholder.innerHTML = '📷';
                this.parentElement.appendChild(newPlaceholder);
            } else {
                placeholder.style.display = 'flex';
            }
        };

        img.onload = function() {
            // Image loaded successfully
            const placeholder = this.parentElement.querySelector('.photo-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create snowflakes
    createSnowflakes();

    // Preload images
    preloadImages();

    // Setup image error handling
    setupImageErrorHandling();

    // Photo click handlers
    document.querySelectorAll('.photo-item').forEach((item) => {
        item.addEventListener('click', () => openPhotoModal(item));
    });

    // Modal close handlers
    document.getElementById('photoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Scroll indicator
    document.querySelector('.scroll-indicator').addEventListener('click', function() {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Lazy load images when they come into view
                if (entry.target.classList.contains('photo-item')) {
                    const img = entry.target.querySelector('img');
                    if (img && !img.src) {
                        // You could implement lazy loading here if needed
                    }
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.memory-card, .photo-item, .timeline-item').forEach(el => {
        observer.observe(el);
    });
});