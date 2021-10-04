_In this point-and-click game, you control the vast power of an unstable mountain._

> The heroes of the land aim to ascend **Mount Oh No** to destroy the vessel of your vast power! You must CRUSH THEM! And send them flying! They will FEEL YOUR ANGER!! They think they can scale Mount Oh No?? Not while **The Eye of Glower-On** is watching!

This game was originally created in 48-hours as a [submission](https://ldjam.com/events/ludum-dare/49/TODO) for the [Ludum Dare 49 game jam](https://ldjam.com/events/ludum-dare/48).

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

> _The latest version of **TODO** is owned by [Snoring Cat LLC](https://snoringcat.games), but the original version was published by Levi in the Ludum Dare 49 game jam._


![The various characters](https://s3-us-west-2.amazonaws.com/levi-portfolio-media/eye-of-glower-on/loading.gif)
