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

import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [createToken] = useMutation(CREATE_TOKEN, {
    onCompleted: ({ createToken }) => {
      localStorage.setItem('token', createToken.token);
      window.location.href = '/';
    },
    onError: () => alert('Telefone ou senha incorretos')
  });
  const DADOS_CRIPTOGRAFAR = {
    algoritmo : "aes256",
    segredo : "chaves",
    tipo : "hex"
  };
  const [login, setLogin] = useState('');
  const [email, setLoginE] = useState('');
  const [password, setPassword] = useState('');
  const handleLoginChange = event => {
    if(document.getElementById('field-login').value !== ''){
        document.getElementById('form-email').style.visibility = "hidden";
    }else{
        document.getElementById('form-email').style.visibility = "visible";
    }
    setLogin(event.target.value);
  };    
  const handleemailChange = event => {
    if(document.getElementById('field-email').value !== ''){
        document.getElementById('form-login').style.visibility = "hidden";
    }else{
        document.getElementById('form-login').style.visibility = "visible";
    }
    setLoginE(event.target.value);
  };
  const handlePasswordChange = event => {
    setPassword(event.target.value);

  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedLogin = login.split(' ').join('');
    const crypto = require("crypto");
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    cipher.update(password);
    const drowssap = cipher.final(DADOS_CRIPTOGRAFAR.tipo);

    const xmlhttp_Login = new XMLHttpRequest();
    const url = "https://moduloespacializacao.herokuapp.com/seguranca_barragem/usuario/login?login=" + parsedLogin + "&senha=" + drowssap + "&dados=sim"; 
    xmlhttp_Login.open("GET", url, true);
    xmlhttp_Login.responseType = 'text';
    xmlhttp_Login.onreadystatechange  = function () {
        if (xmlhttp_Login.readyState === xmlhttp_Login.DONE) {
            console.log(xmlhttp_Login.response);
            const Retorno = JSON.parse(xmlhttp_Login.responseText);
            if (Retorno.aresposta.codigo === 200){
                if (Retorno.retorno.acesso === "ok"){
                    alert(Retorno.retorno.texto);
                    window.location.href = '/';
                }else{
                    alert(Retorno.retorno.texto);
                }
            }else{
                alert(Retorno.retorno.texto);
            }
         }
    };
    xmlhttp_Login.send();
//    createToken({ variables: {
//      phone: parseFarso,
//      passFarsa
//    }});
//    window.location.href = '/';

  };

  return (
    <BasePage>
      <Paper className={ styles.box }>
        <div className={ styles.contentWrapper }>
          <h1 className={ styles.title }>Realize o login</h1>
          <form onSubmit={ handleSubmit }>
            <FormControl id="form-login" className={ styles.formControl }>
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
            <FormControl id="form-email" className={ styles.formControl }>
              <InputLabel htmlFor="field-email">E-mail</InputLabel>
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
            <FormControl className={ styles.formControl }>
              <InputLabel htmlFor="field-password">Senha</InputLabel>
              <Input
                id="field-password"
                type="password"
                value={ password }
                onChange={ handlePasswordChange }
              />
            </FormControl>
            <div className={ styles.actionsWrapper }>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Entrar
              </Button>
            </div>
          </form>
          <p className={ styles.info }>Não tem conta? <a href="/signup">Cadastre-se</a>.</p>
          <p className={ styles.info }>Esqueceu a senha? <a href="/recuperar">Recupere-a</a>.</p>
        </div>
      </Paper>
    </BasePage>
  );
}