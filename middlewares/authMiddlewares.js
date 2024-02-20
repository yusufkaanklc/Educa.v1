import User from "../models/User.js";

const loginCheck = (req, res) => {
  return req.session.userID ? true : false;
};

const isLoggedIn = (req, res, next) => {
  if (loginCheck(req, res)) {
    next();
  } else {
    res.status(401).json("you are not logged in");
  }
};

const isLoggedOut = (req, res, next) => {
  if (!loginCheck(req, res)) {
    next();
  } else {
    res.status(403).json("your are already logged in");
  }
};

const authControl = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "teacher") {
      throw new Error("Unauthorized");
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export default { isLoggedIn, isLoggedOut, authControl, isAdmin };
