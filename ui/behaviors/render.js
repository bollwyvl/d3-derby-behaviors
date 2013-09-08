// all d3-related code lives here
"use strict";

var d3 = require("d3");

module.exports = function(){
  var inited = false;
  
  var updateItem;
  

    
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = document.documentElement.clientWidth - margin.left - margin.right,
    height = document.documentElement.clientHeight - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([-width / 2, width / 2])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([-height / 2, height / 2])
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width);
    

  // the zoom behavior, to be attached to the field
  var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10]);
  
  var my = function(selection){
    var svg;

    zoom
      .on("zoom", function(){
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        update();
      });
    
    // the drag behavior, to be attached to items
    var drag = d3.behavior.drag()
      .on("drag", function(d){
        d3.event.sourceEvent.stopImmediatePropagation();
        d3.event.sourceEvent.stopPropagation();
        var sx = zoom.scale();
        
        var attrs = {
          x: d.value.x + (d3.event.dx / sx),
          y: d.value.y + (-d3.event.dy / sx),
        };
        updateItem(d.key, attrs);
      });

    if(!inited){
      inited = true;
      svg = selection.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("dblclick", function(){
          d3.event.stopImmediatePropagation();
          d3.event.stopPropagation();
          updateItem(null, {
            x: x.invert(d3.event.x - margin.left),
            y: y.invert(d3.event.y - margin.top)
          });
        })
        .call(zoom);

      svg.append("rect")
        .attr("width", width)
        .attr("height", height);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        
      svg.append("g")
        .attr("class", "items");
    }else{
      svg = selection.select("svg");
    }
    
    var item = svg.select(".items")
      .selectAll(".item")
      .data(
        d3.entries(selection.datum().items),
        function(d){ return d.key; }
      );
      
    item.enter()
      .append("g")
        .attr("class", "item")
         .on("dblclick", function(d){
           d3.event.stopImmediatePropagation();
           d3.event.stopPropagation();
           updateItem(d.key);
         })
        .call(drag)
      .append("circle");
      
    item.exit()
      .transition()
        .style({opacity: 0})
        .attr("r", 0)
      .remove();
    
    var update = function(){
      var sx = zoom.scale();
      
      svg.selectAll(".items .item")
        .data(
          d3.entries(selection.datum().items),
          function(d){ return d.key; }
        )
        .attr("transform", function(d){
          return "translate(" + x(d.value.x) + "," + y(d.value.y) + ")";
        })
        .select("circle")
          .attr("r", 10 * sx);
    };
    
    update();
  }
  
  my.updateItem = function(_){
    if(!arguments.length){ return updateItem; }
    updateItem = _;
    return my;
  };
  
  return my;
};