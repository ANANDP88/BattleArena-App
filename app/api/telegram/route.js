const FORM_URL =
  "https://forms.gle/SVmsQFFab3PReLYXA";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxEdKbjDYR9r6MQlZnVDKfwceZaNS88IJaMQ9vfTmh7ADlRAFezJe6EzAM42cDN04BJ/exec";

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_IDS || "8883673969,6703996214")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

async function sendMessage(chatId, text, keyboard) {
  const response = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: keyboard,
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.ok) {
    throw new Error(
      `Telegram sendMessage failed: ${data?.description || `HTTP ${response.status}`}`
    );
  }

  return data;
}

async function getPlayerChatId(uid) {
  const result = await verificationRequest("getChatId", uid);
  if (!result || result === "CHAT_ID_NOT_FOUND") return "";
  return result.trim();
}

async function verificationRequest(action, uid, extra = {}) {
  const params = new URLSearchParams({
    action,
    uid,
    ...Object.fromEntries(
      Object.entries(extra).filter(
        ([, value]) => value !== undefined && value !== null
      )
    ),
  });

  const url = `${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Verification service returned HTTP ${response.status}`
      );
    }

    const result = await response.text();
    const trimmed = result.trim();

    if (!trimmed) {
      throw new Error("Verification service returned an empty response.");
    }

    if (/^<!doctype html|^<html/i.test(trimmed)) {
      throw new Error(
        "Google verification Web App is not publicly accessible. Set Web App access to Anyone, then redeploy."
      );
    }

    if (trimmed.length > 3500) {
      throw new Error(
        "Google verification service returned an unexpectedly long response."
      );
    }

    return trimmed;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Verification service timed out after 20 seconds.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
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
    const rawText = message?.text || "";
    const text = rawText.trim();
    const command = text.split(/\s+/)[0].toLowerCase().split("@")[0];

    if (!chatId) {
      return Response.json({ ok: true });
    }

    if (text.startsWith("/start")) {
      const username = message?.from?.username || "";

      if (username) {
        try {
          await verificationRequest("saveUser", "", {
            username,
            chatId: String(chatId),
          });
        } catch (saveError) {
          console.error("SAVE USER ERROR:", saveError);
        }
      }

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
        "❓ BattleArena Help\n\n🎮 Tournament → Upcoming match\n📝 Register → Registration form\n🏆 Leaderboard → Results\n🎁 Rewards → Rewards information\n👕 Merchandise → BattleArena products\n\n🔐 /verify UID → Verify registration\n❌ /reject UID → Reject registration\n🆔 /myid → Your Telegram ID",
        keyboard
      );
    } else if (command === "/verify") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        const verifyArgs = text
          .replace(/^\/(?:verify)(?:@[^\s]+)?/i, "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        const uid = verifyArgs[0] || "";
        const directPlayerChatId = verifyArgs[1] || "";

        if (!uid) {
          await sendMessage(
            chatId,
            "🔐 Verify Registration\n\nUsage:\n/verify BGMI_UID [PLAYER_CHAT_ID]",
            keyboard
          );
        } else {
          try {
            await sendMessage(
              chatId,
              `🔄 Verifying registration...\n\n🆔 BGMI UID: ${uid}`,
              keyboard
            );

            const result = await verificationRequest("verify", uid);

            if (result.startsWith("✅ REGISTRATION VERIFIED")) {
              const username = message?.from?.username || "";

              if (username) {
                try {
                  await verificationRequest("saveUser", "", {
                    username,
                    chatId: String(chatId),
                  });
                } catch (saveError) {
                  console.error("SAVE USER ERROR:", saveError);
                }
              }

              await sendMessage(
                chatId,
                result +
                  "\n\n📩 Verification complete. Your BattleArena registration is confirmed.",
                keyboard
              );

              try {
                const playerChatId =
                  directPlayerChatId || (await getPlayerChatId(uid));

                if (
                  playerChatId &&
                  playerChatId !== String(chatId)
                ) {
                  await sendMessage(
                    playerChatId,
                    result +
                      "\n\n🎉 Congratulations! Your BattleArena registration has been verified.\n\n📅 18 October 2026\n⏰ 8:00 PM IST",
                    keyboard
                  );
                }
              } catch (playerError) {
                console.error(
                  "PLAYER NOTIFICATION ERROR:",
                  playerError
                );
              }
            } else {
              await sendMessage(chatId, result, keyboard);
            }
          } catch (error) {
            console.error("VERIFY ERROR:", error);

            await sendMessage(
              chatId,
              "⚠️ Verification service error.\n\n" +
                "UID: " +
                uid +
                "\n" +
                "Error: " +
                (error?.message || "Unknown error"),
              keyboard
            );
          }
        }
      }
    } else if (command === "/reject") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        const uid = text
          .replace(/^\/(?:reject)(?:@[^\s]+)?/i, "")
          .trim();

        if (!uid) {
          await sendMessage(
            chatId,
            "❌ Reject Registration\n\nUsage:\n/reject BGMI_UID",
            keyboard
          );
        } else {
          try {
            await sendMessage(
              chatId,
              `🔄 Rejecting registration...\n\n🆔 BGMI UID: ${uid}`,
              keyboard
            );

            const result = await verificationRequest(
              "reject",
              uid
            );

            await sendMessage(chatId, result, keyboard);
          } catch (error) {
            console.error("REJECT ERROR:", error);

            await sendMessage(
              chatId,
              "⚠️ Verification service error.\n\n" +
                "UID: " +
                uid +
                "\n" +
                "Error: " +
                (error?.message || "Unknown error"),
              keyboard
            );
          }
        }
      }
    } else if (text === "/myid") {
      await sendMessage(
        chatId,
        `🆔 Your Telegram Chat ID: ${chatId}\n\nIs ID ko admin verification ke liye use kiya ja sakta hai.`,
        keyboard
      );
    } else if (text.startsWith("/result ")) {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
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
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "BattleArena Telegram API is working",
  });
}
