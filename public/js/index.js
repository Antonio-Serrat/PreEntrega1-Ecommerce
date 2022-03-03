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
    if(admin.checked){
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
                    // create elements
                    const div = document.createElement('div')
                    const card = document.createElement('div')
                    const cardBody = document.createElement('div')
                    const img = document.createElement('img')
                    const cardTitle = document.createElement('h4')
                    const cardText = document.createElement('h5')
                    const divButtons = document.createElement('div')
                    const addToCart = document.createElement('button')

                    // asign class
                    div.className = 'col d-flex justify-content-center'
                    card.className = 'card'
                    img.className = 'card-img'
                    img.alt = 'imagen producto'
                    cardBody.className = 'card-body'
                    cardTitle.className = 'card-title'
                    cardText.className = 'card-text'
                    addToCart.className = 'btn btn-success'

                    // set params
                    img.src = `${producto.thumbnail}`
                    cardTitle.innerText = `${producto.title}`
                    cardText.innerText = `${producto.price}`
                    addToCart.innerHTML = '<i class="fas fa-cart-plus"></i>'

                    // check if user are admin
                    console.log(User)
                    if(User.admin){
                        renderAdminIndex()

                        // create admin btons 
                        const btnCreate = document.createElement('button')
                        const btnDelete = document.createElement('button')

                        // asign class
                        btnCreate.className = 'btn btn-info'
                        btnDelete.className = 'btn btn-danger'

                        // set params
                        btnDelete.innerHTML = '<i class="fas fa-trash"></i>'
                        btnCreate.innerHTML = '<i class="fas fa-edit"></i>'


                        // added to card
                        divButtons.appendChild(btnCreate)
                        divButtons.appendChild(btnDelete)

                        // change justify-content 
                        divButtons.className = 'divButtons container d-flex justify-content-between'
                    }

                    if(!User.admin){
                        // change justify-content 
                        divButtons.className = 'divButtons container d-flex justify-content-center'
                    }

                    // agrup all
                    cardBody.appendChild(cardTitle)
                    cardBody.appendChild(cardText)
                    divButtons.appendChild(addToCart)
                    card.appendChild(img)
                    card.appendChild(cardBody)
                    card.appendChild(divButtons)
                    div.appendChild(card)


                    // put into index
                    cards.appendChild(div)
                });

            }
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
function postProducts(){
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

Cart.addEventListener('click', () => {
    myModalCart.show(modalCart)
})




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
