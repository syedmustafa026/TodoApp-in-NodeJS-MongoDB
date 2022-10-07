
// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const dltAllTodo = document.querySelector('.delete-todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
let postID
// Event Listeners

toDoBtn.addEventListener('click', addToDo);
dltAllTodo.addEventListener('click', dltAllTodos);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
let allTodoIds;
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));



function addToDo(event) {
    event.preventDefault();

    if (toDoInput.value === '') {
        alert("You must write something!");
    }
    else {
        toDoList.innerHTML +=
            `<div class="todo ${savedTheme}-todo">
                    <div  class="todo-item">
                   <li>${toDoInput.value}</li></div>
                     <button class="check-btn"><i class="fas fa-check"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>`
        // adding to server
        axios.post('http://localhost:3000/todo', {
            text: toDoInput.value
        })
            .catch((err) => console.log("err", err))
        // CLearing the input;
        toDoInput.value = '';
    }
}

function getTodos() {
    // adding to server
    axios.get(`http://localhost:3000/todos`)
        .then((response) => {
            response.data.data.map((value) => {
                allTodoIds = value
                toDoList.innerHTML +=
                    `<div class="todo ${savedTheme}-todo">
                <div  class="todo-item">
               <li>${value.text}</li></div>
                <button class="check-btn"><i class="fas fa-check"></i></button>
                <button class="delete-btn" onclick='dltTodo("${value._id}")'><i class="fas fa-trash"></i></button>
               </div>`
            })
        })
        .catch((err) => console.log("err", err))
}

const dltTodo = async (id) => {
    await axios.delete(`http://localhost:3000/todo/${id}`, {
        _id: id
    })
        .then((res) => {
            console.log("deleted from mongodb");
        })
        .catch((err) => console.log("err", err))
}

function dltAllTodos(event) {
    deletecheck(event)
    event.preventDefault();
    axios.delete(`http://localhost:3000/todos`)
        .then(() => {
            console.log("All deleted from mongodb");
            history.go(0)
        })
        .catch((err) => console.log("errorr", err))
}
function deletecheck(event) {
    event.preventDefault();
    const item = event.target
    // delete
    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");
        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        })
    }
    // check
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }
}
// POST /todo
// GET /todos
// GET /todo/id
// PUT /todo/id
// DELETE /todo/id



// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ?
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
var dt = new Date();
document.getElementById("datetime").innerHTML = dt.toLocaleString();