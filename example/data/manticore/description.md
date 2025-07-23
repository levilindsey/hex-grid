_[Manticore Games](https://www.manticoregames.com/) is a video game company based in San Mateo, California._

I worked on Manticore's [Core Editor](https://www.coregames.com/create) and the game [Out of Time](https://gamesbeat.com/manticore-games-unveils-out-of-time-multiplayer-roguelike/).

[Core](https://www.coregames.com/create) is a platform for players to create, publish, and play games.

[Out of Time](https://gamesbeat.com/manticore-games-unveils-out-of-time-multiplayer-roguelike/) is an MMO roguelite. I was the lead engineer on most of the core systems—things like matchmaking, game loading, map and location management, friends management, squad management, inventory systems, a ton of UI architecture, a lot of features to coordinate with our Lua systems for content created in the Core Editor (Core is an established platform that Manticore Games made for players to create, publish, and play games), and so very many features that got abandoned along the way!

### Notable contributions

-   Massive impact on our codebase: **Created 25% of the CLs** (of 20 devs), while accounting for only 5% of the bugs.
-   Extensive work on: networking, engine, UI architecture (both UMG and Slate), Blueprints, matchmaking, game-loading, inventory systems, UGC systems (authoring / dynamic-loading / in-game-usage), editor tooling, C++/Lua script-binding, telemetry and performance optimization.
-   Specific impact:
    -   Drove adoption of Unreal’s **ViewModel framework**—yielding **3x speed-up for UI creation and maintenance**.
    -   Added **telemetry tools** and introduced **object-pooling**, to **optimize performance of critical gameplay features by 2x to 30x**.
    -   Architected **configurable UI layout systems**, which let devs **create new overlays 4x as quickly**.
    -   Designed a **Hierarchical State Machine**, which **halved the bugs** in a complex matchmaking system.
    -   Implemented an **event-logging system**, which let devs debug issues in published servers **10x as quickly**.
    -   Designed **developer tooling** to let QA and devs test issues in the most Critical User Journeys in **half the time** (e.g. a teleport system and a     -   UGC-management system).
    -   Improved **Bounding Box calculation** **accuracy by 2x** and **efficiency by 3x**.
    -   Introduced **automated testing practices** across engineering teams.
    -   Created **robust tweening libraries**, in both Lua and Blueprints, enabling animations of any property.
    -   And many other systems that are under NDA!
