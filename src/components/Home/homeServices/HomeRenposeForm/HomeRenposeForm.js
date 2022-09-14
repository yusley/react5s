import { faBook, faCheck, faEdit, faFolderOpen, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Children, useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Dropdown, Form, Image, Modal, Row, Table } from "react-bootstrap";
import { Link, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import useAxios from "../../../../utils/useAxios";
import Paginator from "../../../Reusable/Pagination/Paginator";
import Moment from 'moment'
import './homeResponseForm.css'
import { getCurrentDate } from "../../../../utils/GetCurrentDate";
import AuthContext from "../../../../utils/AuthService/AuthContext";
import ModalResponseForm from "./FormResponseInput/ModalResponse";

function HomeRenposeForm(){
    
    const {authTokens} = useContext(AuthContext);
    const url  = useLocation().pathname;
    const [is_active, setIs_active] = useState()
    const [sector, setDataSector] = useState(null)
    const api = useAxios()
    const [datasectores, setSectores] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')
    const [sectorImage, setSectorImage] = useState()
    const [responde, setResponse] = useState([])
    const [sectorImageId, setSectorImageId] = useState()
    const sectorId = useParams()
    const [formsList,setFormsList] = useState([])
    const [ordering, setOrdering] = useState('')
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        api.get(`/sectors/${sectorId.id}/`)
        .then((element) => {
            setDataSector(element.data)
            setPaginateObject(element.data)
            setSectorImageId(element.data.image)

            api.get(`/imagesectors/${element.data.image}/`)
            .then((img) => {
                setSectorImage(img.data.image)
            })
            .catch((err) => console.log(err))

            api.get(`/formr/?sectorId=${element.data.id}&end_at__gte=${getCurrentDate()}&start_at__lte=${getCurrentDate()}`)
            .then((element) => {
            
                setFormsList(element.data.results)
                
                setPaginateObject(element.data)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))

        
    },[])

    const handleChange = (event) => {
        setSearch(event.target.value)
        api.get(`/formr/?search=${event.target.value}&end_at__gte=${getCurrentDate()}&start_at__lte=${getCurrentDate()}`)
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
       
        <Container Fluid className=" ContainerTableResponseForm5s ">
        <Container fluid className='profileSector'>
            <Col className="imageDiv" xs={2}>
                <Image roundedCircle className='image5S' src={sectorImage}/>
                
            </Col>
            <Col className="sectorTitle" xs={10}>
                {sector ? <h2>{sector.name}</h2> : null}
            </Col> 
        </Container>
            
        {sector ? <h2 className="text-center mb-3">Formulários ativos em {sector.name}</h2> : null}
        
                        
        <Row className="d-flex justify-content-between p-1">
                <Col sm={2} md={2} >
                    
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

          
         
        

        <Table striped hover responsive >
                
        
                <thead>
                    <tr>
                        <th>ID</th>
                        <th >Nome</th>
                     
                        <th className="text-center">Data de duração</th>
                        <th className="text-center">Responder formulário</th>
                    </tr>
                </thead>
                <tbody>
                        { formsList.length > 0 ? Children.toArray( formsList.map((element,index) =>   
                        <tr>
                            <td className="col-3">{element.id}</td>
                            <td className="col-2 overflow-td-table-5s">{element.title}</td>
                            
                            <td className="text-center col-3">{Moment(element.start_at).format("DD/MM/YYYY")} até {Moment(element.end_at).format("DD/MM/YYYY")}</td>
                            <td  className="col-4 text-center">
                                <ModalResponseForm 
                                    id={element.id}
                                />
                            </td>
                        </tr>
                        )) : <td colspan="4" className="mt-5 text-center">Nenhum formulário encontrado</td>}  
                </tbody>
        </Table>
        <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/formr/"
                        is_active = {is_active} 
                        start_at = {getCurrentDate()}
                        end_at = {getCurrentDate()}
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'formr'}/>
                </Col>
            </Row>
   </Container>
  
    )

}

export default HomeRenposeForm;
