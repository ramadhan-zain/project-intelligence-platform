import type { ReactNode } from "react";

export const metadata = {
  title: "Project Intelligence Platform",
  description: "Shared, continuously updated project knowledge.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
