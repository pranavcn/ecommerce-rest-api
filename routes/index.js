import express from 'express';
import auth from '../middlewares/auth';
import {
  registerController,
  loginController,
  userController,
  refreshController,
  productController
} from '../controllers';
const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

router.post('/products', productController.store);

export default router;
