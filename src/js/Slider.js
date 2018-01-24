import Slidable from './Slidable';
import { nearestNumInSortedArray } from './utils';

/**
  * Creates slider vertical or horizontal
  */
class Slider {
  /**
   * Create slider instance
   * @param {HTMLElement} element - element to create from
   * @param {Object} [options] - slider options
   * @param {boolean} [options.vertical = false] - specifies slider direction
   * @param {number} [options.startIndex = 0] - start slide index
   */
  constructor(element, options) {
    const opts = options || {};

    this.container = element.parentElement;
    this.track = element;
    this.items = Array.from(element.children);

    this.slidable = new Slidable(this.track, {
      vertical: opts.vertical,
      onStart: this._handleTrackMoveStart.bind(this),
      onMove: this._handleTrackMove.bind(this),
      onEnd: this._handleTrackMoveEnd.bind(this),
      threshold: 25
    });

    this.isVertical = opts.vertical || false;
    this.containerDimension = undefined;
    this.itemsDimensions = undefined;
    this.endPoints = undefined;
    this.handlers = {};
    this.currentIndex = opts.startIndex || 0;

    this.resizeTo = undefined;
    this._handleResize = this._handleResize.bind(this);
    window.addEventListener('resize', this._handleResize);

    this._update();
  }

  _handleResize() {
    clearTimeout(this.resizeTo);

    this.resizeTo = setTimeout(() => {
      this._update();
    }, 150);
  }

  _update() {
    this.track.style.width = '';

    setTimeout(() => {
      this.containerDimension = this.container[this._getDimensionName()]
      this._updateItemsDimensions();
      this._updateTrackDimension();
      this._updateEndPoints();

      this.slidable.setPosition(-this.endPoints[this.currentIndex]);
    }, 0);
  }

  _updateItemsDimensions() {
    const prop = this._getDimensionName();
    this.itemsDimensions = this.items.map(item => item[prop]);
  }

  _updateTrackDimension() {
    if (!this.isVertical) {
      this.track.style.width = this.itemsDimensions.reduce((total, current) => total + current) + 'px';
    }
  }

  _updateEndPoints() {
    const endPoints = [0];
    const l = this.itemsDimensions.length;

    let nextEndPoint = 0;
    let dimension = undefined;

    // slider moves by item width (or height if vertical)
    // so each end point is sum of previous point plus current item dimension
    for (let i = 0; i < l; i++) {
      dimension = this.itemsDimensions[i];
      nextEndPoint = endPoints[i] + dimension;

      // in case of last item we extract container dimension
      // so that slider won't move out of container
      if (l - 1 === i) {
        nextEndPoint -= this.containerDimension;
      }

      endPoints.push(nextEndPoint);
    }

    this.endPoints = endPoints;
  }

  _getDimensionName() {
    return ['offsetWidth', 'offsetHeight'][Number(this.isVertical)];
  }

  _handleTrackMoveStart() {
    if (this.handlers['slide-start']) {
      this.handlers['slide-start'](this.currentIndex);
    }
  }

  _handleTrackMove(current, next) {
    if (next > 0 || next < -this.endPoints[this.endPoints.length - 1]) {
      return false;
    }

    let nearestEndPoint = nearestNumInSortedArray(this.endPoints, Math.abs(current));
    const index = this.endPoints.indexOf(nearestEndPoint);

    if (index !== this.currentIndex) {
      this.currentIndex = index;

      if (this.handlers['slide-change']) {
        this.handlers['slide-change'](index);
      }
    }

    return true;
  }

  _handleTrackMoveEnd(current) {
    let nearestEndPoint = nearestNumInSortedArray(this.endPoints, Math.abs(current));
    this._slideTo(nearestEndPoint);
  }

  _slideTo(position) {
    this.slidable.slideTo(-position, function() {
      if (this.handlers['slide-end']) {
        this.handlers['slide-end'](this.currentIndex);
      }
    }.bind(this));
  }
  /**
   * changes slide by index
   * @param {number} index
   */
  changeSlide(index) {
    const dest = this.endPoints[index];

    if (dest || dest === 0) {
      this._slideTo(dest);
      this.currentIndex = index;
    }
  }
  /**
   * sets event listener
   * @param {string} eventName - name of event, one of: 'slide-change', 'slide-start', 'slide-end'
   * @callback handler
   */
  on(eventName, handler) {
    this.handlers[eventName] = handler;
  }
  /**
   * removes event listener
   * @param {string} eventName - name of event
   */
  off(eventName) {
    this.handlers[eventName] = null;
  }
}

export default Slider;
