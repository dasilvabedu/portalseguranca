import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import LayersIcon from '@material-ui/icons/Layers';
import MapIcon from '@material-ui/icons/Map';
import Paper from '@material-ui/core/Paper';

import baseMaps from '../../../../data/baseMaps';
import paeLayers from '../../../../data/paeLayers';

import styles from './MapLayersBox.module.scss';

const DEFAULT_VISIBLE_CONTENT = ['paeLayers', 'baseMaps'];

export default function MapLayersBox({
  activeBaseMap,
  activePAE,
  activeLayers = [],
  onLayersChange = () => {},
  onBaseMapChange = () => {}
}) {
  const isMobile = useMediaQuery('(max-width: 420px)');
  const [visibleContentList, setVisibleContentList] = useState(isMobile ? [] : DEFAULT_VISIBLE_CONTENT);

  useEffect(() => {
    setVisibleContentList(isMobile ? [] : DEFAULT_VISIBLE_CONTENT);
  }, [isMobile]);

  const handleBaseMapChange = (id) => {
    onBaseMapChange(id);
  };

  const getActiveLayer = (id) => {
    return _.find(activeLayers, layerId => layerId === id);
  };

  const handleLayerChange = (id) => {
    let nextActiveLayers = _.cloneDeep(activeLayers);

    if (getActiveLayer(id)) {
      nextActiveLayers = _.filter(
        nextActiveLayers,
        layerId => layerId !== id
      );
    } else {
      nextActiveLayers = _.concat(nextActiveLayers, id);
    }

    onLayersChange(nextActiveLayers);
  };

  const isContentVisible = (contentKey) => {
    return _.includes(visibleContentList, contentKey);
  };

  const toggleContent = (contentKey) => {
    let nextItems = _.clone(visibleContentList);

    if (isContentVisible(contentKey)) {
      nextItems = _.filter(nextItems, (item) => item !== contentKey);
    } else {
      nextItems = _.concat(nextItems, contentKey);
    }

    setVisibleContentList(nextItems);
  };

  return (
    <Paper className={ styles.wrapper }>
      <Collapse in={ !!activePAE }>
        <div className={ styles.dataSection }>
          <h2 className={ styles.title }>
            <LayersIcon />
            <span>Camadas</span>
            <IconButton
              size="small"
              className={ styles.toggleButton }
              onClick={ toggleContent.bind(this, 'paeLayers') }
            >
              { isContentVisible('paeLayers') ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
            </IconButton>
          </h2>
          <Collapse in={ isContentVisible('paeLayers') }>
            <ul className={ styles.list }>
              { paeLayers.map((layer) => {
                return (
                  <li
                    key={ `map-layer-${ layer.id }` }
                    className={ styles.listItem }
                  >
                    <FormControlLabel
                      classes={{
                        root: styles.checkboxButtonRoot,
                        label: styles.checkboxButtonLabel
                      }}
                      control={
                        <Checkbox
                          checked={ !!getActiveLayer(layer.id) }
                          className={ styles.checkboxButtonIcon }
                          onChange={ handleLayerChange.bind(this, layer.id) }
                          value={ layer.id }
                          color="primary"
                          size="small"
                          icon={ <CheckBoxOutlineBlankIcon fontSize="small" /> }
                          checkedIcon={ <CheckBoxIcon fontSize="small" /> }
                        />
                      }
                      label={
                        <span className={ styles.layerControlLabel }>
                          <span style={ { backgroundColor: layer.color } } />
                          <span>{ layer.name }</span>
                        </span>
                      }
                    />
                  </li>
                );
              }) }
            </ul>
          </Collapse>
        </div>
      </Collapse>
      <div>
        <h2 className={ styles.title }>
          <MapIcon />
          <span>Mapa Base</span>
          <IconButton
            size="small"
            className={ styles.toggleButton }
            onClick={ toggleContent.bind(this, 'baseMaps') }
          >
            { isContentVisible('baseMaps') ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
          </IconButton>
        </h2>
        <Collapse in={ isContentVisible('baseMaps') }>
          <ul className={ styles.list }>
            { baseMaps.map((baseMap) => {
              return (
                <li
                  key={ `base-map-${ baseMap.id }` }
                  className={ classnames(styles.listItem, {
                    [styles.listItemActive]: baseMap.id === activeBaseMap
                  }) }
                  onClick={ handleBaseMapChange.bind(this, baseMap.id) }
                >
                  { baseMap.name }
                </li>
              );
            }) }
          </ul>
        </Collapse>
      </div>
    </Paper>
  );
}
