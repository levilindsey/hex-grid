'use strict';

// TODO: remove this module after basing some other animation job implementations off of it

/**
 * This module defines a constructor for AnimationJob objects.
 *
 * @module AnimationJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   */
  function checkForComplete() {
    var job = this;

    // TODO:
//    if (???) {
//      console.log('AnimationJob completed');
//
//      job.isComplete = true;
//      job.onComplete(true);
//    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Sets the given class on the given element. The class describes an animation state:
   * waiting-to-animate, is-animating, done-animating
   *
   * @param {HTMLElement} element
   * @param {'waiting-to-animate'|'is-animating'|'done-animating'} animatingClass
   */
  function setAnimatingClassOnElement(element, animatingClass) {
    hg.util.removeClass(element, 'waiting-to-animate');
    hg.util.removeClass(element, 'is-animating');
    hg.util.removeClass(element, 'done-animating');
    hg.util.addClass(element, animatingClass);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this AnimationJob as started.
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // TODO:
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * This should be called from the overall animation loop.
   */
  function update(currentTime) {
    var job = this;

    // TODO:

    checkForComplete.call(job);
  }

  /**
   * Stops this AnimationJob, and returns the element its original form.
   */
  function cancel() {
    var job = this;

    // TODO:

    job.onComplete(false);

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} element
   * @param {number} duration In milliseconds.
   * @param {string} easingFunctionName
   * @param {Function} animationFunction
   * @param {Function} onComplete
   */
  function AnimationJob(element, duration, easingFunctionName, animationFunction, onComplete) {
    var job = this;

    job.element = element;
    job.duration = duration;
    job.animationFunction = animationFunction;
    job.startTime = 0;
    job.isComplete = false;

    job.easingFunction = hg.util.easingFunctions[easingFunctionName];
    job.start = start;
    job.update = update;
    job.cancel = cancel;
    job.onComplete = onComplete;

    console.log('AnimationJob created');
  }

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.AnimationJob = AnimationJob;

  console.log('AnimationJob module loaded');
})();
