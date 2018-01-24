import Slider from './Slider';
import RangeElement from './RangeElement';

const DiagramsSlide = {
  init() {
    const track = document.getElementsByClassName('slider')[1].firstElementChild;
    const slider = new Slider(track, { startIndex: 2 });
    const range = new RangeElement(document.querySelector('[data-range]'), {
      min: 0,
      max: 2,
      value: 2
    });

    slider.on('slide-change', index => {
      range.setValue(index);
    });

    range.on('value-change', value => {
      slider.changeSlide(value);
    });
  }
};

export default DiagramsSlide;
