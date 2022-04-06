_[Watch this let's-play video from a stranger on the Internet!](https://www.youtube.com/watch?v=bv0djyPlHwQ)_
_[...or this one!](https://www.youtube.com/watch?v=S1iYKWqClok&t=2307s)

_In this point-and-click game, you control the vast power of an unstable mountain._

> The heroes of the land aim to ascend **Mount Oh No** to destroy the vessel of your vast power! You must CRUSH THEM! And send them flying! They will FEEL YOUR ANGER!! They think they can scale Mount Oh No?? Not while **The Eye of Glower-On** is watching!

This game was originally created in 48-hours as a [submission](https://ldjam.com/events/ludum-dare/49/ludum-dare-49) for the [Ludum Dare 49 game jam](https://ldjam.com/events/ludum-dare/49).

All design, code, images, sound effects, and music were created by Levi.

## The jam

Ludum Dare is a semi-annual event where people create a game over the weekend. Ludum Dare is a ranked competition, with a clever voting system that gets more eyes on your game when you in turn rate other games. There are two tracks you can participate in:

-   In the "**Compo**" track, you must create all your own art, music, sounds, etc. from scratch, work by yourself, and finish within 48 hours.
-   In the "**Jam**" track, you can work with a team, you can use art, code, music, sounds, etc. that already existed or was created by someone else, and you get 72 hours to finish.

Additionally, the games all follow some central theme, which is only announced at the start of the jam.

I worked solo and created everything during the event. Except of course for my Scaffolder and Surfacer frameworks (which is fine, you're allowed to use pre-existing code).

![The various characters](https://s3-us-west-2.amazonaws.com/levi-portfolio-media/eye-of-glower-on/characters_demo.gif)

### The theme: "Unstable"

The mountain is unstable! You use frequent earthquakes and falling boulders to stop those pesky heroes in their tracks!

## Controls

Tap, tappity, tap tap!

Mouse or touch!

## What reviewers are saying

[(See the reviews on ldjam.com)](https://ldjam.com/events/ludum-dare/49/ludum-dare-49)

*   "Great game! I love the SFX and the art. The AI is really cool too and i love that if you shake them off and they land on another platform they start going again. Good work!"
*   "Loving it, dig the simplicity! The forces of good surely felt my wrath as i pounded them with countless tremors, a hailstorm of meteors and they trembled by the sight of my orc army!(though I’m having a harder time then I’d like to admit with lvl 2 haha) The sounds you’ve made are incredible(I’m biased to anything midi or bit-like), fits really well with the all-around aesthetics of the game, and the soundtrack is just 😙👌. Gotta do some other stuff, but i have just put a solid 30-45 minutes into this haha, will definitely get back to it"
*   "Very good game, played it more than other games! Auto jumping enemies looks like magic for me) My respect to SFX and burning eye animation"
*   "this is so fun!!! you are so talented to do such a polished game especially as a COMPO entry. i loved everything here, i usually not into point and click but this was so addicting and fun, the simple graphics are very consistent and your UI\menu’s are beautiful as heck, the sound fits well and hit the spot. the game idea is so innovative and fun! amazing job dude. [...] BTW if you ever decide to expand on this one and make it a whole game on steam, i will be your first buyer :D really had great time with it."
*   "👏👏👍better than licensed versions. fun and simple gameplay. also GODOT!"
*   "It’s really fun to play as the bad guy, it’s like a vertical tower defense game, really cool!! Also love that they’re called Bobbits"
*   "I can totally understand why someone would want an orc army."
*   etc...

## Software used

-   **[Godot](https://godotengine.org/):** Game engine.
-   **[Aseprite](https://www.aseprite.org/):** Pixel-art image editor.
-   **[Bfxr](https://www.bfxr.net/):** Sound effects editor.
-   **[DefleMask](https://www.deflemask.com/):** Chiptune music tracker.
-   **[Scaffolder](https://godotengine.org/asset-library/asset/969):** A package from the Godot Asset Library that provides some general app infrastructure (like GUI layout and screen navigation).
-   **[Surfacer](https://godotengine.org/asset-library/asset/968):** A package from the Godot Asset Library that provides procedural path-finding across 2D platforms.

Notably, this is what the pre-existing Godot Asset Library packages add:
-   **[Surfacer](https://godotengine.org/asset-library/asset/968)**
    -   This mostly adds pathfinding.
        -   Parsing tile maps into platform graphs of navigable surfaces.
        -   Calculating paths through the graph and executing movement through these paths.
        -   Annotating stuff relating to these paths.
-   **[Scaffolder](https://godotengine.org/asset-library/asset/969)**
    -   This mostly adds the GUI and screen-layout you see before actually starting a level.

> _The latest version of **The Eye of Glower-On** is owned by [Snoring Cat LLC](https://snoringcat.games), but the original version was published by Levi in the Ludum Dare 49 game jam._


![The various characters](https://s3-us-west-2.amazonaws.com/levi-portfolio-media/eye-of-glower-on/loading.gif)
