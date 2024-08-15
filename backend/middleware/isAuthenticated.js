import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token; // Correctly access cookies from req

    if (!token) {
      return res
        .status(401)
        .json({ msg: "User not authenticated", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        msg: "Invalid token",
        success: false,
      });
    }

    req.id = decoded.userId; // Adjust based on your token payload
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ msg: "Authentication error", success: false });
  }
};

export default isAuthenticated;