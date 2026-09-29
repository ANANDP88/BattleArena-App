"use client";

import { useState } from "react";

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

            <a href="#referral" className="secondaryBtn">
              🎁 Refer & Earn
            </a>
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
