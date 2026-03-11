const express = require('express');
const router = express.Router();
const roleModel = require('../schemas/roles');
const userModel = require('../schemas/users');

// CRUD cho Role
router.get('/', async (req, res) => {
    let roles = await roleModel.find();
    res.send(roles);
});
router.get('/:id', async (req, res) => {
    let role = await roleModel.findById(req.params.id);
    if (!role) return res.status(404).send({ message: "ID NOT FOUND" });
    res.send(role);
});
router.post('/', async (req, res) => {
    let newRole = new roleModel(req.body);
    await newRole.save();
    res.send(newRole);
});
router.put('/:id', async (req, res) => {
    let role = await roleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(role);
});
router.delete('/:id', async (req, res) => {
    let role = await roleModel.findByIdAndDelete(req.params.id);
    res.send(role);
});

// Lấy tất cả user có role là id
router.get('/:id/users', async (req, res) => {
    let users = await userModel.find({ role: req.params.id, status: true });
    res.send(users);
});

module.exports = router;