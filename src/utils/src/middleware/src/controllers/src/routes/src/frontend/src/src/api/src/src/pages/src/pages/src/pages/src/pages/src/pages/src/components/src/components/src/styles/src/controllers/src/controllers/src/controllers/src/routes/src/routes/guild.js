const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createGuild, getGuilds } = require('../controllers/guildController');

router.use(authMiddleware);
router.post('/create', createGuild);
router.get('/', getGuilds);

module.exports = router;
