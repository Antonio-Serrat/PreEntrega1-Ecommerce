const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, "../public/database/products.json")
class Products {
    constructor() {
        this.nombreArchivo = db;
    }

    async save(Name, date, price, description, code, stock, thumbnail) {
        let producto = {
            id: 0,
            date: date,
            name: Name,
            description: description,
            code: code,
            thumbnail: thumbnail,
            price: price,
            stock: stock
        };
        let newProducts = [];
        try {
            if (!(fs.existsSync(this.nombreArchivo))) {
                const data = JSON.stringify(newProducts, null, 2)
                writeFile(data)

            }
            const data = await fsp.readFile(this.nombreArchivo) 
                const products = JSON.parse(data);
                newProducts = products;
                if (newProducts.length === 0)
                {
                producto.id = 0
                } else {
                producto.id = newProducts[newProducts.length - 1].id + 1
                }
                newProducts.push(producto)
                const allProducts = JSON.stringify(newProducts, null, 2);

                writeFile(allProducts)
                return producto.id;
        } catch (error) {
            return error;
        }
    }

    async getAll() {
        try {
            const products = await readFile()
            return products;
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const products = await readFile()
            const product = products.find(product => product.id == id)
            return product
        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {
            const products = await readFile()
            const product = products.find(product => product.id == id);
            if (product) {
                const index = products.indexOf(product)
                products.splice(index, 1)
                return true
            }
            else{
                return false
            }
        } catch (error) {
            return error
        }
    }

    async deleteAll() {
        try {
            writeFile('[]')
            return
        } catch (error) {
            return error
        }
    }

    async updateById(id, newProduct) {
        try {
            const products = await readFile()
            const product = products.find(product => product.id == id);
            const index = products.indexOf(product)
            newProduct.id = product.id 
            products.splice(index, 1, newProduct)
            const updatedProducts = JSON.stringify(products, null, 2);
            writeFile(updatedProducts)
            return
        } catch (error) {
            return error
        }
    }
}


async function readFile (){
    const data = await fsp.readFile(db)
    return JSON.parse(data);
}

async function writeFile(data){
    await fsp.writeFile(db, data, 'utf-8')
    return
}

module.exports = Products;