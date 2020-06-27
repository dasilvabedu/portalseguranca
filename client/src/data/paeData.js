export default [
  {
    id: 'saiba-o-que-fazer',
    title: 'Saiba o que fazer',
    layerType: 'single',
    layerId: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:pln_planicieinundavel`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    id: 'rota-de-evacuacao',
    title: 'Rota de evacuação',
    layerType: 'multi',
    layers: [
      {
        layerId: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:trechos_de_rotas_de_evacuacao`,
        titleKey: 'tro_logradouro',
        color: '#333',
        dataList: [
          { label: 'Logradouro', key: 'tro_logradouro' },
        ],
      },
      {
        layerId: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:pontos_de_seguranca`,
        titleKey: 'pns_identificacao',
        color: '#333',
      },
    ]
  },
  {
    id: 'lista-de-agentes',
    title: 'Lista de agentes',
    layerType: 'single',
    layerId: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:agentes_externos`,
    titleKey: 'age_identificacao',
    color: '#D35400',
    dataList: [
      { label: 'Tipo', key: 'age_tipo' },
      { label: 'Endereço', key: 'age_endereco' },
    ],
  },
  {
    id: 'cadastro-identificado',
    title: 'Cadastro identificado',
    layerType: 'single',
    layerId: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:pro_propriedade`,
    titleKey: 'pro_proprietario',
    color: '#16A085',
    dataList: [
      { label: 'Tipo', key: 'pro_tipo' },
      { label: 'Endereço', key: 'pro_endereco' },
    ],
  },
  // The item below is used only to load '<workspace>:zas_zonaautossalvamento' layer data
  // on PAE data loading
  {
    layerType: 'single',
    layerId: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:zas_zonaautossalvamento`,
  },
];
