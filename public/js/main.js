var todoCover = document.querySelector(".todo-body");
var todoButtons = todoCover.querySelectorAll(".todos>li>i");
var blankScreen = document.querySelector(".blank-screen");
const viewMessage = (msg) => {
 var elm = document.querySelector(".viewMessage");
 elm.innerText = msg;
 elm.style.display = "block"
}

const openScreen = (options = {
 screenBg: "normal"
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
}

const closeScreen = () => {
 blankScreen.style.display = "none";
 closeToolBox();
}



const openUpdatingTodoComponent = (todoId, todoValue) => {

 alert(todoId);
 alert(todoValue)
 var component = document.createElement("div");
 component.innerHTML = `
 <div class="component-header">
  Todo ID: ${todoId}
 </div>
 <div class="component-body">
  <input type="text" placeholder="Add todo" value="${todoValue}">
 </div>
 <div class="component-footer">
  <button class="cnacle-btn">Cancle</button>
  <button class="update-btn">Update</button>
 </div>`
 component.classList.add("todo-updateing-component");

 todoCover.insertBefore(component, todoCover.querySelector(".todo-toolBox"));
 openScreen({ screenBg: "neumorphism" });
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
  openScreen()
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
