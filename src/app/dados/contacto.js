// Dados de contacto da barbearia, usados nas secções Contactos e no Footer
// (campos vazios não são exibidos)
export const CONTACTO = {
  nome: "Monte Bravo Barbershop",
  morada: "Avenida Sá Carneiro, nº 32, Sala 34 (ao lado da Remax)",
  codigoPostal: "5300-021 Bragança, Portugal",
  telefone: "+351 962 022 250",
  whatsapp: "351962022250", // apenas dígitos com indicativo
  instagram: "https://www.instagram.com/montebravobarbershop/",
  facebook: "https://www.facebook.com/profile.php?id=61576677509232",
};

// Horário de funcionamento (diasSemana: 0 = domingo … 6 = sábado; horas no fuso de Portugal)
export const HORARIO = [
  { dias: "Segunda", diasSemana: [1], periodos: [["13:00", "19:00"]] },
  { dias: "Terça a Sexta", diasSemana: [2, 3, 4, 5], periodos: [["09:30", "12:00"], ["14:00", "19:00"]] },
  { dias: "Sábado", diasSemana: [6], periodos: [["09:00", "13:00"]] },
  { dias: "Domingo", diasSemana: [0], periodos: [] },
];

// Localização exata da barbearia no Google Maps
export const MAPS_LINK =
  "https://www.google.com/maps/place/Monte+Bravo+Barbershop/@41.8056038,-6.760175,17z/data=!3m1!4b1!4m6!3m5!1s0xd3a49fa79b85ad5:0x2380f1df262ec906!8m2!3d41.8056038!4d-6.760175!16s%2Fg%2F11md44b1lx";
