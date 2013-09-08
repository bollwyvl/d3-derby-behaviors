# derby-d3-behaviors

![Screenshot](/screenshot.png)

This simple app shows how to make a [derby][derby] component out of a reusable
[d3][d3] visualization that makes use of [behaviors][behaviors].

The visualization was ported from the [canonical zoom example](zoom), with
some changes to handle being redrawn. A great introduction to this process can 
be found in the [general update pattern][gup] tutorials.

# Usage
~~~~bash
npm install
npm start
~~~~
Navigate to http://localhost:3000/.

# Limitations
There is no authn/authz whatsoever on the app, nor is there any validation of 
any of the data. As derby, racer and ShareJS mature, it should be possible to add both of these.

# Interesting areas of the code
Not much was modified from the skeleton created by ```derby bare```, aside from 
work done in the `ui` component itself, which could be mostly modified to suit 
your needs.

## Component
- [/ui/behaviors/index.js](/ui/behaviors/index.js): basically the controller, this module knows how to work with both the model and high-level d3 calls
- [/ui/behaviors/render.js](/ui/behaviors/render.js): the view, which passes information translated from screen coordinates back to the model
- [/ui/behaviors/index.html](/ui/behaviors/index.html): really just a shim
- [/ui/behaviors/index.styl](/ui/behaviors/index.styl): styling for the svg and html wrappers... a little messy right now

## App code
- [/lib/app/index.js](/lib/app/index.js): the controller
- [/view/app/index.html](/view/app/index.html): html wrapper

## Styles
- [/styles/app/index.styl](/styles/app/index.styl): base styles

[zoom]: http://bl.ocks.org/mbostock/3892919
[d3]: http://d3js.com
[derby]: http://derbyjs.com
[behaviors]: https://github.com/mbostock/d3/wiki/Behaviors
[gup]: http://bl.ocks.org/mbostock/3808221