// Gallery configuration
const config = {
    loadingDelay: 300, // Minimum time to show loading state (ms)
    imageLoadTimeout: 10000 // Maximum time to wait for image load (ms)
};

// State management
let isLoading = false;
let loadStartTime = null;

// DOM Elements
const elements = {
    gridContainer: null,
    lightbox: null,
    lightboxImage: null,
    lightboxClose: null,
    lightboxPrev: null,
    lightboxNext: null,
    loadingIndicator: null
};

// Initialize gallery
function initGallery() {
    // Create loading indicator
    elements.loadingIndicator = document.createElement('div');
    elements.loadingIndicator.className = 'loading-indicator';
    elements.loadingIndicator.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(elements.loadingIndicator);

    // Create lightbox
    createLightbox();

    // Initialize grid container
    elements.gridContainer = document.querySelector('.grid-container');
    if (!elements.gridContainer) {
        console.error('Grid container not found');
        return;
    }

    // Add click event listener for images
    elements.gridContainer.addEventListener('click', handleImageClick);

    // Get the current page from the URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    loadGallery(currentPage);
}

// Create lightbox elements
function createLightbox() {
    elements.lightbox = document.createElement('div');
    elements.lightbox.className = 'lightbox';
    elements.lightbox.innerHTML = `
        <button class="lightbox-close">&times;</button>
        <button class="lightbox-prev">❮</button>
        <button class="lightbox-next">❯</button>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(elements.lightbox);

    elements.lightboxImage = elements.lightbox.querySelector('.lightbox-image');
    elements.lightboxClose = elements.lightbox.querySelector('.lightbox-close');
    elements.lightboxPrev = elements.lightbox.querySelector('.lightbox-prev');
    elements.lightboxNext = elements.lightbox.querySelector('.lightbox-next');

    // Add event listeners
    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.lightboxPrev.addEventListener('click', showPreviousImage);
    elements.lightboxNext.addEventListener('click', showNextImage);
    elements.lightbox.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) closeLightbox();
    });
}

// Load gallery for current page
async function loadGallery(page) {
    if (isLoading) return;
    
    try {
        isLoading = true;
        loadStartTime = Date.now();
        showLoading();

        console.log('Loading gallery for page:', page);
        const response = await fetch(`/api/upload/photos/${page}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server returned ${response.status}: ${response.statusText}`);
        }

        const photos = await response.json();
        console.log('Received photos:', photos);

        if (!Array.isArray(photos)) {
            throw new Error('Invalid response format from server');
        }

        // Ensure minimum loading time for better UX
        const elapsedTime = Date.now() - loadStartTime;
        if (elapsedTime < config.loadingDelay) {
            await new Promise(resolve => setTimeout(resolve, config.loadingDelay - elapsedTime));
        }

        renderGallery(photos, page);
    } catch (error) {
        console.error('Error loading gallery:', error);
        showError(error.message);
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// Render gallery images
function renderGallery(photos, page) {
    if (!elements.gridContainer) return;

    elements.gridContainer.innerHTML = '';
    
    if (photos.length === 0) {
        elements.gridContainer.innerHTML = '<p class="no-photos">No photos available yet.</p>';
        return;
    }

    photos.forEach((photo, index) => {
        const figure = document.createElement('figure');
        
        // Add size classes for chaotic layout
        if (index % 3 === 0) {
            figure.classList.add('tall');
        } else if (index % 5 === 0) {
            figure.classList.add('wide');
        } else if (index % 7 === 0) {
            figure.classList.add('tall', 'wide');
        } else if (index % 11 === 0) {
            figure.classList.add('tall');
        }
        
        const img = document.createElement('img');
        // Add Cloudinary transformation parameters for thumbnail with less aggressive compression
        const thumbnailUrl = photo.url.replace('/upload/', '/upload/c_scale,w_600,q_80,f_auto/');
        img.src = thumbnailUrl;
        img.alt = `${page} photo ${index + 1}`;
        img.loading = 'lazy';
        img.dataset.index = index;
        img.dataset.fullsize = photo.url; // Store the original URL
                
        // Add loading state
        img.addEventListener('load', () => {
            figure.classList.add('loaded');
        });

        // Add error handling
        img.addEventListener('error', () => {
            figure.innerHTML = '<div class="image-error">Failed to load image</div>';
        });

        figure.appendChild(img);
        elements.gridContainer.appendChild(figure);
    });
}

// Handle image click for lightbox
function handleImageClick(e) {
    const figure = e.target.closest('figure');
    if (!figure) return;

    const img = figure.querySelector('img');
    if (!img) return;

    const images = Array.from(elements.gridContainer.querySelectorAll('img'));
    const currentIndex = images.indexOf(img);
    
    // Use the full-size image URL stored in data-fullsize
    showLightbox(img.dataset.fullsize, currentIndex);
}

// Lightbox functions
function showLightbox(src, index) {
    // Add Cloudinary transformation parameters for lightbox image
    const lightboxUrl = src.replace('/upload/', '/upload/c_scale,w_1200,q_auto,f_auto/');
    elements.lightboxImage.src = lightboxUrl;
    elements.lightboxImage.dataset.index = index;
    elements.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    elements.lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPreviousImage() {
    const images = Array.from(elements.gridContainer.querySelectorAll('img'));
    const currentIndex = parseInt(elements.lightboxImage.dataset.index);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    showLightbox(images[prevIndex].dataset.fullsize, prevIndex);
}

function showNextImage() {
    const images = Array.from(elements.gridContainer.querySelectorAll('img'));
    const currentIndex = parseInt(elements.lightboxImage.dataset.index);
    const nextIndex = (currentIndex + 1) % images.length;
    showLightbox(images[nextIndex].dataset.fullsize, nextIndex);
}

// Loading state functions
function showLoading() {
    elements.loadingIndicator.classList.add('active');
}

function hideLoading() {
    elements.loadingIndicator.classList.remove('active');
}

// Error handling
function showError(message) {
    if (!elements.gridContainer) return;
    elements.gridContainer.innerHTML = `
        <div class="error-message">
            <p>Error loading photos: ${message}</p>
            <button onclick="location.reload()">Try Again</button>
        </div>
    `;
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery); 