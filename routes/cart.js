const express = require('express');
const path = require('path');
const { Router } = express;
const router = Router()
const Cart = require('../models/cart')
const cartModule = new Cart()
const Product = require('../models/products')
const productModel = new Product();

router.post('/', async (req, res) => {
    try{
        await cartModule.save()
        res.status(201).send({succes:'Carrito creado'})
    }catch(e){
        res.status(400).send({
            error: 'No se pudo crear el nuevo carrito ',
            desrciption: e
    })
    }
})

router.delete('/:id', async (req, res) => {
    try{
        await cartModule.deleteCartById(req.params.id)
        res.status(201).send({succes:'Carrito eliminado'})
    }catch(e){
        res.status(400).send({
            error: 'No se pudo eliminar el carrito ',
            desrciption: e
    })
    }
})

router.get('/:id/productos', async (req, res) =>{
    try {
        const products = await cartModule.getProductsFromCart(req.params.id)
        res.status(200).send(products)
    } catch (error) {
        res.status(400).send({
            error: 'No se pudieron listar los productos el carrito ',
            desrciption: error
    })
    }
})

router.post('/:id/productos/:id_prod', async (req, res) => {
    try {
        const product = await productModel.getById(req.params.id_prod)
        console.log(product)
        await cartModule.addProductToCart(req.params.id, product)
        res.status(200).send({success: 'Se agrego con exito el nuevo producto al carrito'})
    } catch (error) {
        res.status(400).send({
            error: 'No se pudo agregar el producto al carrito ',
            desrciption: error
    })
    }
})

router.delete('/:id/productos/:id_prod', async(req, res) => {
    try {
        await cartModule.deleteProductFromCart(req.params.id, req.params.id_prod)
        res.status(200).send({success:'Se elimino el producto del carrito con exito'})
    } catch (error) {
        res.status(400).send({
            error: 'No se pudo eliminar el producto del carrito ',
            desrciption: error
    })
    }
})


module.exports = router