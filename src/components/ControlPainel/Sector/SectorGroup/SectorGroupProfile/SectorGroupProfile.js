import { Button, Col, Container, Dropdown, DropdownButton, Form, Row, Table, Image } from "react-bootstrap";
import { faTrash, faEdit, faBook, faBan, faCircleCheck, faArrowUpFromWaterPump, faFileWaveform} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, Children } from "react";
import { Link, useLocation, useParams} from "react-router-dom";
import useAxios from "../../../../../utils/useAxios";
import Paginator from "../../../../Reusable/Pagination/Paginator";
import Moment from 'moment'
import NoData from "../../../../Reusable/Messages/MessageTable";

function SectorGroupProfile(){

    const url  = useLocation().pathname;
    const [is_active, setIs_active] = useState()
    var urlchosen = true
    const [sector, setDataSector] = useState(null)
    const api = useAxios()
    const [datasectores, setSectores] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')
    const [sectorImage, setSectorImage] = useState()
    const [sectorImageId, setSectorImageId] = useState()
    const sectorGroup = useParams()
    const [formsList,setFormsList] = useState([])
    const [ordering, setOrdering] = useState('')
    const filial = 0;

   
    useEffect(() =>{

        api.get(`/sectorsGroup/${sectorGroup.id}/`)
        .then((element) => {
          
            setDataSector(element.data)
            setPaginateObject(element.data)
            setSectorImageId(element.data.image)
            
            api.get(`/imagesectors/${element.data.image}/`)
            .then((img) => {
                setSectorImage(img.data.image)
            })
            .catch((err) => console.log(err))

            api.get(`/sectors/?sectorGroup=${sectorGroup.id}`)
            .then((element) => {
               
                setFormsList(element.data.results)
                setPaginateObject(element.data)
            })

        })
        .catch((err) => console.log(err))

        
    },[])

    const handleChange = (event) => {
        api.get(`/sectors/?search=${event.target.value}&sectorGroup=${sectorGroup.id}`)
        .then((element) => {
            setFormsList(element.data.results)
            setPaginateObject(element.data)
        })
    }


    const reloadTable = (data) =>{
        setFormsList(data.results)
        setPaginateObject(data)
       
    }

    return(

        <Container fluid>
            <Container fluid className='profileSector'>
                <Col className="imageDiv" xs={2}>
                    <Image roundedCircle className='image5S' src={sectorImage}/>   
                </Col>
                <Col className="sectorTitle" xs={10}>
                    {sector ? <h2>{sector.name}</h2> : null}
                </Col>
            </Container>
        
        <Container fluid className="sectorInfos"> 
            <Col >
                {sector ? <p>Criado em : {Moment(sector.created_at).format("DD/MM/YYYY")}</p> : null}
                {sector ? <p>Editado em : {Moment(sector.updated_at).format("DD/MM/YYYY")}</p> : null}
                {sector ? <p>Filial : {sector?.branchName}</p> : null}
            </Col>
            <Col >
            {sector ? <p>{sector.description}</p> : null}
            </Col>
        </Container>

        <hr/>

        <Container Fluid className="ContainerTableSector5s">
            <h2 className="text-center mb-3">SubSetores do Setor</h2>               
            <Row className="d-flex justify-content-between p-1">
                    <Col sm={2} md={2} >
                        <Button as={Link} to={`/subsetor/criarsetor/${sectorGroup.id}/${sector?.branchName}/${sector?.name}/no`} >Novo SubSector</Button> 
                    </Col>
                    <Col sm={10} md={6}>
                        <Form.Control 
                            className="inputTable5S" 
                            type='text'
                            id="search"
                            name="search"
                            placeholder="Filtre os subsetores com base na pesquisa"
                            onChange={handleChange}
                            >
                        </Form.Control>
                    </Col>
                </Row>              

        <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ta ativo?</th>
                        <th>Sensos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                        {Children.toArray( formsList.map((element,index) =>                    
                        <tr>
                            <td className="col-2">{element.id}</td>
                            <td className="col-4 overflow-td-table-5s">{element.name}</td>
                            <td  className="col-2">{element.is_active ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                            <td  className="col-2">
                                <Link className="link5S" to={`/perfilsetor/${element.id}`}>
                                    <FontAwesomeIcon size="2x" icon={faFileWaveform}/>
                                </Link>
                            </td>
                       
                            <td className="col-2"><Dropdown className="ms-1">
                                <Dropdown.Toggle variant="dark" className=" btnWreach5S btn_home_createform5s">
                                   
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item variant="warning" key={element.id+'edit'} as={Link} to={`/subsetor/editar/${sectorGroup.id}/${element.image}/${element.id}/${sector?.name}/yes`}>
                                        <span><FontAwesomeIcon color="green" icon={faEdit}></FontAwesomeIcon> </span>Editar setor</Dropdown.Item>
                                    
                                    {/* {is_active ? 
                                    <DeleteSector reloadTableActive = {reloadTable} 
                                                searchvalue={search} 
                                                id={element.id} 
                                                name={element.name}
                                                route = "/sectors/" 
                                                is_active = 'true'
                                                objectName = "setor"
                                                ordering = {ordering}/>
                                    : 
                                    <ActiveSector reloadTableActive = {reloadTable} 
                                                searchvalue={search} 
                                                id={element.id} 
                                                name={element.name} 
                                                route = "/sectors/" 
                                                is_active = 'false'
                                                objectName = "setor" 
                                                ordering = {ordering}/>
                                    } */}
 
                                </Dropdown.Menu>
                                </Dropdown>  
                            </td>
                        </tr>))}
                        <NoData table={formsList} searchvalue={search} colspan='4' messageSearch="Nenhum SubSetor encontrado" messageNoData="Nenhum SubSetor cadastrado no sistema"/>

                        
                </tbody>
        </Table>
        <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/sectors/"
                        sectorGroup = {sectorGroup.id}
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        baseUrl = {'sectors'}/>
                </Col>
            </Row>
   </Container>
   </Container>
    )
}

export default SectorGroupProfile;