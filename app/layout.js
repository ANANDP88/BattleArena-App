* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: #07090f;
  color: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.app {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, #18213a 0%, #07090f 42%),
    #07090f;
}

.hero {
  text-align: center;
  padding: 55px 20px 45px;
  border-bottom: 1px solid #22293a;
}

.badge {
  display: inline-block;
  padding: 8px 14px;
  border: 1px solid #ffd700;
  border-radius: 999px;
  color: #ffd700;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 18px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(36px, 10vw, 64px);
  line-height: 1;
  color: #ffffff;
}

.hero p {
  max-width: 560px;
  margin: 18px auto 0;
  color: #aeb6ca;
  line-height: 1.6;
  font-size: 16px;
}

.heroButtons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.primaryBtn,
.secondaryBtn {
  display: inline-block;
  padding: 13px 18px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
}

.primaryBtn {
  background: #ffd700;
  color: #090b10;
}

.secondaryBtn {
  border: 1px solid #3a4358;
  color: #ffffff;
  background: #111625;
}

.section {
  max-width: 1050px;
  margin: 0 auto;
  padding: 38px 18px;
}

.sectionTitle span,
.simpleCard span,
.referralCard > span {
  color: #ffd700;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.sectionTitle h2,
.simpleCard h2,
.referralCard h2 {
  margin: 7px 0 0;
  font-size: 26px;
}

.tournamentGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
}

.tournamentCard,
.simpleCard,
.referralCard {
  background: rgba(17, 22, 37, 0.92);
  border: 1px solid #293147;
  border-radius: 20px;
  padding: 22px;
}

.tournamentCard {
  position: relative;
}

.gameIcon {
  font-size: 42px;
}

.status {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 9px;
  border-radius: 7px;
  background: #20283a;
  color: #ffd700;
  font-size: 11px;
  font-weight: 800;
}

.tournamentCard h3 {
  font-size: 20px;
  margin: 15px 0 20px;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.info div {
  padding: 11px;
  border-radius: 10px;
  background: #0c101b;
}

.info small {
  display: block;
  color: #727d94;
  font-size: 9px;
  font-weight: 800;
  margin-bottom: 5px;
}

.info strong {
  font-size: 13px;
}

.registerBtn {
  width: 100%;
  border: 0;
  border-radius: 11px;
  padding: 13px;
  background: #ffd700;
  color: #090b10;
  font-weight: 900;
  font-size: 14px;
  cursor: pointer;
}

.registerBtn:active {
  transform: scale(0.98);
}

.notice {
  margin-top: 18px;
  padding: 13px 15px;
  border-radius: 11px;
  background: #172033;
  border: 1px solid #34415c;
  color: #dce3f4;
  font-size: 13px;
  line-height: 1.5;
}

.simpleCard p,
.referralCard p {
  color: #9da7bc;
  line-height: 1.6;
  margin-bottom: 0;
}

.levels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 22px;
}

.levels div {
  padding: 14px 10px;
  text-align: center;
  background: #0c101b;
  border: 1px solid #252d40;
  border-radius: 12px;
}

.levels b,
.levels small {
  display: block;
}

.levels b {
  font-size: 13px;
}

.levels small {
  color: #8993a8;
  font-size: 10px;
  margin-top: 5px;
}

footer {
  text-align: center;
  padding: 35px 20px 45px;
  border-top: 1px solid #22293a;
  color: #8993a8;
}

footer strong {
  color: #ffd700;
  font-size: 18px;
}

footer p {
  margin: 8px 0;
  font-size: 13px;
}

footer small {
  font-size: 11px;
}

@media (max-width: 650px) {
  .hero {
    padding: 42px 18px 35px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .tournamentGrid {
    grid-template-columns: 1fr;
  }

  .levels {
    grid-template-columns: 1fr 1fr;
  }

  .section {
    padding: 30px 14px;
  }
}
