import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { scryptSync, randomBytes } from "crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64) as Buffer;
  return `${hash.toString("hex")}.${salt}`;
}

async function createUser(
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "INTERN"
) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  ↳ User ${email} already exists, skipping`);
    return existing;
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      emailVerified: true,
      role,
    },
  });

  // Create account with hashed password (Better Auth format)
  await db.account.create({
    data: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashPassword(password),
    },
  });

  return user;
}

async function main() {
  console.log("🌱 Seeding Urbanclicks database...\n");

  // ── Admin ────────────────────────────────────────────────────────────────────
  console.log("Creating admin user (Cedric)...");
  const cedric = await createUser(
    "Cedric Al-Rashid",
    "cedric@urbanclicks.ae",
    "admin123456",
    "ADMIN"
  );
  console.log(`  ✓ Admin: ${cedric.email}\n`);

  // ── Interns ──────────────────────────────────────────────────────────────────
  console.log("Creating intern accounts...");

  const layla = await createUser(
    "Layla Hassan",
    "layla@urbanclicks.ae",
    "intern123456",
    "INTERN"
  );

  const omar = await createUser(
    "Omar Khalid",
    "omar@urbanclicks.ae",
    "intern123456",
    "INTERN"
  );

  console.log(`  ✓ Intern: ${layla.email}`);
  console.log(`  ✓ Intern: ${omar.email}\n`);

  // ── Intern Profiles ───────────────────────────────────────────────────────────
  console.log("Creating intern profiles...");

  const laylaProfile = await db.internProfile.upsert({
    where: { userId: layla.id },
    update: {},
    create: {
      userId: layla.id,
      role: "Content Creator",
      startDate: new Date("2025-02-01"),
      status: "ACTIVE",
      bio: "Final-year Marketing student at Khalifa University. Passionate about brand storytelling and Instagram content.",
      portfolioUrl: "https://laylahassan.notion.site",
    },
  });

  const omarProfile = await db.internProfile.upsert({
    where: { userId: omar.id },
    update: {},
    create: {
      userId: omar.id,
      role: "Social Media Coordinator",
      startDate: new Date("2025-03-01"),
      status: "ACTIVE",
      bio: "Communications graduate from UAE University. Specialises in community management and analytics reporting.",
      portfolioUrl: null,
    },
  });

  console.log(`  ✓ Profile: ${laylaProfile.role} — Layla`);
  console.log(`  ✓ Profile: ${omarProfile.role} — Omar\n`);

  // ── Tasks ────────────────────────────────────────────────────────────────────
  console.log("Creating tasks...");

  const now = new Date();
  const days = (n: number) => new Date(now.getTime() + n * 86400000);

  const tasks = await Promise.all([
    db.internTask.create({
      data: {
        title: "Write 5 Instagram captions for Al Ain Oasis campaign",
        description:
          "Each caption should be 150–200 characters, include 2 relevant hashtags, and use a conversational tone. Deliverable: Google Doc with all 5 options.",
        assignedToId: laylaProfile.id,
        dueDate: days(3),
        status: "IN_PROGRESS",
      },
    }),
    db.internTask.create({
      data: {
        title: "Create content calendar for June (TikTok)",
        description:
          "Plan 20 TikTok posts for June for our food & beverage client. Include topic, format, and hook idea for each post.",
        assignedToId: laylaProfile.id,
        dueDate: days(7),
        status: "TODO",
      },
    }),
    db.internTask.create({
      data: {
        title: "Compile monthly analytics report — May 2025",
        description:
          "Pull data from Instagram Insights and TikTok Analytics. Report should cover reach, engagement rate, top posts, and 3 recommendations.",
        assignedToId: omarProfile.id,
        dueDate: days(2),
        status: "IN_PROGRESS",
      },
    }),
    db.internTask.create({
      data: {
        title: "Research UAE food influencers (micro-tier, Abu Dhabi)",
        description:
          "Find 15 food micro-influencers (5k–50k followers) based in Abu Dhabi. Include handle, follower count, avg engagement, and contact email in a spreadsheet.",
        assignedToId: omarProfile.id,
        dueDate: days(5),
        status: "DONE",
      },
    }),
    db.internTask.create({
      data: {
        title: "Draft brand guidelines one-pager for new client brief",
        description:
          "Create a one-page brand snapshot document covering tone of voice, key messages, content do's & don'ts, and visual references.",
        assignedToId: laylaProfile.id,
        dueDate: days(10),
        status: "TODO",
      },
    }),
  ]);

  tasks.forEach((t) => console.log(`  ✓ Task: "${t.title.slice(0, 50)}..."`));
  console.log();

  // ── Submissions ───────────────────────────────────────────────────────────────
  console.log("Creating sample submissions...");

  const sub1 = await db.submission.create({
    data: {
      taskId: tasks[3].id, // Research task (DONE)
      internId: omarProfile.id,
      workUrl: "https://docs.google.com/spreadsheets/d/sample-influencer-list",
      notes: "Found 18 influencers in total, filtered down to the 15 best matches by engagement rate.",
      status: "APPROVED",
    },
  });

  const sub2 = await db.submission.create({
    data: {
      taskId: tasks[0].id, // Instagram captions (IN_PROGRESS)
      internId: laylaProfile.id,
      workUrl: "https://docs.google.com/document/d/sample-ig-captions",
      notes: "First draft of 5 captions. Went with a warm, story-led tone as discussed.",
      status: "REVISION_NEEDED",
    },
  });

  console.log(`  ✓ Submission: Omar → Research task (Approved)`);
  console.log(`  ✓ Submission: Layla → Instagram captions (Revision needed)\n`);

  // ── Feedback ──────────────────────────────────────────────────────────────────
  console.log("Creating feedback...");

  await db.feedback.create({
    data: {
      submissionId: sub1.id,
      authorId: cedric.id,
      body: "Excellent work, Omar. The engagement rate column is exactly what we needed. Well done — this goes straight into the client deck.",
    },
  });

  await db.feedback.create({
    data: {
      submissionId: sub2.id,
      authorId: cedric.id,
      body: "Good start, Layla! Captions 1 and 3 are strong. For captions 2, 4, and 5 — make the opening line punchier (hook in the first 3 words). Also add the #AlAinOasis hashtag to each one.",
    },
  });

  console.log(`  ✓ Feedback on both submissions\n`);

  // ── Sample application ────────────────────────────────────────────────────────
  console.log("Creating sample application...");

  await db.application.create({
    data: {
      name: "Noor Al-Zaabi",
      email: "noor.alzaabi@gmail.com",
      roleInterest: "Video Producer",
      portfolioUrl: "https://vimeo.com/noor-alzaabi",
      coverNote:
        "I'm a final-year Film & Media student at UAEU. I've been producing short-form content for my personal brand for 2 years and would love to bring that energy to Urbanclicks. I'm based in Al Ain and available to start immediately.",
      status: "PENDING",
    },
  });

  console.log(`  ✓ Application: Noor Al-Zaabi (Video Producer)\n`);

  console.log("✅ Seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Login credentials:");
  console.log("  Admin:  cedric@urbanclicks.ae  / admin123456");
  console.log("  Intern: layla@urbanclicks.ae   / intern123456");
  console.log("  Intern: omar@urbanclicks.ae    / intern123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await db.$disconnect();
    process.exit(1);
  });
