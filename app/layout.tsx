import "./globals.css";

export const metadata = {
  title: "Celestial Hymns for OBS",
  description: "Project Celestial hymns into OBS with Dock + Display",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}