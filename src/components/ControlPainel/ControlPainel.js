import { faCaretDown,faCaretUp,faBriefcase,faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Collapse, Container, InputGroup, ListGroup, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import './style.css'
import useAxios from "../../utils/useAxios";
import AuthContext from "../../utils/AuthService/AuthContext";

function ControlPainel() {

    const { authTokens} = useContext(AuthContext);
    const [openSectors, setOpenSectors] = useState(true);
    const [openUser, setOpenUser] = useState(true);
    const [openMetrics, setOpenMetrics] = useState(true);
    const [data, setData] = useState();
    const api = useAxios()

    useEffect(() => {
        const getUser = () =>{

            api.get(`/users/profile/`)
            .then( element => {
                setData(element.data.results)
            })
            .catch(err => console.log(err))
            }
        
        getUser()
    },[])


    return (
        <Container fluid className="containerControlPanel5S">

                <Container fluid className="profileUser">
                    <Container fluid>
                            <Col className="profile">
                                <Image 
                                    className="picture"
                                    src='https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg'
                                    roundedCircle

                                />
                                
                                {data ? 
                                <Col >
                                    <h2>{data[0].first_name} {data[0].last_name}</h2>
                                    <p>{data[0].office}</p>
                                    <p>Seja bem vindo ao seu painel de admin</p>
                                </Col>
                                : null}
                                
                            </Col>
                        
                    </Container>
                </Container>


                <Card className='cardControlPanel5S'>
                    <Card.Header className='w-100 card5sControlPaneç' 
                                onClick={() => setOpenSectors(!openSectors)} 
                                aria-controls="cardSectors"
                                aria-expanded={openSectors}>
                        <InputGroup>
                            
                            <Card.Title className="title5S w-100">
                                <Row>
                                        <Col className="d-flex justify-content-between">
                                            <Col className='d-flex justify-content-around'>
                                                <FontAwesomeIcon color="#00004F" size="1x" icon={faBriefcase}/>
                                                <p className="px-25">
                                                    Gerenciar Setores
                                                </p>
                                                { openSectors ? <FontAwesomeIcon icon={faCaretDown}/> : <FontAwesomeIcon icon={faCaretUp}/>}
                                                
                                            </Col>
                                             
                                            
                                        </Col>
                                   
                                </Row>
                            </Card.Title>
                        </InputGroup>
                    </Card.Header>
                    <Collapse in={openSectors} className="collapse5S">
                        <ListGroup id="cardSectors" variant="flush" className="w-100">
                            <ListGroup.Item><Link to="/setores/adicionarsetor" className="linkControlPanel5S"> Adicionar novo setor </Link></ListGroup.Item>
                            <ListGroup.Item><Link to="/setores" className="linkControlPanel5S"> Gerenciar setores </Link></ListGroup.Item>
                            <ListGroup.Item><Link to="/setores/enviarimagem" className="linkControlPanel5S"> Adicionar imagens </Link></ListGroup.Item>
                            <ListGroup.Item><Link to="/filiais" className="linkControlPanel5S"> Gerenciar filiais </Link></ListGroup.Item>
                        </ListGroup >
                    </Collapse>
                </Card>

                <Card className='cardControlPanel5S '>
                    <Card.Header className='w-100 card5sControlPaneç' 
                                onClick={() => setOpenUser(!openUser)} 
                                aria-controls="cardSectors"
                                aria-expanded={openUser}>
                        <InputGroup>
                            <Card.Title className="title5S w-100" >
                            <Row>
                                        <Col className="d-flex justify-content-between">
                                            <Col className='d-flex justify-content-around'>
                                                <FontAwesomeIcon color="#00004F" size="1x" icon={faUser}/>
                                                <p className="px-25">
                                                    Gerenciar Usuários
                                                </p>
                                                { openUser ? <FontAwesomeIcon icon={faCaretDown}/> : <FontAwesomeIcon icon={faCaretUp}/>}
                                                
                                            </Col>
                                             
                                            
                                        </Col>
                                   
                                </Row>
                            </Card.Title>
                        </InputGroup>
                    </Card.Header>
                    <Collapse in={openUser} className='collapse5S'>
                        <ListGroup id="cardSectors" variant="flush" className="w-100">
                            <ListGroup.Item><Link to="/usuarios" className="linkControlPanel5S"> Lista de usuários </Link></ListGroup.Item>
                            {authTokens.user.is_superuser ? 
                            <ListGroup.Item> <Link to="/permissoes" className="linkControlPanel5S"> Gerenciar permissões de acesso</Link></ListGroup.Item> 
                            :  
                            <ListGroup.Item variant="secondary" > <p className="linkControlPanel5S"> Gerenciar permissões de acesso</p></ListGroup.Item>}
                            {authTokens.user.is_superuser ? 
                            <ListGroup.Item> <Link to="/" className="linkControlPanel5S"> Adicionar novo administrador</Link></ListGroup.Item> 
                            :  
                            <ListGroup.Item variant="secondary" > <p className="linkControlPanel5S"> Adicionar novo administrador</p></ListGroup.Item>}
                            <ListGroup.Item><Link to="/cargos" className="linkControlPanel5S"> Gerenciar cargos </Link></ListGroup.Item>
                        </ListGroup >
                    </Collapse>
                </Card>
                
                <Card className='cardControlPanel5S '>
                    <Card.Header className='w-100 card5sControlPaneç' 
                                onClick={() => setOpenMetrics(!openMetrics)} 
                                aria-controls="cardSectors"
                                aria-expanded={openMetrics}>
                        <InputGroup>
                            <Card.Title className="title5S w-100" ><Row>
                                        <Col className="d-flex justify-content-between">
                                            <Col className='d-flex justify-content-around'>
                                                <FontAwesomeIcon color="#00004F" size="1x" icon={faSquarePollVertical}/>
                                                <p className="px-25">
                                                    Métricas
                                                </p>
                                                { openMetrics ? <FontAwesomeIcon icon={faCaretDown}/> : <FontAwesomeIcon icon={faCaretUp}/>}
                                                
                                            </Col>
                                             
                                            
                                        </Col>
                                   
                                </Row></Card.Title>
                        </InputGroup>
                    </Card.Header>
                    <Collapse in={openMetrics} className="collapse5S">
                        <ListGroup id="cardSectors" variant="flush" className="w-100">
                            <ListGroup.Item><Link to="/notasgerais" className="linkControlPanel5S"> Notas Gerais </Link></ListGroup.Item>
                            <ListGroup.Item><Link to="/respostas" className="linkControlPanel5S"> Lista de respostas </Link></ListGroup.Item>
                            <ListGroup.Item><Link to="/sectores" className="linkControlPanel5S"> Opção 3 </Link></ListGroup.Item>
                        </ListGroup >
                    </Collapse>
                </Card>

        </Container>
    )
}

export default ControlPainel;