#### A tile-matching puzzle game

This web app gave Levi the opportunity to hone his web development skills and to learn the latest features of HTML5 and CSS3.

On the front end, Levi used pure JavaScript without external libraries like jQuery&mdash;with the notable exception of SoundJS for cross-browser support for layering audio. On the server side, Levi used Node.js with ExpressJS.

## Gameplay

Core gameplay features:

- Blocks fall from all four sides
- Blocks stack and collapse according to rules that closely resemble the familiar game of Tetris
- Upcoming blocks are shown for each side with a cooldown progress indicator
- Falling blocks can be manipulated with either the mouse or the keyboard if keyboard mode is enabled
- Falling blocks can be slid downward, slid from side to side, rotated, and moved to the next quadrant
- As a falling block is being manipulated, phantom lines are shown, which help to indicate where a block can be moved in either the downward or lateral directions.
- As more layers of blocks are collapsed, the player advances through levels and gameplay becomes more difficult with faster falling blocks and shorter cooldown times.
- Awesome sound effects and background music.

Additional optional gameplay features include:

- A mode where only complete layers around the entire center square are collapsed.
- A mode where blocks fall from the center outward.
- A special block type that "settles" all of the blocks that have landed.
- A special block type that destroys any nearby block that has landed.


[main-url]: https://levi.dev/squared-away