let overlay = null;

const TherapyFoundationSlide = {
  resetContentMovement() {
    overlay.style.transform = 'translateY(0vh)';
  },
  moveContent(direction) {
    if (direction === 'up') {
      overlay.style.transform = 'translateY(-20vh)';
    } else if (direction === 'down') {
      overlay.style.transform = 'translateY(20vh)';
    }
  },
  init() {
    overlay = document.getElementsByClassName('therapy-foundation__overlay')[0];
    overlay.style.transition = 'transform 0.7s ease-in-out';
  }
};

export default TherapyFoundationSlide;
