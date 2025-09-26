const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { processAvatar } = require('../utils/upload');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = '7d';

async function register(req, res) {
  try {
    const { email, password, nick } = req.body;
    if (!email || !password || !nick) return res.status(400).json({ error: 'Missing fields' });

    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(400).json({ error: 'E-mail já cadastrado' });

    const hash = await bcrypt.hash(password, 10);
    let avatar_url = null;
    if (req.file) {
      const outPath = await processAvatar(req.file.buffer, 'user-avatar', 256);
      avatar_url = path.relative(process.cwd(), outPath);
    }

    const user = await prisma.user.create({
      data: { email, password_hash: hash, nick, avatar_url }
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, email: user.email, nick: user.nick, avatar_url: user.avatar_url }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, user: { id: user.id, email: user.email, nick: user.nick, avatar_url: user.avatar_url }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}

module.exports = { register, login };
