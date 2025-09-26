const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createCharacter, getUserCharacters, getCharacter } = require('../controllers/characterController');
const { upload } = require('../utils/upload');

router.use(authMiddleware);
router.post('/create', upload.single('avatar'), createCharacter);
router.get('/me', getUserCharacters);
router.get('/:id', getCharacter);

module.exports = router;
