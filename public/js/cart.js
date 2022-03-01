const socketCart = io()
const btnCart = document.querySelector('#btn-cart')
const modalCart = document.querySelector('#modal-cart')
const myModalCart = new bootstrap.Modal(document.getElementById('modal-cart'), {
    Keyboard: false
})

myModalCart.hide(modalCart)

btnCart.addEventListener('click', ()=>{
    myModalCart.show(modalCart)
})