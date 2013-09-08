var d3 = require("d3"),
  app = require("derby")
    .createApp(module)
    .use(require("../../ui"));

app.get("/:roomName?", function(page, model, params, next){
  var roomName = params.roomName || "home",
    roomPath = "rooms." + roomName;
  
  // subscribe to changes of the container
  model.subscribe(roomPath, function(err){
    // if there is a problem, execute the callback;
    if(err){ return next(err); }
    
    var room = model.at(roomPath);
    
    // initialize a new object
    room.setNull("name", roomName);
    room.setNull("items", {});
    
    // add a reference to the room
    model.ref("_page.room", room);
    
    page.render({title: "using d3 behaviors in derby"});
  });
  
});