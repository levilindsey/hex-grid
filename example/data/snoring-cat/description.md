-   Formed Snoring Cat LLC to publish games that Levi and some teammates independently develop.
-   They continue to release side-projects under Snoring Cat.
-   Created robust frameworks for **platformer pathfinding and AI** (https://snoringcat.games/surfacer) and **UI/app scaffolding** (https://snoringcat.games/scaffolder).
-   Created **over 20 games** (spanning a variety of engines and languages: Godot/GDscript, Unreal/C++, Unity/C#).
-   Published **over 120 devlog posts** (https://devlog.levi.dev).
-   Wrote a 6-part **tutorial series** on how to create platformer AI (https://levi.dev/platformer-ai-tutorial).
-   **1.6k views** on his platformer AI tutorial in 2024.
-   **135 stars** on the Surfacer and Scaffolder repositories on GitHub.
-   With Surfacer, Levi invented a **novel technique for accurate and robust pathfinding** in 2D platformers, enabling AI characters to use the exact same movement mechanics as the player character.
    -   This works by pre-parsing a level into a platform graph. The nodes are represented by points along the different surfaces in the level (floors, walls, and ceilings). The edges are represented by possible movement trajectories between points along surfaces. The movement trajectories are then further simplified into the actual control-inputs—and associated timings—that will reproduce the corresponding trajectory. There are different types of edges for different types of movement (e.g., jumping from a floor to a floor, falling from a wall, walking along a floor). At run time, A* search is used to calculate a path to a given destination.
-   With Surfacer, Levi invented a **wholly new game genre**—**the point-and-click platformer**.

If you're curious about what all went into forming this LLC, check out [this devlog post](https://devlog.levi.dev/2021/02/snoring-cat-forming-llc.html).
