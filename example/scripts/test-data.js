'use strict';

/**
 * This module defines a singleton that creates a collection of test post data.
 *
 * @module testData
 */
(function () {

  var testData = {},
      config = {};

  config.postCount = 30;
  config.testContent = 'Throw a stick, and the servile dog wheezes and pants and stumbles to bring it to you. Do the same before a cat, and he will eye you with coolly polite and somewhat bored amusement. And just as inferior people prefer the inferior animal which scampers excitedly because someone else wants something, so do superior people respect the superior animal which lives its own life and knows that the puerile stick-throwings of alien bipeds are none of its business and beneath its notice. The dog barks and begs and tumbles to amuse you when you crack the whip. That pleases a meekness-loving peasant who relishes a stimulus to his self importance. The cat, on the other hand, charms you into playing for its benefit when it wishes to be amused; making you rush about the room with a paper on a string when it feels like exercise, but refusing all your attempts to make it play when it is not in the humour. That is personality and individuality and self-respect -- the calm mastery of a being whose life is its own and not yours -- and the superior person recognises and appreciates this because he too is a free soul whose position is assured, and whose only law is his own heritage and aesthetic sense.';

  // ---  --- //

  testData.config = config;
  testData.createTestData = createTestData;

  window.app = window.app || {};
  app.testData = testData;

  // ---  --- //

  /**
   * @returns {Array.<PostData>}
   */
  function createTestData() {
    var i, post, imageDirectory, mainImageSrc, thumbnailSrc;
    var posts = [];

    imageDirectory = window.app.main.appRootPath + '/images';
    thumbnailSrc = imageDirectory + '/test-thumbnail.png';
    mainImageSrc = imageDirectory + '/test-banner.png';

    for (i = 0; i < config.postCount; i += 1) {
      post = {};
      posts[i] = post;

      post.id = 'test-post-' + i;
      post.titleShort = 'Cats\nare\nCool';
      post.titleLong = 'H.P. Lovecraft on Cats';
      post.thumbnailSrc = thumbnailSrc;
      post.mainImages = [mainImageSrc];
      post.content = config.testContent;
    }

    return posts;
  }

  console.log('testData module loaded');
})();
