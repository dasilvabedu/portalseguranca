import React, { useEffect, useState } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import Header from '../Header';
import HeaderMobile from '../HeaderMobile';
import Footer from '../Footer';

import styles from './BasePage.module.css';

const HEADER_HEIGHT = 50;
const FOOTER_HEIGHT = 30;

function BasePage({
  mapRef,
  activePAE,
  children,
  onPAEAutocompleteChange,
  onLocationAutocompleteChange,
  onOverlayContentVisibilityChange = () => {}
}) {
  const isMobile = useMediaQuery('(max-width: 820px)');
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [contentHeight, setContentHeight] = useState(window.innerHeight - (HEADER_HEIGHT + FOOTER_HEIGHT));
  const HeaderComponent = isMobile ? HeaderMobile : Header;

  function updateHeight() {
    setWindowHeight(window.innerHeight);
    setContentHeight(window.innerHeight - (HEADER_HEIGHT + FOOTER_HEIGHT));
  }
  const debouncedUpdateHeight = _.debounce(updateHeight, 500);

  useEffect(() => {
    window.addEventListener('resize', debouncedUpdateHeight);

    return () => {
      window.removeEventListener('resize', debouncedUpdateHeight)
    };
  }, []);

  return (
    <div className={ styles.pageWrapper } style={ { height: windowHeight } }>
      <HeaderComponent
        mapRef={ mapRef }
        activePAE={ activePAE }
        onPAEAutocompleteChange={ onPAEAutocompleteChange }
        onLocationAutocompleteChange={ onLocationAutocompleteChange }
        onOverlayContentVisibilityChange={ onOverlayContentVisibilityChange }
      />
      <div className={ styles.contentWrapper } style={ { minHeight: contentHeight } }>
        { children }
      </div>
      <Footer />
    </div>
  );
}

export default BasePage;
