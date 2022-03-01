const socketChat = io()
const btnModal = document.querySelector('#modal-btn')
const userName = document.querySelector('#name')
const User = document.querySelector('#userName')
const containerMessages = document.querySelector('#messages')



function renderChat(){

}


btnModal.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('new-User', userName.value)
    myModal.hide(modalIndex)
})
socket.on('user', user=>{
    if(user.name == userName.value){
        User.textContent = user.name
    }
})
socket.on('users', users=>{

})