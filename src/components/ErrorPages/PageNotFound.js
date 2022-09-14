import './Forbidden.css' 
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Alert, Collapse } from "react-bootstrap";
import { Link } from 'react-router-dom';
import AuthContext from '../../utils/AuthService/AuthContext';
import React, { useContext } from 'react';

function Forbidden(){
  const { authTokens} = useContext(AuthContext);

  return(
      <Container fluid className="backgroundNotFound containerNotFound">
        <h1 className='h1notFound'>404</h1>
          <div id="notfound" className='divNotFound'>
            <p className='PNotFound'> <span className='spanPageNotFound'>ERRO</span>: 
              "<i className="iPageNotFound">HTTP 404 Página não existe</i>"
            </p>
            <p className='PNotFound'> 
              <span className='spanPageNotFound'>DESCRIÇÃO DO ERRO</span>: 
              "<i className="iPageNotFound">A página buscada não existe, talvez você tenha se perdido ou digitou alguma coisa errada?</i>"
            </p>
            <p className='PNotFound'> 
              <span className='spanPageNotFound'>RETORNE PARA A PÁGINA INICIAL</span>: 
              [<Link className="link avatar" to="/">Clicando aqui</Link>]
            </p>
          </div>
      </Container>
    )
}

export default Forbidden;