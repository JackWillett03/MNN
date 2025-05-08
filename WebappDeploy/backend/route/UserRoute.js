const express = require('express');
const router = express.Router();
const userController = require(`../controllers/Usercontroller`);


// GET all users
router.get('/', userController.getAllUsers);

// GET Zeus users
router.get('/role/zeus', userController.getZeusUsers);

// GET user by username
router.get('/:username', userController.getUserByUsername);

// PUT by ID
router.put('/:id', userController.updateUser);

// DELETE by ID
router.delete('/:id', userController.deleteUser);

router.post('/register', userController.addUser); 
router.post('/login', userController.login);   

// GET user by ID
router.get('/id/:id', userController.getUserById);



module.exports = router;
