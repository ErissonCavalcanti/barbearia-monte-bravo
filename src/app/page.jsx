import Banner from './componentes/banner.jsx';
import Equipe from './componentes/equipe.jsx';
import Sobre from './componentes/sobre.jsx';
import Marcacao from './componentes/marcacao.jsx';
import Footer from './componentes/footer.jsx';
import Contatos from './componentes/contatos.jsx';
import Pote from './componentes/pote.jsx';
import Servicos from './componentes/servicos.jsx';
import Avaliacoes from './componentes/avaliacoes.jsx';
import Carregamento from './componentes/carregamento.jsx';
import DadosEstruturados from './componentes/dadosEstruturados.jsx';

export default function Home() {
  return (
    <main>
        <DadosEstruturados />
        <Carregamento />
        <Banner />
        <Sobre />
        <Equipe />
        <Servicos />
        <Avaliacoes />
        <Marcacao />
        <Pote />
        <Contatos />
        <Footer />
    </main>
  );
}
