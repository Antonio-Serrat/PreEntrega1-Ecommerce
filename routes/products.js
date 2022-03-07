const express = require('express');
const path = require('path');
const { Router } = express;

const Product = require('../models/products')
const productModel = new Product();
const upload = require('../middlewares/file');
const router = Router();

admin = true

// get all produts
router.get('/', async (req, res) => {
    const products =  await productModel.getAll()
    res.status(200).send(products)    
})

// get product by id
router.get('/:id', async (req, res)=> {
    const product = await productModel.getById(req.params.id)
    !product ? res.status(404).send({error:'El producto no existe o el id es erroeo'})
    : res.status(200).send(product)
})

// add new product
router.post("/", upload.single("thumbnail"), async (req, res) =>{
    if(!admin){
        res.status(403)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
    }else{
        const { Name, price, description, code, stock} = req.body;
        const date = Date.now()
        const thumbnail = path.join("static/img/" + req.file.filename)
        await productModel.save(Name, date, price+"$", description, code, stock, thumbnail).then(id =>{return id});
        res.status(201).send({success: 'Producto creado con exito'})
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
        newProduct.date = Date.now()
        newProduct.Name = Name
        newProduct.description = description
        newProduct.code = code
        newProduct.thumbnail = thumbnail
        newProduct.price = price
        newProduct.stock = stock
        await productModel.updateById(req.params.id, newProduct)
        res.status(200).send({success: 'Producto actualizado'})
    }
})

// delete product by id
router.delete('/:id', async (req, res)=> {
    if(!admin){
        res.status(403)
        .send({error: 'Usted no posee el permiso de administrador para realizar esta llamda'})
    }else{
        const deleted = await productModel.deleteById(req.params.id)
        !deleted ? res.status(404).send({error:'No se encontro el producto'})
        : res.status(200).send({success: 'Producto eliminado con exito'})
    }
})

  module.exports = router;
