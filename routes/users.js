const express = require('express');
const router = express.Router();
const userModel = require('../schemas/users');

// Get all users
router.get('/', async (req, res) => {
  let users = await userModel.find({ isDeleted: { $ne: true } }).populate('role');
  res.send(users);
});

// Get user by id
router.get('/:id', async (req, res) => {
  let user = await userModel.findById(req.params.id).populate('role');
  if (!user || user.isDeleted) return res.status(404).send({ message: "ID NOT FOUND" });
  res.send(user);
});

// Create user
router.post('/', async (req, res) => {
  let newUser = new userModel(req.body);
  await newUser.save();
  res.send(newUser);
});

// Update user
router.put('/:id', async (req, res) => {
  let user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(user);
});

// Soft delete user
router.delete('/:id', async (req, res) => {
  let user = await userModel.findById(req.params.id);
  if (!user || user.isDeleted) return res.status(404).send({ message: "ID NOT FOUND" });
  user.isDeleted = true;
  await user.save();
  res.send(user);
});

// Enable user
router.post('/enable', async (req, res) => {
  let { email, username } = req.body;
  let user = await userModel.findOne({ email, username });
  if (!user) return res.status(404).send({ message: "User not found" });
  user.status = true;
  await user.save();
  res.send(user);
});

// Disable user
router.post('/disable', async (req, res) => {
  let { email, username } = req.body;
  let user = await userModel.findOne({ email, username });
  if (!user) return res.status(404).send({ message: "User not found" });
  user.status = false;
  await user.save();
  res.send(user);
});

module.exports = router;