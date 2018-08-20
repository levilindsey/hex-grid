_A 3D WebGL-based game engine. Includes a 3D WebGL-based [graphics framework][grafx], a [physics engine][physx] with 3D rigid-body dynamics and collision detection (with impulse-based resolution), and miscellaneous other features that are commonly needed when creating a game._

## Grafx: A 3D graphics framework for WebGL

### Notable features

- A system for defining 3D shapes, models, and controllers.
- A system for configuring and drawing multiple simultaneous [WebGL programs][webgl-program].
- A system for loading and compiling WebGL shaders and programs.
- Support for both per-model and post-processing shaders. 
- A system for loading textures.
- An animation framework.
- A camera framework with built-in first-person and third-person cameras.
- A collection of basic shape definitions, each with vertex position, normal, texture coordinate, and vertex indices configurations.
- Algorithms for converting to and from a vertex-indexing array.
- An algorithm for polygon [tesselation][tesselation].
  - This is used for subdividing all faces of a polygon into a parameterized number of triangles.
  - All of the resulting vertices can then be pushed out to a given radius in order to render a smoother sphere.
- An algorithm for mapping spherical lat-long textures onto an icosahedron.
  - This involves careful consideration of the texture coordinates around the un-even seam of the icosahedron.

## Physx: A physics engine with 3D rigid-body dynamics and collision detection (with impulse-based resolution).

### Notable features

- Includes continuous [collision detection][collision-detection] with [impulse-based resolution][collision-resolution].
- [Decouples the physics simulation and animation rendering time steps][stable-time-steps], and uses a fixed timestep for the physics loop. This provides numerical stability and precise reproducibility.
- Suppresses linear and angular momenta below a certain threshold.

The engine consists primarily of a collection of individual physics jobs and an update loop. This update loop is in turn controlled by the animation loop. However, whereas the animation loop renders each job once per frame loop&mdash;regardless of how much time actually elapsed since the previous frame&mdash;the physics loop updates its jobs at a constant rate. To reconcile these frame rates, the physics loop runs as many times as is needed in order to catch up to the time of the current animation frame. The physics frame rate should be much higher than the animation frame rate.

### Collision Detection

This physics engine also includes a collision-detection pipeline. This will detect collisions between collidable bodies and update their momenta in response to the collisions.

- Consists of an efficient broad-phase collision detection step followed by a precise narrow-phase step.
- Calculates the position, surface normal, and time of each contact.
- Calculates the impulse of a collision and updates the bodies' linear and angular momenta in response.
- Applies Coulomb friction to colliding bodies.
- Sub-divides the time step to more precisely determine when and where a collision occurs.
- Supports multiple collisions with a single body in a single time step.
- Efficiently supports bodies coming to rest against each other.
- Bodies will never penetrate one another.
- This does not address the [tunnelling problem][tunnelling-problem]. That is, it is possible for two fast-moving bodies to pass through each other as long as they did not intersect each other during any time step.
- This only supports collisions between certain types of shapes. Fortunately, this set provides reasonable approximations for most other shapes. The supported types of shapes are:
    - [sphere][sphere]
    - [capsule][capsule]
    - [AABB][aabb]
    - [OBB][obb]


[grafx]: https://github.com/levilindsey/grafx
[physx]: https://github.com/levilindsey/physx

[webgl-program]: https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
[tesselation]: https://en.wikipedia.org/wiki/Tessellation

[collision-detection]: https://en.wikipedia.org/wiki/Collision_detection
[collision-resolution]: https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model
[stable-time-steps]: https://gafferongames.com/post/fix_your_timestep/
[tunnelling-problem]: https://www.aorensoftware.com/blog/2011/06/01/when-bullets-move-too-fast/
[sphere]: https://en.wikipedia.org/wiki/Sphere
[capsule]: https://en.wikipedia.org/wiki/Capsule_(geometry)
[aabb]: https://en.wikipedia.org/w/index.php?title=Axis-aligned_bounding_box&redirect=no
[obb]: https://en.wikipedia.org/w/index.php?title=Oriented_bounding_box&redirect=no
