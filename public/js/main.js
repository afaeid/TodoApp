var todoCover = document.querySelector(".todo-body");
var todoButtons = todoCover.querySelectorAll(".todos>li>i");
var blankScreen = document.querySelector(".blank-screen");
const viewMessage = (msg) => {
 var elm = document.querySelector(".viewMessage");
 elm.innerText = msg;
 elm.style.display = "block"
}

const openScreen = (options = {
 screenBg: "normal",
 layoutValue: "1"
}) => {
 if (options.screenBg === "normal") {
  blankScreen.style.background = "transparent";
  blankScreen.style.backdropFilter = "blur(0px)"
 } else if (options.screenBg === "neumorphism") {
  blankScreen.style.background = "rgba(255, 255, 255, 0.2)";
  blankScreen.style.backdropFilter = "blur(10px)"
 } else {
  blankScreen.style.background = "transparent";
  blankScreen.style.backdropFilter = "blur(0px)"
 }
 blankScreen.style.display = "block";
 blankScreen.style.zIndex = options.layoutValue;
}

const closeScreen = () => {
 blankScreen.style.display = "none";
 closeToolBox();
 closeUpdatingTodoComponent()
}

const closeUpdatingTodoComponent = () => {
 todoCover.removeChild(todoCover.querySelector(".todo-updateing-component"));
}

const openUpdatingTodoComponent = (todoId, todoValue) => {

 var component = document.createElement("div");
 component.innerHTML = `
 <div class="component-header">
 <p class="title">Update Todo</p>
 <p class="info">Todo ID: ${todoId}</p>
 </div>
 <div class="component-body">
  <input type="text" placeholder="Update Todo" data-previousvalue="${todoValue}" value="${todoValue}" onkeyup="checkUpdatedTodo(this)">
 </div>
 <div class="component-footer">
  <button class="cancel-btn" onclick="closeScreen()">Cancel</button>
  <button class="update-btn" disabled>Update</button>
 </div>`
 component.classList.add("todo-updateing-component");
 todoCover.insertBefore(component, todoCover.querySelector(".todo-toolBox"));
 openScreen({ screenBg: "neumorphism", layoutValue: "6" });
}



const checkUpdatedTodo = (elm)=>{
 if(elm.dataset.previousvalue != elm.value){
  console.log("todo has been changed");
  elm.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = false;
 }else{
  console.log("todo has not been changed");
  elm.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = true;
 }
}


const openToolBox = (xPos, yPos, todoId, todoValue) => {
 try {
  var todoToolBox = document.createElement("div");
  todoToolBox.innerHTML = `  
   <ul>
    <li onclick="openUpdatingTodoComponent('${todoId}', '${todoValue}')" data-todoId="${todoId}"><i class="fa-regular fa-pen-to-square"></i> <span>Edit</span></li>
    <li data-todoId="${todoId}"><i class="bi bi-trash"></i> <span>Delete</span></li>
   </ul>`;
  todoToolBox.classList.add("todo-toolBox")
  todoCover.insertBefore(todoToolBox, todoCover.querySelector("ul"))
  todoToolBox.style.top = yPos + "px";
  todoToolBox.style.left = (xPos - todoToolBox.clientWidth) + "px";
  openScreen({ layoutValue: "5" })
  
  
 } catch (e) {
  alert(e.stack)
 }
}


const closeToolBox = () => {
 let toolBox = todoCover.querySelector(".todo-toolBox");
 todoCover.removeChild(toolBox)
}


todoButtons.forEach((eachButton) => {

 eachButton.addEventListener("click", (e) => {
  var yPos = (eachButton.getBoundingClientRect().y - todoCover.getBoundingClientRect().y) + eachButton.clientHeight + 5;
  var xPos = ((eachButton.getBoundingClientRect().x - todoCover.getBoundingClientRect().x) + eachButton.clientWidth);
  openToolBox(xPos, yPos, e.currentTarget.dataset.todoid, eachButton.previousElementSibling.innerText);
 })
})