let scrollDownHint = null;
let hintIsHidden = false;

const TherapyTargetsSlide = {
  showHint() {
    if (hintIsHidden) {
      scrollDownHint.style.opacity = 1;
      hintIsHidden = false;
    }
  },
  hideHint() {
    if (!hintIsHidden) {
      scrollDownHint.style.opacity = 0;
      hintIsHidden = true;
    }
  },
  init() {
    scrollDownHint = document.getElementsByClassName('scroll-down-hint')[0];
  }
};

export default TherapyTargetsSlide;
