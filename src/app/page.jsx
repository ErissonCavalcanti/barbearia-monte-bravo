import Banner from './componentes/banner.jsx';
import Equipe from './componentes/equipe.jsx';
import Sobre from './componentes/sobre.jsx';
import Marcacao from './componentes/marcacao.jsx';

export default function Home() {
  return (
    <main>
        <Banner />
        <Sobre />
        <Equipe />  
        <Marcacao />
    </main>
  );
}
