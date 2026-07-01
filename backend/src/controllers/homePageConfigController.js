const HomePageConfig = require('../models/HomePageConfig');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Obter configuração da Home (Público)
// @route   GET /api/homepage-config
const getHomeConfig = asyncHandler(async (req, res) => {
  let config = await HomePageConfig.findOne({ name: 'DEFAULT_HOME' });
  
  if (!config) {
    // Inicialização de Elite se não existir
    config = await HomePageConfig.create({
      name: 'DEFAULT_HOME',
      sections: [
        { id: 'hero', isVisible: true, title: '{{gradient:from-green-600 to-teal-600}}Aplicação Modelo{{/gradient}}', subtitle: 'A plataforma demonstrativa para gestão e cadastro de pets e unidades.', order: 1 },
        { id: 'forms', isVisible: true, title: 'Cadastro Voluntário', subtitle: 'Registre-se como tutor e adicione seus PETs.', order: 2 },
        { id: 'news', isVisible: true, title: 'Últimas {{color:green-600}}Notícias{{/color}}', subtitle: 'Fique por dentro das notícias e comunicados.', order: 3 },
        { id: 'transparency', isVisible: true, title: 'Transparência', subtitle: 'Dados e relatórios públicos sobre a aplicação.', order: 4 }
      ]
    });
  }

  res.status(200).json({ success: true, data: config });
});

// @desc    Atualizar configuração da Home (Admin)
// @route   PUT /api/homepage-config
const updateHomeConfig = asyncHandler(async (req, res) => {
  const config = await HomePageConfig.findOneAndUpdate(
    { name: 'DEFAULT_HOME' },
    req.body,
    { new: true, runValidators: true, upsert: true }
  );

  res.status(200).json({ success: true, data: config });
});

module.exports = {
  getHomeConfig,
  updateHomeConfig
};
