require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"))

app.set("view engine", "ejs");

var todos = [];

app.get("/", (req, res) => {
 res.render("index", { todos })
})

app.post("/", (req, res) => {
 var todoValue = req.body.todoValue.trim();
 var todoId = Date.now();
 if (todoValue !== '') {
  var newTodo = { todoValue, todoId }
  todos.unshift(newTodo);
  let foundTodo = todos.find(todo => todo.todoId == todoId);
  res.status(201).json({
   message: "Todo has been successfully created",
   createdTodo: foundTodo
  })
 } else {
  res.status(406).json({ message: "No todo has been given to creat new" })
 }
})

app.put("/", (req, res) => {

 var todoValue = req.body.todoValue.trim();
 var todoId = req.body.todoId;
 let foundTodo = todos.find(todo => todo.todoId == todoId);
 if (foundTodo) {
  if (foundTodo.todoValue != todoValue && todoValue != "") {
   Object.assign(foundTodo, { todoValue });
   foundTodo = todos.find(todo => todo.todoId == todoId);
   res.headers= {
    
   }
   res.status(202).json({
    message: "Todo has been successfully updated",
    updatedTodo: foundTodo
   })
  } else {
   res.setHeader("Content-Type", "application/json")
   .status(406)
   .json({ message: "Nothing to update in todo" })
  }
 } else {
  // Sending custom error messages.
  res.status(404).json({ message: "No todo found to update" })
 }
})



app.delete("/", (req, res) => {
 var todoId = req.body.todoId;
 var newTodos = todos.filter((todo) => {
  return todo.todoId != todoId;
 });
 let deletedTodo = todos.find(todo => todo.todoId == todoId);
 if (newTodos.length < todos.length) {
  todos = newTodos;
  res.status(202).json({
   message: "Todo has been successfully deleted",
   deletedTodo
  });
 } else {
  res.status(404).json({
   message: "No todo found to delete"
  });
 }
});


module.exports = app;