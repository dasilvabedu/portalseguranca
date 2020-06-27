import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './InfoBox.module.scss';

export default function InfoBox({
  data,
  onClose = () => {},
  onFeatureChange = () => {},
  onFeatureReset = () => {},
}) {
  const [isOpen, setIsOpen] = useState(!!data);
  const [isVisible, setIsVisible] = useState(true);
  const [activeDataItem, setActiveDataItem] = useState(null);

  useEffect(() => {
    setIsOpen(!!data);
  }, [data]);

  const handleActiveDataItemChange = (id) => {
    if (id === activeDataItem) {
      setActiveDataItem(null);
      onFeatureReset();
    } else {
      setActiveDataItem(id);
    }
  };

  const handleActiveFeatureChange = (data) => {
    setActiveDataItem(data.id);
    onFeatureChange(data);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Fade in={ isOpen } onExited={ onClose }>
      <Paper className={ styles.wrapper }>
        <h2 className={ styles.title }>{ _.get(data, 'title') }</h2>
        <IconButton
          size="small"
          className={ styles.toggleButton }
          onClick={ toggleVisibility }
        >
          { isVisible ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
        </IconButton>
        <IconButton
          size="small"
          className={ styles.closeButton }
          onClick={ handleClose }
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Collapse in={ isVisible }>
          <div className={ styles.content }>
            { _.get(data, 'description') && <p>{ _.get(data, 'description') }</p> }
            { _.get(data, 'dataParsed') &&
              <ul className={ styles.dataList }>
                { _.map(_.sortBy(_.get(data, 'dataParsed'), 'title'), (item, index) => {
                  return (
                    <li
                      key={ `data-list-${ _.get(data, 'id') }-${ item.id }` }
                      className={ styles.dataListItem }
                    >
                      <div className={ styles.dataListItemHeader }>
                        <span
                          className={ classnames(styles.dataListItemTitle, {
                            [styles.dataListItemTitleActive]: activeDataItem === item.id
                          }) }
                        >
                          { item.title }
                        </span>
                        { item.data && !_.isEmpty(item.data) &&
                          <Tooltip title="Visualizar informações">
                            <IconButton
                              size="small"
                              color={ activeDataItem === item.id ? 'primary' : 'default' }
                              className={ styles.dataListItemInfoButton }
                              onClick={ handleActiveDataItemChange.bind(this, item.id) }
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        { item.coordinates &&
                          <Tooltip title="Visualizar localização">
                            <IconButton
                              size="small"
                              className={ styles.dataListItemLocationButton }
                              onClick={ handleActiveFeatureChange.bind(this, item) }
                            >
                              <MyLocationIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                      </div>
                      <Collapse in={ activeDataItem === item.id }>
                        <ul className={ styles.infoList }>
                          { _.map(item.data, (info) => {
                            return (
                              <li
                                key={ `data-list-${ _.get(data, 'id') }-${ item.id }-info-${ info.label }` }
                                className={ styles.infoListItem }
                              >
                                <span className={ styles.infoListItemLabel }>{ info.label }</span>
                                <b className={ styles.infoListItemValue }>{ info.value }</b>
                              </li>
                            );
                          }) }
                        </ul>
                      </Collapse>
                    </li>
                  );
                }) }
              </ul>
            }
          </div>
        </Collapse>
      </Paper>
    </Fade>
  );
}
