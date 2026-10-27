const bcrypt = require('bcryptjs');
const repository = require('../store/repository');
const { generateToken } = require('../middleware/auth');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await repository.getUserByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email address or password.' });
    }

    if (user.active === false) {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact the administrator.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email address or password.' });
    }

    const token = generateToken(user);
    const safeUser = await repository.getUserById(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await repository.getUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User session not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};
