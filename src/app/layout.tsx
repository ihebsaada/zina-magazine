// This root layout is intentionally minimal.
// All locale-aware rendering (lang, dir, fonts) happens in app/[lang]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
