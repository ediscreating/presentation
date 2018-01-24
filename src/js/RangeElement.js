import Slidable from './Slidable';
import { nearestNumInSortedArray, range } from './utils';

class RangeElement {
  /**
   * Create RangeElement instance
   * @param {HTMLElement} element - element to create from,
   * must have child element with data-range-thumb attribute
   * and optional child with data-range-progress attribute
   * @param {Object} [options]
   * @param {number} [options.min = 0]
   * @param {number} [options.max = 0]
   * @param {number} [options.step = 1]
   * @param {number} [options.value = options.min] - start value
   */
  constructor(element, options) {
    const opts = options || {};

    const min = opts.min || 0;
    const max = opts.max || 0;

    this.values = range(min, max, opts.step);

    this.element = element;
    this.progress = element.querySelector('[data-range-progress]');

    if (this.progress) {
      this.progress.style.transformOrigin = 'left center';
    }

    this.thumb = new Slidable(element.querySelector('[data-range-thumb]'), {
      onMove: this._handleThumbMove.bind(this),
      onEnd: this._handleThumbMoveEnd.bind(this),
      threshold: 5
    });

    this.rangeWidth = element.clientWidth;
    this.endPoints = this._calculateEndpoints();
    this.thumbPosition = 0;

    this._setValue(opts.value || min);

    this.handlers = {};

    this._handleResize = this._handleResize.bind(this);
    this.resizeTo = undefined;
    window.addEventListener('resize', this._handleResize);
  }

  _handleResize() {
    clearTimeout(this.resizeTo);

    this.resizeTo = setTimeout(() => {
      this.rangeWidth = this.element.clientWidth;
      this.endPoints = this._calculateEndpoints();
      this._moveTo(this.endPoints[this.values.indexOf(this.currentValue)], false);
    }, 100)
  }

  _calculateEndpoints() {
    const endPoints = [0];
    const l = this.values.length - 1;
    const partWidth = this.rangeWidth / l;

    for (let i = 0; i < l; i++) {
      endPoints.push(endPoints[i] + partWidth);
    }

    return endPoints;
  }

  _updateProgress(transition) {
    if (this.progress) {
      if (transition) {
        this.progress.style.transition = 'transform 0.7s ease-in-out';
      } else {
        this.progress.style.transition = '';
      }

      this.progress.style.transform = 'scaleX(' + this.thumbPosition / this.rangeWidth + ')';
    }
  }

  _handleThumbMove(current, next) {
    if (next < 0 || next > this._endEdge) {
      return false;
    }

    this.thumbPosition = next;
    this._updateProgress(false);
    this._checkForValueChange();

    return true;
  }

  _handleThumbMoveEnd(current) {
    let nearestEndPoint = nearestNumInSortedArray(this.endPoints, current);
    this._moveTo(nearestEndPoint, true);
  }

  _checkForValueChange() {
    let nearestEndPoint = nearestNumInSortedArray(this.endPoints, this.thumbPosition);

    const nextValue = this.values[this.endPoints.indexOf(nearestEndPoint)];

    if (nextValue !== this.currentValue) {
      this.currentValue = nextValue;

      if (this.handlers['value-change']) {
        this.handlers['value-change'](nextValue);
      }
    }
  }

  _setValue(val) {
    this.currentValue = val;
    this._moveTo(this.endPoints[this.values.indexOf(val)], false);
  }

  _moveTo(position, transition) {
    this.thumbPosition = position;

    if (transition) {
      this.thumb.slideTo(position);
    } else {
      this.thumb.setPosition(position);
    }

    this._updateProgress(transition);
  }

  get _endEdge() {
    return this.endPoints[this.endPoints.length - 1];
  }
  /**
   * @param {number} val
   */
  setValue(val) {
    this.currentValue = val;
    this._moveTo(this.endPoints[this.values.indexOf(val)], true);
  }
  /**
   * sets event listener
   * @param {string} eventName - 'value-change'
   * @param {function(value):void} handler
   */
  on(eventName, handler) {
    this.handlers[eventName] = handler;
  }
  /**
   * removes event listener
   * @param {string} eventName - 'value-change'
   */
  off(eventName) {
    this.handlers[eventName] = null;
  }
}

export default RangeElement;
