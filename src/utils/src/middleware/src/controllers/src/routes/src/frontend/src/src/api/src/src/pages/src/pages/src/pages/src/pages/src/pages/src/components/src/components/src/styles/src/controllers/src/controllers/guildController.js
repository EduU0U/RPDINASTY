const prisma = require('../lib/prisma');

async function createGuild(req, res) {
  const { name, tag, lore } = req.body;
  if (!name || !tag) return res.status(400).json({ error: 'Campos obrigatórios' });

  const guild = await prisma.guild.create({
    data: { name, tag, lore, leader_ids: JSON.stringify([req.user.id]) }
  });

  const chat = await prisma.chat.create({
    data: { name: guild.name, type: 'guild', is_private: true, guildId: guild.id }
  });

  res.json({ guild, chat });
}

async function getGuilds(req, res) {
  const guilds = await prisma.guild.findMany();
  res.json(guilds);
}

module.exports = { createGuild, getGuilds };
