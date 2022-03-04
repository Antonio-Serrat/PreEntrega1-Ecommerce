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

    async deleteCartById(id) {
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
            const index = carts.indexOf(cartById)
            const cartProducts = cartById.products
            const validateProd = cartProducts.find(prodct => prodct.id === product.id)
            const indexProd = cartProducts.indexOf(validateProd)
            if(validateProd){
                let cant = 1
                validateProd.cant = cant+1
                cartProducts.splice(indexProd, 1, validateProd)
                carts.splice(index, 1, cartById)


            }else{
                cartById.products.push(product)
                carts.splice(index, 1, cartById)
            }
            
            const newCart = JSON.stringify(carts, null, 2);
            fs.writeFile(this.nombreArchivo, newCart, (err) => {
                if (err) throw error;
            }); 
            return 
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
            if(product.cant > 1){
                product.cant = product.cant-1
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1, product)
            }else{
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1)
            }
            const cartUpdated = JSON.stringify(carts, null, 2);
            fs.writeFile(this.nombreArchivo, cartUpdated, (err) => {
                if (err) throw error;
            });
        } catch (error) {
            return error
        }
    }
}

module.exports = Cart