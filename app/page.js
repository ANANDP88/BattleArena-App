"use client";

import { useEffect, useState } from "react";

const tournaments = [
  {
    game: "BGMI",
    icon: "🎯",
    title: "BattleArena BGMI — Dussehra Special",
    mode: "Squad",
    entry: "FREE",
    prize: "Special Rewards",
    status: "Registration OPEN",
    open: true,
  },
  {
    game: "Free Fire",
    icon: "🔥",
    title: "BattleArena Free Fire Tournament",
    mode: "Squad",
    entry: "FREE",
    prize: "Coming Soon",
    status: "Registration CLOSED",
    open: false,
  },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const target = new Date("2026-10-17T20:00:00+05:30").getTime();

    function updateCountdown() {
      const diff = target - Date.now();

      if (diff <= 0) {
        setCountdown("Registration closing");
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setCountdown(
        `${days}d : ${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(2, "0")}m : ${String(seconds).padStart(2, "0")}s`
      );
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  function register(game) {
    if (game !== "BGMI") return;
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLScyEVnRrzlkI4rS_hkmPOS7PGnvKOJP7IPZkEzNPLmXROxV1A/viewform?usp=publish-editor",
      "_blank"
    );
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="heroContent">
          <div className="badge">🏆 BATTLEARENA</div>

          <h1>Play. Compete. Win.</h1>

          <p>
            Free Fire & BGMI tournaments for the BattleArena gaming community.
          </p>

          <div className="heroButtons">
            <a href="#tournaments" className="primaryBtn">
              🎮 View Tournaments
            </a>

            <a
              href="https://t.me/battlearenaS2"
              target="_blank"
              rel="noreferrer"
              className="secondaryBtn"
            >
              📢 Join Telegram Channel
            </a>

            <a
              href="https://t.me/TheBattleArena_bot"
              target="_blank"
              rel="noreferrer"
              className="secondaryBtn"
            >
              🤖 Open BattleArena Bot
            </a>
          </div>
        </div>
      </section>

      <section className="section sponsorsSection">
        <div className="sectionTitle">
          <span>PARTNERS</span>
          <h2>🤝 Our Sponsors</h2>
          <p className="sectionIntro">
            Sponsor space for gaming brands, creators and future BattleArena partners.
          </p>
        </div>

        <div className="sponsorGrid">
          <div className="sponsorCard">
            <div className="sponsorLogo sponsorOne">NOVA</div>
            <strong>Nova Gaming</strong>
            <small>Example Sponsor</small>
          </div>

          <div className="sponsorCard">
            <div className="sponsorLogo sponsorTwo">XP</div>
            <strong>XP Esports</strong>
            <small>Example Sponsor</small>
          </div>

          <div className="sponsorCard">
            <div className="sponsorLogo sponsorThree">GG</div>
            <strong>GG Arena</strong>
            <small>Example Sponsor</small>
          </div>

          <div className="sponsorCard sponsorEmpty">
            <div className="sponsorLogo">+</div>
            <strong>Your Brand Here</strong>
            <a href="https://t.me/Ciattra" target="_blank" rel="noreferrer" className="sponsorContact">Become a Sponsor</a>
          </div>
        </div>
      </section>

      <section id="tournaments" className="section">
        <div className="sectionTitle">
          <span>COMPETE</span>
          <h2>🏆 Upcoming Tournaments</h2>
        </div>

        <div className="tournamentGrid">
          {tournaments.map((tournament) => (
            <article
              className="tournamentCard"
              key={tournament.game}
            >
              <div className="gameIcon">
                {tournament.icon}
              </div>

              <div className="status">
                {tournament.status}
              </div>

              {tournament.game === "BGMI" && (
                <div className="countdown">
                  <small>⏳ REGISTRATION CLOSES IN</small>
                  <strong>{countdown}</strong>
                  <span>Deadline: 17 October 2026 • 8:00 PM IST</span>
                </div>
              )}

              <h3>{tournament.title}</h3>

              <div className="info">
                <div>
                  <small>GAME</small>
                  <strong>{tournament.game}</strong>
                </div>

                <div>
                  <small>MODE</small>
                  <strong>{tournament.mode}</strong>
                </div>

                <div>
                  <small>ENTRY</small>
                  <strong>{tournament.entry}</strong>
                </div>

                <div>
                  <small>PRIZE</small>
                  <strong>{tournament.prize}</strong>
                </div>
              </div>

              <button
                className="registerBtn"
                onClick={() => register(tournament.game)}
                disabled={!tournament.open}
              >
                {tournament.open ? "📝 Register Now" : "🔒 Registration Closed"}
              </button>
            </article>
          ))}
        </div>

        {message && (
          <div className="notice">
            {message}
          </div>
        )}
      </section>

      <section id="leaderboard" className="section">
        <div className="simpleCard">
          <span>🥇 LEADERBOARD</span>

          <h2>BattleArena Rankings</h2>

          <p>
            Tournament winners and top players will appear here.
          </p>
        </div>
      </section>

      <section id="referral" className="section">
        <div className="referralCard">
          <span>🎁 REFERRAL PROGRAM</span>

          <h2>Invite. Grow. Earn.</h2>

          <p>
            Invite genuine gaming friends to BattleArena and
            unlock referral rewards as the community grows.
          </p>

          <div className="levels">
            <div>
              <b>🥉 Bronze</b>
              <small>10 referrals</small>
            </div>

            <div>
              <b>🥈 Silver</b>
              <small>20 referrals</small>
            </div>

            <div>
              <b>🥇 Gold</b>
              <small>50 referrals</small>
            </div>

            <div>
              <b>💎 Diamond</b>
              <small>100 referrals</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="simpleCard">
          <span>🎁 REWARDS</span>

          <h2>BattleArena Rewards</h2>

          <p>
            Tournament rewards, champion kits, merchandise
            and community rewards will be added here.
          </p>
        </div>
      </section>

      <footer>
        <strong>🔥 BattleArena</strong>

        <p>
          Free Fire & BGMI Tournaments
        </p>

        <small>
          Play • Compete • Win
        </small>
      </footer>
    </main>
  );
              }
