tread-station
=============

Wirelessly control your treadmill, replace the old lackluster dashboard with graphics and workout analytics! Replace the dashboard with a monitor and add a small computer and you have a Treadmill Workstation.

Features
========
  * Controls both speed and incline
  * morphs speed to the desired speed, no fast changes
  * contains soft limit for testing (reduces max speed)
  * saves state of incline level to EEPROM. To calibrate, reduce platform to zero incline and use SetIncline("CALIBRATE") function to reset saved level.
  * can retrieve local IP for later implementation of direct local connection

Upcoming Features
=================
  * measures pulses from a hall-effect sensor and uses a rolling average
        currently my reed switch sensor on my treadmill appears broken, so I did not implement this right away.

Issues
======
  * currently dealing with a major issue where the spark board resets (blinking reds) after about 10 mins of connectivity
    via TCPServer.
  * Requires implementation of WebSockets on the spark side to allow direct communication from browsers. Will use the
    cwebsockets project. Waiting to fix above outstanding item before complicating the code.

Progress
========

The code for the controller is done besides the outstanding issues. Currently working on the web interface in HTML5 which
is half complete of the dashboard only.

Control Interface
=================

Access the following variables and functions through the spark cloud interface. The user interface uses a faster direct 
interface which provides realtime feedback and control.

Variables:
   Variable         | Type       | Description                                                                             |
   ---------------- | ---------- | --------------------------------------------------------------------------------------- |
    speed           | integer    | the current speed output to the controller |
    desiredSpeed    | integer    | the desired speed setting. current speed will catchup or fallback to this speed at the set morph rate |
    enabled         | bool       | true if platform motion is desired (platform will slow to a stop if this is set false) |
    running         | bool       | true if the platform is in motion (this is the actual state of the platform)           |
    incline         | integer    | current incline setting |
    desiredIncline  | integer    | the desired incline setting |
    inclineInMotion | integer    | 0 if the platform is not inclining, +1 if inclining positive, -1 if negative. |


Functions:
    SetSpeed            speed       treadmill platform speed in tenths of a millisecond (Range is 90 to 410, i.e. 9ms
                                    to 41ms) Also use commands {STOP, START, PANIC}. Platform starts in the STOP state,
                                    so use SetSpeed(START) to begin the motion.
    SetSpeedMorphRate   rate        how fast actual speed will adjust to match desired speed (1=fastest to 20=slowest, 
                                    but even 5 is a crawl)    
    SetIncline          integer     achieve desired incline level, 0=floor to 100=max incline or use {FLOOR,CALIBRATE}.
                                    CALIBRATE will set current_incline to zero (floor).
    EnableSoftLimits    bool        set to false to disable the soft limits acheiving faster speeds (default is on)

Electronics
===========

LOW PASS FILTERS:
  Let's talk about low pass filters. :)  The treadmill controller generates a lot of noise on the signals, both the speed
  signal and the incline sense. It is important to filter out this noise if we are going to get nice clean signals into
  our spark. This is pretty easy since the noise is of a high frequency and our signals are all well under 1kHz. We could
  use complicated code to debounce the inputs, but why risk introducing bugs and make the code unreadable when a simple
  resistor and capacitor will do?
  
  You need to add low pass filters on all input signals and the speed output signal. The speed output already has a 290ohm
  resistor as a current limit, so a 0.22uF capacitor will do here. For simplicity you can also use the same 290ohm and 0.22uF
  cap on the other lines. This will keep a good low-impedance connection between the signal transmitter and receiver.
  
  I assume your spark controller and the MC2100 is seperated by a long cable, where possible put the filter closest to the
  input/receiver side. That means near the MC2100 for the speed output and at the spark for the sense inputs.
  
  A good low-pass resistor-capacitor calculator can be found here:
  http://www.learningaboutelectronics.com/Articles/Low-pass-filter-calculator.php#answer1
  
