import Hammer from 'hammerjs';

/** Makes element slidable */
class Slidable {
  /**
   * Create slidable instance
   * @param {HTMLElement} element - element to be wrapped
   * @param {Object} [options] - slidable options
   * @param {boolean} [options.vertical = false] - specifies slide direction
   * @param {function(currentPosition):void} [options.onStart]
   * @param {function(currentPosition, nextPosition, startPosition):boolean} [options.onMove] -
   * falsy returned value will prevent element from moving
   *
   * @param {function(currentPosition):void} [options.onEnd]
   * @param {number} [options.threshold = 10] - minimal slide distance required before recognizing
   */
  constructor(element, options) {
    const opts = options || {};

    const hammerOptions = {
      direction: opts.vertical ? Hammer.DIRECTION_VERTICAL :
                                 Hammer.DIRECTION_HORIZONTAL,
      threshold: options.threshold || 10
    };

    this.hm = new Hammer.Manager(element, {
      recognizers: [
        [Hammer.Pan, hammerOptions]
      ]
    });

    this.element = element;
    this.vertical = opts.vertical || false;
    this.position = 0;
    this.currentPosition = 0;
    this.handlers = {
      onStart: opts.onStart,
      onMove: opts.onMove,
      onEnd: opts.onEnd
    };

    this.hm.on('panstart', this._handleStart.bind(this));
    this.hm.on('panmove', this._handleMove.bind(this));
    this.hm.on('panend', this._handleEnd.bind(this));
  }

  _handleStart() {
    this.element.style.transition = '';
    this._setPosition(Slidable.getTranslateValue(this.element.style.transform) || 0);

    if (this.handlers.onStart) {
      this.handlers.onStart(this.position);
    }
  }

  _handleMove(e) {
    const delta = ['deltaX', 'deltaY'][Number(this.vertical)];
    const nextPosition = this.position + e[delta];

    // call onMove callback if provided
    // if it returns truthy value then we can move element else not
    // if not provided always move
    const onMove = this.handlers.onMove;
    const move = onMove ? Boolean(onMove(this.currentPosition, nextPosition, this.position)) :
                          true;

    if (move) {
      this._translate(nextPosition);
      this.currentPosition = nextPosition;
    }
  }

  _handleEnd(e) {
    this.position = this.currentPosition;

    if (this.handlers.onEnd) {
      this.handlers.onEnd(this.position);
    }
  }

  _setPosition(pos) {
    this.position = pos;
    this.currentPosition = pos;
  }

  _handleTransitionEnd(onComplete) {
    if (onComplete) {
      onComplete();
    }

    this.element.removeEventListener('transitionend', this._handleTransitionEnd);
  }

  _translate(pos) {
    this.element.style.transform = this.vertical ? 'translateY(' + pos + 'px)' :
                                                   'translateX(' + pos + 'px)';
  }
  /**
   * slides element with transition
   * @param {number} position - target position
   * @callback [onComplete]
   */
  slideTo(position, onComplete) {
    if (position === this.position) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    this._handleTransitionEnd = this._handleTransitionEnd.bind(this, onComplete);
    this.element.addEventListener('transitionend', this._handleTransitionEnd);

    this.element.style.transition = 'transform 0.7s ease-in-out';

    this._translate(position);
    this._setPosition(position);
  }
  /**
   * sets position without transition
   * @param {number} value - target position
   */
  setPosition(value) {
    this.element.style.transition = '';
    this._translate(value);
    this._setPosition(value);
  }
}
/**
 * gets translateX or translateY value from transform string
 * @param {string} str
 * @returns {(number|undefined)}
 */
Slidable.getTranslateValue = function getTranslateValue(str) {
  const arr = str.split(' ');

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('translate') !== -1) {
      return parseInt(arr[i].split('(').join(')').split(')')[1]);
    }
  }
}

export default Slidable;
