import React from 'react';

import logoEcostage from './logo-ecostage.svg';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={ styles.wrapper }>
      <small className={ styles.copyText }>© Copyright - China Three Gorges Brasil Energia Ltda. - Todos os direitos reservados</small>
      {/* <a href="http://www.ecostage.com.br" target="_blank">
        <img className={ styles.ecostageImage } src={ logoEcostage } alt="logo EcoStage" />
      </a> */}
    </footer>
  );
}
