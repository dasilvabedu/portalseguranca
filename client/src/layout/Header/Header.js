import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as turf from '@turf/turf';

import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@material-ui/core/Tooltip';

import AsyncLocationAutocomplete from './AsyncLocationAutocomplete';
import PAEAutocomplete from './PAEAutocomplete';

import getGeoServerLayer from '../../helpers/getGeoServerLayer';

import logo from './logo.png';

import styles from './Header.module.css';

const GEOCODE_QUERY = `
query Geocode($address: String!) {
  geocode(address: $address)
}
`;

export default function Header({
  mapRef,
  activePAE,
  onPAEAutocompleteChange = () => {},
  onLocationAutocompleteChange = () => {},
}) {
  const [damData, setDamData] = useState(null);
  const isLogged = localStorage.getItem('token');

  useEffect(() => {
    getGeoServerLayer(`${ process.env.REACT_APP_GEOSERVER_WORKSPACE_NAME }:barragens`)
      .then(data => {
        if (data) {
          setDamData(turf.toWgs84(data));
        }
      });
  }, []);

  const parsedPAEOptions = _.map(_.get(damData, 'features'), (feature) => {
    return {
      id: _.get(feature, 'id'),
      title: _.get(feature, 'properties.nome_do_empreendimento'),
      subtitle: _.get(feature, 'properties.nome_da_companhia'),
    };
  });

  const handleExit = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handlePAEAutocompleteChange = (_event, option) => {
    if (option) {
      const feature = _.find(_.get(damData, 'features'), (f) => f.id === option.id);

      onPAEAutocompleteChange(feature);
    }
  };

  const handleLocationAutocompleteChange = (_event, option) => {
    if (!option) {
      onLocationAutocompleteChange(null);
      return;
    }

    const description = _.get(option, 'description');

    fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variables: { address: description },
        query: GEOCODE_QUERY
      }),
    })
      .then(res => res.json())
      .then(res => {
        const result = _.first(_.get(res, 'data.geocode.results'));
        const location = _.get(result, 'geometry.location');
        const viewport = _.get(result, 'geometry.viewport');

        if (location) {
          onLocationAutocompleteChange({
            location,
            viewport
          });
        }
      });
  };

  return (
    <header className={ styles.wrapper }>
      <a href="/">
        <img className={ styles.logoImage } src={ logo } alt="logo CTG Brasil" />
      </a>
      <div className={ styles.actions }>
        <NavLink to="/sobre" className={ styles.link } activeClassName={ styles.activeLink }>O que é o PAE?</NavLink>
        { !activePAE &&
          <PAEAutocomplete
            options={ parsedPAEOptions }
            onChange={ handlePAEAutocompleteChange }
          />
        }
        { activePAE &&
          <AsyncLocationAutocomplete
            mapRef={ mapRef }
            onChange={ handleLocationAutocompleteChange }
          />
        }
        { isLogged &&
          <div className={ styles.userInfoWrapper }>
            <span className={ styles.userInfo }>
              <PersonIcon />
              <span>Usuário Teste</span>
            </span>
            <Tooltip title="Sair">
              <IconButton className={ styles.exitButton } onClick={ handleExit }>
                <ExitToAppIcon className={ styles.exitButtonIcon } />
              </IconButton>
            </Tooltip>
          </div>
        }
        { !isLogged &&
          <Button className={ styles.signInButton } href="/login">
            <InputIcon className={ styles.signInButtonIcon } />
            <span className={ styles.signInButtonText }>Entrar</span>
          </Button>
        }
      </div>
    </header>
  );
}
