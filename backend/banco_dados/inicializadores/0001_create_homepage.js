const path = require('path');
const backendSrc = path.join(__dirname, '../../src');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../../.env') });

require(path.join(backendSrc, 'models', 'HomePageConfig'));
const HomePageConfig = mongoose.model('HomePageConfig');

async function ensureDefaultHomepage() {
  console.log('[Homepage Init] Garantindo configuração padrão da Home Page...');

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const homeConfig = await HomePageConfig.findOne({ name: 'DEFAULT_HOME' });
    if (!homeConfig) {
      await HomePageConfig.create({
        name: 'DEFAULT_HOME',
        sections: [
          { id: 'hero', isVisible: true, title: 'Aplicação Modelo: {{gradient:from-emerald-600 to-teal-600}}Exemplo de Boilderplate{{/gradient}}', subtitle: 'Demonstração de uma plataforma para gestão de cadastros e unidades.', order: 1 },
          { id: 'feed', isVisible: true, title: 'Comunidade', subtitle: 'Notícias e atualizações.', order: 2 },
          { id: 'lost_pets', isVisible: true, title: 'Alerta Comunitário', subtitle: 'Registre e acompanhe notificações.', order: 3 },
          { id: 'benefits', isVisible: true, title: 'Por que usar esta solução?', subtitle: 'A Aplicação Modelo é um ponto de partida para sistemas de gestão.', order: 4 },
          { id: 'stats', isVisible: true, title: 'Portal da Transparência', subtitle: 'Dados e relatórios públicos.', order: 5 },
          { id: 'adoption', isVisible: true, title: 'Módulo de Exemplo: Adoção', subtitle: 'Demonstração de fluxo de adoção (exemplo).', order: 6 },
          { id: 'institutional', isVisible: true, title: 'Aplicação Exemplo', subtitle: 'Um esqueleto funcional para começar seu projeto.', order: 7 }
        ],
        footer: { text: 'Plataforma de Demonstração', address: 'Cidade Exemplo', phone: '(00) 0000-0000', links: [{ label: 'Privacidade', url: '/privacy' }, { label: 'Termos', url: '/terms' }] }
      });
      console.log('[Homepage Init] Configuração inicial da Homepage criada.');
    } else {
      console.log('[Homepage Init] Configuração DEFAULT_HOME já existe. Nada a fazer.');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Homepage Init] Erro:', err.message || err);
    if (mongoose.connection && mongoose.connection.close) await mongoose.connection.close();
    process.exit(1);
  }
}

ensureDefaultHomepage();
