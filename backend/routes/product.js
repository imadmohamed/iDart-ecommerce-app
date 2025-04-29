const express = require('express');
const { get } = require('mongoose');
const { getProducts, newProduct } = require('../controller/productController');
const router = express.Router();

router.route('/products').get(getProducts);
router.route('/product/new').post(newProduct);

module.exports = router;