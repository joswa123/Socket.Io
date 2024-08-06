
//io is global variable which is loaded from html script link
const socket = io('http://localhost:3000')

const messageContainer = document.getElementById('message-container')
let userAction=document.getElementById('others')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const inputField = document.getElementById('message-input');
const name = prompt('What is your name?')
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
let memberId=''
let members={}
let firstDealer;
let allowMesssage=false;
appendMessage('You joined')

socket.emit('new-user', name)
//listner for each chats
socket.on('chat-message', data => {
  console.log(data.timerElement,'hiii');
  appendMessage(`${data.name} has remaingTime(${data.remaingTime}) : ${data.message}`)
  startTimer()
  allowMesssage=true;
})
//details of other connected users
socket.on('user-connected', name => {
  memberId=name.id;
members=name.users;
const keys = Object.keys(members);

keys.forEach(key => {

  const name = members[key];
  if(members[key].dealer){
    firstDealer=true
    console.log(firstDealer);
    
  }
  userDetails(name)


});


console.log(memberId,members);


  updateTimerDisplay();
})
socket.on('dealer', data => {
  firstDealer=data.dealer;
  console.log('firstDEaler');
  
})
//notifuing when they are typing in input box
socket.on('others-typing', data => {
  appendMessage(`${data.name} is typing`)
})
//noitfies when the user disconnected
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})
//function to send mewsage to server
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  if(firstDealer || allowMesssage){
  const message = messageInput.value;
  appendMessage(`You: ${message}`)
  let remaingTime=timerElement.textContent;
  socket.emit('send-chat-message', message,remaingTime)
  messageInput.value = ''
  pauseTimer();
  allowMesssage=false
  }
})
//function to display mmesage in UI
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)

}
//user name handling
function userDetails(details){
  userAction.append(details+",")

}

let totalTime = 5 * 60; 
let isRunning = false;

// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    
}

// Function to start or resume the timer
function startTimer() {
    if (!isRunning) { // Only start if the timer isn't already running
        isRunning = true;
        intervalId = setInterval(() => {
            if (totalTime <= 0) {
                clearInterval(intervalId);
                isRunning = false;
                timerElement.textContent = "Time's up!";
            } else {
                totalTime--;
                updateTimerDisplay();
            }
        }, 1000);
    }
}

// Function to pause the timer
function pauseTimer() {
    if (isRunning) { // Only pause if the timer is currently running
        clearInterval(intervalId);
        isRunning = false;
    }
}
function handleKeyUp(event) {
  socket.emit('user-typing','typing')
}

inputField.addEventListener('keyup', handleKeyUp);