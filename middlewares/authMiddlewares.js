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
      throw { code: 2, message: "User not found" };
    }
    if (user.role !== "teacher") {
      throw { code: 4, message: "Unauthorized" };
    }
    next();
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    if (user.role !== "superadmin") {
      throw { code: 4, message: "You are not an admin" };
    }
    next();
  } catch (error) {
    errorHandling(error, req, res);
  }
};

export default { isLoggedIn, isLoggedOut, authControl, isAdmin };
