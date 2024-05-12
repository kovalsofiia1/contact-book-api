import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SECRET = process.env.SECRET;

const auth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({
      "message": "Not authorized"
    })
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).json({
      "message": "Not authorized"
    })
  }

  jwt.verify(token, SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({
        "message": "Not authorized"
      })
    }
    try {
      const userFound = await User.findById(decode.id);
      if (!userFound || userFound.token !== token) {
        return res.status(401).json({
          "message": "Not authorized"
        })
      }
      req.user = {
        id: decode.id,
        email: decode.email
      }
      next(); 
    } catch (error) {
      next(error);
    }
  });
};

export default auth;
