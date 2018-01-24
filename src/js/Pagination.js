const activeDotClass = 'pagination-dots__dot_active';
let activeIndex = 0;
let dots = null;

const Pagination = {
  onSelect: undefined,
  setActive(index) {
    dots[activeIndex].classList.remove(activeDotClass);
    dots[index].classList.add(activeDotClass);
    activeIndex = index;
  },
  init() {
    const element = document.getElementsByClassName('pagination-dots')[0];
    dots = Array.from(element.getElementsByClassName('pagination-dots__dot'));

    element.addEventListener('click', e => {
      const index = dots.indexOf(e.target);

      if (index !== -1) {
        this.onSelect(index);
      }
    });
  }
}

export default Pagination;
