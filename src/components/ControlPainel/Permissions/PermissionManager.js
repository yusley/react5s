import { faBan, faCircleCheck, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Children, useEffect, useState } from "react";
import { Col, Container, Dropdown, Form, Row, Table } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";
import NoData, { NoOffice } from "../../Reusable/Messages/MessageTable";
import HandleOrdering from "../../Reusable/Pagination/OrdenationTable";
import Paginator from "../../Reusable/Pagination/Paginator";
import ModalAddPermision from "./ModalAddPermision";

function PermissionManager(){

    const [ordering, setOrdering] = useState('')
    const api = useAxios()
    const [data, setData] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getSectores = () =>{

            api.get(`/user/`)
            .then( element => {
                setData(element.data.results)
                setPaginateObject(element.data)
                console.log(element.data)
            })
            .catch(err => console.log(err))
            }
        
        getSectores()
    },[])

    const handleChange = (event) => {

        setSearch(event.target.value)
        api.get(`/user/?search=${event.target.value}&ordering=${ordering}`)
            .then( element => {
                //console.log(element.data)
                setData(element.data.results)
                setPaginateObject(element.data)
            })
            .catch(err => console.log(err))
            }

    const reloadTable = (data) =>{
        setData(data.results)
        setPaginateObject(data)
    }

    return (
        <Container fluid className="ContainerTableSector5s">
            
            <h2 className="text-center mb-3">Gerenciamento de permissões</h2>
            <Row className="d-flex justify-content-between p-1">
                <Col sm={2} md={2} >
                   
                </Col>
                <Col sm={10} md={6}>
                    <Form.Control 
                        className="inputTable5S" 
                        type='text'
                        id="search"
                        name="search"
                        placeholder="Filtre os usuários com base na pesquisa"
                        onChange={handleChange}
                        >
                    </Form.Control>
                </Col>
            </Row>

            <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className="text-center">Administrador?</th>
                            <th className="text-center">Super administrador?</th>
                            <th ><HandleOrdering columName = "Email" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/user/" 
                                                ordenation = 'email'/>
                            </th>
                            <th ><HandleOrdering columName = "Nome" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/user/" 
                                                ordenation = 'first_name'/>
                            </th>
                            <th className="text-center"> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Children.toArray(data.map((element, index) =>
                        <tr>
                            <td className="col-1">{((paginateObject.actual_pages - 1) * 2) + index + 1}</td>
                            <td  className="col-1 text-center">{element.is_admin ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                            <td  className="col-2 text-center ">{element.is_superuser ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                            <td className="col-2 ">{element.email}</td>
                            
                            <td  className="col-2">{element.first_name} {element.last_name}</td>
                            <td className="col-2 text-center">
                                <Dropdown className="ms-1">
                                    <Dropdown.Toggle variant="dark" className=" btnWreach5S btn_home_createform5s">
                                    
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <ModalAddPermision 
                                        is_admin={element.is_admin}
                                        is_superAdmin={element.is_superuser}
                                        reloadTableActive = {reloadTable} 
                                        searchvalue={search} 
                                        id={element.id} 
                                        name={element.first_name}
                                        route = "/user/" 
                                        objectName = "usuário(a)"
                                        ordering = {ordering}/>
    
                                    </Dropdown.Menu>
                                </Dropdown> 
                            </td>
                            
                        </tr>))}
                        <NoData table={data} searchvalue={search} colspan='6' messageSearch="Nenhuma permissão encontrada" messageNoData="Nenhuma permissão cadastrada no sistema"/>
                    </tbody>
            </Table>
            <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/user/"
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'user'}/>
                </Col>
            </Row>
        </Container>
    )
}

export default PermissionManager;