const socket=io()

// mesg-container

const mesg_container=document.getElementById('mesg-container')
const nameInput=document.getElementById('name-input')
const mesg_form=document.getElementById('mesg-form')
const mesgInput=document.getElementById('mesg-input')

mesg_form.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})

function sendMessage(){
    if(mesgInput.value==='') return
    console.log(mesgInput.value)
    const data={
        name:nameInput.value,
        mesg:mesgInput.value,
        dateTime:new Date()
    }
    socket.emit('message',data)
    addMessagetoUI(true,data);
    mesgInput.value=''
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

mesgInput.addEventListener('focus',(e)=>{
      socket.emit('feedback',{
        feedback:`${nameInput.value} is typing`
      })
})
mesgInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing`
      })
})
mesgInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:``
      })
})

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