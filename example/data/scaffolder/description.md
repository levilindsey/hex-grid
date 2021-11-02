This is an opinionated framework that provides a bunch of general-purpose application scaffolding and utility functionality for Godot games.

## Features

### Viewport scaling

This framework handles viewport scaling directly. You will need to turn off Godot's built-in viewport scaling (`Display > Window > Stretch > Mode = disabled`).

This provides some powerful benefits over Godot's standard behaviors, but requires you to be careful with how you define your GUI layouts.

#### Handling camera zoom

This provides limited flexibility in how far the camera is zoomed. That is, you will be able to see more of the level on a larger screen, but not too much more of the level. Similarly, on a wider screen, you will be able to able to see more from side to side, but not too much more.

-   You can configure a minimum and maximum aspect ratio for the game region.
-   You can configure a default screen size and aspect ratio that the levels are designed around.
-   At runtime, if the current viewport aspect ratio is greater than the max or less than the min, bars will be shown along the sides or top and bottom of the game area.
-   At runtime, the camera zoom will be adjusted so that the same amount of level is showing, either vertically or horizontally, as would be visible with the configured default screen size. If the screen aspect ratio is different than the default, then a little more of the level is visible in the other direction.
-   Any annotations that are drawn in the separate annotations CanvasLayer are automatically transformed to match whatever the game-area's current zoom and position is.
-   Click positions can also be transformed to match the game area.

#### Handling GUI scale

-   At runtime, a `gui_scale` value is calculated according to how the current screen resolution compares to the expected default screen resolution, as described above.
-   Then all fonts—which are registered with the scaffold configuration—are resized according to this `gui_scale`.
-   Then the size, position, and scale of all GUI nodes are updated accordingly.

#### Constraints for how you define your GUI layouts

> TODO: List any other constraints/tips.

-   Avoid custom positions, except maybe for centering images. For example:
    -   Instead of encoding a margin/offset, use a VBoxContainer or HBoxContainer parent, and include an empty spacer sibling with size or min-size.
    -   This is especially important when your positioning is calculated to include bottom/right-side margins.
-   Centering images:
    -   To center an image, I often place a `TextureRect` inside of a `Control` inside of some time of auto-positioning container.
    -   I then set the image position in this way: `TextureRect.rect_position = -TextureRect.rect_size/2`.
    -   This wrapper pattern also works well when I need to scale the image.
-   In general, whenever possible, I find it helpful to use a VBoxContainer or HBoxContainer as a parent, and to have children use the shrink-center size flag for both horizontal and vertical directions along with a min-size.

### Analytics

This feature depends on the proprietary third-party **[Google Analytics](https://analytics.google.com/analytics/web/#/)** service.

-   Fortunately, Google Analytics is at least free to use.
-   To get started with Google Analytics, [read this doc](https://support.google.com/analytics/answer/1008015?hl=en).
-   To learn more about the "Measurement Protocol" API that this class uses to send event info, [read this doc](https://developers.google.com/analytics/devguides/collection/protocol/v1).
-   To learn more about the "Reporting API" you could use to run arbitrary queries on your recorded analytics, [read this doc](https://developers.google.com/analytics/devguides/reporting/core/v4).
    -   Alternatively, you could just use [Google's convenient web client](http://analytics.google.com/).

#### "Privacy Policy" and "Terms and Conditions" documents

If you intend to record any sort of user data (including app-usage analytics or crash logs), you should create a "Privacy Policy" document and a "Terms and Conditions" document. These are often legally required when recording any sort of app-usage data. Fortunately, there are a lot of tools out there to help you easily generate these documents. You could then easily host these as view-only [Google Docs](https://docs.google.com/).

Here are two such generator tools that might be useful, and at least have free-trial options:
-   [Termly's privacy policy generator](https://termly.io/products/privacy-policy-generator/?ftseo)
-   [Nishant's terms and conditions generator](https://app-privacy-policy-generator.nisrulz.com/)

> _**DISCLAIMER:** I'm not a lawyer, so don't interpret anything from this framework as legal advice, and make sure you understand which laws you need to obey._

### Automatic error/crash reporting

This feature currently depends on the proprietary third-party **[Google Cloud Storage](https://cloud.google.com/storage)** service. But you could easily override it to upload logs somewhere else.

### Screen layout and navigation

-   You can control transitions through `Gs.nav`.
-   It is easy to include custom screens and exclude default screens.
-   Here are some of the default screns included:
    -   Main menu
    -   Credits
    -   Settings
        -   Configurable to display checkboxes, dropdowns, or plain text for whatever settings you might want to support.
    -   Level select
    -   Game/level
    -   Pause
    -   Notification
        -   Configurable to display custom text and buttons as needed.
    -   Game over

### Lots of useful utility functions

It might just be easiest to scroll through some of the following files to see what sorts of functions are included:
-   [`Audio`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/Audio.gd)
-   [`CameraShake`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/CameraShake.gd)
-   [`DrawUtils`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/DrawUtils.gd)
-   [`Geometry`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/Geometry.gd)
-   [`Profiler`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/Profiler.gd)
-   [`SaveState`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/data/SaveState.gd)
-   [`Time`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/Time.gd)
-   [`Utils`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/utils/Utils.gd)

### A widget library

For example:
-   [`AccordionPanel`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/gui/AccordionPanel.gd)
-   [`LabeledControlList`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/gui/labeled_control_list/LabeledControlList.gd)
-   [`ShinyButton`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/gui/ShinyButton.gd)
-   [`NavBar`](https://github.com/SnoringCatGames/scaffolder/blob/master/src/gui/NavBar.gd)

> _Scaffolder is owned by [Snoring Cat LLC](https://snoringcat.games)._
