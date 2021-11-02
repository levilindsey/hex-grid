[![License Status][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![Downloads Status][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Flattr this git repo][flattr-image]][flattr-url]

_[MEAN stack][mean-url] generator for [Yeoman][yeoman-url] with [gulp][gulp-url]. Follows the [Best Practice Recommendations for Angular App Structure][angular-best-practices-url], and, in general, attempts to  follow best practices throughout._

## What this is

- **Modular**: The main goal of this generator is to create a highly componentized file structure for both  [frontend][angular-best-practices-url] and server-side code. This helps to keep your code modular, scalable, and  easier to understand.
- **Gulp tasks**: This includes a wide array of gulp tasks for optimizing frontend performance and streamlining your  development process.
- **App infrastructure**: This creates a comprehensive boilerplate infrastructure for a end-to-end web application  using the MEAN stack. This likely includes some extra bells and whistles that you may not want to include in your  particular app. The goal of this project is to promote development through _subtractive_ synthesis. What this means  is that, hopefully, this generator creates infrastructure that will handle most of the high-level problems in your  web app, in addition to providing some other common features that you will likely remove.
- **Tests**: This includes a testing infrastructure using the [Karma][karma-url] test runner and the  [Jasmine][jasmine-url] test framework for testing the frontend code.
- **SASS**: This uses the [SASS][sass-url] stylesheet language.
- **UI-Router**: This uses the [UI-Router][ui-router-url] library for more powerful frontend routing and state  management in Angular.

## Why use this generator instead of one of the many other options?

Maybe you shouldn't! Check out the file structure, the gulp tasks, and the various libraries and tools that are used   in this project. If these are all aspects that you agree with, then please try this generator out! Otherwise, there  are many other great generators out there for you to use. Addy Osmani has an [excellent article][addy-osmani-url]  describing MEAN-stack development and a quick survey of some of the more popular generators and boilerplate options  for it. Each of these options have different benefits and each option uses a different set of tools.

## How to use it

```bash
npm install -g generator-meanie
yo meanie
```

See the [getting set up guide][getting-set-up-url] for a step-by-step walkthrough for setting things up and
running.

## Technology stack / acknowledgements

This project uses technology from a number of third-parties. These technologies include:

- [Node.js][node-url]
- [AngularJS][angular-url]
- [MongoDB][mongo-url]
- [gulp.js][gulp-url]
- [SASS][sass-url]
- [Yeoman][yeoman-url]
- [Git][git-url]
- Numerous other packages that are available via [NPM][npm-url] (these are listed within the [`package.json`][package.json-url] file)

## Background

This project is an on-going effort to collect common patterns and processes for developing web apps using the MEAN  stack and gulp. It is constantly evolving and gaining new features.

The contents of this project is strongly opinionated. This is all code that was originally developed and tested by  Levi for his own personal use. That being said, it works great for him, so it will probably work great for you too!

Feedback, bug reports, feature requests, and pull requests are very welcome!

## Next steps

See the [project roadmap][roadmap-url] for Levi's future plans for this generator.


[flattr-url]: https://flattr.com/submit/auto?user_id=levisl176&url=github.com/levilindsey/generator-meanie&title=generator-meanie&language=javascript&tags=github&category=software
[flattr-image]: http://api.flattr.com/button/flattr-badge-large.png

[npm-url]: https://npmjs.org/package/generator-meanie
[npm-image]: http://img.shields.io/npm/v/generator-meanie.svg?style=flat-square
[npm-image-old]: https://badge.fury.io/js/generator-meanie.png

[travis-url]: https://travis-ci.org/levisl176/generator-meanie
[travis-image]: http://img.shields.io/travis/levisl176/generator-meanie/master.svg?style=flat-square
[travis-image-old]: https://secure.travis-ci.org/levisl176/generator-meanie.png?branch=master

[coveralls-url]: https://coveralls.io/r/levisl176/generator-meanie
[coveralls-image]: http://img.shields.io/coveralls/levisl176/generator-meanie/master.svg?style=flat-square
[coveralls-image-old]: https://img.shields.io/coveralls/levisl176/generator-meanie.svg?style=flat

[depstat-url]: https://david-dm.org/levisl176/generator-meanie
[depstat-image]: http://img.shields.io/david/levisl176/generator-meanie.svg?style=flat-square
[depstat-image-old]: https://david-dm.org/levisl176/generator-meanie.svg

[license-url]: https://github.com/levilindsey/generator-meanie/blob/master/LICENSE
[license-image]: http://img.shields.io/npm/l/generator-meanie.svg?style=flat-square

[downloads-url]: https://npmjs.org/package/generator-meanie
[downloads-image]: http://img.shields.io/npm/dm/generator-meanie.svg?style=flat-square

[getting-set-up-url]: https://github.com/levilindsey/generator-meanie/blob/master/docs/getting-set-up.md
[roadmap-url]: https://github.com/levilindsey/generator-meanie/blob/master/docs/roadmap.md
[package.json-url]: https://github.com/levilindsey/generator-meanie/blob/master/package.json
[bower.json-url]: https://github.com/levilindsey/generator-meanie/blob/master/bower.json

[angular-best-practices-url]: https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub
[mean-url]: http://en.wikipedia.org/wiki/MEAN
[yeoman-url]: http://yeoman.io/
[gulp-url]: http://gulpjs.com/
[node-url]: http://nodejs.org/
[angular-url]: https://angularjs.org/
[mongo-url]: https://mongodb.org/
[sass-url]: http://sass-lang.com/
[git-url]: http://git-scm.com/
[npm-url]: http://npmjs.org/
[bower-url]: http://bower.io/
[traceur-url]: https://github.com/google/traceur-compiler

[karma-url]: http://karma-runner.github.io/0.12/index.html
[jasmine-url]: http://jasmine.github.io/2.0/introduction.html
[protractor-url]: http://angular.github.io/protractor/#/
[mocha-url]: http://mochajs.org/
[chai-url]: http://chaijs.com/
[sinon-url]: http://sinonjs.org/

[ui-router-url]: https://github.com/angular-ui/ui-router
[passport-url]: http://passportjs.org/

[addy-osmani-url]: http://addyosmani.com/blog/full-stack-javascript-with-mean-and-yeoman/