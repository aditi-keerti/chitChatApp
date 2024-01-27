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
    console.log(data)
    addMessagetoUI(false,data)
})


function addMessagetoUI(isOwnMessage,data){
    const ele=`<li class="${isOwnMessage ? 'mesg-right':'mesg-left'}">
    <p class="mesg">
    ${data.mesg}<span>${data.name} . ${moment(data.dateTime).fromNow()}</span>
    </p>
</li>`

mesg_container +=ele;
}

// total clients logic
const clients_total=document.getElementById('clients-total')

socket.on('clients-total',(data)=>{
    clients_total.innerText=`Total Clients : ${data}`
})