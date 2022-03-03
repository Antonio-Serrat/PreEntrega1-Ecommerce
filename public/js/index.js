const Products = require("../../models/products")

const socket = io()
const cards = document.querySelector('#cards')
const div = document.createElement('div')
const h4 = document.createElement('h4')
const btn = document.querySelector('#button')
const sectionForm = document.querySelector('#section-form')
const form = document.querySelector('#formulary')
let title = document.querySelector('#title')
let price = document.querySelector('#price')
let file = document.querySelector('#thumbnail')
const modalIndex = document.querySelector('#modal-index')
const Cart = document.querySelector('#btn-cart')
const modalCart = document.querySelector('#modal-cart')
const formRegister = document.querySelector('#form-register')
const email = document.querySelector('#email')
const userName = document.querySelector('#userName')
const admin = document.querySelector('#admin')
const myModal = new bootstrap.Modal(document.getElementById('modal-index'), {
    Keyboard: false
})
const myModalCart = new bootstrap.Modal(document.getElementById('modal-cart'), {
    Keyboard: false
})

const User = {};

//*********** REGISTER USER **************/

formRegister.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('new-User', email.value)
    myModal.hide(modalIndex)
})

socket.on('user', user => {
    if (admin.checked) {
        user.admin = true
    }
    if (user.email == email.value) {
        userName.textContent = user.email
    }

    // save user into a variable
    User.email = user.email
    User.id = user.id
    User.admin = user.admin

    // render index view
    renderIndex()
})

//********** SHOW MODAL ********/

socket.on("index", () => {
    myModal.show(modalIndex)
    renderIndex()
})

// section NO cards
div.className = 'col-12 my-5 text-center'
h4.className = 'title'
h4.innerText = 'Aun no hay productos agregados'
div.appendChild(h4)

async function renderIndex() {
    await fetch(`${sectionForm.baseURI}api/productos`)
        .then((res) => {
            return res.clone().json()
        })
        .then((productos) => {
            if (productos.length == 0) {
                cards.appendChild(div)
            } else {
                cards.innerHTML = ""
                productos.forEach(producto => {

                    cards.innerHTML += `
                    <div class="col d-flex justify-content-center">
                        <div class="card" id="${producto.id}">
                            <img class="card-img" alt="imagen producto" src="${producto.thumbnail}">
                            <div class="card-body">
                                <h4 class="card-title">${producto.title}</h4>
                                <h5 class="card-text">${producto.price}</h5>
                            </div>
                            <div class="divButtons container d-flex ${User.admin ? 'justify-content-between' : 'justify-content-center'}">
                                ${User.admin ? `
                                <button class="btn btn-info"  type="submit">
                                    <i class="fas fa-edit" aria-hidden="true"></i>
                                </button>
                                <button class="btn btn-danger"  type="submit">
                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                </button>
                                <button class="btn btn-success"  type="submit">
                                    <i class="fas fa-cart-plus" aria-hidden="true"></i>
                                </button>
                                    ` : `
                                <button class="btn btn-success"  >
                                    <i class="fas fa-cart-plus" aria-hidden="true"></i>
                                </button>
                                `}
                            </div>
                        </div>
                    </div>
                    `
                });
                if(User.admin){
                    renderAdminIndex()
                }
            }
            console.log('emit select')
            socket.emit('select-btns', null)
        })
}

function renderAdminIndex() {
    sectionForm.innerHTML = `
        <div class="title">
        <h1>Ingrese un producto</h1>
        </div>
        <div class="container my-5 justify-content-center">
            <form id="formulary" >
                <div class="mb-3">
                    <label class="form-label", id="inputGroup-sizing-default", for="title"> Titulo </label>
                    <input id="title" type="text" name="title", class="form-control", aria-label="Sizing example input", aria-describedby="inputGroup-sizing-default">
                </div>
                <div class="mb-3">
                    <label class="form-label", id="inputGroup-sizing-default", for="price"> Precio $ </label>
                    <input id="price" type="number" name="price", class="form-control", aria-label="Amount (to the nearest dollar)">
                </div>
                <div class="mb-3"> 
                    <label class="form-label", id="inputGroup-sizing-default", for="thumbnail"> Foto del Producto </label>
                    <input id="thumbnail" type="file" name="thumbnail", class="form-control", aria-label="Sizing example input", aria-describedby="inputGroup-sizing-default">
                </div>
                <div class="text-center"> 
                    <button id="button" type="submit" class="btn btn-info text-white"> Agregar producto </button>
                </div>
            </form>
        </div>
    `
}

//********* POST NEW PRODUCTS ***********/
function postProducts() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        renderTitle(formData)
        renderPrice(formData)
        renderFile(formData)
        await fetch(`${form.baseURI}api/productos`, {
            method: 'POST',
            body: formData
        })
        socket.emit('reload', null)
    })
}
socket.on('refresh', () => {
    cleanInputs()
    renderIndex()
})

function renderTitle(formData) {
    const titleFd = formData.get('title')
    title.textContent = titleFd
}
function renderPrice(formData) {
    const priceFd = formData.get('price')
    price.textContent = priceFd
}
function renderFile(formData) {
    const fileFd = formData.get('thumbnail')

    file.textContent = fileFd
}
function cleanInputs() {
    form.reset()
}


//*********** CART *************/

myModalCart.hide(modalCart)

Cart.addEventListener('click', e => {
    e.preventDefault()
    myModalCart.show(modalCart)
})


socket.on('selected-btns', () => {
    console.log('si papa')
    const cards = document.querySelector('#cards')
    cards.addEventListener('click', (e) => {
        console.log(e.target.parentElement.parenElement)
        addToCart(e)
    })
})

function addToCart(e) {
}



//***************SECCION PARA FUTURO LOGIN **************/
//const newUser = {}
// formRegister.addEventListener('submit', (e) => {
//     e.preventDefault()
//     newUser.email = email.value
//     newUser.name = Name.value
//     newUser.password = password.value
//     newUser.id = socket.id
//     socket.emit('new-User', newUser)
//     myModal.hide(modalIndex)
// })

// const email = document.querySelector('#email')
// const Name = document.querySelector('#name')
// const password = document.querySelector('#password')
