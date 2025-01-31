import jwt, { decode } from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).send({ message: "Invalid token or not validated" });
    }

    req.userId = decoded.userId;
    req.role = decode.role;
    next()
  } catch (error) {
    console.log(error);
    res.status(401).send({message: 'Error while verifying token'})
  }
};

export default verifyToken;
