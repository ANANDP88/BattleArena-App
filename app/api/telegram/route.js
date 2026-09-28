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
      const parts = text.split(" ");
      const referral = parts[1] || "";

      const reply =
        referral
          ? `🏆 Welcome to BattleArena!\n\n🎮 Referral detected: ${referral}\n\n🔥 Free Fire & BGMI tournaments coming soon!\n\n👇 Register and compete!`
          : `🏆 Welcome to BattleArena!\n\n🎮 Free Fire & BGMI tournaments\n🔥 Free registration\n🏅 Compete & win rewards!\n\n👇 Stay tuned for upcoming tournaments!`;

      await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply,
          }),
        }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  
}
export async function GET() {
  return Response.json({
    ok: true,
    message: "BattleArena Telegram API is working"
  });
}
