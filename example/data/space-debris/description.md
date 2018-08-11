_Fly through starscapes destroying space debris!_

This WebGL-based space-flight simulation video game is built on a collection of supporting libraries that Levi created:
- [grafx][grafx]: A 3D graphics framework for WebGL
- [physx][physx]: A physics engine with 3D rigid-body dynamics and collision detection (with impulse-based resolution)
- [gamex][gamex]: A 3D WebGL-based game engine

## Notable Features

- An algorithm for calculating intercept velocity of B given the position and velocity of A and the position and speed of B.
- Coordination between multiple [WebGL programs][webgl-program].
- Procedurally generated asteroid shapes.
- A procedurally generated starscape.
- A user-controllable ship flying through space and shooting asteroids!
- Rendering lat-long spherical textures over [tessellated][tesselation] icosahera.
- A post-processing [bloom][bloom] shader.
- A ton of cool features in supporting libraries--notably:
  - [grafx][grafx]: A 3D graphics framework for WebGL.
  - [physx][physx]: A physics engine with 3D rigid-body dynamics and collision detection (with impulse-based resolution).


[gamex]: https://github.com/levilindsey/gamex
[grafx]: https://github.com/levilindsey/grafx
[physx]: https://github.com/levilindsey/physx

[webgl-program]: https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
[tesselation]: https://en.wikipedia.org/wiki/Tessellation
[bloom]: https://en.wikipedia.org/wiki/Bloom_(shader_effect)
