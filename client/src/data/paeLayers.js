/*
  - Layers that starts with the configured workspace will be rendered as WMS tile layers;
  - Layers that starts with 'paeData' will be rendered as GeoJSON using
    the data loaded and parsed on main component 'LandingPage' 'paeLayersData'
    state prop.
*/

export default [
  {
    id: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:pln_planicieinundavel`,
    name: 'Planície inundável',
    color: '#BEB297'
  },
  {
    id: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:zas_zonaautossalvamento`,
    name: 'Zona de auto salvamento',
    color: '#F3A5B2'
  },
  {
    id: 'paeData:rota-de-evacuacao',
    name: 'Rota de evacuação',
    color: '#333'
  },
  {
    id: 'paeData:lista-de-agentes',
    name: 'Lista de agentes',
    color: '#D35400'
  },
  {
    id: 'paeData:cadastro-identificado',
    name: 'Cadastro identificado',
    color: '#16A085'
  },
];
