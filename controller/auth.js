require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../userModel');

exports.register = async (req, res) => {
 try {
  const user = new User(req.body);
  console.log(user);
  const addedUser = await user.save();
  res.status(200).json({
   status: 200,
   payload: null,
   message: 'User Succesfully added to database',
  });
  return;
 } catch (error) {
  res.status(500).json({
   status: 500,
   payload: null,
   message:
    'Failed to add user to database, Potential reason could be - username already exists',
  });
  return;
 }
};

exports.login = async (req, res) => {
 const { username, password } = req.body;
 const user = await User.findOne({ username: username });
 user.comparePassword(password, (err, result) => {
  if (err) {
   res.status(500).json({
    status: 500,
    payload: null,
    message: 'Internal Server Error',
   });
  }
  if (result === true) {
   const token = jwt.sign(
    {
     username,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1d' },
   );
   const data = { username, token };
   res.status(200).json({
    status: 200,
    payload: data,
    message: 'Logged In Successfully',
   });
   return;
  } else {
   res.status(400).json({
    status: 400,
    payload: null,
    message: 'Invalid Credentilas',
   });
   return;
  }
 });
};
