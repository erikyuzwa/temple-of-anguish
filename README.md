# temple-of-anguish

![explore and survive the temple](/screenshot.png)

*This is my entry for the 7DRL - 7 Day RogueLike - 2016 competition. It's a fun filled gamejam, where the overall
"goal" is to build a roguelike game in 7 days.*

The land is in turmoil. 

The Queen is the Head of State of lands and territories that are little more then fractured 
geo-political areas governed by leaders that at one time were interested in mutual cooperation. After years of 
concessions, the Queen has no substantial army of her own and must appeal to the government for troops and other war 
donations.

One particular source of the instability, is the recent rise of a brutal cult known as "Infinity Sect". After many 
months on the case, the Queen's spies have tracked down the leader back to his lair deep within the "Temple of Anguish".

Rather then going through "regular" channels, the Queen assigns the assassination to you: a loyal officer of her Royal Guard.

You've navigated through the countryside crossing several dangerous territories, until you've finally reached the last 
reported hideout of the Infinity Sect.

Will you discover the identity of the elusive leader?

* original start date: March 6th, 2016
* original delivery date: March 13th, 2016

## keys

Because of it's magestic awesomeness, I based most of the keyboard input to match that of `UltimaIV`. If your memory
is as crappy as mine (thanks to kids), here's the [Player Reference Card](https://paradroid.automac.se/u4/refguide/refguide.html).

* *left-arrow* : move left
* *right-arrow* : move right
* *up-arrow* : move up
* *down-arrow* : move down
* *i* : open inventory
* *d* : open drop screen
* *u* : use food (eg. eat it)
* *e* : equip weapons
* *w* : wear armor
* *g* : get whatever it is you're standing on


## features

This game is a JavaScript based project, depending on JQuery, [ROT.js](https://github.com/ondras/rot.js) for
generating the console text and map generation. 
[Howler.js](http://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library) 
is used for playing the audio as the background track.

## development

This was my first roguelike, and so I went through the excellent tutorial series over at 
[CodingCookies.com](http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/) and worked on
adding some tweaks to the process.

I wanted to use this project both as a way to create a roguelike, and also to test the viability of using [Electron](http://electron.atom.io/)
for creating a cross-platform desktop binary for distribution.

* `npm install`

## Electron packaging

To get this to work, I created a seperate `package.json` in the root folder called `package.electron.json`. During
the `grunt build` process, this file is copied and renamed as `build/package.json`. 

Once Electron does it's magic, it will use the file defined in the `main` attribute as the startup file. In our
case it's `main.js`.

* `grunt build:mac` - to create the Mac build in the `dist` folder
* `grunt build:win32` - to create the Windows build in the `dist` folder
* `grunt` or `grunt serve` - creates a local web server to debug any game features
* `grunt test` - can be used to run karma (or your favorite js test suite). Empty at the moment.

## refactor notes and future goals

Avoiding the **R** word during a gamejam is probably essential and good for your sanity. Given my web development
background, I would like to go back and tackle this codebase using either `Angular.js`, `Backbone` and/or `React`.

* I would love to see more of the story. Naturally some things took longer then others, which meant I couldn't get
around to tackling actual story integration during the initial 7DRL period.
* setup and configure Webpack
* work on reducing the size of the final game binaries
* I prefer combat to be a little more turn-based / interactive then what it is now
* write an updated tutorial series
* record a video or two

## credits and acknowledgements

* [jquery](https://jquery.com/)
* [jsrogue](https://github.com/jokeofweek/jsrogue)
* [ROT.js](http://ondras.github.io/rot.js/hp/)
* [Howler.js](http://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library)
* [Free Music Archive](http://freemusicarchive.org/music/Visager/Songs_From_An_Unmade_World/Visager_-_Songs_from_an_Unmade_World_-_02_Castle_Theme)

## changelog

* v0.5.0 - updated build infrastructure
* v0.4.1 - minor update to help screen
* v0.4.0 - initial release
## license

The MIT License (MIT)

Copyright (c) 2016 Erik Yuzwa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

