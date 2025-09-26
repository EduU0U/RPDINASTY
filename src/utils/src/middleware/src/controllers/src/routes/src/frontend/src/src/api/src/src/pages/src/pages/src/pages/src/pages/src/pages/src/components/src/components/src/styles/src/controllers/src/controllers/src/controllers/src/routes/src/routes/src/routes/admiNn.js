const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { createBossEvent, grantChest } = require('../controllers/adminController');

router.use(authMiddleware);
router.post('/boss', createBossEvent);
router.post('/grant-chest', grantChest);

module.exports = router;
