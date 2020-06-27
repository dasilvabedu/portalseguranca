import React, { useState } from 'react';
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

import styles from './SignUpPage.module.css';

export default function SignUpPage() {
  const DADOS_CRIPTOGRAFAR = {
    algoritmo : "aes256",
    segredo : "chaves",
    tipo : "hex"
  };
  const [login, setLogin] = useState('');  
  const [cel, setCel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLoginChange = event => {
    setLogin(event.target.value);
  };  
  const handleEmailChange = event => {
    setEmail(event.target.value);
  };  
  const handleCelChange = event => {
    setCel(event.target.value);
  };
  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedCel = cel.split(' ').join('');
    const crypto = require("crypto");
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    cipher.update(password);
    const drowssap = cipher.final(DADOS_CRIPTOGRAFAR.tipo);

    const xmlhttp_Login = new XMLHttpRequest();
    const url = "https://moduloespacializacao.herokuapp.com/seguranca_barragem/usuario/incluido?nome=" + login + "&celular=" + parsedCel + "&senha=" + drowssap + "&email=" + email; 
    xmlhttp_Login.open("GET", url, true);
    xmlhttp_Login.responseType = 'text';
    xmlhttp_Login.onreadystatechange  = function () {
        if (xmlhttp_Login.readyState === xmlhttp_Login.DONE) {
            console.log(xmlhttp_Login.response);
            const Retorno = JSON.parse(xmlhttp_Login.responseText);
            if (Retorno.aresposta.codigo === 200){
                if (Retorno.retorno.acesso === "ok"){
                    alert(Retorno.retorno.texto);
                }else{
                    alert(Retorno.retorno.texto);
                }
            }else{
                alert(Retorno.aresposta.mensagem);
            }
         }
    };
    xmlhttp_Login.send();
  };

  return (
    <BasePage>
      <Paper className={ styles.box }>
        <div className={ styles.contentWrapper }>
          <h1 className={ styles.title }>Cadastre-se</h1>
          <form onSubmit={ handleSubmit }>
            <FormControl className={ styles.formControl }>
              <InputLabel htmlFor="field-login">Nome</InputLabel>
              <Input
                id="field-login"
                type="text"
                value={ login }
                onChange={ handleLoginChange }
              />
            </FormControl>
            <FormControl className={ styles.formControl }>
              <InputLabel htmlFor="field-login">Celular</InputLabel>
              <Input
                id="field-Cel"
                type="text"
                value={ null }
                onChange={ handleCelChange }
                inputComponent={ Cleave }
                inputProps={ {
                  options: {
                    phone: true,
                    phoneRegionCode: 'BR'
                  },
                placeholder:"DDD + Número",
                } }
               />
            </FormControl>
            <FormControl className={ styles.formControl }>
              <InputLabel htmlFor="field-email">E-mail</InputLabel>
              <Input
                id="field-email"
                type="text"
                value={ email }
                onChange={ handleEmailChange }
              />
            </FormControl>
            <FormControl className={ styles.formControl }>
              <InputLabel htmlFor="field-password">Senha</InputLabel>
              <Input
                id="field-password"
                type="password"
                value={ password }
                onChange={ handlePasswordChange }
              />
            </FormControl>
            <FormControl className={ styles.formControl }>
              <InputLabel htmlFor="field-password">Confirmação da senha</InputLabel>
              <Input
                id="field-password"
                type="password"
                value={ null }
                onChange={ () => {} }
              />
            </FormControl>
            <div className={ styles.actionsWrapper }>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Cadastrar
              </Button>
            </div>
          </form>
        </div>
      </Paper>
    </BasePage>
  );
}