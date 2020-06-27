import React from 'react';
import _ from 'lodash';
import parse from 'autosuggest-highlight/parse';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import styles from './Header.module.css';

const AUTOCOMPLETE_QUERY = `
query Autocomplete($query: String!, $location: String) {
  autocomplete(query: $query, location: $location)
}
`;

export default function AsyncLocationAutocomplete({
  mapRef,
  onChange = () => {}
}) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const dataFetch = React.useMemo(
    () =>
      _.throttle(({ input }, callback) => {
        if (input && input.length < 3) { return; }

        const { lat, lng } = mapRef.current.leafletElement.getCenter()
        const centerCoordinates = [lat, lng].join(',')

        fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variables: {
              query: input,
              location: centerCoordinates,
            },
            query: AUTOCOMPLETE_QUERY
          }),
        })
          .then(res => res.json())
          .then(res => {
            const options = _.get(res, 'data.autocomplete.predictions');
            callback(options || []);
          });
      }, 1500),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    dataFetch({ input: inputValue }, (results) => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, dataFetch]);

  return (
    <Autocomplete
      id="location-autocomplete"
      includeInputInList
      autoComplete
      filterSelectedOptions
      blurOnSelect={ true }
      options={ options }
      noOptionsText="Nenhuma opção disponível"
      getOptionLabel={ (option) => (typeof option === 'string' ? option : option.description) }
      filterOptions={ (option) => option }
      style={ { width: 300 } }
      renderInput={ (params) => (
        <TextField
          { ...params }
          label={ null }
          variant="outlined"
          placeholder="Entre com o seu endereço"
          InputProps={ {
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={ { fontSize: 20, fill: '#808080' } } />
              </InputAdornment>
            )
          } }
          onChange={ handleChange }
        />
      )}
      renderOption={(option) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={ styles.locationIcon } />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
      onChange={ onChange }
    />
  );
}
