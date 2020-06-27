import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';

import styles from './Header.module.css';

export default function PAEAutocomplete({
  options,
  onChange = () => {}
}) {
  return (
    <Autocomplete
      id="pae-autocomplete"
      blurOnSelect={ true }
      options={ options }
      noOptionsText="Nenhuma opção disponível"
      getOptionLabel={ option => option.title }
      style={{ width: 300 }}
      filterOptions={ (options, { inputValue }) => {
        const parsedInputValue = _.kebabCase(inputValue);

        return _.filter(options, ({ title, subtitle }) => {
          const parsedTitle = _.kebabCase(title);
          const parsedSubtitle = _.kebabCase(subtitle);

          return _.includes(parsedTitle, parsedInputValue) ||
            _.includes(parsedSubtitle, parsedInputValue);
        });
      } }
      renderInput={ (params) => (
        <TextField
          { ...params }
          label={ null }
          variant="outlined"
          placeholder="Verifique os PAEs da sua região"
          InputProps={ {
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={ { fontSize: 20, fill: '#808080' } } />
              </InputAdornment>
            )
          } }
        />
      )}
      renderOption={ (option) => {
        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={ styles.locationIcon } />
            </Grid>
            <Grid item xs>
              <span className={ styles.autocompleteOptionTitle }>{ option.title }</span>
              <span className={ styles.autocompleteOptionSubtitle }>{ option.subtitle }</span>
            </Grid>
          </Grid>
        );
      }}
      onChange={ onChange }
    />
  );
}
