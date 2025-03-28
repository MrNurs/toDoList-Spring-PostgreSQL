let addButton = document.getElementById("addButton")
let plans = document.getElementById("plans")
let inputTask = document.getElementById("inputTask")
let taskText = document.getElementById("taskText")
let burger = document.getElementById("burger")
let burgerContent = document.getElementById("burgerContent")
let burgerDiv = document.getElementById("burgerDiv")
let loadingIcon = document.getElementById("loadingIcon")

let connectionStatus = checkConnection();
let tasks = new Map()

async function checkConnection() {
    let getMethodResponse = await fetch('http://localhost:8080/toDoList');
    if(getMethodResponse.ok){
        return true
    }else{
        return false
    }
}
//local Storage
async function getMethod() {
    try {
        let getMethodResponse = await fetch('http://localhost:8080/toDoList');
        if (getMethodResponse.ok) {
            console.log('Connected');
            let mapsFromPostgres = new Map()
            let commits = await getMethodResponse.json();
            for(let i = 0; i < commits.length; i++){
                let task = { id: commits[i].id, name: commits[i].name, complete: commits[i].complete };
                mapsFromPostgres.set(commits[i].id,task)
            }
            return mapsFromPostgres
        } else {
            console.log('ERROR while connection, status is ' + getMethodResponse.status);
        }
    } catch (error) {
        console.log('Fetch failed:', error);
        return null;
    }
}


async function loadOnStart(){
    let taskMap = new Map(JSON.parse(localStorage.getItem('localPlans')))
    
    id = taskMap.size > 0 ? Math.max(...taskMap.keys()) + 1 : 0;
    console.log(id)
    console.log('loading')
    //responses from backend
    let postGresMap = await getMethod(); 
    if(postGresMap){
        id = postGresMap.size > 0 ? Math.max(...postGresMap.keys()) + 1 : 0;
        postGresMap.forEach((content, id) => {
            console.log(content)
            tasks.set(id, content);
            addDomElement(content, id);
        });
    }else{ 
        id = taskMap.size > 0 ? Math.max(...taskMap.keys()) + 1 : 0;
        console.log('localStorage')
        console.log(taskMap)
        taskMap.forEach((task,id)=>{
            tasks.set(id, task);
            addDomElement(task,id)
        })
    }
    //local

}
loadOnStart()
//add tasks into the Map
async function add(){
    if(inputTask.value==""){
        return
    }
    let task = {id:id, name: inputTask.value, text:'',complete: false };
    tasks.set(id,task)
    if(connectionStatus==true){
        try{
            let response = await fetch('http://localhost:8080/toDoList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(task)
            })
            if(response.status == 201){
                task = await response.json()
            }
        }catch(e){
            console.log("Error "+e)
        }
    }
    addDomElement(task,id)
    id++;
    inputTask.value=""
}
//add to the task to the 'plans' div
async function addDomElement(task,id){  
    let temp = document.getElementById("taskTemplate");
    let taskClone = temp.content.cloneNode(true);
    let deleteBtn = taskClone.querySelector(".deleteBtn")
    let doneBtn = taskClone.querySelector(".doneBtn")
    let taskText = taskClone.querySelector("#taskText")
    let taskDiv = taskClone.querySelector('.task')

    taskText.textContent = task.name
    //done
    doneBtn.addEventListener('click',async function(){
        task.complete = true;
        let currentTask = this.parentElement
        currentTask.classList.add('completed')
        this.remove()
        currentTask.querySelector('.taskTextWrapper').style.pointerEvents = 'none';
        console.log(task)
        //put method
        loadingIcon.classList.toggle('hidden')
        
        plans.appendChild(currentTask)
        addLocal(tasks)
        try{
            let response = await fetch('http://localhost:8080/toDoList', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(task)
            })
        }finally {
            loadingIcon.classList.toggle('hidden')
        }    
    })
    //delete
    deleteBtn.addEventListener('click',async function(){
        
        loadingIcon.classList.toggle('hidden')
        try{
            let response = fetch('http://localhost:8080/toDoList/'+id,{
                method: 'DELETE'
            })
        }finally{
            loadingIcon.classList.toggle('hidden')
        }
        
        this.parentElement.remove() 
        tasks.delete(id)
        addLocal(tasks)
    }) 
    //inputChange
    taskText.addEventListener('click',  function (event) {
        changeText.call(this, task)
    })

    if (task.complete === true) {
        taskClone.querySelector('.taskTextWrapper').style.pointerEvents = 'none';
        taskClone.querySelector('.task').classList.add('completed');
        taskClone.querySelector('.doneBtn').remove();
    }
    let firstDoneBtn = plans.querySelector(".completed")
    if (firstDoneBtn) {
        plans.insertBefore(taskClone, firstDoneBtn)
        addLocal(tasks)
  
    } else {
        plans.appendChild(taskClone)  
        addLocal(tasks)

    } 
}
//add local
function addLocal(tasks){
    localStorage.setItem('localPlans', JSON.stringify(Array.from(tasks.entries())));
}
//enter Info
inputTask.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        add(); 
    }
});
//burger
document.getElementById('burger').addEventListener('click',openCloseBurger)
//openClose
function openCloseBurger(){
    let burgerContent = burgerDiv.parentElement.querySelector("#burgerContent")
    burgerContent.classList.toggle("hidden");
}
//add
addButton.addEventListener('click',add)
//inputChange
async function changeText(task){
    let input = document.createElement('input')
    input.type = "text"
    input.value = this.textContent
    input.addEventListener("keydown",async function(event){
        if (event.key === "Enter") {
            let span = document.createElement("span")
            span.textContent = this.value
            if(this.value==""){
                return
            }
            span.addEventListener('click', changeText);
            this.replaceWith(span); 
            task.name = span.textContent
            let response = await fetch('http://localhost:8080/toDoList', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(task)
            });
            addLocal(tasks)
        }
    })
    input.classList.add('taskInput');
    this.replaceWith(input); 
    input.focus(); 

}
//burgerRadio
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