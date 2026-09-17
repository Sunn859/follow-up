require('dotenv/config');
const { Client } = require('pg');
const { createHash } = require('node:crypto');
const fixtures = require('./fixtures/contacts.json');

function seedId(userId, index) {
  const hex = createHash('sha256').update(`follow-up-board-contacts-v1:${userId}:${index}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

(async () => {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  try {
    const email = process.argv[2];
    const users = await db.query(email ? 'SELECT id, email FROM "User" WHERE email = $1' : 'SELECT id, email FROM "User"', email ? [email] : []);
    if (users.rows.length !== 1) throw new Error('Specify exactly one existing owner: node prisma/seed-contacts.cjs user@example.com');
    const owner = users.rows[0];
    await db.query('BEGIN');
    // Contacts are accessed only through the authenticated server, never public Supabase REST.
    await db.query('ALTER TABLE "Contact" ENABLE ROW LEVEL SECURITY');
    let inserted = 0;
    for (const [index, fixture] of fixtures.entries()) {
      const offset = fixture.followUp ? Math.round((Date.parse(fixture.followUp) - Date.parse('2024-10-24')) / 86400000) : null;
      const today = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }) + 'T00:00:00Z');
      const followUp = offset === null ? null : new Date(today.getTime() + offset * 86400000).toISOString().slice(0, 10);
      const result = await db.query(`INSERT INTO "Contact"
        (id, "userId", name, company, email, phone, channel, "channelId", interest, status, "followUp", notes, "createdAt", "updatedAt")
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW()) ON CONFLICT (id) DO NOTHING`,
        [seedId(owner.id, index), owner.id, fixture.name, fixture.company, fixture.email, fixture.phone, fixture.channel, fixture.channelId, fixture.interest, fixture.status, followUp, fixture.notes]);
      inserted += result.rowCount;
    }
    await db.query('COMMIT');
    console.log(`Inserted ${inserted} sample contacts for ${owner.email}; existing records preserved.`);
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally { await db.end(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
