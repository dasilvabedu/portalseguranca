import React from 'react';
import _ from 'lodash';
import { useQuery } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import BasePage from '../../layout/BasePage';

import {
  GET_ALL_DOCUMENTS
} from './query';

import styles from './AboutPage.module.scss';

export default function AboutPage() {
  const { data, loading } = useQuery(GET_ALL_DOCUMENTS);

  if (loading) { return null; }

  const { allDocuments } = data;

  const getIconByFileType = (fileType) => {
    const mapFileTypeToIcon = {
      document: DescriptionIcon,
      image: ImageIcon,
      video: PlayCircleFilledIcon,
    };

    return mapFileTypeToIcon[fileType] || DescriptionIcon;
  };

  const getColorByFileType = (fileType) => {
    const mapFileTypeToColor = {
      document: '#636466',
      image: '#6EBE44',
      video: '#F59721',
    };

    return mapFileTypeToColor[fileType] || '#636466';
  };

  return (
    <BasePage>
      <main className={ styles.container }>
        <h1>O que é o PAE?</h1>
        <p>O PAE tem caráter preventivo e visa garantir a segurança dos empreendimentos e a proteção das comunidades localizadas nas áreas inundáveis, principalmente nas Zonas de Auto Salvamento (ZAS). Ele define as ações e os meios para que estas populações possam ser alertadas e evacuadas em caso de emergência na barragem.</p>
        <ul className={ styles.fileList }>
          { _.map(allDocuments, ({ description, id, url, type }) => {
            const IconComponent = getIconByFileType(type);

            return (
              <li key={ `file-${ id }` } className={ styles.fileItem }>
                <div className={ styles.fileItemHeader }>
                  <IconComponent className={ styles.fileItemIcon } style={ { color: getColorByFileType(type) } } />
                  <div className={ styles.fileItemContent }>
                    <p className={ styles.fileItemDescription }>{ description }</p>
                    <Button variant="contained" color="primary" href={ url } target="_blank">Visualizar</Button>
                  </div>
                </div>
              </li>
            );
          }) }
        </ul>
      </main>
    </BasePage>
  )
}
