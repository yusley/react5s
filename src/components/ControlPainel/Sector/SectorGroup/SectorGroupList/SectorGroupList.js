import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faBook, faCircleCheck, faBan, faArrowTurnRight, faPlaneLock, faSolarPanel } from '@fortawesome/free-solid-svg-icons'
import { Container, Table, Dropdown, Row,Col,Form,Button} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import NoData from "../../../../Reusable/Messages/MessageTable";
import { useState, Children,useEffect } from "react";
import useAxios from "../../../../../utils/useAxios";
import Paginator from "../../../../Reusable/Pagination/Paginator";
import Inative from "../../../../Reusable/Modals/Inative";
import Active from  "../../../../Reusable/Modals/Active";

function SectorGroup(){

    const [ordering, setOrdering] = useState('')
    const url  = useLocation().pathname;
    const api = useAxios()
    const [datasectores, setSectores] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {

        api.get('/sectorsGroup/')
        .then((element) => {
            console.log(element.data.results)
            setSectores(element.data.results)
            setPaginateObject(element.data)
        })
        .catch((err) => console.log(err))


    },[])

    
    const handleChange = (event) => {
        setSearch(event.target.value)
        api.get(`/sectorsGroup/?search=${event.target.value}`)
        .then((element) => {
            setSectores(element.data.results)
            setPaginateObject(element.data)
        })
        .catch((err) => console.log(err))
    }

    const reloadTable = (data) => {
        console.log(data)
        setSectores(data.results)
        setPaginateObject(data)
    }

    

    return(
        <Container fluid className="ContainerTableSector5s">
            
        <h2 className="text-center mb-3">Administrar Setores</h2>
        <Row className="d-flex justify-content-between p-1">
            <Col sm={2} md={2} >
                <Button as={Link} to="/setores/adicionarsetor" className="text-nowrap">Novo</Button>
            </Col>
            <Col sm={10} md={6}>
                <Form.Control
                    className="inputTable5S" 
                    type='text'
                    id="search"
                    name="search"
                    placeholder="Filtre os setores com base na pesquisa"
                    onChange={handleChange}
                    >
                </Form.Control>
            </Col>
        </Row>

        <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th >Nome </th>
                        <th>Filial </th>
                        <th>Ta ativo? </th>
                        {/* <th>Detalhes</th> */}
                        <th>SubSetores</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {Children.toArray(datasectores.map((element, index) =>
                    <tr>
                        <td className="col-2">{element.id}</td>
                        <td className="col-4 overflow-td-table-5s">{element.name}</td>
                        <td className="col-2 overflow-td-table-5s">{element.branchName}</td>
                        <td  className="col-2">{element.is_active ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                        
                        <td  className="col-1">
                            <Link className="link5S" to={`/setores/perfil/${element.id}`}>
                                <FontAwesomeIcon size="2x" icon={faSolarPanel}/>
                            </Link>
                            
                        </td>
                   
                        
                        
                        <td className="col-1 "><Dropdown className="ms-1">
                            <Dropdown.Toggle variant="dark" className=" btnWreach5S btn_home_createform5s">
                               
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item variant="warning" key={element.id+'edit'} as={Link} to={`/setores/editarsetor/${element.id}`} state={{edit:true,id:element.id,name:element.name,description:element.description, branch:element.branchName, imageId: element.image}}>
                                    <span><FontAwesomeIcon color="green" icon={faEdit}></FontAwesomeIcon> </span>Editar setor</Dropdown.Item>
                                    {element.is_active ? 
                                    <Inative reloadTableActive = {reloadTable} 
                                                searchvalue={search} 
                                                id={element.id} 
                                                name={element.name}
                                                route = "/sectorsGroup/" 
                                                objectName = "setor"
                                                ordering = {ordering}/>
                                    : 
                                    <Active reloadTableActive = {reloadTable} 
                                                searchvalue={search} 
                                                id={element.id} 
                                                name={element.name} 
                                                route = "/sectorsGroup/"
                                                objectName = "setor" 
                                                ordering = {ordering}/>
                                    }
                                
                               
                            </Dropdown.Menu>
                            </Dropdown>  
                        </td>
                    </tr>))}
                    <NoData table={datasectores} searchvalue={search} colspan='4' messageSearch="Nenhum setor encontrado" messageNoData="Nenhum setor cadastrado no sistema"/>
                </tbody>
        </Table>
        <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/sectorsGroup/"
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'sectors'}/>
                </Col>
            </Row>

    </Container>
    )
}


export default SectorGroup;