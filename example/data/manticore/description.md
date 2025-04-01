_[Manticore Games](https://www.manticoregames.com/) is a video game company based in San Mateo, California._

-   Massive impact on their codebase: **Created 25% of the CLs** during his tenure (of 12 engineers), while accounting for only 5% of the bugs.
-   Extensive work on: networking, engine, UI architecture (with both UMG and Slate), Blueprints, matchmaking, game-loading, inventory systems, UGC systems (authoring/dynamic-loading/in-game-usage), editor tooling, C++/Lua script-binding.
Specific examples:
    -   Identified the need for and created **developer tooling** that let QA and developers test issues in their most Critical User Journeys in **less than half the time**. In particular, Levi added a teleport system and UGC-management system that are now the de facto patterns for accessing their massive collections of locations and UGC (C++).
    -   Massive improvements to the **accuracy and efficiency of their Bounding Box calculations**. Levi added support for Oriented Bounding Boxes, which can be up to **2x as accurate** when detecting collisions, and Levi more than **doubled calculation efficiency** for bounding boxes by removing redundant checks and filtering-out irrelevant geometry (C++).
    -   Consistently campaigned for better **automated testing** and drove adoption of more unit tests across gameplay engineering (C++).
    -   Prototyped integrating Unreal’s **ViewModel framework** while in Beta, documented key usage patterns, and drove wider adoption across their engineering and design teams—leading to **implementation and maintenance times being 2x faster** for new UIs (C++).
    -   Identified the need for and architected new **configurable dialog and screen systems**, which let their developers **create new overlays 3x as quickly**, in addition to greatly reducing maintenance costs and increasing styling consistency across their UI (C++).
    -   Designed and implemented a **matchmaking Hierarchical State Machine** to replace their massive, complex, and brittle legacy systems. This HSM makes their matchmaking logic approachable to other engineers, in addition to greatly reducing bugs and maintenance costs (C++).
    -   Created a new **event-logging system** to help with tracing execution paths that cross between the client and server (C++).
    -   Created **robust tweening libraries**, both in Lua and in Blueprints, enabling new polished UX patterns and animations of any property on any object (Lua/Blueprints).
    -   And many other projects that are not announced to the public!
