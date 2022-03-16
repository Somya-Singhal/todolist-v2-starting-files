//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

//new schema
const itemsSchema = {
   name: String
};
const Item = mongoose.model("Item", itemsSchema);

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const item1 = new Item ({
  name: "Welcome to your to-do list"
});

const item2 = new Item ({
  name: "Hit the + button to add new item"
});

const item3 = new Item ({
  name: "<--- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

// const day = date.getDate();
Item.find({}, function(err, foundItems) {
  if(foundItems.length === 0) {
    Item.insertMany(defaultItems, function(err) {
      if(err) {
       console.log(err);
      }
      else {
       console.log("Successfully saved three models into the database.");
      }
   });
   res.redirect("/");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
});

});

app.get("/:customListName", function(req,res) {
  const customListName = req.params.customListName;
  List.findOne({name: customListName}, function(err, foundList) {
    if(!err) {
      if(!foundList) {
        // console.log("Doesn't exist");
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        list.save();
      } else {
        // console.log("exists");
        res.render("list", {listTitle: foundList.name, newListItems: foundItems.items});
      }
    }
  })
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Successfully deleted");
      res.redirect("/");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
