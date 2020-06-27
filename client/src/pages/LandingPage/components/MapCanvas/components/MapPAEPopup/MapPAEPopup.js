import React from 'react';

import styles from './MapPAEPopup.module.css';

export default function MapPAEPopup({ feature }) {
  const isLogged = localStorage.getItem('token');

  return (
    <div className={ styles.wrapper }>
      <h2 className={ styles.title }>{ feature.properties.nome_do_empreendimento }</h2>
      <h3 className={ styles.subtitle }>{ feature.properties.nome_da_companhia }</h3>
      { !feature.properties.pae_id && <p className={ styles.warningText }>Detalhes deste PAE ainda não disponíveis.</p> }
      { feature.properties.pae_id && !isLogged &&
        <div>
          <p className={ styles.infoText }>Realize o login para visualizar os detalhes deste PAE.</p>
          <div className={ styles.actionWrapper }>
            <a className={ styles.actionButton } href="/login">Entrar</a>
          </div>
        </div>
      }
      { feature.properties.pae_id && isLogged &&
        <div className={ styles.actionWrapper }>
          <button
            id="popup-pae-button"
            className={ styles.actionButton }
            data-paeid={ feature.properties.pae_id }
          >
            Visualizar informações
          </button>
        </div>
      }
    </div>
  );
}
