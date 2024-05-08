import { ProductService } from "../services/index.js";
import CustomError from "../services/errors/custom_error.js";
import EErros from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import logger from '../logger.js'

export const createProductController = async (req, res) => {
  try {
    const product = req.body;
    
    // Verificar si el usuario es premium
    const isPremiumUser = req.user.role === 'premium';
    
    // Si no se proporciona un owner, establecerlo como "admin"
    if (!product.owner) {
      product.owner = isPremiumUser ? req.user.email : 'admin';
    } else {
      // Si se proporciona un owner, asegurarse de que solo se guarde el correo electrónico
      product.owner = isPremiumUser ? req.user.email : 'admin'; // o req.user._id si prefieres el ID del usuario
    }

    // Resto del código para validar y crear el producto...

  } catch (error) {
    // Manejo de errores
  }
}

export const updateProductController = async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;

    // const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, {
    //   new: true // Para devolver el documento actualizado
    // }).lean().exec();
    const updatedProduct = await ProductService.update(productId, updatedFields)

    if (!updatedProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    //const products = await Product.find().lean().exec();
    const products = await ProductService.getAll();

    req.io.emit('productList', products);

    res.status(200).json(updatedProduct);
  } catch (error) {
    logger.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await ProductService.findById(productId);

    // Verificar si el usuario es premium
    const isPremiumUser = req.user.role === 'premium';

    if (isPremiumUser) {
      // Si el usuario es premium, solo puede eliminar sus propios productos
      if (product.owner !== req.user.email) {
        return res.status(403).json({ status: 'error', message: 'No tienes permiso para eliminar este producto.' });
      }
    } else {
      // Si el usuario no es premium (es admin), puede eliminar cualquier producto
      await ProductService.delete(productId);
    }

    res.status(200).json({ status: 'success', message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    // Manejo de errores
  }
}

export const readProductController = async (req, res) => {
  const id = req.params.pid;
  try {
    //const product = await Product.findById(id).lean().exec();
    const product = await ProductService.getById(id)
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    logger.error('Error al leer el producto:', error);
    res.status(500).json({ error: 'Error al leer el producto' });
  }
}

export const readAllProductsController = async (req, res) => {
  logger.http('¡Solicitud recibida!');

  const result = await ProductService.getAllPaginate(req)
  res.status(result.statusCode).json(result.response)
}
