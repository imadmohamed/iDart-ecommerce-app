const express = require('express');
const { get } = require('mongoose');
const { getProducts, newProduct, getSingleProduct } = require('../controller/productController');
const router = express.Router();

router.route('/products').get(getProducts);
router.route('/product/new').post(newProduct);
router.route('/product/:id').get(getSingleProduct);

module.exports = router;