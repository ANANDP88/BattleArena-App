"use client";

import { useState } from "react";

const BGMI_IMAGE = "data:image/webp;base64,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";

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
        <div className="heroImage">
          <img
            src="/hero-banner.jpg"
            alt="BattleArena Gaming"
          />
          <div className="heroOverlay" />
        </div>

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
              {tournament.game === "BGMI" ? (
                <img
                  src={BGMI_IMAGE}
                  alt="BattleArena BGMI tournament"
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    borderRadius: "14px",
                    marginBottom: "14px",
                    border: "1px solid #273149",
                  }}
                />
              ) : (
                <div className="gameIcon">
                  {tournament.icon}
                </div>
              )}

              <div className="status">
                {tournament.status}
              </div>

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
