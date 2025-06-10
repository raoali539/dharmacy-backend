import ExamplesService from '../../services/examples.service';
import User from '../../models/User';
export class Controller {

 // Register
 async register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!['user', 'vendor'].includes(role)) {
    return res.status(400).json({ message: 'Role must be user or vendor.' });
  }

  const existingUser = await User.findOne({email: email});

  // console.log('Existing User:', existingUser);

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }


  const newUser = {
    name,
    email,
    password,
    role
  };

  User.create(newUser);
  res.status(201).json({ message: 'User registered successfully.' });
}

// Login
async login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({email: email});
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  return res.status(200).json({ message: 'Login successful' });
}
}
export default new Controller();
