//add an eventListener to the from
const form = document.querySelector('#itemForm'); // select form
const itemInput = document.querySelector('#itemInput'); // select input box from form
const itemList = document.querySelector('.item-list');
const feedback = document.querySelector('.feedback');
const clearButton = document.querySelector('#clear-list');
const clearBtn = document.querySelector('#clear-list');
let todoItems = [];

form.addEventListener('submit', createItem);
clearBtn.addEventListener('click', clearItems);

function restartData() {
    todoItems = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        todoItems.push(key);
    }
}

function createItem(e) {
    e.preventDefault();
    if (itemInput.value === '') {
        return alert('Пожалуйста, заполните поля чем то');
    }
    let date = new Date();
    let itemObj = {
        value: itemInput.value,
        completed: false,
        id: +date,
    }
    localStorage.setItem(+date, JSON.stringify(itemObj));
    restartData();
    addItems();
}

function addItems() {
    todoItems.sort();
    itemList.innerHTML = '';

    todoItems.forEach(item => {
        let stringObj = localStorage.getItem(item);
        let obj = JSON.parse(stringObj);
        if (obj.completed) {
            itemList.innerHTML += `
            <div class="item my-3 completed" id="${obj.id}">
                <h5 class="item-name text-capitalize">${obj.value}</h5>
                <div class="item-icons">
                    <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                    <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                    <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
                </div>
            </div>
            `
        } else {
            itemList.innerHTML += `
            <div class="item my-3" id="${obj.id}">
                <h5 class="item-name text-capitalize">${obj.value}</h5>
                <div class="item-icons">
                    <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                    <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                    <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
                </div>
            </div>
            `
        }
    });
    itemEvents()
}

function itemEvents() {
    // делаем теперь функционал
    const completeItem = document.querySelectorAll('.complete-item');
    const editItem = document.querySelectorAll('.edit-item');
    const deleteItem = document.querySelectorAll('.delete-item');

    completeItem.forEach(item => item.addEventListener('click', completedFun));
    editItem.forEach(item => item.addEventListener('click', editedFun));
    deleteItem.forEach(item => item.addEventListener('click', deletedFun))

}

function completedFun() {
    const item = this.closest('.item');
    const id = +item.id;
    const stringObj = localStorage.getItem(id);
    const obj = JSON.parse(stringObj);

    obj.completed = !obj.completed;
    localStorage.setItem(id, JSON.stringify(obj));

    addItems()
}

function editedFun() {
    //делаем editing
    const item = this.closest('.item');
    const allItems = document.querySelectorAll('.item');
    const editItem = item.querySelector('.edit-item');
    const id = +item.id;
    const stringObj = localStorage.getItem(id);
    const obj = JSON.parse(stringObj);

    if (item.className.includes('editing')) {
        obj.value = itemInput.value;
        localStorage.setItem(id, JSON.stringify(obj))
        itemInput.value = '';
        editItem.innerHTML = '<i class="far fa-edit"></i>';
        addItems()
    } else {
        itemInput.value = obj.value;
        allItems.forEach(item => {
            item.classList.remove('editing');
            item.querySelector('.edit-item').innerHTML = '<i class="far fa-edit"></i>'
        });
        editItem.innerHTML = '<i class="fas fa-plus"></i>'
    }
    item.classList.toggle('editing');

}

function deletedFun() {
    const item = this.closest('.item');
    const id = +item.id;
    localStorage.removeItem(id);
    restartData()
    addItems()
}

function clearItems() {
    itemInput.value = ''
    localStorage.clear();
    restartData();
    addItems();
}
restartData()
addItems()