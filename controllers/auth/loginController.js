import Joi from 'joi';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';
import { User, RefreshToken } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';
const loginController = {
  async login(req, res, next) {
    // Validate
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}')).required()
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const access_token = JwtService.sign({
        _id: user._id,
        role: user.role
      });

      const refresh_token = JwtService.sign(
        {
          _id: user._id,
          role: user.role
        },
        '1y',
        REFRESH_SECRET
      );
      await RefreshToken.create({ token: refresh_token });

      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },
  async logout(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required()
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteMany({ token: req.body.refresh_token });
    } catch (err) {
      next(new Error('Something went wrong '));
    }
    res.json({ status: 1 });
  }
};

export default loginController;
