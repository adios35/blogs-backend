import {User} from '../models/schema.js';
import Express from "express"
import bcrypt from "bcrypt"
import { body, validationResult } from "express-validator"
// Route for user registration
const router = Express.Router()
router.post('/register', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail().withMessage("invalid email format"),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: `errors`, errors: errors.array() })
  }
  try {
    const { username, email, password } = req.body;

    // Create a new user instance

    const newUser = new User({ username, email, password});

    // Save the user to the database
    const savedUser = await newUser.save({ select: '-password' });

    return res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


router.post('/login',
  [body('email').isEmail().withMessage("invalid email format"),
  body('password').isLength({ min: 6 })],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Create a new user instance
      const isExist = await User.findOne({ email })
      if (!isExist) return res.status(404).json({ message: "user not found" })
      const isMatch = await isExist.comparePassword(password)
      if (!isMatch) return res.status(400).json({ message: "password is incorrect" })
      // Save the user to the database
      req.session.loggedin = true
      req.session.user = isExist
      return res.status(200).json({ message: 'login sucesss', user: isExist });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

router.delete("/logout", (req, res) => {
  req.session.destroy()
  res.status(200).json({ message: "logout sucesss" })
})
export default router