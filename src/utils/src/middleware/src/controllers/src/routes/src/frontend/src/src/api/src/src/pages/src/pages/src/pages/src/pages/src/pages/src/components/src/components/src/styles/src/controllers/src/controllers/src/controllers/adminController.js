const prisma = require('../lib/prisma');

async function createBossEvent(req, res) {
  if (req.user.role !== 'admin' && req.user.role !== 'moderator')
    return res.status(403).json({ error: 'Acesso negado' });

  const { chatId, title, description, active_until } = req.body;
  const event = await prisma.event.create({
    data: { chatId, title, description, active_until: active_until ? new Date(active_until) : null, created_by: req.user.id }
  });
  res.json(event);
}

async function grantChest(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });

  const { characterId, item } = req.body;
  const char = await prisma.character.findUnique({ where: { id: characterId }});
  if (!char) return res.status(404).json({ error: 'Personagem não encontrado' });

  const items = JSON.parse(char.items || '[]');
  items.push(item);
  await prisma.character.update({ where: { id: characterId }, data: { items: items }});

  res.json({ success: true, items });
}

module.exports = { createBossEvent, grantChest };
