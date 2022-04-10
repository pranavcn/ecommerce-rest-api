/* eslint-disable camelcase */
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { REFRESH_SECRET } from '../../config';
import { User, RefreshToken } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';
const registerController = {
  async register(req, res, next) {
    // CHECKLIST
    // [ ] validate the request
    // [ ] authorise the request
    // [ ] check if user is in the database already
    // [ ] prepare model
    // [ ] store in database
    // [ ] generate jwt token
    // [ ] send response

    // Validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}')).required(),
      repeat_password: Joi.ref('password')
    });

    // console.log(req.body);
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // Check if user in the database
    try {
      const emailExists = await User.exists({ email: req.body.email });
      if (emailExists) {
        return next(CustomErrorHandler.alreadyExist('This email is already taken'));
      }
    } catch (err) {
      return next(err);
    }

    // Hashing password and saving user

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });

    let access_token;
    let refresh_token;

    try {
      const result = await user.save();
      // console.log(result);
      // Creating token
      access_token = JwtService.sign({
        _id: result._id,
        role: result.role
      });
      refresh_token = JwtService.sign(
        {
          _id: result._id,
          role: result.role
        },
        '1y',
        REFRESH_SECRET
      );

      // Whitelist refresh in database
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }
    res.json({ access_token, refresh_token });
  }
};

export default registerController;
