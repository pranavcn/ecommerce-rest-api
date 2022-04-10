import CustomErrorHandler from '../services/CustomErrorHandler';
import JwtService from '../services/JwtService';

const auth = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    next(CustomErrorHandler.unAuthorized());
  }

  const token = authHeaders.split(' ')[1];
  try {
    const { _id, role } = await JwtService.verify(token);
    const user = {
      _id,
      role
    };
    req.user = user;
    next();
  } catch (err) {
    next(CustomErrorHandler.unAuthorized());
  }
};

export default auth;
