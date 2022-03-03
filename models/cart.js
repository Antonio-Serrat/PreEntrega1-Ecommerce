const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

class Cart {
    constructor() {
        this.nombreArchivo = path.join(__dirname, "../public/database/cart.json");
    }

    async save() {
        let cart = {
            id: 0,
            createDate: Date.now(),
            products : []
        };
        let newCart = [];
        try {
            if (!(fs.existsSync(this.nombreArchivo))) {
                const data = JSON.stringify(newCart, null, 2)
                fs.writeFileSync(`./${this.nombreArchivo}`, data, (err) => {
                    if (err) throw error;
                })
            }
            const data = await fsp.readFile(this.nombreArchivo) 
                const carts = JSON.parse(data);
                newCart = carts;
                newCart.push(cart);

                let i = newCart.length - 2;
                i < 0 ? i = 0 : i;
                let id = newCart[i].id + 1;
                cart.id = id;
                cart.id == 0 ? cart.id = 1 : cart.id;
                const allCarts = JSON.stringify(newCart, null, 2);

               await fsp.writeFile(this.nombreArchivo, allCarts, 'utf-8')
                    return cart.id;
        } catch (error) {
            return error;
        }
    }

    async deleteById(id) {
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id == id);
            if (cart) {
                const index = carts.indexOf(cart)
                carts.splice(index, 1)
            }
            const newCart = JSON.stringify(carts, null, 2);
            fs.writeFile(this.nombreArchivo, newCart, (err) => {
                if (err) throw error;
            });
        } catch (error) {
            return error
        }
    }
    
    async getProductsFromCart(id){
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const carts = JSON.parse(data);
            const cartById = carts.find(cart => cart.id == id)
            if (cartById = null) {
                return error;
            }
            return cartById.products
        } catch (error) {
            return error
        }
    }

    async addProductToCart(id, product){
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const carts = JSON.parse(data);
            const cartById = carts.find(cart => cart.id == id)
            if (cartById = null) {
                return error;
            }
            cartById.products.push(product)
            return 'added'
        } catch (error) {
            return error
        }
    }

    async deleteProductFromCart(idC, idP) {
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id == idC);
            if (!cart) {
                return error;
            }

            const allProducts = cart.products
            const product = allProducts.find(product => product.id == idP)
            const index = allProducts.indexOf(product)
            allProducts.splice(index, 1)
            const productsUpdated = JSON.stringify(allProducts, null, 2);
            fs.writeFile(this.nombreArchivo, productsUpdated, (err) => {
                if (err) throw error;
            });
        } catch (error) {
            return error
        }
    }
}

module.exports = Cart