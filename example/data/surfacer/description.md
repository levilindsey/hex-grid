_Point-and-click platformers!_

_An AI and pathfinding 2D-platformer framework for [Godot](https://godotengine.org/)._

_"Surfacer": Like a platformer, but with walking, climbing, and jumping on all surfaces!_

![Surfaces and edges in a plattform graph](https://s3-us-west-2.amazonaws.com/levi-portfolio-media/surfacer/surfaces-and-edges.png)

**tl;dr**: Surfacer works by **pre-parsing** a level into a **"platform graph"**. The **nodes** are represented by points along the different surfaces in the level (floors, walls, and ceilings). The **edges** are represented by possible movement trajectories between points along surfaces. There are different types of edges for different types of movement (e.g., jumping from a floor to a floor, falling from a wall, walking along a floor). At run time, **[A* search](https://en.wikipedia.org/wiki/A*_search_algorithm)** is used to calculate a path to a given destination.

Some features include:
-   Surfacer includes a powerful **character-behavior system** for easily creating a character AI with high-level behaviors like "wander", "follow", "run-away", "return".
-   Easy-to-use point-and-click navigation for player-controlled characters.
-   [Configurable movement parameters](https://github.com/SnoringCatGames/surfacer/blob/master/src/platform_graph/edge/models/movement_params.gd) on a per-character basis (e.g., horizontal acceleration, jump power, gravity, collision boundary shape and size, which types of edge movement are allowed).
-   Level creation using Godot's standard pattern with a [TileMap in the 2D scene editor](https://docs.godotengine.org/en/3.2/tutorials/2d/using_tilemaps.html).
-   Preparsing the level into a platform graph, and using A* search for efficient path-finding at runtime.
-   A powerful inspector for analyzing the platform graph, in order to debug and better understand how edges were calculated.
-   Walking on floors, climbing on walls, climbing on ceilings, jumping and falling from anywhere.
-   [Variable-height jump and fast-fall](https://kotaku.com/the-mechanics-behind-satisfying-2d-jumping-1761940693).
-   Adjusting movement trajectories to move around intermediate surfaces (such as jumping over a wall or around a floor).

See [more details in the library's README](https://github.com/SnoringCatGames/surfacer).

You can also read more about how Surfacer's AI and movement works in **[this series of devlog posts on devlog.levi.dev](https://devlog.levi.dev/2021/09/building-platformer-ai-from-low-level.html)**.

> _Surfacer is owned by [Snoring Cat LLC](https://snoringcat.games)._