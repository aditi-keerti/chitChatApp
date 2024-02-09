// Socket.IO connection with user information
const socket = io('http://localhost:4000', {
    query: {
        userId: localStorage.getItem('userName') // Use the user ID or any unique identifier
    }
});


// mesg-container

const mesg_container=document.getElementById('mesg-container')
const nameInput=document.getElementById('name-input')
nameInput.value=localStorage.getItem('userName')
const mesg_form=document.getElementById('mesg-form')
const mesgInput=document.getElementById('mesg-input')
const imgSpan=document.getElementById('img-span');
const img=localStorage.getItem('userImg');
if(img){
    imgSpan.innerHTML="";
    imgSpan.innerHTML=`<img id="img-tag" src=${img}>`
}



mesg_form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (mesgInput.value === '') return;
    console.log(mesgInput.value);

    const data = {
        name: localStorage.getItem('userName'),
        mesg: mesgInput.value,
        dateTime: new Date()
    };

    socket.emit('message', data);
    addMessagetoUI(true, data);
    mesgInput.value = '';
}


socket.on('chat-mesg',(data)=>{
    clearFeedback()
    console.log(data)
    addMessagetoUI(false,data)
    
})


function addMessagetoUI(isOwnMessage,data){
    clearFeedback()
    let ele=`<li class="${isOwnMessage ? 'mesg-right':'mesg-left'}">
    <p class="mesg">
    ${data.mesg}<span>${data.name} . ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`
mesg_container.innerHTML+=ele;
scrollToBottom()
}

function scrollToBottom(){
    mesg_container.scrollTo(0,mesg_container.scrollHeight)
}

// total clients logic
const clients_total=document.getElementById('clients-total')

socket.on('clients-total',(data)=>{
    clients_total.innerText=`Total Clients : ${data}`
})

// Emit user is typing feedback when input is focused or key is pressed
mesgInput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `${localStorage.getItem('userName')} is typing`
    });
});

mesgInput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `${localStorage.getItem('userName')} is typing`
    });
});

mesgInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ''
    });
});
socket.on('feedback',(data)=>{
    clearFeedback();
    let ele=` <li class="mesg-feedback">
    <p class="feedback" id="feedback">
       ${data.feedback}
    </p>
</li>`
mesg_container.innerHTML+=ele;
})

function clearFeedback(){
    document.querySelectorAll('li.mesg-feedback').forEach(ele=>{
        ele.parentNode.removeChild(ele)
    })
}