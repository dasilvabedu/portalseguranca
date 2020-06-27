export default function getGeoServerLayer(name, paeId) {
  let url = `${ process.env.REACT_APP_GEOSERVER_BASE_URL }/${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${ name }&outputFormat=application%2Fjson`;

  if (paeId) {
    url += `&cql_filter=pae_identificador=${ paeId }`;
  }

  return fetch(url)
    .then(resp => resp.json());
}
