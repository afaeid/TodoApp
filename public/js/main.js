var todoCover = document.querySelector(".todo-cover");
var todoBody = todoCover.querySelector(".todo-body")
var todoButtons = todoBody.querySelectorAll(".todos>li>i");
var blankScreen = document.querySelector(".blank-screen");

/*var previousOpeningFuncs = null;
var previousClosingFuncs = null;
var openedScreen = false;
var closeOnTap = true;*/
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
  if (this.openedScreen === true) {
   await this.closeScreen();
  }

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

  if (options.closeOnTap) {
   blankScreen.addEventListener("click", this.closeScreen)
  }
  if (options.openingFuncs != null) {
   options.openingFuncs.forEach(func => {
   await func();
   })
  }

  this.openedScreen = true;
  this.closeOnTap = options.closeOnTap;
  this.previousOpeningFuncs = options.openingFuncs;
  this.previousClosingFuncs = options.closingFuncs;
 },

 async closeScreen() {
  try {
   // console.log(this.previousClosingFuncs, this.openedScreen, "values on close");
   // console.log(this.previousClosingFuncs != null && this.openedScreen == true, "condition on close");
   // console.log(this.previousClosingFuncs != null, "previousClosingFuncs cond");
   // console.log(this.openedScreen == true, "openScreen cond");
   if (this.previousClosingFuncs != null && this.openedScreen == true) {
    for (const func of this.previousClosingFuncs) {
     console.log(func, "From loop");
    await  func();
    };
   }
   if (this.closeOnTap) {
    blankScreen.removeEventListener("click", this.closeScreen);
   }
   blankScreen.style.display = "none";
   this.openedScreen = false;

  } catch (e) { console.log(e.stack) }
 }
}

// const openScreen = (options = {
//  screenBg: "normal",
//  layoutValue: "1"
// }) => {
//  if (options.screenBg === "normal") {
//   blankScreen.style.background = "transparent";
//   blankScreen.style.backdropFilter = "blur(0px)"
//  } else if (options.screenBg === "neumorphism") {
//   blankScreen.style.background = "rgba(255, 255, 255, 0.2)";
//   blankScreen.style.backdropFilter = "blur(10px)"
//  } else {
//   blankScreen.style.background = "transparent";
//   blankScreen.style.backdropFilter = "blur(0px)"
//  }
//  blankScreen.style.display = "block";
//  blankScreen.style.zIndex = options.layoutValue;
// }

// const closeScreen = () => {
//  blankScreen.style.display = "none";
//  closeToolBox();
//  closeUpdatingTodoComponent()
// }

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
 updateBtn
  .addEventListener("click", () => {
   console.log(todoId, todoCover.querySelector(".todo-updateing-component>.component-body>input").value);
   requestHandler("http://localhost:1500", {
    method: "PUT",
    headers: {
     "Content-type": "application/json"
    },
    body: JSON.stringify({ todoId, todoName: todoCover.querySelector(".todo-updateing-component>.component-body>input").value })
   },
   {
    statusCode: 200,
    message: "Todo has successfully updated"
   },
   {
    message: "Failed to update todo"
   });
  })
 blankScreenManager.openScreen({ screenBg: "neumorphism", layoutValue: "6", closeOnTap: false, closingFuncs: [closeUpdatingTodoComponent] });
}



const checkUpdatedTodo = (e) => {
 if (e.currentTarget.dataset.previousvalue != e.currentTarget.value) {
  e.currentTarget.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = false;
 } else {
  e.currentTarget.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = true;
 }
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
    openUpdatingTodoComponent(todoId, todoValue)
   );
  todoToolBox.style.top = yPos + "px";
  todoToolBox.style.left = xPos - todoToolBox.clientWidth + "px";
  blankScreenManager.openScreen({ layoutValue: "5", closeOnTap: true, closingFuncs: [closeToolBox] });
 } catch (e) {
  console.log(e.stack);
 }
};


const closeToolBox = () => {
 todoBody.removeChild(todoBody.querySelector(".todo-toolBox"))
}


todoButtons.forEach((eachButton) => {

 eachButton.addEventListener("click", (e) => {
  var yPos = (eachButton.getBoundingClientRect().y - todoCover.getBoundingClientRect().y) + eachButton.clientHeight + 5;
  var xPos = ((eachButton.getBoundingClientRect().x - todoCover.getBoundingClientRect().x) + eachButton.clientWidth);
  openToolBox(xPos, yPos, e.currentTarget.dataset.todoid, eachButton.previousElementSibling.innerText);
 })
})

