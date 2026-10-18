import { CONTACTO, HORARIO, MAPS_LINK } from "../dados/contacto";
import { SERVICOS } from "../dados/servicos";

// Dados estruturados (Schema.org) para o Google: identificam o site como uma barbearia,
// com morada, contactos, horário e preços. Gerados a partir dos mesmos dados que o site mostra.
const DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const precos = SERVICOS.flatMap((categoria) => categoria.itens.map((servico) => servico.preco));

const dados = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: CONTACTO.nome,
  image: "/monte_bravo_nav.svg",
  telephone: CONTACTO.telefone.replace(/\s/g, ""),
  priceRange: `${Math.min(...precos)}€ - ${Math.max(...precos)}€`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avenida Sá Carneiro, nº 32, Sala 34",
    postalCode: "5300-021",
    addressLocality: "Bragança",
    addressCountry: "PT",
  },
  geo: { "@type": "GeoCoordinates", latitude: 41.8056038, longitude: -6.760175 },
  hasMap: MAPS_LINK,
  sameAs: [CONTACTO.instagram, CONTACTO.facebook].filter(Boolean),
  openingHoursSpecification: HORARIO.flatMap((linha) =>
    linha.periodos.map(([abre, fecha]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: linha.diasSemana.map((d) => DIAS[d]),
      opens: abre,
      closes: fecha,
    }))
  ),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços",
    itemListElement: SERVICOS.flatMap((categoria) =>
      categoria.itens.map((servico) => ({
        "@type": "Offer",
        price: servico.preco,
        priceCurrency: "EUR",
        itemOffered: { "@type": "Service", name: servico.nome },
      }))
    ),
  },
};

export default function DadosEstruturados() {
  return (
    <script
      type="application/ld+json"
      // JSON gerado no servidor a partir de dados do próprio site (não vem do utilizador)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }}
    />
  );
}
