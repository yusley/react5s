import {Container, Nav, NavDropdown} from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import {Link} from 'react-router-dom'
import './NavbarStyle.css'
import { useContext, useEffect, useState } from "react";
import AuthContext from '../../../utils/AuthService/AuthContext';
import useAxios from '../../../utils/useAxios';

function NavBar(props){
    const { user, logoutUser, authTokens} = useContext(AuthContext);
    
    return(
        <Navbar collapseOnSelect expand="lg" className="NavColor5S" variant="dark">
            <Container fluid className="navmargin5s">
                <Navbar.Brand as={Link} to="/">Mercale 5S</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                {user ? (
                    <>
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Página inicial</Nav.Link>
                        </Nav>
                        <Nav>
                            {authTokens.user ? 
                            <>
                                {authTokens.user.is_admin ?
                                <>                                
                                    <NavDropdown title={`Setores`} id="collasible-nav-dropdown" className='text-light'>
                                        <NavDropdown.Item as={Link} to="/setores/">Gerenciar setores</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/setores/adicionarsetor">Adicionar novo setor</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/setores/enviarimagem">Adicionar imagem</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/filiais">Gerenciar Filiais</NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title={`Usuários`} id="collasible-nav-dropdown" className='text-light'>
                                        <NavDropdown.Item as={Link} to="/usuarios">Lista de usuários</NavDropdown.Item>
                                        {authTokens.user.is_superuser ?
                                        <>
                                            <NavDropdown.Item as={Link} to="/permissoes">Gerenciar permissões de acesso</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/">Adicionar novo administrador</NavDropdown.Item>
                                        </>
                                        : null }
                                        <NavDropdown.Item as={Link} to="/cargos">Gerenciar cargos</NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title={`Métricas`} id="collasible-nav-dropdown" className='text-light'>
                                        <NavDropdown.Item as={Link} to="/notasgerais">Notas gerais</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/respostas">Lista de respostas</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link as={Link} to="/admin">Painel administrativo</Nav.Link>
                                </>
                                : null}
                                <NavDropdown title={`${authTokens.user.first_name}`} id="collasible-nav-dropdown" className='text-light'>
                                    <NavDropdown.Item as={Link} to="/conta/perfil" state={"oloco"}>Meu perfil</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logoutUser}>Deslogar</NavDropdown.Item>
                                </NavDropdown>
                            </>
                            : null}
                        </Nav>
                    </>
                ):(
                    <>
                        <Nav className="me-auto"/>
                        <Nav>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/cadastro">Cadastro</Nav.Link>
                        </Nav>
                    </>
                )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar