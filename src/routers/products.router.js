import { Router } from "express";

import { createProductController, readProductController, readAllProductsController, updateProductController, deleteProductController } from "../controllers/product.controller.js";

const router = Router();

const filePathProducts = './src/productos.json';

router.get('/', readAllProductsController); // devuelve todos los productos

router.get('/:pid', readProductController); // devuelve un producto

router.post('/', createProductController); // crea un producto

router.put('/:pid', updateProductController); // actualiza un producto

router.delete('/:pid', deleteProductController); // elimina un producto

export default router; 