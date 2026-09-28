const FORM_URL =
  "https://forms.gle/SVmsQFFab3PReLYXA";

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

export async function POST(req) {
  try {
    const update = await req.json();
    const message = update?.message;
    const chatId = message?.chat?.id;
    const text = message?.text || "";

    if (!chatId) {
      return Response.json({ ok: true });
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

    if (text.startsWith("/start")) {
      await sendMessage(
        chatId,
        "🏆 Welcome to BattleArena!\n\n🎮 Free Fire & BGMI Tournaments\n🔥 Free Registration\n🏅 Compete & Win Rewards!\n\n👇 नीचे menu से option चुनें:",
        keyboard
      );
    } else if (text === "🎮 Tournaments") {
      await sendMessage(
        chatId,
        "🎮 BattleArena Tournaments\n\n🔥 Free Fire\n🎯 BGMI\n\n📅 Upcoming tournaments जल्द ही यहाँ दिखाई देंगे.",
        keyboard
      );
} else if (text === "📝 Register") {
  await sendMessage(
    chatId,
    `📝 Tournament Registration

👉 Register here:
${FORM_URL}`,
    keyboard
  );
    } else if (text === "🏆 Leaderboard") {
      await sendMessage(
        chatId,
        "🏆 Leaderboard\n\nअभी tournaments शुरू होने बाकी हैं.\nResults और rankings यहाँ update होंगे.",
        keyboard
      );
    } else if (text === "🎁 Rewards") {
      await sendMessage(
        chatId,
        "🎁 BattleArena Rewards\n\n🏅 Tournament rewards\n🎖️ Champion badges\n🎁 Special rewards\n\nDetails tournaments के साथ announce होंगे.",
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
        "❓ BattleArena Help\n\n🎮 Tournament → Upcoming matches\n📝 Register → Registration form\n🏆 Leaderboard → Results\n🎁 Rewards → Rewards information\n👕 Merchandise → BattleArena products",
        keyboard
      );
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
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "BattleArena Telegram API is working",
  });
}
