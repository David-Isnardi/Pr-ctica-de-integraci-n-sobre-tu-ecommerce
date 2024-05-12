function hasPermissions(req, res, next) {
    const currentUser = req.session.user;
  
    if (!currentUser) {
      return res.status(401).send('No autorizado');
    }
  
    if (currentUser.role === 'admin') {
      next();
    } else {
      return res.status(403).send('Prohibido');
    }
  }
  
  const protectedRouter = express.Router();
  
  protectedRouter.use(hasPermissions);
  
  protectedRouter.post('/', createProductController);
  protectedRouter.put('/:id', updateProductController);
  protectedRouter.delete('/:id', deleteProductController);
  
  export default protectedRouter;