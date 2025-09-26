const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const { upload } = require('../utils/upload');

router.post('/register', upload.single('avatar'), register);
router.post('/login', express.json(), login);

module.exports = router;
