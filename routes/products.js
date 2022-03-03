const express = require('express');
const path = require('path');
const { Router } = express;

const Product = require('../models/products')
const productModel = new Product();
const upload = require('../middlewares/file');
const router = Router();

admin = false

// get all produts
router.get('/', async (req, res) => {
    const products =  await productModel.getAll()
    res.status(200).send(products)    
})

// get product by id
router.get('/:id', async (req, res)=> {
    const product = await productModel.getById(req.params.id)
    res.status(200).send(product)
})

// add new product
router.post("/", upload.single("thumbnail"), async (req, res) =>{
    if(!admin){
        res.status(403)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
    }else{
        const { Name, price, description, code, stock} = req.body;
        const thumbnail = path.join("static/img/" + req.file.filename)
        const date = Date.now()
        await productModel.save(Name, date, price+"$", description, code, stock, thumbnail).then(id =>{return id});
        res.status(201).end()
    }
  })


// update product by id
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
    if(!admin){
        res.status(403)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
    }else{
        const newProduct = {}
        const { Name, price, description, code, stock} = req.body;
        const thumbnail = path.join("static/img/" + req.file.filename)
        const date = Date.now()
        newProduct.date = date
        newProduct.Name = Name
        newProduct.description = description
        newProduct.code = code
        newProduct.thumbnail = thumbnail
        newProduct.price = price
        newProduct.stock = stock
        await productModel.updateById(req.params.id, newProduct)
        res.status(200).send('actualizado')
    }
})

// delete product by id
router.delete('/:id', (req, res)=> {
    if(!admin){
        res.status(403)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
    }else{
        productModel.deleteById(req.params.id)
        res.status(200).send('eliminado con exito')
    }
})

  module.exports = router;
