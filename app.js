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

 var todoValue = req.body.todoName.trim();
 var todoId = Date.now();
 var newTodo = { todoValue, todoId }
 if (todoValue !== '') {
  todos.unshift(newTodo);
  res.status(202);
  res.render("index", { todos });
 } else {
  res.status(404);
  res.send({ message: "No todo has been given to creat new" })
 }
})

app.put("/", (req, res) => {
 var todoValue = req.body.todoName.trim();
 var todoId = req.body.todoId;
 let foundTodo = todos.find(todo => todo.todoId == todoId);

 if (foundTodo) {
  if(foundTodo.todoValue != todoValue && todoValue != ""){
   Object.assign(foundTodo, { todoValue });
  res.status(200).send({message: "Todo has been successfully updated"})
  }else{
   res.status(304).send({message: "Nothing to update in todo"})
  }
 } else {
  res.status(404).send({message: "No todo found to update"})
 }
})



app.delete("/", (req, res) => {
 var todoId = req.body.todoId;
 var newTodos = todos.filter((todo) => {
  return todo.todoId != todoId;
 });

 if (newTodos.length < todos.length) {
  todos = newTodos;
  res.status(202).send({
   message: "Todo has been successfully deleted"
  });
 } else {
  res.status(404).send({
   message: "No todo found to delete"
  });
 }
});


module.exports = app;