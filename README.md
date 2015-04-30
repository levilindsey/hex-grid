# hex-grid

[![Flattr this git repo][flattr-image]][flattr-url]

#### A dynamic, expandable, animated grid of hexagonal tiles for displaying posts

_See this running at [levi.sl/hex-grid][demo-url]!_

Levi was bored with the standard grid layout and wanted to play with particle systems and crazy animations. So he made
hex-grid.

Levi uses this package for his professional portfolio, so you know it must be pretty cool!

## Features

Some features of this package include:

- A particle system complete with neighbor and anchor position spring forces.
- An assortment of **persistent** animations that make the grid _exciting to watch_.
- An assortment of **transient** animations that make the grid _exciting to interact with_.
- A control panel that enables you to adjust most of the many different parameters of this system.
- The ability to display custom collections of posts.
    - These posts will be displayed within individual tiles.
    - These tile posts can be expanded for more information.
    - The contents of these posts use standard [Markdown syntax][markdown-url], which is then parsed by the system for
      displaying within the grid.

## Included Example

An example app is included in this project's repository. This currently uses data from Levi's portfolio, but there are
plans to include a separate data collection.

The media for Levi's portfolio is stored in an [AWS S3 bucket][aws-s3-url]. The textual content and metadata is stored
in a MongoDB database hosted by [MongoLab][mongolab-url].

## The Tile-Expansion Algorithm

The following diagrams help to visualize how the grid is expanded.

### A Basic Sector Expansion

This image illustrates how the grid is expanded in order to show an enlarged area with details for a given tile. The
grid is divided into six sectors around the given tile. These are then each translated in a different direction.

![Basic sector expansion][sector-expansion-1-image]

### Sector Expansion with Viewport Panning and Creating New Tiles

This image illustrates which tile positions lie within the viewport after both the grid has been expanded and panning
has occurred in order to center the viewport on the expanded tile. This also illustrates where new tiles will need to
be created in order to not show gaps within the expanded grid.

![Basic sector expansion with panning and new tiles][sector-expansion-2-image]

### A Reference for how Neighbor Tile and Sector Data is Stored and Indexed

This image illustrates how the hex-grid system stores data for three different types of tile relationships. For each
of these relationships, both the vertical and horizontal grid configurations are illustrated.

Each tile holds a reference to each of its neighbor tiles. These references are stored in an array that is indexed
according to the position of the neighbor tiles relative to the given tile. The left-most images show which positions
correspond to which indices.

The expanded grid holds an array with references to each of the six sectors. The middle images show which sectors
correspond to which indices.

A sector stores references to its tiles within a two-dimensional array. The right-most images show how this
two-dimensional array is indexed.

![Reference for how neighbor tile and sector data is stored and indexed][indices-image]

## Acknowledgements / Technology Stack

The following packages/libraries/projects were used in the development of hex-grid:

- [Gulp.js][gulp-url]
- [Bower][bower-url]
- [dat.gui][dat-gui-url]
- [Showdown][showdown-url]
- Additional packages that are available via [NPM][npm-url] (these are listed within the `package.json` file)

## License

MIT



[sector-expansion-1-image]: ./docs/design/hg-sector-expansion-1.png
[sector-expansion-2-image]: ./docs/design/hg-sector-expansion-2.png
[indices-image]: ./docs/design/hg-indices.png

[flattr-url]: https://flattr.com/submit/auto?user_id=levisl176&url=github.com/levilindsey/hex-grid&title=hex-grid&language=javascript&tags=github&category=software
[flattr-image]: http://api.flattr.com/button/flattr-badge-large.png

[demo-url]: http://levi.sl/hex-grid
[markdown-url]: http://daringfireball.net/projects/markdown/
[aws-s3-url]: http://aws.amazon.com/s3/
[mongolab-url]: https://mongolab.com
[dat-gui-url]: http://code.google.com/p/dat-gui
[gulp-url]: http://gulpjs.com
[bower-url]: http://bower.io
[npm-url]: https://npmjs.org
[showdown-url]: https://github.com/showdownjs/showdown
