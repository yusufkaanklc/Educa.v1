import { body, validationResult } from "express-validator";
import pkg from "validator";
const { isStrongPassword } = pkg;

const validateFunc = (type) => {
  let validateFormData = [];

  // Register işlemi için doğrulama işlemleri
  if (type === "register") {
    validateFormData.push(
      body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
      body("email").isEmail().withMessage("Invalid email"),
      body("password").custom((value) => {
        if (!isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
        return true;
      })
    );
  }

  // UpdateAccount işlemi için doğrulama işlemleri
  if (type === "updateAccount") {
    // Güncelleme isteğinde gelen alanlar varsa, onları doğrula
    validateFormData.push(
      (req, res, next) => {
        const { username, email, password } = req.body;
        if (username || email || password) {
          next();
        } else {
          res.status(400).json({ message: "No fields to update" });
        }
      },
      body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .optional(), // Opsiyonel olarak işaretle
      body("email").isEmail().withMessage("Invalid email").optional(), // Opsiyonel olarak işaretle
      body("password")
        .custom((value) => {
          if (value && !isStrongPassword(value)) {
            // Sadece değer varsa kontrol et
            throw new Error("Password is not strong enough");
          }
          return true;
        })
        .optional() // Opsiyonel olarak işaretle
    );
  }

  // Doğrulama işlemlerini gerçekleştiren middleware
  validateFormData.push((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ validationErrors: errors.array() });
    }
    next();
  });

  return validateFormData;
};

export default { validateFunc };
