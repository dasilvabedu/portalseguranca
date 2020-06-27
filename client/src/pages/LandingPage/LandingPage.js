import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import * as turf from '@turf/turf';

import BasePage from '../../layout/BasePage';

import InfoBox from './components/InfoBox';
import MapCanvas from './components/MapCanvas';
import MapLayersBox from './components/MapLayersBox';
import StatusBox from './components/StatusBox';

import getGeoServerLayer from '../../helpers/getGeoServerLayer';
import paeData from '../../data/paeData';
import paeLayers from '../../data/paeLayers';

function getBoundingBox(geojson) {
  const bboxValue = turf.bbox(geojson);
  return [[bboxValue[1], bboxValue[0]], [bboxValue[3], bboxValue[2]]];
}

const defaultActivePAELayers = _.map(paeLayers, 'id');

function checkIfPointIsInsidePolygon(point, polygon) {
  const pt = turf.point(point);

  return turf.booleanPointInPolygon(pt, polygon);
}

export default function LandingPage() {
  let mapRef = useRef();
  const [damData, setDamData] = useState(null);
  const [headerOverlayContentIsVisible, setHeaderOverlayContentIsVisible] = useState(false);
  const [state, setState] = useState({
    activeLocation: null,
    activePAE: null,
    activeInfo: null,
    activeFeature: null,
    activeLayers: defaultActivePAELayers,
    baseMap: 3,
    flyTo: null,
    isLoading: true,
    paeLayersData: null
  });

  useEffect(() => {
    getGeoServerLayer(`${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:barragens`)
      .then(data => {
        if (data) {
          setDamData(turf.toWgs84(data));
          setState({
            ...state,
            isLoading: false
          });
        }
      });
  }, []);

  const handleStateChange = (paramKey, paramValue) => {
    setState({
      ...state,
      [paramKey]: paramValue
    });
  };

  const handleZoomIntoPae = (feature) => {
    setState({
      ...state,
      activeInfo: null,
      activePAE: null,
      flyTo: {
        feature,
        coordinates: _.reverse(_.cloneDeep(_.get(feature, 'geometry.coordinates'))),
        zoom: 12
      },
    });
  };

  const handleViewPae = (data) => {
    handleStateChange('isLoading', true);
    const paeLayersDataRequests = _(paeData)
      .map((item) => {
        if (item.layerId) {
          return {
            baseData: item,
            request: getGeoServerLayer(item.layerId, data.properties.pae_id)
          };
        } else {
          return _.map(item.layers, (layer) => {
            return {
              baseData: layer,
              request: getGeoServerLayer(layer.layerId, data.properties.pae_id)
            };
          });
        }
      })
      .flatten()
      .value();
    const layersPromises = _.map(paeLayersDataRequests, 'request');
    const paeLayersData = {};

    Promise.all(layersPromises)
      .then((geojsons) => {
        _.each(geojsons, (geojson, index) => {
          const paeLayerDataRequest = paeLayersDataRequests[index];
          const baseData = paeLayerDataRequest.baseData;
          const convertedGeoJSON = turf.toWgs84(geojson);
          let dataParsed = null;

          if (baseData.titleKey) {
            dataParsed = _.map(convertedGeoJSON.features, (feature) => {
              return getParsedFeature(geojson, baseData, feature);
            });
          }

          const bboxParsed = getBoundingBox(convertedGeoJSON);

          paeLayersData[baseData.layerId] = {
            geojson: convertedGeoJSON,
            dataParsed,
            bbox: bboxParsed
          };
        });

        const wrapperLayer = paeLayersData[`${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:pln_planicieinundavel`];
        const bboxParsed = getBoundingBox(wrapperLayer.geojson);

        setState({
          ...state,
          activeInfo: null,
          activePAE: data,
          flyTo: bboxParsed,
          isLoading: false,
          paeLayersData
        });
      });
  }

  const handleStatusBoxClose = () => {
    setState({
      ...state,
      activePAE: null,
      activeInfo: null,
      activeLocation: null
    });
  };

  const handleActiveFeatureChange = (data) => {
    setState({
      ...state,
      activeFeature: data.id,
      flyTo: data.coordinates
    });
  };

  const handleActiveFeatureReset = () => {
    setState({
      ...state,
      activeFeature: null,
      flyTo: null
    });
  };

  const handleFlyComplete = () => {
    setState({
      ...state,
      flyTo: null
    });
  };

  const getParsedFeature = (geojson, layerData, feature) => {
    let coordinates;

    if (feature.geometry.type === 'Point') {
      coordinates = _.reverse(_.clone(_.get(feature.geometry, 'coordinates')));
    } else {
      const geojsonClone = _.cloneDeep(geojson);
      geojsonClone.totalFeatures = 1;
      geojsonClone.features = [_.cloneDeep(feature)];

      coordinates = getBoundingBox(geojsonClone);
    }

    return {
      id: feature.id,
      title: _.get(feature.properties, layerData.titleKey),
      coordinates,
      data: _.map(layerData.dataList, (item) => {
        return {
          label: item.label,
          value: _.get(feature.properties, item.key)
        };
      })
    };
  };

  const handleInfoChange = (data) => {
    const { paeLayersData } = state;
    let nextActiveLayers = _.cloneDeep(state.activeLayers);
    let dataParsed, flyTo;

    if (data.layerType === 'single') {
      const layerData = paeLayersData[data.layerId];

      dataParsed = layerData.dataParsed;
      flyTo = layerData.bbox;
    } else {
      const layersData = _.map(data.layers, (item) => paeLayersData[item.layerId]);

      dataParsed = _.flatten(_.map(layersData, 'dataParsed'));
      flyTo = _.first(layersData).bbox;
    }

    if (data.id !== 'saiba-o-que-fazer') {
      nextActiveLayers = _.uniq(_.concat(nextActiveLayers, [`paeData:${ data.id }`]));
    }

    setState({
      ...state,
      activeLayers: nextActiveLayers,
      activeInfo: {
        ...data,
        dataParsed
      },
      flyTo
    });
  };

  const handleLocationChange = (data) => {
    if (!data) {
      setState({
        ...state,
        activeLocation: null
      });

      return;
    }

    const { location, viewport } = data;

    const bbox = [
      [viewport.northeast.lat, viewport.northeast.lng],
      [viewport.southwest.lat, viewport.southwest.lng],
    ];
    const selfRescueZoneData = state.paeLayersData[`${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:zas_zonaautossalvamento`];
    const floodPlainData = state.paeLayersData[`${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:pln_planicieinundavel`];

    const selfRescueZoneGeometry = selfRescueZoneData.geojson.features[0].geometry;
    const floodPlainGeometry = floodPlainData.geojson.features[0].geometry;

    const pointCoordinates = [location.lng, location.lat];
    let pointType = null;

    if (checkIfPointIsInsidePolygon(pointCoordinates, selfRescueZoneGeometry)) {
      pointType = 'selfRescueZone';
    } else if (checkIfPointIsInsidePolygon(pointCoordinates, floodPlainGeometry)) {
      pointType = 'floodPlain';
    } else {
      pointType = 'outOfRisk';
    }

    setState({
      ...state,
      activeLocation: {
        coordinates: _.reverse(_.clone(pointCoordinates)),
        type: pointType
      },
      flyTo: bbox
    });
  };

  return (
    <BasePage
      mapRef={ mapRef }
      activePAE={ state.activePAE }
      onPAEAutocompleteChange={ handleZoomIntoPae }
      onLocationAutocompleteChange={ handleLocationChange }
      onOverlayContentVisibilityChange={ setHeaderOverlayContentIsVisible }
    >
      <MapCanvas
        activeFeature={ state.activeFeature }
        activeLayers={ state.activeLayers }
        activeLocation={ state.activeLocation ? state.activeLocation.coordinates : null }
        activePAE={ state.activePAE }
        baseMap={ state.baseMap }
        damData={ damData }
        flyTo={ state.flyTo }
        isLoading={ state.isLoading }
        headerOverlayContentIsVisible={ headerOverlayContentIsVisible }
        paeLayersData={ state.paeLayersData }
        onViewPAE={ handleViewPae }
        onFlyComplete={ handleFlyComplete }
        mapRef={ mapRef }
      />
      <StatusBox
        data={ state.activePAE }
        headerOverlayContentIsVisible={ headerOverlayContentIsVisible }
        location={ state.activeLocation }
        onClose={ handleStatusBoxClose }
        onLinkClick={ handleInfoChange }
      />
      <MapLayersBox
        activeBaseMap={ state.baseMap }
        activePAE={ state.activePAE }
        activeLayers={ state.activeLayers }
        onLayersChange={ handleStateChange.bind(this, 'activeLayers') }
        onBaseMapChange={ handleStateChange.bind(this, 'baseMap') }
      />
      <InfoBox
        data={ state.activeInfo }
        onClose={ handleStateChange.bind(this, 'activeInfo', null) }
        onFeatureChange={ handleActiveFeatureChange }
        onFeatureReset={ handleActiveFeatureReset }
      />
    </BasePage>
  )
}
