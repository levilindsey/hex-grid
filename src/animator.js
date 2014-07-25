'use strict';

/**
 * This module defines a singleton for animating things.
 *
 * @module animator
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * This is the animation loop that drives all of the animation.
   */
  function animationLoop() {
    var currentTime = Date.now();
    animator.isLooping = true;

    if (!animator.isPaused) {
      updateJobs(currentTime);
      hg.util.requestAnimationFrame.call(window, animationLoop);
    } else {
      animator.isLooping = false;
    }

    animator.previousTime = currentTime;
  }

  /**
   * Updates all of the active AnimationJobs.
   *
   * @param {number} currentTime
   */
  function updateJobs(currentTime) {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].update(currentTime);

      // Remove jobs from the list after they are complete
      if (animator.jobs[i].isComplete) {
        removeJob(animator.jobs[i], i);
        i--;
        count--;
      }
    }
  }

  /**
   * Removes the given job from the collection of active, animating jobs.
   *
   * @param {AnimationJob} job
   * @param {number} [index]
   */
  function removeJob(job, index) {
    var count;

    if (typeof index === 'number') {
      animator.jobs.splice(index, 1);
    } else {
      for (index = 0, count = animator.jobs.length; index < count; index += 1) {
        if (animator.jobs[index] === job) {
          animator.jobs.splice(index, 1);
          break;
        }
      }
    }

    // Stop the animation loop when there are no more jobs to animate
    if (animator.jobs.length === 0) {
      animator.isPaused = true;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a new AnimationJob.
   *
   * @param {HTMLElement} element
   * @param {number} duration In milliseconds.
   * @param {string} easingFunctionName
   * @param {Function} animationFunction
   * @param {Function} onComplete
   * @returns {Window.hg.AnimationJob}
   */
  function createJob(element, duration, easingFunctionName, animationFunction, onComplete) {
    // Just make sure that any state that should be completed from a previous animation is ready
    animationLoop();

    return new hg.AnimationJob(element, duration, easingFunctionName, animationFunction,
        onComplete);
  }

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function startJob(job) {
    job.start();
    animator.jobs.push(job);

    // Start the animation loop if it were not already running
    animator.isPaused = false;
    if (!animator.isLooping) {
      animationLoop();
    }
  }

  /**
   * Cancels the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function cancelJob(job) {
    job.cancel();
    removeJob(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  var animator = {};
  animator.jobs = [];
  animator.createJob = createJob;
  animator.startJob = startJob;
  animator.cancelJob = cancelJob;
  animator.isPaused = true;

  // Expose this module
  if (!window.hg) window.hg = {};
  window.hg.animator = animator;

  console.log('animator module loaded');
})();
