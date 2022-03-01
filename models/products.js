const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

class Products {
    constructor() {
        this.nombreArchivo = path.join(__dirname, "../public/database/products.json");
    }

    async save(title, price, thumbnail) {
        let producto = {
            id: 0,
            title: title,
            price: price,
            thumbnail: thumbnail
        };
        let newProducts = [];
        try {
            if (!(fs.existsSync(this.nombreArchivo))) {
                const data = JSON.stringify(newProducts, null, 2)
                fs.writeFileSync(`./${this.nombreArchivo}`, data, (err) => {
                    if (err) throw error;
                })
            }
            const data = await fsp.readFile(this.nombreArchivo) 
                const products = JSON.parse(data);
                newProducts = products;
                newProducts.push(producto);

                let i = newProducts.length - 2;
                i < 0 ? i = 0 : i;
                let id = newProducts[i].id + 1;
                producto.id = id;
                producto.id == 0 ? producto.id = 1 : producto.id;
                const allProducts = JSON.stringify(newProducts, null, 2);

               await fsp.writeFile(this.nombreArchivo, allProducts, 'utf-8')
                    return producto.id;
        } catch (error) {
            return error;
        }
    }

    async getAll() {
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const products = JSON.parse(data);
            const product = products.find(product => product.id == id)
            if (product != null) {
                return product;
            }
            return null;
        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {
            const data = await fsp.readFile(this.nombreArchivo)
            const products = JSON.parse(data);
            const product = products.find(product => product.id == id);
            if (product) {
                const index = products.indexOf(product)
                products.splice(index, 1)
            }
            const newProducts = JSON.stringify(products, null, 2);
            fs.writeFile(this.nombreArchivo, newProducts, (err) => {
                if (err) throw error;
            });
        } catch (error) {
            return error
        }
    }

    async deleteAll() {
        try {
            await fsp.writeFile(this.nombreArchivo, "[]", (err) => {
                if (err) throw error;
            })

        } catch (error) {
            return error
        }
    }
}
module.exports = Products;