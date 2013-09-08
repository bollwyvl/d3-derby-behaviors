;(function(){
  // all d3-related code lives here
  "use strict";

  var d3 = require("d3");

  // this probably wouldn't work in the browser without require right now
  module.exports = function(){
    var updateItem = function(){};

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = function(){
        return document.documentElement.clientWidth -
          margin.left - margin.right;
      },
      height = function(){
        return document.documentElement.clientHeight -
          margin.top - margin.bottom;
      };

    // scales
    var x = d3.scale.linear()
      .domain([-1000, 1000])
      .range([0, width()]);

    var y = d3.scale.linear()
      .domain([-1000, 1000])
      .range([height(), 0]);

    // axes
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height());

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickSize(-width());

    // behaviors
    var zoom = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0.001, 100]);

    var drag = d3.behavior.drag()
      .on("drag", function(d){
        // prevent pan
        d3.event.sourceEvent.stopImmediatePropagation();
        d3.event.sourceEvent.stopPropagation();

        // transform the event pixels into the zoom/panned coordinate frame
        var attrs = {
          x: d.value.x + (x.invert(d3.event.dx) - x.invert(0)),
          y: d.value.y + (y.invert(d3.event.dy) - y.invert(0)),
        };
        updateItem(d.key, attrs);
      });

    // event callbacks
    var resize = function(selection){
      x.range([0, width()]);
      y.range([height(), 0]);
      xAxis.tickSize(-height());
      yAxis.tickSize(-width());
      selection.call(my);
    };

    var add_item = function(d){
      d3.event.stopImmediatePropagation();
      d3.event.stopPropagation();
      d3.event.preventDefault();
      // make a new item!
      updateItem(null, {
        x: x.invert(d3.event.x - margin.left),
        y: y.invert(d3.event.y - margin.top)
      });
    };

    var delete_item = function(d){
      d3.event.stopImmediatePropagation();
      d3.event.stopPropagation();
      updateItem(d.key);
    };

    // the actual renderer
    var my = function(selection){
      // the main svg container
      var svg = selection.selectAll("svg").data([1]),
        // initialize
        svg_init = svg.enter().append("svg");

      svg_init.append("defs").append("clipPath")
        .attr({id: "clip"})
      .append("svg:rect")
        .attr({id: "clip-rect"});

      var root_init = svg_init.append("g").attr({
        id: "root",
        transform: "translate(" + margin.left + "," + margin.top + ")"
      });

      root_init.append("rect")
        .attr({id: "frame"});


      root_init.append("g").attr({
        id: "x",
        "class": "axis"
      });

      root_init.append("g").attr({
        id: "y",
        "class": "axis"
      });

      root_init.append("g").attr({
        id: "items",
        "clip-path": "url(#clip)"
      });

      // update selections
      svg.attr({
        width: width() + margin.left + margin.right,
        height: height() + margin.top + margin.bottom
      });

      svg.select("#clip-rect").attr({
        width: width(),
        height: height()
      });

      svg.select("#frame").attr({
        width: width(),
        height: height()
      });

      svg.select("#x")
        .attr({transform: "translate(0," + height() + ")"})
        .call(xAxis);

      svg.select("#y")
        .call(yAxis);

      // update items
      var item = svg.select("#items")
        .selectAll(".item")
        .data(
          d3.entries(selection.datum().items),
          function(d){ return d.key; }
        );

      item.enter()
        .append("g")
          .attr("class", "item")
        .append("circle");

      // clean up
      item.exit()
        .transition()
          .style({opacity: 0, color: "red"})
        .remove();

      // the most-frequently called postioning stuff
      var update = function(){
        var sx = zoom.scale();

        svg.select("#x").call(xAxis);
        svg.select("#y").call(yAxis);

        svg.selectAll("#items .item")
          .attr("transform", function(d){
            return "translate(" + x(d.value.x) + "," + y(d.value.y) + ")";
          })
          .select("circle")
            .attr("r", 10 * sx);
      };

      // attach behaviors and other events
      d3.select(window)
        .on("resize", function(){ resize(selection); });

      zoom
        .on("zoom", update);

      root_init
        .call(zoom)
        .on("dblclick", add_item);

      item
        .on("dblclick", delete_item)
        .call(drag);

      update();
    };


    // getter/setter
    my.updateItem = function(_){
      if(!arguments.length){ return updateItem; }
      updateItem = _;
      return my;
    };

    return my;
  };
}).call(this);
