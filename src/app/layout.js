import "../app/styles/globals.css";

export const metadata = {
  title: "Monte Bravo Barbershop | Barbearia em Bragança",
  description:
    "Barbearia em Bragança: cortes de cabelo, barba e acabamentos à navalha. Consulte serviços, preços e horário, e marque online.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Monte Bravo Barbershop",
    description: "Barbearia em Bragança. Marque o seu corte online.",
    locale: "pt_PT",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT">
      <head>
        {/* a foto de fundo do banner é o maior elemento do 1.º ecrã: é pedida logo no início */}
        <link rel="preload" as="image" href="/banner_mobile.webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/banner_tablet.webp" media="(min-width: 768px) and (max-width: 1023px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/banner_desktop.webp" media="(min-width: 1024px)" fetchPriority="high" />
      </head>
      <body>
        <a href="#sobre" className="saltar-conteudo">
          Saltar para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
