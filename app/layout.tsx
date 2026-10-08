export const metadata = {
  title: "SlotRescue AI scaffold",
  description: "Implementation in progress. Sponsored by Creignificent LLC."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#07080a", color: "#f4f1ea", fontFamily: "Georgia, serif" }}>
        {children}
      </body>
    </html>
  );
}
