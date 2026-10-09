import Banner from './componentes/banner.jsx';
import Equipe from './componentes/equipe.jsx';
import Sobre from './componentes/sobre.jsx';
import Marcacao from './componentes/marcacao.jsx';
import Footer from './componentes/footer.jsx';
import Contatos from './componentes/contatos.jsx';
import Pote from './componentes/pote.jsx';

export default function Home() {
  return (
    <main>
        <Banner />
        <Sobre />
        <Equipe />  
        <Marcacao />
        <Pote />
        <Contatos />
        <Footer />
    </main>
  );
}
