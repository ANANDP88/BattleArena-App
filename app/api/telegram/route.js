const FORM_URL =
  "https://forms.gle/SVmsQFFab3PReLYXA";

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

async function sendMessage(chatId, text, keyboard) {
  await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: keyboard,
      }),
    }
  );
}

const keyboard = {
  keyboard: [
    ["🎮 Tournaments", "📝 Register"],
    ["🏆 Leaderboard", "🎁 Rewards"],
    ["👕 Merchandise", "📜 Rules"],
    ["❓ Help"],
  ],
  resize_keyboard: true,
};

export async function POST(req) {
  try {
    const update = await req.json();
    const message = update?.message;
    const chatId = message?.chat?.id;
    const text = message?.text || "";

    if (!chatId) {
      return Response.json({ ok: true });
    }

    if (text.startsWith("/start")) {
      await sendMessage(
        chatId,
        "🏆 Welcome to BattleArena!\n\n🎮 Free Fire & BGMI Tournaments\n🔥 Free Registration\n🏅 Compete & Win Rewards!\n\n👇 नीचे menu से option चुनें:",
        keyboard
      );
    } else if (text === "🎮 Tournaments") {
      await sendMessage(
        chatId,
        "🏆 BattleArena BGMI — Dussehra Special\n\n🎮 BGMI\n📅 18 October 2026 (Sunday)\n⏰ 8:00 PM IST\n💰 Entry: FREE\n\n🔥 Registration is OPEN!\n📝 Register: " +
          FORM_URL,
        keyboard
      );
    } else if (text === "📝 Register") {
      await sendMessage(
        chatId,
        `📝 Tournament Registration

🏆 BattleArena BGMI — Dussehra Special
📅 18 October 2026
⏰ 8:00 PM IST
💰 Entry: FREE

👉 Register here:
${FORM_URL}`,
        keyboard
      );
    } else if (text === "🏆 Leaderboard") {
      await sendMessage(
        chatId,
        "🏆 BattleArena Leaderboard\n\n📊 Tournament results will appear here after the match.\n\n🥇 1st — Pending\n🥈 2nd — Pending\n🥉 3rd — Pending",
        keyboard
      );
    } else if (text === "🎁 Rewards") {
      await sendMessage(
        chatId,
        "🎁 BattleArena Rewards\n\n🥇 1st Place — Champion Title + Champion Badge + Special Reward\n🥈 2nd Place — Runner-Up Badge + Special Reward\n🥉 3rd Place — 3rd Place Badge + Special Reward\n\n⭐ Bonus: Best Performance & Special Achievement rewards\n\n⚠️ Final rewards tournament announcement में officially confirm होंगे.",
        keyboard
      );
    } else if (text === "👕 Merchandise") {
      await sendMessage(
        chatId,
        "👕 BattleArena Merchandise\n\n🔥 T-Shirts\n🧢 Caps\n👕 Jerseys\n🏆 Champion Kits\n🎖️ Medals & Badges\n\nMerchandise store जल्द आएगा.",
        keyboard
      );
    } else if (text === "📜 Rules") {
      await sendMessage(
        chatId,
        "📜 BattleArena Rules\n\n1️⃣ Fair play only\n2️⃣ No cheating or hacks\n3️⃣ Correct UID देना जरूरी है\n4️⃣ Tournament instructions follow करें\n5️⃣ Admin decision tournament rules के अनुसार होगा.",
        keyboard
      );
    } else if (text === "❓ Help") {
      await sendMessage(
        chatId,
        "❓ BattleArena Help\n\n🎮 Tournament → Upcoming match\n📝 Register → Registration form\n🏆 Leaderboard → Results\n🎁 Rewards → Rewards information\n👕 Merchandise → BattleArena products\n\n🔐 /verify → Registration verification\n🆔 /myid → Your Telegram ID",
        keyboard
      );
    } else if (text === "/verify") {
      await sendMessage(
        chatId,
        "✅ Registration Verification\n\nAapka Telegram account verification ke liye receive ho gaya.\n\n⚠️ Final verification admin registration sheet se confirm karega.",
        keyboard
      );
    } else if (text === "/myid") {
      await sendMessage(
        chatId,
        `🆔 Your Telegram Chat ID: ${chatId}\n\nIs ID ko admin verification ke liye use kiya ja sakta hai.`,
        keyboard
      );
    } else if (text.startsWith("/result ")) {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(
          chatId,
          "⛔ Admin access required.",
          keyboard
        );
      } else {
        await sendMessage(
          chatId,
          "🏆 Result command received.\n\nLeaderboard storage connection is the next backend step.",
          keyboard
        );
      }
    } else {
      await sendMessage(
        chatId,
        "👇 कृपया नीचे दिए गए menu से option चुनें.",
        keyboard
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "BattleArena Telegram API is working",
  });
}
