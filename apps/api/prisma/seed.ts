import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EcoBank database...');

  const hash = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@ecobank.id',
        passwordHash: hash,
        name: 'Demo User',
        username: 'demouser',
        role: 'ADMIN',
        xp: 2500,
        level: 12,
        wallet: { create: { balance: 150000, points: 4500 } },
        profile: { create: { bio: 'Eco-warrior and recycling enthusiast!', location: 'Jakarta' } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'rina@example.com',
        passwordHash: hash,
        name: 'Rina Wijaya',
        username: 'rinawj',
        xp: 1800,
        level: 9,
        wallet: { create: { balance: 85000, points: 3200 } },
        profile: { create: { bio: 'Turning trash into treasure ♻️', location: 'Bandung' } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'budi@example.com',
        passwordHash: hash,
        name: 'Budi Santoso',
        username: 'budisant',
        xp: 3200,
        level: 15,
        wallet: { create: { balance: 210000, points: 6800 } },
        profile: { create: { bio: 'Zero waste advocate', location: 'Surabaya' } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'sari@example.com',
        passwordHash: hash,
        name: 'Sari Dewi',
        username: 'saridewi',
        xp: 950,
        level: 6,
        wallet: { create: { balance: 42000, points: 1500 } },
        profile: { create: { bio: 'New to recycling, loving it!', location: 'Yogyakarta' } },
      },
    }),
    prisma.user.create({
      data: {
        email: 'adi@example.com',
        passwordHash: hash,
        name: 'Adi Pratama',
        username: 'adipratama',
        xp: 4100,
        level: 18,
        wallet: { create: { balance: 325000, points: 9200 } },
        profile: { create: { bio: 'Green tech enthusiast', location: 'Jakarta' } },
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  const machines = await Promise.all([
    prisma.machine.create({
      data: {
        name: 'EcoATM - Kota Kasablanka',
        location: 'Kota Kasablanka Mall, Jakarta',
        status: 'ONLINE',
        fillLevel: 45,
        lastActive: new Date(),
        acceptedTypes: JSON.stringify(['plastic-bottle', 'plastic-glass', 'plastic-other']),
      },
    }),
    prisma.machine.create({
      data: {
        name: 'EcoATM - Grand Indonesia',
        location: 'Grand Indonesia, Jakarta',
        status: 'ONLINE',
        fillLevel: 72,
        lastActive: new Date(),
        acceptedTypes: JSON.stringify(['plastic-bottle', 'plastic-glass', 'plastic-other']),
      },
    }),
    prisma.machine.create({
      data: {
        name: 'EcoATM - Trans Studio Mall',
        location: 'Trans Studio Mall, Bandung',
        status: 'MAINTENANCE',
        fillLevel: 30,
        lastActive: new Date(Date.now() - 86400000),
        acceptedTypes: JSON.stringify(['plastic-bottle', 'plastic-glass']),
      },
    }),
    prisma.machine.create({
      data: {
        name: 'EcoATM - Tunjungan Plaza',
        location: 'Tunjungan Plaza, Surabaya',
        status: 'ONLINE',
        fillLevel: 88,
        lastActive: new Date(),
        acceptedTypes: JSON.stringify(['plastic-bottle', 'plastic-glass', 'plastic-other']),
      },
    }),
  ]);

  console.log(`✅ Created ${machines.length} machines`);

  const achievements = await Promise.all([
    prisma.achievement.create({ data: { name: 'First Step', description: 'Complete your first recycling deposit', xpReward: 100, criteria: JSON.stringify({ type: 'deposits', count: 1 }) } }),
    prisma.achievement.create({ data: { name: 'Eco Beginner', description: 'Recycle 10kg of waste', xpReward: 250, criteria: JSON.stringify({ type: 'weight_kg', amount: 10 }) } }),
    prisma.achievement.create({ data: { name: 'Eco Warrior', description: 'Recycle 100kg of waste', xpReward: 1000, criteria: JSON.stringify({ type: 'weight_kg', amount: 100 }) } }),
    prisma.achievement.create({ data: { name: 'Social Butterfly', description: 'Make 5 friends on EcoBank', xpReward: 300, criteria: JSON.stringify({ type: 'friends', count: 5 }) } }),
    prisma.achievement.create({ data: { name: 'Community Star', description: 'Get 50 likes on your posts', xpReward: 500, criteria: JSON.stringify({ type: 'likes', count: 50 }) } }),
    prisma.achievement.create({ data: { name: 'Recycling Streak', description: 'Recycle 7 days in a row', xpReward: 700, criteria: JSON.stringify({ type: 'streak', days: 7 }) } }),
    prisma.achievement.create({ data: { name: 'Plastic Hunter', description: 'Recycle 50 plastic bottles', xpReward: 400, criteria: JSON.stringify({ type: 'plastic_bottles', count: 50 }) } }),
    prisma.achievement.create({ data: { name: 'Eco Legend', description: 'Reach level 20', xpReward: 2000, criteria: JSON.stringify({ type: 'level', level: 20 }) } }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  await Promise.all([
    prisma.badge.create({ data: { name: 'Eco Newcomer', description: 'Joined EcoBank', type: 'MILESTONE' } }),
    prisma.badge.create({ data: { name: 'Recycling Pro', description: '50 deposits completed', type: 'ECO' } }),
    prisma.badge.create({ data: { name: 'Community Hero', description: '100 likes received', type: 'SOCIAL' } }),
    prisma.badge.create({ data: { name: 'Earth Saver', description: '500kg total recycled', type: 'ECO' } }),
    prisma.badge.create({ data: { name: 'Early Adopter', description: 'Joined in the first month', type: 'SPECIAL' } }),
    prisma.badge.create({ data: { name: 'Friend Magnet', description: 'Added 10 friends', type: 'SOCIAL' } }),
  ]);

  console.log(`✅ Created badges`);

  await Promise.all([
    prisma.reward.create({ data: { name: 'Eco Tote Bag', description: 'Reusable organic cotton tote bag', pointsCost: 500, stock: 50, rarity: 'COMMON', category: 'merch', imageUrl: '/rewards/tote-bag.svg' } }),
    prisma.reward.create({ data: { name: 'Rp25,000 Voucher', description: 'GoPay / OVO digital voucher', pointsCost: 1000, stock: 30, rarity: 'UNCOMMON', category: 'voucher', imageUrl: '/rewards/voucher-25.svg' } }),
    prisma.reward.create({ data: { name: 'EcoBank Tumbler', description: 'Stainless steel tumbler, 500ml', pointsCost: 1500, stock: 20, rarity: 'UNCOMMON', category: 'merch', imageUrl: '/rewards/tumbler.svg' } }),
    prisma.reward.create({ data: { name: 'Rp100,000 Voucher', description: 'Shopee / Tokopedia voucher', pointsCost: 3500, stock: 10, rarity: 'RARE', category: 'voucher', imageUrl: '/rewards/voucher-100.svg' } }),
    prisma.reward.create({ data: { name: 'Plant a Tree Kit', description: 'We plant 10 trees in your name', pointsCost: 5000, stock: 100, rarity: 'EPIC', category: 'donation', imageUrl: '/rewards/tree-kit.svg' } }),
    prisma.reward.create({ data: { name: 'EcoBank Legend Jacket', description: 'Limited edition eco jacket', pointsCost: 10000, stock: 5, rarity: 'LEGENDARY', category: 'merch', imageUrl: '/rewards/jacket.svg' } }),
  ]);

  console.log(`✅ Created rewards`);

  const depositData = [
    { userId: users[0].id, machineId: machines[0].id, weight: 2.5, wasteType: 'plastic-bottle', points: 250 },
    { userId: users[0].id, machineId: machines[1].id, weight: 1.2, wasteType: 'plastic-glass', points: 120 },
    { userId: users[1].id, machineId: machines[0].id, weight: 3.0, wasteType: 'plastic-other', points: 450 },
    { userId: users[2].id, machineId: machines[3].id, weight: 5.0, wasteType: 'plastic-bottle', points: 500 },
    { userId: users[2].id, machineId: machines[3].id, weight: 2.0, wasteType: 'plastic-glass', points: 300 },
    { userId: users[3].id, machineId: machines[1].id, weight: 1.0, wasteType: 'plastic-bottle', points: 100 },
    { userId: users[4].id, machineId: machines[0].id, weight: 4.5, wasteType: 'plastic-other', points: 675 },
    { userId: users[4].id, machineId: machines[1].id, weight: 3.5, wasteType: 'plastic-bottle', points: 350 },
    { userId: users[4].id, machineId: machines[3].id, weight: 6.0, wasteType: 'plastic-glass', points: 900 },
    { userId: users[2].id, machineId: machines[0].id, weight: 2.0, wasteType: 'plastic-bottle', points: 200 },
  ];

  for (const d of depositData) {
    await prisma.deposit.create({ data: { ...d, images: '[]' } });
    await prisma.transaction.create({
      data: {
        userId: d.userId,
        amount: d.weight * 100,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: `Recycled ${d.weight}kg of ${d.wasteType}`,
        category: d.wasteType,
        metadata: JSON.stringify({ machineId: d.machineId, weight: d.weight }),
      },
    });
  }

  await prisma.transaction.create({ data: { userId: users[1].id, amount: -500, type: 'REDEEM', description: 'Redeemed Eco Tote Bag', category: 'redeem', status: 'COMPLETED' } });
  await prisma.transaction.create({ data: { userId: users[2].id, amount: -3500, type: 'REDEEM', description: 'Redeemed Rp100,000 Voucher', category: 'redeem', status: 'COMPLETED' } });
  await prisma.transaction.create({ data: { userId: users[0].id, amount: 500, type: 'BONUS', description: 'First deposit bonus!', category: 'bonus', status: 'COMPLETED' } });
  await prisma.transaction.create({ data: { userId: users[3].id, amount: 200, type: 'REFERRAL', description: 'Referred a friend bonus', category: 'referral', status: 'COMPLETED' } });
  await prisma.transaction.create({ data: { userId: users[4].id, amount: -1000, type: 'REDEEM', description: 'Redeemed Rp25,000 Voucher', category: 'redeem', status: 'COMPLETED' } });

  console.log(`✅ Created transactions`);

  const posts = await Promise.all([
    prisma.post.create({ data: { userId: users[0].id, content: 'Just recycled 2.5kg of plastic bottles! Every bottle counts 🌍♻️', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800', badges: JSON.stringify(['eco-warrior', 'plastic-free']) } }),
    prisma.post.create({ data: { userId: users[2].id, content: 'Hit 100kg total recycled today! 🎉 Proud to be part of this eco-community. #EcoBank #ZeroWaste', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800', badges: JSON.stringify(['eco-legend', 'milestone']) } }),
    prisma.post.create({ data: { userId: users[1].id, content: 'DIY compost bin from recycled materials! Who else loves upcycling? 🌱', imageUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800', badges: JSON.stringify(['eco-creative']) } }),
    prisma.post.create({ data: { userId: users[4].id, content: 'The new EcoATM at Tunjungan Plaza is amazing! Fast, clean, and gives great points. Try it out!', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb082b14?w=800', badges: JSON.stringify(['eco-tech']) } }),
    prisma.post.create({ data: { userId: users[3].id, content: 'My kids are learning to sort waste! Starting them young 🌱♻️ #EcoFamily', imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800', badges: JSON.stringify(['eco-family']) } }),
  ]);

  for (let i = 0; i < posts.length; i++) {
    const likers = [users[(i + 1) % users.length].id, users[(i + 2) % users.length].id];
    for (const likerId of likers) {
      await prisma.like.create({ data: { postId: posts[i].id, userId: likerId } });
    }
    if (i < 3) {
      await prisma.comment.create({ data: { postId: posts[i].id, userId: users[(i + 1) % users.length].id, content: 'Amazing work! Keep it up! 🌍' } });
    }
  }

  await prisma.friendRequest.create({ data: { senderId: users[0].id, receiverId: users[1].id, status: 'ACCEPTED' } });
  await prisma.friendRequest.create({ data: { senderId: users[0].id, receiverId: users[2].id, status: 'ACCEPTED' } });
  await prisma.friendRequest.create({ data: { senderId: users[4].id, receiverId: users[0].id, status: 'ACCEPTED' } });
  await prisma.friendRequest.create({ data: { senderId: users[2].id, receiverId: users[4].id, status: 'ACCEPTED' } });
  await prisma.friendRequest.create({ data: { senderId: users[3].id, receiverId: users[0].id, status: 'PENDING' } });

  console.log(`✅ Created ${posts.length} posts with likes/comments`);
  console.log(`✅ Created friend connections`);

  console.log('\n🔑 Machine API keys (pakai header x-machine-key saat testing POST /deposit):');
  for (const machine of machines) {
    console.log(`   ${machine.name.padEnd(30)} id=${machine.id}  key=${machine.apiKey}`);
  }

  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
