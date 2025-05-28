document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.reviews-grid');
  const prevButton = document.querySelector('.slider-button.prev');
  const nextButton = document.querySelector('.slider-button.next');
  const slides = document.querySelectorAll('.review');
  
  let currentPosition = 0;
  const slideWidth = slider.offsetWidth;
  let autoSlideInterval;
  const autoSlideDelay = 3000; // 5 seconds between slides
  
  function updateSlider() {
    slider.style.transform = `translateX(${currentPosition}px)`;
  }
  
  function slideNext() {
    const maxPosition = -(slideWidth * (slides.length - 1));
    if (currentPosition > maxPosition) {
      currentPosition -= slideWidth;
      updateSlider();
    } else {
      // Reset to first slide
      currentPosition = 0;
      updateSlider();
    }
  }
  
  function slidePrev() {
    if (currentPosition < 0) {
      currentPosition += slideWidth;
      updateSlider();
    } else {
      // Go to last slide
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
  
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  });
  
  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      slideNext();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      slidePrev();
    }
  }
  
  // Pause auto-slide when hovering over the slider
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  
  // Start auto-sliding
  startAutoSlide();
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newSlideWidth = slider.offsetWidth;
      const slideIndex = Math.abs(Math.round(currentPosition / slideWidth));
      currentPosition = -(newSlideWidth * slideIndex);
      updateSlider();
    }, 250);
  });
});