import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create seed members
  await prisma.member.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      status: 'current',
      discordId: '123456789',
      discordRole: 'Member',
      duesExpiry: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months from now
    },
  });

  await prisma.member.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      status: 'lapsed',
      discordId: '987654321',
      discordRole: 'Affiliate',
      duesExpiry: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
    },
  });

  // Create seed event
  const event = await prisma.event.upsert({
    where: { actionNetworkId: 'an_123456' },
    update: {},
    create: {
      title: 'Monthly Chapter Meeting',
      description: 'Regular monthly meeting for all chapter members',
      startTime: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
      endTime: new Date(new Date().setDate(new Date().getDate() + 7 + 2)), // 2 hours after start
      location: 'Delaware Community Center',
      actionNetworkId: 'an_123456',
      googleCalendarId: 'gc_123456',
      discordEventId: 'dc_123456',
    },
  });

  // Create seed event attendance
  await prisma.eventAttendee.create({
    data: {
      memberId: 1, // Alice
      eventId: event.id,
      status: 'registered',
    },
  });

  // Create seed document
  await prisma.document.create({
    data: {
      title: 'April Meeting Minutes',
      driveFileId: 'drive_123456',
      driveParentId: 'drive_folder_123',
      driveLink: 'https://drive.google.com/file/d/drive_123456',
      documentType: 'minutes',
      lastEdited: new Date(),
      createdBy: 'alice@example.com',
    },
  });

  // Create seed newsletter
  await prisma.newsletter.create({
    data: {
      title: 'May 2025 Newsletter',
      templateId: 'template_123',
      content: '<h1>May Update</h1><p>Latest news from the chapter...</p>',
      scheduledDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
      status: 'scheduled',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
