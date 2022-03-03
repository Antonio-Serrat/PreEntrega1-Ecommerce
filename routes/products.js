const express = require('express');
const path = require('path');
const { Router } = express;

const Product = require('../models/products')
const productModel = new Product();
const upload = require('../middlewares/file');
const router = Router();



router.get('/', async (req, res) => {
    const products =  await productModel.getAll()
    res.status(200).send(products)    
})

router.get('/id', async (req, res)=> {
    const product = await productModel.getById(req.params.id)
    res.status(200).send(product)
})


router.post("/", upload.single("thumbnail"), async (req, res) =>{
    const { title, price} = req.body;
    const thumbnail = path.join("static/img/" + req.file.filename)
    await productModel.save(title, price+"$", thumbnail).then(id =>{return id});
    res.status(201).end()
  })


  module.exports = router;
