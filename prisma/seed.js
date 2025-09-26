/**
 * Seed script for Prisma. Runs basic inserts: 3 chats, 1 guild, 1 admin user.
 * Run with: npx prisma db push && node prisma/seed.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // create admin user
  const adminEmail = 'admin@example.com';
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail }});
  if (!adminExists) {
    const pw = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash: pw,
        nick: 'Admin',
        role: 'admin'
      }
    });
    console.log('Admin created: admin@example.com / Admin@123');
  }

  // create Off chat
  const off = await prisma.chat.upsert({
    where: { name: 'Off' },
    update: {},
    create: {
      name: 'Off',
      type: 'off',
      lore_text: 'Chat geral Off — sinta-se livre para postar como você mesmo.',
      is_private: false
    }
  });

  // 3 RPG chats with short lore and NPCs
  const scenarios = [
    {
      name: 'Floresta de Eryndor',
      lore: 'Uma floresta antiga onde as árvores sussurram segredos. NPCs: Guardiã Lira (elfa), Bardo Jor.',
    },
    {
      name: 'Ruínas de Valmora',
      lore: 'Ruínas enterradas cheias de enigmas. NPCs: Arqueólogo Keth, Espírito da Ruína.',
    },
    {
      name: 'Porto de Brisa Negra',
      lore: 'Cidade portuária onde contrabandistas e magos se encontram. NPCs: Capitã Mara, Feiticeiro Solen.',
    }
  ];

  for (const s of scenarios) {
    await prisma.chat.upsert({
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        type: 'rpg',
        lore_text: s.lore,
        is_private: false
      }
    });
  }

  // example guild
  const guild = await prisma.guild.upsert({
    where: { name: 'Lâmina Dourada' },
    update: {},
    create: {
      name: 'Lâmina Dourada',
      tag: 'LD',
      lore: 'Uma guilda de mercadores-espada que protegem rotas comerciais.',
      leader_ids: JSON.stringify([]) // empty leaders for seed, can be set later
    }
  });

  console.log('Seeds done.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
