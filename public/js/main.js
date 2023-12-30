/* ===== rectification 
openToolBox = openTodoToolBox
closeToolBox = closeTodoToolBox
*/
var todoCover = document.querySelector(".todo-cover");
var todoPostForm = todoCover.querySelector(".todo-header>form");
var todoBody = todoCover.querySelector(".todo-body");
var todoContainer = todoBody.querySelector("ul.todos");
var allTodos = todoContainer.querySelectorAll("li")
var todoButtons = todoBody.querySelectorAll(".todos>li>i");
var blankScreen = document.querySelector(".blank-screen");

const handleTodoBtn = (e) => {
 var btn = e.currentTarget;
 var btnXPos = btn.getBoundingClientRect().x;
 var btnYPos = btn.getBoundingClientRect().y;
 var todoBodyXPos = todoBody.getBoundingClientRect().x;
 var todoBodyYPos = todoBody.getBoundingClientRect().y;

 var toolbarXPos = (btnXPos - todoBodyXPos) + btn.clientWidth;
 var toolbarYPos = (btnYPos - todoBodyYPos) + btn.clientHeight + 5;

 openToolBox(toolbarXPos, toolbarYPos, e.currentTarget.dataset.todoid, e.currentTarget.previousElementSibling.innerText);
}



const domTodoManger = {
 addTodo({ todoId, todoValue }) {
  var todoContainer = todoBody.querySelector("ul");
  var allTodos = todoContainer.querySelectorAll("li")
  var newTodo = document.createElement("li");
  newTodo.innerHTML =
   `
 <span class="todoName"></span>
 <i class="fa-solid fa-ellipsis-vertical"></i>
`
  newTodo.id = todoId;
  var newTodoValue = newTodo.querySelector("span");
  var newTodoBtn = newTodo.querySelector("i")
  newTodoValue.textContent = todoValue;
  newTodoBtn.dataset.todoid = todoId;
  newTodoBtn.addEventListener("click", handleTodoBtn)
  todoContainer.insertBefore(newTodo, allTodos[0])
  toastMessageController.showToastMessage({ message: "New todo has been created" })
 },
 updateTodo({ todoId, todoValue }) {

  document.getElementById(todoId).querySelector('span').innerText = todoValue;
 },
 deleteTodo({ todoId }) {
  var todoContainer = todoBody.querySelector("ul.todos");
  var allTodos = todoContainer.querySelectorAll("li")
  todoContainer.removeChild(document.getElementById(todoId))
 }
}

var isOpened = false;
const toastMessageController = {
 showToastMessage({
  type = "info",
  message: {
   title = "Info message",
   description = "Use more frameworks from our website"
  } = {},
  messageDuration = 7000
 } = {}) {
  if (isOpened) {
   this.closeToastMessage()
  }
  var toastBox = document.createElement('div');
  toastBox.innerHTML = `
  <div class="alligned-line"></div>
  <div class="toast-icon-container">
   <i></i>
  </div>
  <div class="toast-message-container">
   <p class="toast-message-title"></p>
   <p class="toast-message-description">
   </p>
  </div>
  <div class="toast-closing-icon-container">
   <i class="fa-solid fa-xmark"></i>
  </div>
  `;
  var toastIconClasses = {
   info: ["bi", "bi-check-circle"],
   success: ["bi", "bi-check-circle"],
   error: ["bi", "bi-x-circle"],
   warning: ["bi", "bi-exclamation-triangle"]
  }
  toastBox.classList.add("toast-box", type)

  var toastIcon = toastBox.querySelector(".toast-icon-container>i");
  var toastTitle = toastBox.querySelector(".toast-message-container>p.toast-message-title");
  var toastDes = toastBox.querySelector(".toast-message-container>p.toast-message-description");
  var toastClsIcon = toastBox.querySelector(".toast-closing-icon-container") // missing 
  toastIcon.classList.add(...toastIconClasses[type]);
  toastTitle.textContent = title;
  toastDes.textContent = description;
  toastClsIcon.addEventListener("click", this.closeToastMessage)
  document.body.appendChild(toastBox);
  isOpened = true;
  this.toastMsgTimeoutId = setTimeout(() => {
   this.closeToastMessage();
   isOpened = false;
  }, messageDuration)

 },
 closeToastMessage() {
  if (isOpened) {
   document.body.removeChild(document.querySelector(".toast-box"));
   clearTimeout(this.toastMsgTimeoutId)
   isOpened = false;
  }
  console.log(isOpened);
 }
}


const httpRequestSender = (url, requestInfos) => {
 var controller = new AbortController();
 var timeoutId = setTimeout(() => controller.abort(), 8000)
 return fetch(url, { signal: controller.signal, ...requestInfos })
  .then(res => {
   clearTimeout(timeoutId)
   if (!res.ok) {
    return res.json().then(err => err)
   }
   return res.json()
  })
  .catch(err => {
   try {
    var errData = err
    console.error(errData)
   } catch (errParsingData) {
    console.error("Error while parsing error: " + errParsingData.stack);
   }
  })
}




todoPostForm.addEventListener("submit", async (e) => {
 e.preventDefault();
 var formData = {
  todoValue: e.currentTarget.elements.todoValue.value
 };
 var inputField = e.currentTarget.elements.todoValue;
 var submitBtn = e.currentTarget.querySelector("button");
 submitBtn.innerText = "Adding...";
 var newTodo;
 try {
  newTodo = await httpRequestSender("http://localhost:1500", {
   method: "POST",
   headers: {
    "Content-Type": "application/json"
   },
   body: JSON.stringify(formData)
  })
  await domTodoManger.addTodo(newTodo.createdTodo);
  toastMessageController.showToastMessage({
   type: "success",
   message: {
    title: "Successfully created the todo",
    description: newTodo.message
   },
   messageDuration: 7000
  })
 } catch (e) {
  toastMessageController.showToastMessage({
   type: "error",
   message: {
    title: "Seems that an error has occurred",
    description: newTodo.message
   },
   messageDuration: 7000
  })
 }

 inputField.value = null;
 submitBtn.innerText = "Add";
})




var previousOpeningFuncs = null;
var previousClosingFuncs = null;
var openedScreen = false;
var closeOnTap = true;
const blankScreenManager = {
 async openScreen(options = {
  screenBg: "normal",
  layoutValue: "1",
  closeOnTap: true,
  openingFuncs: null,
  closingFuncs: null
 }) {
  try {

   if (openedScreen == true) {
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
     await func();
    }
   }

   openedScreen = true;
   closeOnTap = options.closeOnTap;
   previousOpeningFuncs = options.openingFuncs;
   previousClosingFuncs = options.closingFuncs;

  } catch (e) { console.log(e.stack) }
 },

 async closeScreen() {
  try {

   if (previousClosingFuncs != null && openedScreen) {
    for (const func of previousClosingFuncs) {
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
 if (e.currentTarget.dataset.previousvalue.trim() != e.currentTarget.value.trim()) {
  e.currentTarget.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = false;
 } else {
  e.currentTarget.parentElement.parentElement.querySelector(".component-footer>button.update-btn").disabled = true;
 }
}


const closeUpdatingTodoComponent = () => {
 todoBody.removeChild(todoBody.querySelector(".todo-updateing-component"));
}

const openUpdatingTodoComponent = (todoId, todoValue) => {

 var component = document.createElement("form");
 component.innerHTML = `
 <div class="component-header">
 <p class="title">Update Todo</p>
 <p class="info">Todo ID: ${todoId}</p>
 </div>
 <div class="component-body">
  <input type="text" placeholder="Update Todo" data-previousvalue="${todoValue}" value="${todoValue}" class="update-field" name="todoValue">
  <input type="number" placeholder="Write todo ID" value="${todoId}" name="todoId" readonly>
 </div>
 <div class="component-footer">
  <button class="cancel-btn">Cancel</button>
  <button class="update-btn" disabled type="submit">Update</button>
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
 component.addEventListener("submit", async (e) => {
  e.preventDefault();
  var formData = {
   todoValue: e.currentTarget.elements.todoValue.value,
   todoId: e.currentTarget.elements.todoId.value
  };
  updateBtn.innerText = "Updating"
  var updatedTodo;
  try {
   updatedTodo = await httpRequestSender("http://localhost:1500/", {
    method: "PUT",
    headers: {
     "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
   });
   await domTodoManger.updateTodo(updatedTodo.updatedTodo);

   toastMessageController.showToastMessage({
    type: "success",
    message: {
     title: "Successfully updated the todo",
     description: updatedTodo.message
    },
    messageDuration: 7000
   })
  } catch (e) {
   toastMessageController.showToastMessage({
    type: "error",
    message: {
     title: "Failed to updated the todo",
     description: updatedTodo.message
    },
    messageDuration: 7000
   })
  }
  updateBtn.innerText = "Update"
  blankScreenManager.closeScreen();
 })
}





const closeToolBox = () => {
 todoBody.removeChild(todoBody.querySelector(".todo-toolBox"))
}

const openToolBox = async (xPos, yPos, todoId, todoValue) => {

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


 todoToolBox
  .querySelector(".delete-option")
  .addEventListener("click", async () => {
   var deletedTodo;

   try {
    deletedTodo = await httpRequestSender("http://localhost:1500/", {
     method: "DELETE",
     headers: {
      "Content-type": "application/json"
     },
     body: JSON.stringify({ todoId })
    });
    domTodoManger.deleteTodo(deletedTodo.deletedTodo);
    blankScreenManager.closeScreen();
    toastMessageController.showToastMessage({
     type: "success",
     message: {
      title: "Successfully deleted the todo",
      description: deletedTodo.message
     },
     messageDuration: 7000
    })
   } catch (e) {
    toastMessageController.showToastMessage({
     type: "error",
     message: {
      title: "Failed to delete Todo",
      description: deletedTodo.message
     },
     messageDuration: 7000
    })
   }
  })
};



todoButtons.forEach((eachButton) => {
 eachButton.addEventListener("click", handleTodoBtn)
})