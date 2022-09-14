import { faBan, faCircleCheck, faEdit} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, Children } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Col, Container, Dropdown, Form, Row, Table, Image } from "react-bootstrap";
import useAxios from "../../../../utils/useAxios";
import './SectorProfile.css'
import Moment from 'moment'
import Paginator from '../../../Reusable/Pagination/Paginator';
import NoData from '../../../Reusable/Messages/MessageTable';


// import DeleteSector from "./DeleteSector";
// import ActiveSector from "./ActiveSector";
//import NoSectors from "./MessageTable";
// import Paginator from "../../../Reusable/Pagination/Paginator";

function SectorProfile(){
    const [is_active, setIs_active] = useState()
  
    const [sector, setDataSector] = useState(null)
    const api = useAxios()
    const [datasectores, setSectores] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')
    const [sectorImage, setSectorImage] = useState()
    const [sectorImageId, setSectorImageId] = useState()
    const id = useParams()
    const [formsList,setFormsList] = useState([])
    const [ordering, setOrdering] = useState('')
    
 
    
    useEffect(() =>{

     

        api.get(`/sectors/${id.sectorid}/`)
        .then((element) => {
            setDataSector(element.data)
            setPaginateObject(element.data)
            setSectorImageId(element.data.image)

            api.get(`/imagesectors/${element.data.image}/`)
            .then((img) => {
                setSectorImage(img.data.image)
            })
            .catch((err) => (err))

            api.get(`/formr/?sectorId=${id.sectorid}`)
            .then((element) => {
                console.log(element.data.results)
                setFormsList(element.data.results)
                
                setPaginateObject(element.data)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))

        
    },[])

    
    const handleChange = (event) => {
        setSearch(event.target.value)
        api.get(`/formr/?search=${event.target.value}&ordering=${ordering}&sectorId=${id.sectorid}`)
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
            </Col>
            <Col >
            {sector ? <p>{sector.description}</p> : null}
            </Col>
        </Container>

        <hr/>


        <Container fluid className="ContainerTableSector5s">

            
       <h2 className="text-center mb-3">Formulários do Subsetor</h2>
        
                        
        <Row className="d-flex justify-content-between p-1">
                <Col sm={2} md={2} >
              
                     <Button as={Link} state={{sectorId:id.sectorid, sectorImage: sectorImageId, sectorName : sector?.name}} to="/setores/senso" >Novo formulário</Button>
                    
                </Col>
                <Col sm={10} md={6}>
                    <Form.Control 
                        className="inputTable5S" 
                        type='text'
                        id="search"
                        name="search"
                        placeholder="Filtre os formulários com base na pesquisa"
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
                     
                        <th>Duração</th>
                        <th>Ativo?</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                        
   
                        {Children.toArray( formsList.map((element,index) => 
                                
                            
<tr>
                            <td className="col-2">{element.id}</td>
                            <td className="col-3 overflow-td-table-5s">{element.title}</td>
                            
                            <td  className="col-3">
                                {`${Moment(element.start_at).format('DD/MM/YYYY')} à ${Moment(element.end_at).format('DD/MM/YYYY')}`}
                                
                            </td>
                       
                            <td  className="col-2">{element.is_active ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                            
                            <td className="col-2"><Dropdown className="ms-1">
                                <Dropdown.Toggle variant="dark" className=" btnWreach5S btn_home_createform5s">
                                   
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item variant="warning" key={element.id+'edit'} as={Link} to={`/setores/senso/${id.sectorid}/editar/${element.id}`}>
                                        <span><FontAwesomeIcon color="green" icon={faEdit}></FontAwesomeIcon> </span>Editar Senso</Dropdown.Item>
                                    
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
                        <NoData table={formsList} searchvalue={search} colspan='4' messageSearch="Nenhum formulário encontrado nesse subsetor" messageNoData="Nenhum formulário cadastrado neste subsetor"/>
                        
                </tbody>
        </Table>
        <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/formr/"
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'formr'}/>
                </Col>
            </Row>
   </Container>
   </Container>
    )

}

export default SectorProfile;