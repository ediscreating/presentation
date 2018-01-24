import Slider from './Slider';
import Pagination from './Pagination';
import TherapyTargetsSlide from './TherapyTargetsSlide';
import DiagramsSlide from './DiagramsSlide';
import TherapyFoundationSlide from './TherapyFoundationSlide';

const Presentation = {
  init() {
    Pagination.init();
    TherapyTargetsSlide.init();
    TherapyFoundationSlide.init();
    DiagramsSlide.init();

    let slider = new Slider(document.getElementsByClassName('slider__track')[0], { vertical: true });

    TherapyFoundationSlide.moveContent('down');

    Pagination.onSelect =  index => {
      Pagination.setActive(index);
      slider.changeSlide(index);
      TherapyTargetsSlide.hideHint();
      moveTFContent(index);
    };

    slider.on('slide-change', index => {
      Pagination.setActive(index);
      moveTFContent(index);
    });

    slider.on('slide-start', index => {
      TherapyTargetsSlide.hideHint();
    });

    slider.on('slide-end', index => {
      if (index === 0) {
        TherapyTargetsSlide.showHint();
      }
    });
  }
};

function moveTFContent(index) {
  switch (index) {
    case 2:
      TherapyFoundationSlide.moveContent('up');
      break;
    case 0:
      TherapyFoundationSlide.moveContent('down');
      break;
    default:
      TherapyFoundationSlide.resetContentMovement();
  }
}

export default Presentation;
