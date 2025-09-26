const characterRoutes = require('./routes/character');
const guildRoutes = require('./routes/guild');
const adminRoutes = require('./routes/admin');

app.use('/api/characters', characterRoutes);
app.use('/api/guilds', guildRoutes);
app.use('/api/admin', adminRoutes);
