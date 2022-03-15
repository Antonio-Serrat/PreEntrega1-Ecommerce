const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, "../public/database/cart.json")
class Cart {
    constructor() {
        this.nombreArchivo = db;
    }

    async save() {
        let cart = {
            id: 0,
            createDate: Date.now(),
            products: []
        };
        let newCart = [];
        try {
            if (!(fs.existsSync(this.nombreArchivo))) {
                const data = JSON.stringify(newCart, null, 2)
                await writeFile(data)
            }
            const carts = await readFile()
            newCart = carts;
            if (newCart.length === 0) {
                cart.id = 0
            } else {
                cart.id = newCart[newCart.length - 1].id + 1
            }
            newCart.push(cart);
            const allCarts = JSON.stringify(newCart, null, 2);
            await writeFile(allCarts)
            return cart.id;
        } catch (error) {
            return error;
        }
    }

    async deleteCartById(id) {
        try {
            const carts = await readFile()
            const cart = carts.find(cart => cart.id == id);
            if (cart) {
                const index = carts.indexOf(cart)
                carts.splice(index, 1)
                return true
            } else {
                return false
            }

        } catch (error) {
            return error
        }
    }

    async getProductsFromCart(id) {
        try {
            const carts = await readFile()
            const cartById = carts.find(cart => cart.id == id)
            if (!cartById) {
                return false
            } else {
                return cartById.products
            }
        } catch (error) {
            return error
        }
    }

    async addProductToCart(id, product) {
        try {
            const carts = await readFile()
            const cartById = carts.find(cart => cart.id == id)

            const index = carts.indexOf(cartById)
            const cartProducts = cartById.products
            const validateProd = cartProducts.find(prodct => prodct.id === product.id)
            const indexProd = cartProducts.indexOf(validateProd)

            if (validateProd) {
                let cant = 1
                validateProd.cant = cant + 1
                cartProducts.splice(indexProd, 1, validateProd)
            } else {
                cartById.products.push(product)
            }
            carts.splice(index, 1, cartById)
            const newCart = JSON.stringify(carts, null, 2);
            await writeFile(newCart)
        } catch (error) {
            return error
        }
    }

    async addProductToNewCart(product) {
        try {
            const cartId = await this.save()
            const carts = await readFile()
            console.log(carts)
            const cart = carts.find(cart => cart.id == cartId)
            console.log(cart)
            console.log(product)
            cart.products.push(product)
            const newCart = JSON.stringify(carts, null, 2);
            await writeFile(newCart)
        } catch (error) {
            return error
        }
    }

    async deleteProductFromCart(idC, idP) {
        try {
            const carts = await readFile()
            const cart = carts.find(cart => cart.id == idC);
            if (!cart) {
                return false;
            }

            const allProducts = cart.products
            const product = allProducts.find(product => product.id == idP)
            if (!product) {
                return false
            }
            if (product.cant > 1) {
                product.cant = product.cant - 1
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1, product)
            } else {
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1)
            }
            const cartUpdated = JSON.stringify(carts, null, 2);
            await writeFile(cartUpdated)
            return true
        } catch (error) {
            return error
        }
    }
}

async function readFile() {
    const data = await fsp.readFile(db)
    return JSON.parse(data);
}

async function writeFile(data) {
    await fsp.writeFile(db, data, 'utf-8')
    return
}


module.exports = Cart