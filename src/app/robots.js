// Gera o /robots.txt: permite que os motores de busca indexem todo o site
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
