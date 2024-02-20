import { body, validationResult } from "express-validator";
import pkg from "validator";
const { isStrongPassword } = pkg;

const validateFormData = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").custom((value) => {
    if (!isStrongPassword(value)) {
      throw new Error("password is not strong enough");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ validationErrors: errors.array() });
    }
    next();
  },
];

export default { validateFormData };
