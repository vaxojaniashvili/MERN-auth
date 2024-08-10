import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userAuth = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) {
      return res.status(401).send({
        status: false,
        message: "User is Unauthorized",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decode) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return res.status(401).send({ msg: "User is Unauthorized" });
          } else {
            return res.status(401).send({ msg: err.message });
          }
        } else {
          req.user = decode.id;
          next();
        }
      }
    );
  } catch (err) {
    console.log(" error :", err.message);
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
