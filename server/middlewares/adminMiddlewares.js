import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    if (user.role !== "superadmin") {
      return res.status(403).send("you are not an admin");
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { isAdmin };
