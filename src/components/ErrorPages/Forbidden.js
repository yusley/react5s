import './Forbidden.css' 
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Alert, Collapse } from "react-bootstrap";
import { Link } from 'react-router-dom';
import AuthContext from '../../utils/AuthService/AuthContext';
import React, { useContext } from 'react';

function Forbidden(){
  const { authTokens} = useContext(AuthContext);

  return(
      <Container fluid className="backgroundNotFound containerNotFound">
        <h1 className='h1notFound'>403</h1>
          <div id="notfound" className='divNotFound'>
            <p className='PNotFound'> <span className='spanPageNotFound'>CÓDIGO DE ERRO</span>: 
              "<i className="iPageNotFound">HTTP 403 Forbidden</i>"
            </p>
            <p className='PNotFound'> 
              <span className='spanPageNotFound'>DESCRIÇÃO DO ERRO</span>: 
              "<i className="iPageNotFound">Acesso negado. Você não tem permissão para acessar esta página</i>"
            </p>
            <p className='PNotFound'> 
              <span className='spanPageNotFound'>POSSÍVEL CAUSA DO ERRO</span>: 
              <i className="iPageNotFound">"Você não tem as permissões necessárias para acessar essa página, solicite as permissões na TI e aguarde a liberação</i>..."
            </p>
            <p className='PNotFound'> 
              <span className='spanPageNotFound'>OUTRAS PÁGINAS QUE VOCÊ TEM PERMISSÃO PARA ACESSAR</span>: 
              [<Link className="link avatar" to="/">Página inicial</Link>, <Link className="link avatar" to="/conta/perfil">Meu Perfil</Link>...]
            </p>
            <p className='PNotFound'> 
              <span className='spanPageNotFound'>TENHA UM ÓTIMO DIA {authTokens.user.first_name} :-)</span>
            </p>
          </div>
      </Container>
    )
}

export default Forbidden;