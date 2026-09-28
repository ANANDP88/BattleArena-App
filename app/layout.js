export const metadata = {
  title: "BattleArena",
  description: "Free Fire & BGMI Tournaments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
