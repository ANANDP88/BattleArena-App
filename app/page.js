"use client";

import { useState } from "react";

const BGMI_IMAGE = "data:image/jpeg;base64,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";

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
