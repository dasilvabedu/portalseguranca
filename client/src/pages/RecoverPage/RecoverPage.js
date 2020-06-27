import React, { useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import _ from 'lodash';

import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.br';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';

import BasePage from '../../layout/BasePage';

import {
  CREATE_TOKEN
} from './query';

import styles from './RecoverPage.module.scss';

export default function RecoverPage() {
  const [createToken] = useMutation(CREATE_TOKEN, {
    onCompleted: ({ createToken }) => {
      localStorage.setItem('token', createToken.token);
      window.location.href = '/';
    },
    onError: () => alert('Telefone/Email incorretos')
  });
  const [login, setLogin] = useState('');
  const [email, setLoginE] = useState('');
  const handleLoginChange = event => {
    if(document.getElementById('field-login').value !== ''){
        document.getElementById('form-email').style.visibility = "hidden";
        document.getElementById('ouLabel').style.visibility = "hidden";
    }else{
        document.getElementById('form-email').style.visibility = "visible";
        document.getElementById('ouLabel').style.visibility = "visible";
    }
    setLogin(event.target.value);
  };    
  const handleemailChange = event => {
    if(document.getElementById('field-email').value !== ''){
        document.getElementById('form-login').style.visibility = "hidden";
        document.getElementById('ouLabel').style.visibility = "hidden";
    }else{
        document.getElementById('form-login').style.visibility = "visible";
        document.getElementById('ouLabel').style.visibility = "visible";
    }
    setLoginE(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedLogin = login.split(' ').join('');
    const parsedemail = email.split(' ').join('');

    createToken({ variables: {
      phone: parsedLogin,
      email: parsedemail,
    }});
  };

  return (
    <BasePage>
      <Paper className={ styles.box }>
        <div className={ styles.contentWrapper }>
          <h1 className={ styles.title }>Recuperação de senha</h1>
          <form onSubmit={ handleSubmit }>
            <FormControl id="form-Login" className={ styles.formControl }>
              <InputLabel htmlFor="field-login">Telefone</InputLabel>
              <Input
                id="field-login"
                type="text"
                value={ login }
                onChange={ handleLoginChange }
                inputComponent={ Cleave }
                inputProps={ {
                  options: {
                    phone: true,
                    phoneRegionCode: 'BR'
                  }
                } }
                placeholder="DDD + Número"
              />
            </FormControl>
            <InputLabel id="ouLabel"> ou </InputLabel><br></br>
            <FormControl id="form-email" className={ styles.formControl }>
              <InputLabel htmlFor="field-email">Email</InputLabel>
              <Input
                id="field-email"
                type="text"
                value={ login }
                onChange={ handleemailChange }
                inputComponent={ Cleave }
                inputProps={ {
                  options: {
                    email: true
                  }
                } }
                placeholder="usuário@domínio"
              />
            </FormControl>

            <div className={ styles.actionsWrapper }>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </Paper>
    </BasePage>
  );
}