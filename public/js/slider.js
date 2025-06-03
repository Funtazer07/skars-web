document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.reviews-grid');
  const prevButton = document.querySelector('.slider-button.prev');
  const nextButton = document.querySelector('.slider-button.next');
  const slides = document.querySelectorAll('.review');
  
  if (!slider || !prevButton || !nextButton || slides.length === 0) return;
  
  let currentPosition = 0;
  let slideWidth = slider.offsetWidth;
  let autoSlideInterval;
  const autoSlideDelay = 5000; // 5 seconds between slides
  let isAnimating = false;
  
  function updateSlider() {
    if (isAnimating) return;
    isAnimating = true;
    
    slider.style.transform = `translateX(${currentPosition}px)`;
    
    // Reset animation flag after transition
    setTimeout(() => {
      isAnimating = false;
    }, 500); // Match the CSS transition duration
  }
  
  function slideNext() {
    if (isAnimating) return;
    
    const maxPosition = -(slideWidth * (slides.length - 1));
    if (currentPosition > maxPosition) {
      currentPosition -= slideWidth;
      updateSlider();
    } else {
      // Smoothly reset to first slide
      currentPosition = 0;
      updateSlider();
    }
  }
  
  function slidePrev() {
    if (isAnimating) return;
    
    if (currentPosition < 0) {
      currentPosition += slideWidth;
      updateSlider();
    } else {
      // Smoothly go to last slide
      currentPosition = -(slideWidth * (slides.length - 1));
      updateSlider();
    }
  }
  
  function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(slideNext, autoSlideDelay);
  }
  
  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }
  
  function updateSlideWidth() {
    const oldSlideWidth = slideWidth;
    slideWidth = slider.offsetWidth;
    
    // Adjust current position based on new slide width
    if (oldSlideWidth !== slideWidth) {
      const slideIndex = Math.abs(Math.round(currentPosition / oldSlideWidth));
      currentPosition = -(slideWidth * slideIndex);
      updateSlider();
    }
  }
  
  // Event listeners
  nextButton.addEventListener('click', () => {
    slideNext();
    stopAutoSlide();
    startAutoSlide();
  });
  
  prevButton.addEventListener('click', () => {
    slidePrev();
    stopAutoSlide();
    startAutoSlide();
  });
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  });
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        slideNext();
      } else {
        slidePrev();
      }
    }
  }
  
  // Pause auto-slide on hover
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    updateSlideWidth();
  });
  
  // Start auto-slide
  startAutoSlide();
});