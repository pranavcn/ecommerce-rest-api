import { User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select('-password, -__v');
      if (!user) {
        next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
};

export default userController;
