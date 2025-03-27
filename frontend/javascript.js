let addButton = document.getElementById("addButton")
let plans = document.getElementById("plans")
let inputTask = document.getElementById("inputTask")
let taskText = document.getElementById("taskText")
let burger = document.getElementById("burger")
let burgerContent = document.getElementById("burgerContent")
let id = 0;



function add(){  
    let temp = document.getElementById("taskTemplate");
    let taskClone = temp.content.cloneNode(true);
    let deleteBtn = taskClone.querySelector(".deleteBtn")
    let doneBtn = taskClone.querySelector(".doneBtn")
    let taskText = taskClone.querySelector("#taskText")
    if(!inputTask.value){   
        return
    }
    taskText.textContent = inputTask.value
    doneBtn.addEventListener('click',function(){
        let currentTask = this.parentElement
        currentTask.classList.add('completed')
        this.remove()
        currentTask.querySelector('.taskTextWrapper').style.pointerEvents = 'none';
        plans.appendChild(currentTask)
        save();
    })

    deleteBtn.addEventListener('click',function(){
        this.parentElement.remove()
        save();
    }) 

    taskText.addEventListener('click',  function (event) {
        changeText.call(this, event)
    })
    let firstDoneBtn = plans.querySelector(".completed")
    if (firstDoneBtn) {
        plans.insertBefore(taskClone, firstDoneBtn)
        save()
    } else {
        plans.appendChild(taskClone)  
        save()
    } 
}
function save(){
    localStorage.setItem('localPlans',plans.innerHTML)
}
inputTask.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        add(); 
    }
});

document.getElementById('burger').addEventListener('click',openCloseBurger)
function openCloseBurger(){
    let burgerContent = burgerDiv.parentElement.querySelector("#burgerContent")
    burgerContent.classList.toggle("hidden");
}
addButton.addEventListener('click',add)
function changeText(event){
    let input = document.createElement('input')
    input.type = "text"
    input.value = this.textContent
    input.addEventListener("blur",function(){
        let span = document.createElement("span")
        span.textContent = this.value
        span.addEventListener('click', changeText);
        this.replaceWith(span); 
    })
    input.classList.add('taskInput');
    this.replaceWith(input); 
    input.focus(); 
}
burgerContent.querySelectorAll('input[name="taskType"]').forEach((radio)=>{
    radio.addEventListener('change',()=>{
        list = plans.querySelectorAll('.task')
        if(radio.id == 'currentTasks'){
            list.forEach((element)=>{
                if(element.classList.contains('completed')){
                    element.classList.add('hidden') 
                }else{
                    element.classList.remove('hidden')
                }
            })
        }else if(radio.id == 'completedTasks'){
            list.forEach((element)=>{
                if(element.classList.contains('completed')){
                    element.classList.remove('hidden') 
                }else{
                    element.classList.add('hidden')
                }
            })
        }else if(radio.id == 'allTasks'){
            list.forEach((element)=>{
                element.classList.remove('hidden')
            })
        }
    })
})