// Vercel production sync — leaderboard Apps Script deployment
// BattleArena production sync marker — 2026-09-29
const FORM_URL =
  "https://forms.gle/SVmsQFFab3PReLYXA";

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxskv_7MmRuKMOOYs-LsKKZpg5QF_PQC-AxCMEbGb9JXXgjlj7SvLAoOFmKe4-DfKmJ/exec";

const BROADCAST_CHANNEL = "@battlearenaS2";

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_IDS || "8883673969,6703996214")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

async function sendMessage(chatId, text, keyboard) {
  for (let attempt = 0; attempt < 4; attempt++) {
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

    if (response.ok && data?.ok) return data;

    const retryAfter = Number(data?.parameters?.retry_after || 0);
    if (response.status === 429 && retryAfter > 0 && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    throw new Error(
      `Telegram sendMessage failed: ${data?.description || `HTTP ${response.status}`}`
    );
  }
}

function parseUserIds(raw) {
  const value = String(raw || "").trim();
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.users)
        ? parsed.users
        : [];
    if (list.length) {
      return [...new Set(
        list
          .map((item) => typeof item === "object" ? (item.chatId || item.chat_id || item.id) : item)
          .map((id) => String(id || "").trim())
          .filter((id) => /^-?\\d+$/.test(id))
      )];
    }
  } catch {}

  return [...new Set(
    value
      .split(/[,\\r\\n]+/)
      .map((id) => id.trim())
      .filter((id) => /^-?\\d+$/.test(id))
  )];
}

async function getBotUsers() {
  return parseUserIds(await verificationRequest("getUsers", ""));
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
  const timeout = setTimeout(() => controller.abort(), 45000);

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
      throw new Error("Verification service timed out after 45 seconds.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

const userKeyboard = {
  keyboard: [
    ["🎮 Tournaments", "📝 Register"],
    ["🏆 Leaderboard", "🎁 Rewards"],
    ["📚 Tournament History", "📊 My Stats"],
    ["🎁 Refer & Earn", "👕 Merchandise"],
    ["📜 Rules", "❓ Help"],
  ],
  resize_keyboard: true,
};

const adminKeyboard = {
  keyboard: [
    ["🎮 Tournaments", "📝 Register"],
    ["🏆 Leaderboard", "🎁 Rewards"],
    ["📚 Tournament History", "📊 My Stats"],
    ["🎁 Refer & Earn", "👕 Merchandise"],
    ["📢 Broadcast", "👥 Bot Users"],
    ["📜 Rules", "❓ Help"],
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

    const keyboard = ADMIN_IDS.includes(String(chatId))
      ? adminKeyboard
      : userKeyboard;

    if (text.startsWith("/start")) {
      const username = message?.from?.username || "";
      const startPayload = text.split(/\s+/)[1] || "";
      const referrerChatId = startPayload.startsWith("ref_")
        ? startPayload.slice(4)
        : "";

      try {
        await verificationRequest("saveUser", "", {
          username: username || "Telegram User",
          chatId: String(chatId),
        });
      } catch (saveError) {
        console.error("SAVE USER ERROR:", saveError);
      }

      if (referrerChatId) {
        try {
          const referralResult = await verificationRequest(
            "savereferral",
            "",
            {
              referrer: referrerChatId,
              referred: String(chatId),
            }
          );
          console.log("REFERRAL RESULT:", referralResult);
        } catch (referralError) {
          console.error("REFERRAL SAVE ERROR:", referralError);
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
        "🏆 BattleArena BGMI — Dussehra Special\n\n🎮 BGMI\n📅 18 October 2026 (Sunday)\n⏰ 8:00 PM IST\n💰 Entry: FREE\n💰 Prize Pool: Participant-Based\n🥉 Bronze: ₹3 per participant\n🥈 Silver: ₹5 per participant\n🥇 Gold: ₹10 per participant\n💎 Diamond: ₹100 per participant\n📌 Final pool = (Bronze × ₹3) + (Silver × ₹5) + (Gold × ₹10) + (Diamond × ₹100)\n⚠️ Earlier displayed prize amount is not confirmed. Final pool will be calculated after registration closes.\nExample: 10 Bronze + 20 Silver + 100 Gold + 1 Diamond = ₹1,230\n\n🔥 Registration is OPEN!\n📝 Register: " +
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
      try {
        const leaderboard = await verificationRequest(
          "leaderboard",
          "",
          {}
        );

        console.log("LEADERBOARD RESPONSE:", leaderboard);

        await sendMessage(
          chatId,
          leaderboard || "🏆 Leaderboard\n\nNo results published yet.",
          keyboard
        );
      } catch (error) {
        console.error("LEADERBOARD ERROR:", error);

        await sendMessage(
          chatId,
          "🏆 BattleArena Leaderboard\n\n🥇 1. BA TEST TEAM — UID 226019\n\n📌 Result saved: 1st Place",
          keyboard
        );
      }
    } else if (text === "📚 Tournament History") {
      await sendMessage(
        chatId,
        "📚 BATTLEARENA TOURNAMENT HISTORY\n\n🟢 UPCOMING\n🏆 BGMI — Dussehra Special\n📅 18 October 2026 (Sunday)\n⏰ 8:00 PM IST\n💰 Entry: FREE\n📌 Status: Registration OPEN\n\n🏅 PAST WINNERS\nNo completed tournaments yet.\n\n🔥 BattleArena history yahin update hoti rahegi.",
        keyboard
      );
    } else if (text === "📊 My Stats") {
      try {
        const stats = await verificationRequest("playerstats", "", {
          chatId: String(chatId),
        });
        await sendMessage(chatId, stats, keyboard);
      } catch (error) {
        console.error("PLAYER STATS ERROR:", error);
        await sendMessage(
          chatId,
          "📊 BATTLEARENA PLAYER STATS\n\n🎮 Tournaments Played: 0\n🏆 Wins: 0\n🥈 Runner-Up: 0\n🥉 3rd Place: 0\n⭐ Best Performance: —\n\n📌 Stats will update automatically after tournament results are recorded.",
          keyboard
        );
      }
    } else if (text === "🎁 Rewards") {
      await sendMessage(
        chatId,
        "🎁 BattleArena Rewards\n\n🥇 1st Place — Champion Title + Champion Badge + Special Reward\n🥈 2nd Place — Runner-Up Badge + Special Reward\n🥉 3rd Place — 3rd Place Badge + Special Reward\n\n⭐ Bonus: Best Performance & Special Achievement rewards\n\n⚠️ Final rewards tournament announcement में officially confirm होंगे.",
        keyboard
      );
    } else if (text === "🎁 Refer & Earn") {
      try {
        const info = await verificationRequest(
          "referralinfo",
          "",
          { chatId: String(chatId) }
        );

        const referralLink =
          "https://t.me/TheBattleArena_bot?start=ref_" +
          String(chatId);

        await sendMessage(
          chatId,
          info +
            "\n\n🔗 Your Referral Link:\n" +
            referralLink +
            "\n\n📌 Referral tabhi count hoga jab referred player registration/verification complete kare.",
          keyboard
        );
      } catch (error) {
        console.error("REFERRAL INFO ERROR:", error);

        const referralLink =
          "https://t.me/TheBattleArena_bot?start=ref_" +
          String(chatId);

        await sendMessage(
          chatId,
          "🎁 BattleArena Referral\n\n🔗 Your Referral Link:\n" +
            referralLink +
            "\n\n👥 Verified referrals: backend sync pending.",
          keyboard
        );
      }
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
        "❓ BattleArena Help\n\n🎮 Tournament → Upcoming match\n📝 Register → Registration form\n🏆 Leaderboard → Results\n📚 Tournament History → Past & upcoming tournaments\n🎁 Rewards → Rewards information\n👕 Merchandise → BattleArena products\n\n🔐 /verify UID → Verify registration\n❌ /reject UID → Reject registration\n🆔 /myid → Your Telegram ID",
        keyboard
      );
    } else if (command === "/reply") {
      if (!(ADMIN_IDS.includes(String(chatId)))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        const args = text.replace(/^\/reply(?:@[^\s]+)?/i, "").trim();
        const firstSpace = args.indexOf(" ");
        const targetChatId = firstSpace > 0 ? args.slice(0, firstSpace).trim() : "";
        const replyText = firstSpace > 0 ? args.slice(firstSpace + 1).trim() : "";

        if (!targetChatId || !replyText) {
          await sendMessage(
            chatId,
            "💬 Reply to User\n\nUsage:\n/reply CHAT_ID Your message",
            keyboard
          );
        } else {
          try {
            await sendMessage(targetChatId, "👑 BattleArena Admin\n\n" + replyText, keyboard);
            await sendMessage(chatId, "✅ Reply sent to user " + targetChatId, keyboard);
          } catch (error) {
            await sendMessage(
              chatId,
              "⚠️ Reply failed.\n\n" + (error?.message || "Unknown error"),
              keyboard
            );
          }
        }
      }
    } else if (text === "⬅️ Main Menu") {
      await sendMessage(chatId, "👇 Main menu", keyboard);
    } else if (text === "👥 Bot Users" || command === "/users") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        try {
          const users = await getBotUsers();
          await sendMessage(
            chatId,
            "👥 BattleArena Bot Users\n\n" +
              "📊 Total bot users: " + users.length +
              "\n\n📢 Broadcast isi user list ko bhejega.",
            keyboard
          );
        } catch (error) {
          console.error("BOT USERS COUNT ERROR:", error);
          await sendMessage(
            chatId,
            "⚠️ User count fetch nahi ho saka.\n\n" +
              (error?.message || "Unknown error"),
            keyboard
          );
        }
      }
    } else if (text === "📢 Broadcast") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        await sendMessage(
          chatId,
          "📢 Broadcast Panel\n\nUsage:\n/broadcast Your message here\n\n👥 Bot users ka current count dekhne ke liye 👥 Bot Users dabayein.\n📣 Broadcast channel + registered bot users dono ko bheja jayega.",
          keyboard
        );
      }
    } else if (command === "/broadcast") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        const broadcastText = text
          .replace(/^\/broadcast(?:@[^\s]+)?/i, "")
          .trim();

        if (!broadcastText) {
          await sendMessage(
            chatId,
            "📢 Broadcast Panel\n\nUsage:\n/broadcast Your message here\n\n📣 Message BattleArena channel + registered bot users ko bheja jayega.",
            keyboard
          );
        } else {
          try {
            await sendMessage(
              BROADCAST_CHANNEL,
              "📢 BattleArena Announcement\n\n" + broadcastText,
              { inline_keyboard: [] }
            );

            // Bot-started users are stored by the Apps Script saveUser action.
            const users = await getBotUsers();

            let sent = 0;
            let failed = 0;

            for (const userId of users) {
              try {
                await sendMessage(
                  userId,
                  "📢 BattleArena Announcement\n\n" + broadcastText,
                  userKeyboard
                );
                sent++;
              } catch (userError) {
                failed++;
                console.error("BROADCAST USER ERROR:", userId, userError);
              }
            }

            await sendMessage(
              chatId,
              "✅ Broadcast complete.\n\n📣 Channel: sent\n👥 Bot users: " +
                sent +
                "\n⚠️ Failed: " +
                failed,
              keyboard
            );
          } catch (error) {
            console.error("BROADCAST ERROR:", error);
            await sendMessage(
              chatId,
              "⚠️ Broadcast failed.\n\n" +
                (error?.message || "Unknown error"),
              keyboard
            );
          }
        }
      }
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

                  try {
                    const referralResult = await verificationRequest(
                      "verifyreferral",
                      "",
                      {
                        referred: String(playerChatId),
                        uid: String(uid),
                      }
                    );

                    console.log(
                      "REFERRAL VERIFICATION RESULT:",
                      referralResult
                    );

                    if (referralResult.startsWith("REFERRAL_VERIFIED|")) {
                      const parts = referralResult.split("|");
                      const referrerChatId = parts[1] || "";
                      const verifiedCount = parts[2] || "0";

                      if (referrerChatId) {
                        await sendMessage(
                          referrerChatId,
                          "🎉 Referral Verified!\n\n" +
                            "A player you referred has completed registration verification.\n\n" +
                            "👥 Verified Referrals: " +
                            verifiedCount +
                            "\n🏅 Level: " +
                            "updated",
                          keyboard
                        );
                      }
                    }
                  } catch (referralError) {
                    console.error(
                      "REFERRAL VERIFICATION ERROR:",
                      referralError
                    );
                  }
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
    } else if (command === "/approve") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        const approveUid = text
          .replace(/^\/(?:approve)(?:@[^\s]+)?/i, "")
          .trim();

        if (!approveUid) {
          await sendMessage(
            chatId,
            "✅ Approve Registration\n\nUsage:\n/approve BGMI_UID",
            keyboard
          );
        } else {
          try {
            const result = await verificationRequest(
              "approve",
              approveUid
            );

            // Approval itself is complete after the Apps Script response.
            // Do not block the admin command on a second Google request for player chat ID.
            await sendMessage(chatId, result, keyboard);
          } catch (error) {
            console.error("APPROVE ERROR:", error);
            await sendMessage(
              chatId,
              "⚠️ Approval service error.\n\n" +
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
    } else if (command === "/result") {
      if (!ADMIN_IDS.includes(String(chatId))) {
        await sendMessage(chatId, "⛔ Admin access required.", keyboard);
      } else {
        const resultArgs = text
          .replace(/^\/result(?:@[^\s]+)?/i, "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        if (resultArgs.length < 2) {
          await sendMessage(
            chatId,
            "🏆 Add Tournament Result\n\nUsage:\n/result BGMI_UID POSITION\n\nExample:\n/result 226019 1",
            keyboard
          );
        } else {
          const resultUid = resultArgs[0];
          const position = resultArgs[1];

          try {
            const result = await verificationRequest(
              "result",
              resultUid,
              { position }
            );

            await sendMessage(chatId, result, keyboard);
          } catch (error) {
            console.error("RESULT ERROR:", error);

            await sendMessage(
              chatId,
              "⚠️ Result service error.\n\n" +
                (error?.message || "Unknown error"),
              keyboard
            );
          }
        }
      }
    } else {
      const q = text.toLowerCase();

      let faqReply = "";

      if (/^(hi|hello|hey|hii|namaste|नमस्ते)/i.test(text)) {
        faqReply = "👋 Welcome to BattleArena!\n\n🎮 Free Fire & BGMI tournaments\n📝 Registration, results, rewards aur referrals ke liye neeche menu use karein.";
      } else if (/tournament|tourney|match|kab|date|time|when/i.test(q)) {
        faqReply = "🏆 Upcoming Tournament\n\n🎮 BattleArena BGMI — Dussehra Special\n📅 18 October 2026 (Sunday)\n⏰ 8:00 PM IST\n💰 Entry: FREE\n💰 Prize Pool: Participant-Based\n🥉 Bronze ₹3 • 🥈 Silver ₹5 • 🥇 Gold ₹10 • 💎 Diamond ₹100 per participant\n📌 Final pool = (Bronze × ₹3) + (Silver × ₹5) + (Gold × ₹10) + (Diamond × ₹100)\n⚠️ Earlier displayed prize amount is not confirmed. Final pool will be calculated after registration closes.\nExample: 10 Bronze + 20 Silver + 100 Gold + 1 Diamond = ₹1,230\n\n📝 Registration OPEN hai.";
      } else if (/register|registration|form|join|participate|entry/i.test(q)) {
        faqReply = "📝 Registration\n\nBattleArena BGMI Dussehra Special ke liye registration free hai.\n\n👇 Menu me 📝 Register button dabayein.";
      } else if (/free fire|ff tournament|freefire/i.test(q)) {
        faqReply = "🔥 Free Fire Tournament\n\n🎮 Free Fire Squad Tournament\n💰 Prize: XXX\n📌 Final prize details official announcement me reveal hongi." ;
      } else if (/bgmi|uid|player id|team|squad/i.test(q)) {
        faqReply = "🎮 BGMI\n\nRegistration ke waqt correct BGMI UID aur team details dena zaroori hai. Galat UID se verification me problem ho sakti hai.";
      } else if (/verify|verification|approved|approve|reject|status/i.test(q)) {
        faqReply = "🔐 Verification\n\nRegistration ke baad BattleArena team UID verify karti hai. Verification complete hone par registration confirmed hota hai.";
      } else if (/rule|rules|cheat|hack|fair play|ban/i.test(q)) {
        faqReply = "📜 Rules\n\nFair play only. Hacks/cheats allowed nahi hain. Correct UID dena aur tournament instructions follow karna zaroori hai.";
      } else if (/reward|prize|winner|1st|2nd|3rd|champion/i.test(q)) {
        faqReply = "🎁 Rewards\n\n💰 Prize Pool: Participant-Based\n🥉 Bronze ₹3 • 🥈 Silver ₹5 • 🥇 Gold ₹10 • 💎 Diamond ₹100 per participant\n📌 Final pool is calculated from verified participants after registration closes.\n📌 Final 1st/2nd/3rd prize distribution will be announced after registration closes.";
      } else if (/refer|referral|invite|friend|bronze|silver|gold|diamond/i.test(q)) {
        faqReply = "🎁 Refer & Earn\n\nReferral optional hai. Referred player registration/verification complete karega tab referral count hoga.\n\nReferral link ke liye 🎁 Refer & Earn button use karein.";
      } else if (/history|past tournament|previous tournament|winner history/i.test(q)) {
        faqReply = "📚 Tournament History\n\nUpcoming: BGMI Dussehra Special — 18 October 2026, 8:00 PM IST.\n\nPast winners aur completed tournaments history yahan publish hogi.";
      } else if (/leaderboard|result|position|rank|score/i.test(q)) {
        faqReply = "🏆 Leaderboard\n\nPublished tournament results 🏆 Leaderboard button me milenge.";
      } else if (/merch|merchandise|shirt|t-shirt|hoodie|cap|jersey|medal|trophy/i.test(q)) {
        faqReply = "👕 Merchandise\n\nBattleArena merchandise store future me available hoga. T-shirts, jerseys, caps, champion kits aur more planned hain.";
      } else if (/contact|support|help|admin|problem|issue|complaint|payment|technical/i.test(q)) {
        faqReply = "🆘 Support\n\nAapka message BattleArena team tak forward kiya ja sakta hai. Apna issue clearly likhein; admin aapko reply karega.";
      }

      if (faqReply) {
        await sendMessage(chatId, faqReply, keyboard);
      } else {
        await sendMessage(
          chatId,
          "👑 Our team will get back to you shortly.",          keyboard
        );

        for (const adminId of ADMIN_IDS) {
          if (adminId !== String(chatId)) {
            try {
              await sendMessage(
                adminId,
                "💬 NEW USER QUESTION\n\n👤 User Chat ID: " + chatId +
                  "\n" + (message?.from?.username ? "📛 Username: @" + message.from.username + "\n" : "") +
                  "\n❓ Question:\n" + text +
                  "\n\nReply command:\n/reply " + chatId + " Your answer",
                keyboard
              );
            } catch (adminError) {
              console.error("ADMIN QUESTION NOTIFY ERROR:", adminError);
            }
          }
        }
      }
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
