/* ===== rectification 
openToolBox = openTodoToolBox
closeToolBox = closeTodoToolBox

*/


var todoCover = document.querySelector(".todo-cover");
var todoBody = todoCover.querySelector(".todo-body")
var todoButtons = todoBody.querySelectorAll(".todos>li>i");
var blankScreen = document.querySelector(".blank-screen");

const blankScreenManager = {
  previousOpeningFuncs: null,
  previousClosingFuncs: null,
  openedScreen: false,
  closeOnTap: true,
 async openScreen(options = {
  screenBg: "normal",
  layoutValue: "1",
  closeOnTap: true,
  openingFuncs: null,
  closingFuncs: null
 }) {
  try {

   if (this.openedScreen == true) {
    await this.closeScreen();
   }

   if (options.screenBg == "normal") {
    blankScreen.style.background = "transparent";
    blankScreen.style.backdropFilter = "blur(0px)";
   } else if (options.screenBg == "neumorphism") {
    blankScreen.style.background = "rgba(255, 255, 255, 0.2)";
    blankScreen.style.backdropFilter = "blur(10px)"
   } else {
    blankScreen.style.background = "transparent";
    blankScreen.style.backdropFilter = "blur(0px)"
   }
   blankScreen.style.display = "block";
   blankScreen.style.zIndex = options.layoutValue;

   if (options.closeOnTap) {
    blankScreen.addEventListener("click", this.closeScreen)
   }
   if (options.openingFuncs != null) {
    for (const func of options.openingFuncs) {
   await  func();
    }
   }

   this.openedScreen = true;
   this.closeOnTap = options.closeOnTap;
   this.previousOpeningFuncs = options.openingFuncs;
   this.previousClosingFuncs = options.closingFuncs;

  } catch (e) { alert(e.stack) }
 },

 async closeScreen() {
  try {

   if (this.previousClosingFuncs != null && this.openedScreen) {
    for (const func of this.previousClosingFuncs) {
     await func();
    };
   }
   if (closeOnTap) {
    blankScreen.removeEventListener("click", this.closeScreen);
   }
   blankScreen.style.display = "none";
   openedScreen = false;

  } catch (e) { console.log(e.stack) }
 }

}

const checkUpdatedTodo = (e) => {
 if (e.currentTarget.dataset.previousvalue != e.currentTarget.value) {
  e.currentTarget.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = false;
 } else {
  e.currentTarget.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = true;
 }
}


const closeUpdatingTodoComponent = () => {
 todoBody.removeChild(todoBody.querySelector(".todo-updateing-component"));
}

const openUpdatingTodoComponent = (todoId, todoValue) => {

 var component = document.createElement("div");
 component.innerHTML = `
 <div class="component-header">
 <p class="title">Update Todo</p>
 <p class="info">Todo ID: ${todoId}</p>
 </div>
 <div class="component-body">
  <input type="text" placeholder="Update Todo" data-previousvalue="${todoValue}" value="${todoValue}">
 </div>
 <div class="component-footer">
  <button class="cancel-btn">Cancel</button>
  <button class="update-btn" disabled>Update</button>
 </div>`
 component.classList.add("todo-updateing-component");
 todoBody.insertBefore(component, todoBody.firstElementChild);
 var updateField = todoBody.querySelector(".todo-updateing-component>.component-body>input");
 var updateBtn = todoBody.querySelector(".todo-updateing-component>.component-footer>button.update-btn");
 var cancelBtn = todoCover.querySelector(".todo-updateing-component>.component-footer>button.cancel-btn");
 updateField
  .addEventListener("keyup", checkUpdatedTodo);
 cancelBtn
  .addEventListener("click", blankScreenManager.closeScreen);
 blankScreenManager.openScreen({ screenBg: "neumorphism", layoutValue: "6", closeOnTap: false, closingFuncs: [closeUpdatingTodoComponent] });
}





const closeToolBox = () => {
 todoBody.removeChild(todoBody.querySelector(".todo-toolBox"))
}

const openToolBox = (xPos, yPos, todoId, todoValue) => {
 try {
  var todoToolBox = document.createElement("div");
  todoToolBox.innerHTML = `  
      <ul>
       <li class="edit-option" data-todoId="${todoId}"><i class="fa-regular fa-pen-to-square"></i> <span>Edit</span></li>
        <li class="delete-option" data-todoId="${todoId}"><i class="bi bi-trash"></i> <span>Delete</span></li>
      </ul>`;
  todoToolBox.classList.add("todo-toolBox");
  todoBody.insertBefore(todoToolBox, todoBody.firstElementChild);
   todoToolBox
    .querySelector(".edit-option")
    .addEventListener("click", () =>
     openUpdatingTodoComponent(todoId, todoValue));

  todoToolBox.style.top = yPos + "px";
  todoToolBox.style.left = xPos - todoToolBox.clientWidth + "px";
  blankScreenManager.openScreen({ layoutValue: "5", closeOnTap: true, closingFuncs: [closeToolBox] });
 } catch (e) {
  console.log(e.stack);
 }
};



todoButtons.forEach((eachButton) => {

 eachButton.addEventListener("click", (e) => {
  var yPos = (eachButton.getBoundingClientRect().y - todoBody.getBoundingClientRect().y) + eachButton.clientHeight + 5;
  var xPos = ((eachButton.getBoundingClientRect().x - todoBody.getBoundingClientRect().x) + eachButton.clientWidth);
  openToolBox(xPos, yPos, e.currentTarget.dataset.todoid, eachButton.previousElementSibling.innerText);
 })
})