const prisma = require('../lib/prisma');
const { processAvatar } = require('../utils/upload');
const path = require('path');

async function createCharacter(req, res) {
  try {
    const { name, bio, chatId } = req.body;
    let avatar_url = null;
    if (req.file) {
      const outPath = await processAvatar(req.file.buffer, 'char-avatar', 256);
      avatar_url = path.relative(process.cwd(), outPath);
    }
    const char = await prisma.character.create({
      data: {
        userId: req.user.id,
        chatId,
        name,
        bio,
        avatar_url,
        powers: [],
        items: [],
        weapons: [],
        xp: 0
      }
    });
    res.json(char);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar personagem' });
  }
}

async function getUserCharacters(req, res) {
  const chars = await prisma.character.findMany({ where: { userId: req.user.id } });
  res.json(chars);
}

async function getCharacter(req, res) {
  const { id } = req.params;
  const char = await prisma.character.findUnique({ where: { id }});
  if (!char) return res.status(404).json({ error: 'Personagem não encontrado' });
  res.json(char);
}

module.exports = { createCharacter, getUserCharacters, getCharacter };
