import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import paeData from '../../../../data/paeData';

import styles from './StatusBox.module.scss';

export default function StatusBox({
  data,
  headerOverlayContentIsVisible,
  location = {},
  onClose = () => {},
  onLinkClick = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!!location) {
      setIsOpen(true);
    }
  }, [location]);

  const handleChange = (item) => {
    onLinkClick(item);
  };

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  const renderAutoSavingContent = () => {
    const filteredPAEData = _.filter(paeData, 'id');

    return (
      <div className={ styles.content }>
        <span className={ styles.legendItem }>
          <span className={ styles.legendItemCircle } />
          <span className={ styles.legendItemLabel }>Zona de auto salvamento</span>
        </span>
        <ul className={ styles.list }>
          { filteredPAEData.map((item) => {
            return (
              <li
                key={ `base-map-${ item.id }` }
                className={ styles.listItem }
                onClick={ handleChange.bind(this, item) }
              >
                <button className={ styles.navButton }>
                  <span className={ styles.navButtonLabel }>{ item.title }</span>
                  <ChevronRightIcon className={ styles.navButtonIcon } />
                </button>
              </li>
            );
          }) }
        </ul>
      </div>
    );
  };

  const renderFloodplainContent = () => {
    return (
      <div className={ styles.content }>
        <span className={ styles.legendItem }>
          <span className={ styles.legendItemCircle } />
          <span className={ styles.legendItemLabel }>Planície inundável</span>
        </span>
        <div className={ styles.textContent }>
          <p>A Planície inundável corresponde a área que será tomada pela água quando houver uma situação de emergência na barragem.</p>
          <p>Recomenda-se que todas as pessoas e animais que estejam nesta área se dirijam a locais seguros. O ZAS é a parte da Planície Inundável com maior nível de risco. Consulte a seção específica para saber como se portar.</p>
          <p>Para as demais áreas, recorra as orientações dos Agentes Públicos, em particular a Defesa Civil de seu município.</p>
        </div>
      </div>
    );
  };

  const renderOutsideContent = () => {
    return (
      <div className={ styles.content }>
        <span className={ styles.legendItem }>
          <span className={ styles.legendItemCircle } />
          <span className={ styles.legendItemLabel }>Este local não está sujeito a inundação</span>
        </span>
      </div>
    );
  };

  return (
    <Fade in={ !!data }>
      <Paper className={ classnames(styles.wrapper, {
        [styles.hasPaddingTop]: headerOverlayContentIsVisible
      }) }>
        <h2 className={ styles.title }>{ data && data.properties.nome_do_empreendimento }</h2>
        { !_.isEmpty(location) &&
          <Tooltip title={ isOpen ? 'Minimizar conteúdo' : 'Expandir conteúdo' }>
            <IconButton
              size="small"
              className={ styles.toggleButton }
              onClick={ toggleVisibility }
            >
              { isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" /> }
            </IconButton>
          </Tooltip>
        }
        <Tooltip title="Resetar visualização">
          <IconButton
            size="small"
            className={ styles.closeButton }
            onClick={ onClose }
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Collapse in={ isOpen }>
          { location && location.type === 'selfRescueZone' && renderAutoSavingContent() }
          { location && location.type === 'floodPlain' && renderFloodplainContent() }
          { location && location.type === 'outOfRisk' && renderOutsideContent() }
        </Collapse>
      </Paper>
    </Fade>
  );
}
