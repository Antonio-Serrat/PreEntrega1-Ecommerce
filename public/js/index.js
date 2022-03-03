const socket = io()
const cards = document.querySelector('#cards')
const div = document.createElement('div')
const h4 = document.createElement('h4')
const btn = document.querySelector('#button')
const sectionForm = document.querySelector('#section-form')
const form = document.querySelector('#formulary')
const formRegister = document.querySelector('#form-register')
let title = document.querySelector('#title')
let price = document.querySelector('#price')
let file = document.querySelector('#thumbnail')
const modalIndex = document.querySelector('#modal-index')
const btnCart = document.querySelector('#btn-cart')
const modalCart = document.querySelector('#modal-cart')
const btnModal = document.querySelector('#modal-btn')
const email = document.querySelector('#email')
const Name = document.querySelector('#name')
const password = document.querySelector('#password')
const userName = document.querySelector('#userName')
const myModal = new bootstrap.Modal(document.getElementById('modal-index'), {
    Keyboard: false
})
const myModalCart = new bootstrap.Modal(document.getElementById('modal-cart'), {
    Keyboard: false
})
const newUser = {}



//*********** CAPTURE USER **************/

formRegister.addEventListener('submit', (e) => {
    e.preventDefault()
    newUser.email = email.value
    newUser.name = Name.value
    newUser.password = password.value
    newUser.id = socket.id
    socket.emit('new-User', user)
    myModal.hide(modalIndex)
})
socket.on('user', user => {
    if (user.name == email.value) {
        userName.textContent = user.name
    }
})

//********** RENDER INDEX ********/

socket.on("index", () => {
    myModal.show(modalIndex)
    renderIndex()
    // if(user)
})

// section NO cards
div.className = 'col-12 my-5 text-center'
h4.className = 'title'
h4.innerText = 'Aun no hay productos agregados'
div.appendChild(h4)

async function renderIndex() {
    await fetch(`${formRegister.baseURI}api/productos`)
        .then((res) => {
            return res.clone().json()
        })
        .then((productos) => {
            if (productos.length == 0) {
                cards.appendChild(div)
            } else {
                cards.innerHTML = ""
                productos.forEach(producto => {
                    //create elements
                    const div1 = document.createElement('div')
                    const div2 = document.createElement('div')
                    const div3 = document.createElement('div')
                    const img = document.createElement('img')
                    const h4_1 = document.createElement('h4')
                    const h5 = document.createElement('h5')

                    //assign class
                    div1.className = 'col d-flex justify-content-center'
                    div2.className = 'card'
                    img.className = 'card-img'
                    img.alt = 'imagen producto'
                    div3.className = 'card-body'
                    h4_1.className = 'card-title'
                    h5.className = 'card-text'

                    //agrup all
                    div3.appendChild(h4_1)
                    div3.appendChild(h5)
                    div2.appendChild(img)
                    div2.appendChild(div3)
                    div1.appendChild(div2)

                    // set params
                    img.src = `${producto.thumbnail}`
                    h4_1.innerText = `${producto.title}`
                    h5.innerText = `${producto.price}`

                    // put into index
                    cards.appendChild(div1)
                });

            }
        })
}

function renderAdminIndex() {
    sectionForm.innerHTML(`
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
    `)
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

btnCart.addEventListener('click', () => {
    myModalCart.show(modalCart)
})