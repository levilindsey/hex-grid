#### A blind-accessible route-navigation Android application

In a computer science capstone course on accessibility at the University of Washington, Levi co-developed a route-orienting application that would guide a blind user via vibrational feedback.

This application would first geocode the user's current location and a user-entered destination and then query the Google Directions API for a route from the one to the other. This route was then displayed on a map with the user’s current location. The user could then rotate the phone around, and the phone would vibrate when pointed in the direction of the current step in the user's route.

This involved the creation of a completely novel blind-accessible soft keyboard in addition to the implementation of a database for storing previously entered destinations.

The PhoneWand code is open source and online at [http://code.google.com/p/mobileaccessibility/source/browse/#svn%2Ftrunk%2FPhoneWand][main-url].

_The following is the final paper from the Phone Wand project._

## Abstract

The Phone Wand is an Android application for mobile phones that enables a blind user to more easily input and navigate  a walking route. At any time a route has been specified, the phone can hint which direction to walk when the user  requests assistance using the phone's built-in compass and vibration: (1) the user requests for help by double tapping  the "magic button" on an orientation screen, (2) the user moves the phone radially to search for the correct direction  and (3) the phone vibrates when facing the correct direction to continue on the route. This type of assistance is  useful when the user is en route to the next intersection and wishes to verify the current heading along the route, or  if the user has reached an intersection and wishes to receive the heading to the next intersection. The application  also contains features to enable blind-users to more easily input and manage walking routes. This includes a custom  blind-accessible keyboard implementation to more easily input addresses, a "slide-rule" based blind-accessible list of  previously entered walking routes, and an ability to save your current location as a new future destination. Such  application is useful for blind users navigating noisy, dense, urban city centers where hearing is difficult, the  application's non-verbal orientation guidance is effective, and where location sensing tools are most accurate.

## Introduction

Navigating routes can be difficult or time consuming for people who are blind or have low-vision. Navigation  applications that are not blind-accessible make it especially difficult and time consuming for blind users to navigate  the software enter route destination. Another problem is that too much text-to-speech can be obstructive to a blind  persons most important sense, hearing, taking away focus from actual navigation and listening for hazards. While  blind-accessible applications often provide an easy interface to input, they often rely too much on text-to-speech  output.

The purpose of the Phone Wand is to minimize text-to-speech related to actual route navigation but keep only the  text-to-speech necessary for a functioning blind-accessible application. The Phone Wand replaces verbal navigation  feedback with vibrational feedback. This is a relatively new type of interaction that uses orientation as input and  vibration as output. The concept is simple, (1) the user points the phone 360 degrees around her and (2) the phone  vibrates when the user is facing the correct direction. This requires minimal text-to-speech as output, solving our  information flooding problem. However, while the heart of our application uses compass and vibration feedback, our  application still relies on text-to-speech for blind-accessible text entry, traditional list of directions display and  giving application directions.

The target group for our application includes blind users and low-vision users who can hear. The compass and vibration  feedback portion of our application is theoretically blind-deaf-accessible. But, we assume that our target group can  hear text-to-speech in order to hear application directions and use the touch keyboard to set up routes in our  application. Theoretically we could make the application completely blind-deaf accessible if we had an option to  translate our input and output methods into some standard method familiar for blind-deaf users.

## Use Case

Harry is walking to a nearby store on the sidewalk and would like additional help. He pulls out his Android phone and  launches the Phone Wand. After patiently inputting the store's destination, and waiting for the phone to compute the  route, he can press the "magic button" to enable the compass driven vibrational orientation feedback mode. After  pointing around for a bit, the phone vibrates in the direction he was heading, indicating that he is en route to the  destination. Minutes later he reaches an intersection and is unsure of this next direction of travel. Pressing the  "magic button" again, he points the phone around. This time the phone vibrates when he points it to his left. This  indicates that he should turn left. Harry continues this until he reaches the store, where the phone announces that he  has arrived at his destination.

## Related Work

There has been a lot of work previously done for inventing useful methods of route-finding and navigation for blind  users. Most of these previous projects are lacking in some regard such as their accuracy, usability, or availability.  There are many projects involving the creation of a novel navigation device, such as the EYECane project, which  involved the creation of a white cane device with an embedded computer and camera, but we will focus rather on blind-accessible smart phone route-finding/navigation applications.

Most previous work with smart phone applications involves the use of GPS navigating systems with audio feedback  similar to the systems available for driving. The Sendero Group has created a couple of applications that are similar  to our project. Their LookAround application has a user interface that is very similar to ours, but it only provides information on the user's current location; it does not provide route information. Their Mobile Geo application both finds routes and provides information about locations; however, this costs $788, and uses primarily audio feedback. The Iwalk application is another navigation application similar in to ours, but once again, this application's primary method of user feedback was with audio.

Our application also relies on special accessible methods of text entry and item selection. Our slide rule list item  selection is based upon an earlier project which allows the user to explore the items by pressing a finger on the item and to select it by double tapping it. Our blind accessible touch keyboard was actually invented from scratch and emulates no prior method of text entry; the key is spoken when a finger presses onto it and is selected when a finger is lifted from it. However, a very similar technique for text entry can be seen in how Apple provides iPhone item exploration and selection with their VoiceOver functionality; with VoiceOver, an item is spoken when pressed or slid over and is selected with a second touch on the screen.

## Solution

The purpose of the Phone Wand application is to provide a blind-accessible interface and orientation scheme for finding and navigating walking routes. Hence the Phone Wand uses the Google Directions API to calculate walking routes using the Android location service including network assisted GPS. Orientation output from the Android sensor service and vibration features are used for orientation feedback. The Android TextToSpeech (TTS) library is heavily used to communicate application screen directions to users in a blind-accessible manner. The Phone Wand automatically saves, previously entered routes and provides the ability to save the current location. The slide rule selection method is used to display these routes for the users and to display a current list of the walking route directions.

### Destination Input

The Phone Wand features a custom blind-accessible keyboard for entering destinations. This keyboard was created to emulate the familiar iPhone keyboard familiar to many blind users. The user uses the keyboard by holding down on the screen and releasing when the desired letter is called. There is functionality for reading out the entered text, backspace, readout of cursor location, and other features. The done button searches for a route best matching the entered text.

Since blind-accessible text entry is still relatively time consuming for users, the Phone Wand automatically saves previously entered destinations in a list. A user can access this blind-accessible list and select a destination address. The list is based on a Slide Rule interaction technique (cite slide rule paper). A user can scan the list with her finger while the phone speaks back what is currently underneath her finger. If the list is longer than the screen, the user can scan for the "next" and "previous" buttons in the list to navigate the list. When the user finds the desired item, she can double tap to confirm the item, which the phone will then search for a route.

### Navigation Features

After a destination has been entered via keyboard or selected from the list of saved addresses, the phone takes the user to a map screen, which displays a route from the current location to the destination. On this screen, there are several options: (1) recompute a new route from the current location, (2) find a nearby address and save it, (3) access a list of directions, or (4) using the compass and vibration feature.

(1) Recomputing a route is useful when the user is significantly off course from the original route, or otherwise when the user wants to find a fresh route from the current location. The user can accomplish this by swiping upwards. The phone downloads a new route using the Google Directions API.

(2) Finding a nearby address and saving it is useful when the user wants to "bookmark" the current location for future use. This is accomplished by swiping downwards.

(3) The user can also access a list of directions. The user can swipe right on the map screen to view the list of directions. The list is blind-accessible: it uses the slide rule interaction. Therefore a user can scan through the list and have the phone speak back the directions. This functionality was implemented to give the user another option.

(4) Finally, the user can take advantage of the compass and vibration feature on this screen as detailed in the next section.

### Compass and Vibration

While the map screen provides additional features, the compass and vibration mode is the most prominent feature of our application.

To activate the compass and vibration mode, the user double taps on the map screen. (This gesture is referred to as the "magic button" because it turns this mode on and off.) Afterwards, the user can move the phone radially around her. The phone vibrates when the user is facing the correct direction. The user should double tap on the map screen again to deactivate the mode and continue walking the direction determined by the phone.

The intended use of this compass and vibration mode is to check the user's heading at interest points (like intersections) along the route, or whenever the user simply needs to verify her heading. Therefore, the user should activate the mode, check her heading, and then deactivate immediately. While one can activate the mode and leave it enabled throughout the entire route, it may not be accurate enough to direct the user along the route.

For effective feedback from the compass, the user should hold the phone parallel to the ground, move the phone radially (point the phone 360 degrees around the person), and move the phone slowly. Since the compass is not entirely accurate, we advise using this feature to "check" the heading occasionally along the route, not to depend on it entirely.

## Future Work

We foresee a few extensions and modifications of the Phone Wand that would be valuable blind and low-vision accessible  applications.

### Indoor Navigation using RFID Tags

Willis and Helal's paper "RFID information grid for blind navigation and wayfinding" lays out the foundations needed to use and construct an indoor RFID (Radio Frequency Identification) based indoor navigation system. RFID tags are cheap, extremely power efficient devices with immense portability that can hold a small amount of information. They are extremely useful in pervasive computing by (literally) attaching computer data to physical objects. Indoor navigation is solved by rigging buildings with thousands of RFIDs each containing a small piece of geographical information. The advantage of RFID readers vs. GPS is in the locality of the information that can be encoded in the RFID. The construction is based on "mature technology" so the limiting factors for widespread use of the infrastructure technology is simply economical feasibility and adoption. With demonstrated success in large corporations and college campuses the technology could be come widespread and worked into building code standards.

In order for Android to take advantage and drive this potentially navigation changing technology, Android would either need to implement an internal RFID reader or provide some simple cost-effective RFID reader attachment. The limiting factor is hardware. The implications of a Blind indoor navigation tool would be extremely valuable for users to navigate complicated indoor areas with little or no GPS capabilities such as airports, public transportation terminals, malls, and stadiums.

### Indoor Navigation using RFID Tags

A useful extension to the Phone Wand would be transferring orientation and vibration feedback to a walking cane via  Bluetooth. A cane is the most natural and useful tool to aid blind people in everyday walking. This extension would  require embedding hardware for compass sensors and vibration directly into a walking cane. There already exists bulky  and expensive electronic aided canes on the market that use sonar to detect solid obstacles and puddles within a "zone  of safety". But user feedback indicates these tend to be too expensive or non-functional for practical use. With the  hardware problem solved, a CaneNavigator Android application would allow users to simply enter all route information  into the cell phone, then the Bluetooth would activate, and then the cell phone could be placed in the users pocket.  All information sensing would then be embedded in the cane and then transferred to the cell phone via Bluetooth.  Information would then be processed and vibration signals would transfer from the phone to the cane via Bluetooth.


[main-url]: http://code.google.com/p/mobileaccessibility/source/browse/#svn%2Ftrunk%2FPhoneWand