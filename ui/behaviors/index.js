var d3 = require("d3"),
  render = require("./render"),
  exports = module.exports;

// `create` is called once in the browser
exports.create = function(model, dom){
  "use strict";
  var el = d3.select(dom.element("container")),
    renderer = render()
      .updateItem(function(id, attrs){
        if(attrs && !id){
          model.at("room").add("items", attrs);
        }else if(attrs){
          model.at("room").setEach("items." + id, attrs);
        }else if(id){
          model.at("room.items").del(id);
        }
      });

  function update(){
    el.datum(model.get("room"))
      .call(renderer);
  };

  model.on("change", "room**", update);
  
  // render once initially
  update();
};