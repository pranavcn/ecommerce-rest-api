import Joi from 'joi';
import { REFRESH_SECRET } from '../../config';
import { RefreshToken, User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required()
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    let refreshToken;
    // Check if refresh token exists in db
    try {
      refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });
      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized());
      }

      let userId;
      try {
        const { _id } = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized());
      }
      // Fetch user details
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return next(CustomErrorHandler.unAuthorized('No user found!'));
      }

      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
    next();
  }
};

export default refreshController;
