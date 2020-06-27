import React, { useEffect, useRef, useState } from 'react';
import {
  GeoJSON,
  Map,
  Marker,
  ScaleControl,
  TileLayer,
  WMSTileLayer,
  ZoomControl
} from 'react-leaflet';
import { BoxZoomControl } from 'react-leaflet-box-zoom';
import _ from 'lodash';
import L from 'leaflet';
import classnames from 'classnames';
import ReactDOMServer from 'react-dom/server';

import CircularProgress from '@material-ui/core/CircularProgress';
import ReplayIcon from '@material-ui/icons/Replay';
import Tooltip from '@material-ui/core/Tooltip';

import MapCustomEvents from './components/MapCustomEvents';
import MapPAEPopup from './components/MapPAEPopup';

import baseMapsData from '../../../../data/baseMaps';
import paeData from '../../../../data/paeData';

import styles from './MapCanvas.module.scss';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const HEADER_HEIGHT = 50;
const FOOTER_HEIGHT = 30;
const EXTERNAL_ELEMENTS_HEIGHT = HEADER_HEIGHT + FOOTER_HEIGHT;

const CONFIG_DEFAULT = {
  lat: -14.392118083661728,
  lng: -56.25000000000001,
  zoom: 4,
  minZoom: 4,
  maxZoom: 19
};

const defaultLayers = [
  {
    key: 'states',
    name: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:unidades_federativas`
  },
  {
    key: 'cities',
    name: `${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:mun_municipio`
  },
];

export default function MapCanvas({
  mapRef,
  activeFeature,
  activeLayers,
  activeLocation,
  activePAE,
  baseMap,
  damData,
  flyTo,
  isLoading,
  headerOverlayContentIsVisible,
  paeLayersData,
  onViewPAE = () => {},
  onFlyComplete = () => {},
}) {
  let zoomControlRef = useRef();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight - EXTERNAL_ELEMENTS_HEIGHT);

  useEffect(() => {
    if (!activePAE) {
      mapRef.current.leafletElement.setView([CONFIG_DEFAULT.lat, CONFIG_DEFAULT.lng], CONFIG_DEFAULT.zoom);
    }
  }, [activePAE]);

  useEffect(() => {
    if (flyTo) {
      if (!_.get(flyTo, 'feature')) {
        if (_.isArray(_.first(flyTo))) {
          mapRef.current.leafletElement.fitBounds(flyTo);
        } else {
          mapRef.current.leafletElement.setView(flyTo, 17);
        }
      } else {
        const { feature, coordinates, zoom } = flyTo;
        mapRef.current.leafletElement.setView(coordinates, zoom || 17);

        const componentString = ReactDOMServer.renderToString(<MapPAEPopup feature={ feature } />);
        L.popup({
            offset: [0, -28]
          })
          .setLatLng(coordinates)
          .setContent(componentString)
          .openOn(mapRef.current.leafletElement);

        handlePopupOpen();
      }
      onFlyComplete();
    }
  }, [flyTo]);

  function updateHeight() {
    setWindowHeight(window.innerHeight - EXTERNAL_ELEMENTS_HEIGHT);
  }
  const debouncedUpdateHeight = _.debounce(updateHeight, 500);

  useEffect(() => {
    window.addEventListener('resize', debouncedUpdateHeight);

    return () => {
      window.removeEventListener('resize', debouncedUpdateHeight)
    };
  }, []);

  const stopZoomControl = () => {
    if (zoomControlRef.current) {
      zoomControlRef.current.stop();
    }
  };

  const onEachPAEFeature = (feature, layer) => {
    const componentString = ReactDOMServer.renderToString(<MapPAEPopup feature={ feature } />);
    layer.bindPopup(componentString);
  };

  const onEachInfoLayerFeature = (titleKey, feature, layer) => {
    const text = _.toString(feature.properties[titleKey]);
    layer.bindTooltip(text, { direction: 'top' });
  };

  const handlePopupOpen = () => {
    setTimeout(() => {
      const paeButton = document.getElementById('popup-pae-button');

      if (paeButton) {
        paeButton.removeEventListener('click', handlePopupPAEButtonClick);
        paeButton.addEventListener('click', handlePopupPAEButtonClick);
      }
    }, 500);
  };

  const handlePopupPAEButtonClick = (event) => {
    const paeId = event.srcElement.dataset.paeid;
    const activePAEFeature = _.find(damData.features, (feature) =>
      feature.properties.pae_id === Number(paeId)
    );

    setTimeout(() => {
      mapRef.current.leafletElement.closePopup();
    }, 500);

    onViewPAE(activePAEFeature);
  };

  const handleReset = () => {
    mapRef.current.leafletElement.setView([CONFIG_DEFAULT.lat, CONFIG_DEFAULT.lng], CONFIG_DEFAULT.zoom);
  };

  const renderPAEGeoJSONLayer = (props, index) => {
    const data = _.get(paeLayersData, props.layerId);
    const activeFeatureLabel = activeFeature ? activeFeature : '';

    return (
      <GeoJSON
        key={ `layer-${ props.layerId }-${ activePAE.properties.pae_id }-${ activeFeatureLabel }` }
        data={ data.geojson }
        pointToLayer={ (feature, latlng) => {
          return new L.circleMarker(latlng, {
            fillColor: activeFeature === feature.id ? '#00A8FF' : props.color,
            fillOpacity: 1,
            radius: 5,
            stroke: false
          });
        } }
        style={ (feature) => {
          return {
            color: activeFeature === feature.id ? '#00A8FF' : (props.color || '#576574')
          };
        } }
        zIndex={ 310 + index }
        onEachFeature={ onEachInfoLayerFeature.bind(this, props.titleKey) }
      />
    );
  };

  const baseMapData = baseMapsData.find((item) => item.id === baseMap);

  return (
    <Map
      ref={ mapRef }
      className={ classnames(styles.mapWrapper, {
        [styles.hasControlsPaddingTop]: headerOverlayContentIsVisible
      }) }
      center={ [CONFIG_DEFAULT.lat, CONFIG_DEFAULT.lng] }
      zoom={ CONFIG_DEFAULT.zoom }
      minZoom={ CONFIG_DEFAULT.minZoom }
      maxZoom={ CONFIG_DEFAULT.maxZoom }
      style={{ height: windowHeight }}
      zoomControl={ false }
      onpopupopen={ handlePopupOpen }
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={ baseMapData.url }
      />
      { damData &&
        <GeoJSON
          data={ damData }
          onEachFeature={ onEachPAEFeature }
        />
      }
      { _.map(defaultLayers, (layer, index) => {
        return (
          <WMSTileLayer
            key={ `layer-${ layer.key }` }
            transparent
            format="image/png"
            layers={ layer.name }
            url={ `${process.env.REACT_APP_GEOSERVER_BASE_URL}/gwc/service/wms` }
            zIndex={ 200 + index }
          />
        );
      }) }
      { activePAE && !_.isEmpty(activeLayers) &&
        _.map(activeLayers, (layerId, index) => {
          if (!_.includes(layerId, 'paeData')) {
            return (
              <WMSTileLayer
                key={ `layer-${ layerId }` }
                transparent
                format="image/png"
                layers={ layerId }
                url={ `${ process.env.REACT_APP_GEOSERVER_BASE_URL }/${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }/ows` }
                cql_filter={ `pae_identificador = ${ activePAE.properties.pae_id }` }
                zIndex={ 300 + index }
                opacity={ 0.65 }
              />
            );
          } else {
            const parsedLayerId = layerId.replace(/paeData:/g, '');
            const paeLayerProps = _.find(paeData, { id: parsedLayerId });

            if (paeLayerProps.layerId) {
              return renderPAEGeoJSONLayer(paeLayerProps, index);
            } else {
              return _.map(paeLayerProps.layers, (layer, index) => {
                return renderPAEGeoJSONLayer(layer, index);
              });
            }
          }
        })
      }
      <ZoomControl position="topright" />
      <BoxZoomControl
        position="topright"
        ref={ zoomControlRef }
        sticky={ true }
        style={{
          width: '32px',
          height: '32px',
          marginRight: '10px',
          marginTop: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          borderRadius: '4px',
          border: '1px solid rgba(0,0,0,0.2)',
          backgroundColor: 'white',
          backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADT0lEQVRIS+WVT2hcVRTGv+9N0plmYa0FSVtBC4KbCiIUtKK0FLuUUrrqpq0UN5qYLubeNxNhnEXCPS8Tg60IRakoCN3YoiAIgtqNuHBRcWcFa/3XYhSbKkzGN+/IDZnhMXkzbxKoFXzLd75zfufcc8+5xB36eIe46IKttZcAPJVKZHFkZOTRmZmZH4wxFZIzwIr+b1U9EkXRB9Zar/8IwOaOH8nXnXPP5xWUBmuPuJUkye65ubkr1tpXAJxK2Y+JyDvGmGdIvt/j95WIPLIR8JMkf1xeXl5aWFj43Qeo1WpBs9m8j2SQJEkriqKfO4HL5fJ4oVAoATioqmcBbAxMcpdz7mpexr12Y8whkhc3Ar4OYGur1dreqXQ98Eql8niSJJ8D+FhEDub5dntcrVa3t1qtUqPR+C7PqZ+9Wq3uHh0dvVav15fyYvwnxuklAOOlUmmyXq8ngzKuVCrb2u227+kTAO5V1SWSl0lecM59m1ett6fHycMYx/ED8/Pz3/dxpjHmRZIvA9iSoWkDONdut081Go2/BiWwZo4H3Gpaa98E8OwQFV0GsE9EbvbTpsFNAMVCobBjdnb2l4xxmST56hDQjuSiiBzOBYdh6BfAPSJyvlc8NTV1d7FY9LO95nhJnlbVySwAyf3Ouc8ybcNUEIbhcVV9K0srIr4Fvet2RUrybefc8YHgQRUbY86SfC4jwC0Ructa+yuAbenLuqr9RkQeGgi21vbtsbXWr8JDqQBviMiaRKy1RwG8m9L9ISJb88Arx5V1q6215wCcyAiwJCJbVpPelFHxVRHZNRQYQJnkIoDrzjn/1sJaOwHgdEYAFZHAWruyAzLs74nIkWHBXZ2q7omi6Mvp6emdcRz7HT7aE0RV9QWSr2WBSR52zvk2rfm6WRpjXBAEj3UUqrqoqieiKLrl/xljIpLlYaZgVfOFiOwFkH3jhw1Uq9U2NZtNf/T7h/EhecA590k/7bpep4mJieLY2NgZACf79NRzYgAjAH4iua/fo7EucCd7a+3DqnoMwF6S4wD+XH2dzsdxfCUIgk8B7BwE3xA476jDMHxQVf2q9PAbAJ4Wka/TfrcF7AE98Gsicv+/Ak7BP1TV36Io8je8+922ivPa8f8D/wPYO2EuFDkvMQAAAABJRU5ErkJggg==)',
          backgroundSize: '80%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          outline: 'none',
          cursor: 'pointer',
        }}
        activeStyle={{
          backgroundColor: '#F4F4F4',
          backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADiElEQVRIS8WVXWgUVxTH/+eOa5IHjVaQ2AhWEApiqTurUlMqSjHJ3qU1iE++qKX0xZrigw/qThi8m9JKEfxAkIpioSCFNvRjZwOKrQ9aRXN3a9+qUD/aqhiljRbUzcwps7jJdHd2ZxPQzOOc/zm/c+45517CFH00RVyMgc0+5ywYqwKJDBueYV7q77qVSGd3MlE/UNIXmWlDPpP8Lr47u4oEDQJoGffjw1qltkYVNA62HK4QP/XYXVLIvHPV7MvuA9P2sp2BTXklv4inc+8S8bf/9+NftEotnTCYPHrLjeGPFtDIz3b3g1IA2xYJNue7FBME42ne7vyrHHi5nW0rQjQLF50AHwEmCfYMWliwk9ejMq60J9JODxMGJgyOW84dAmY3GWLeWKUToMet3EoCn2fgVF7JzijXsR4ndg3OKwpqvpLp+j3KqZZ9mf3DEgPi5kVbjkTFmPp1ilu5NBHatLjYC9v26mW8YufpOcVYsYc8fhPEc4kxwkQFGOIbbXdfi6rWtwfXyYcRe/xKvj91I9yZybRyH/lzDqA1ROOCcWz0sbH9ymdd/9ZLoGqPa091CXoUwHtRFRGjgGJs9dCna/+ppQ2CHwNoIle8PPRx9+2qdbFyvQzeHwUN2Ae0kusjwYm00+kRvZRXyZOV4qX2wCzhNvm7XXW8DD5AoN4wgGBaczmT/CnM1tBUm1ZuM8DHwwJoJcmsvm5LUmacyGfk5rrgehWblnMEwAchAR5qJWealnMPwJzgsD6b3N+GlHy1Lti0nJo9Ni1nAEDPWADG5zojqxJJWNmNDPoyAPpbKzk7Clx6ncKm2kw7x0DYEhJgRCvZ+izp6ZUVA7iulVzYEJiAHQwaBnt3dCblv7WIp51tRDgQEoC1ksK0nNIdEGL/Wiu5oSFwUMQeL8/3py6/vvv7dkMY/h0eqwjCBPqQwYdCwUTr9Z6k36aqb/yR6HM+YcYbAcVwy5PilnN71z30/5l92b1g2tHwHhMu6D3JDv8ynPQ6+Y6L7a+mN7szBgFe0xCc8bbOyDO1tA3tcdl50TanaWYrDoLwfo2e+tJRANMA/AlDrK71aEwIXE4gYWVf84g2EaODwG0MegSmggBOjmL0qiDjRwDt9eCTAkcdtWkPLoLr+VdlOwN3BXjtkEr9GvR7LuDSMAbgAG5qJRe8EHAZTq6XZeC+VrLjhYHrteS5HXXUHEwZ+D9VP2gu5nAsRQAAAABJRU5ErkJggg==)'
        }}
      />
      <Tooltip title="Resetar mapa" placement="left">
        <button
          className={ styles.resetButton }
          onClick={ handleReset }
        >
          <ReplayIcon />
        </button>
      </Tooltip>
      <ScaleControl imperial={ false } position="bottomright" />
      <MapCustomEvents
        onZoomStart={ stopZoomControl }
        onEsc={ stopZoomControl }
      />
      { activeLocation &&
        <Marker position={ activeLocation } />
      }
      { isLoading &&
        <div className={ styles.loadingWrapper }>
          <CircularProgress />
        </div>
      }
    </Map>
  );
}
