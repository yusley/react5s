import { Button, Col, Container, Dropdown, DropdownButton, Form, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faBook, faBookOpen, faBookReader, faBookOpenReader} from '@fortawesome/free-solid-svg-icons'
import './../Sector/ListSector/style.css'
import useAxios from "../../../utils/useAxios";
import { useState, useEffect, Children } from "react";
import { Link, useLocation } from "react-router-dom";
import NoData from "../../Reusable/Messages/MessageTable";
import Paginator from "../../Reusable/Pagination/Paginator";
import Delete from "../../Reusable/Modals/Delete";
import PostEditModal from "./PostEditModal.js";
import HandleOrdering from "../../Reusable/Pagination/OrdenationTable";

function ListOffice(){

    const [ordering, setOrdering] = useState('')
    const api = useAxios()
    const [data, setData] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getSectores = () =>{

            api.get(`/office/manage/`)
            .then( element => {
                setData(element.data.results)
                setPaginateObject(element.data)
            })
            .catch(err => console.log(err))
            }
        
        getSectores()
    },[])

    const handleChange = (event) => {

        setSearch(event.target.value)
        api.get(`/office/manage/?search=${event.target.value}&ordering=${ordering}`)
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

    return(
        <Container fluid className="ContainerTableSector5s">
            
            <h2 className="text-center mb-3">Gerenciar cargos</h2>
            <Row className="d-flex justify-content-between p-1">
                <Col sm={2} md={2} >
                    <PostEditModal reloadTableActive = {reloadTable} 
                                    searchvalue={search} 
                                    objectName = 'cargo' 
                                    route='/office/manage/'
                                    ordering = {ordering}/>
                </Col>
                <Col sm={10} md={6}>
                    <Form.Control 
                        className="inputTable5S" 
                        type='text'
                        id="search"
                        name="search"
                        placeholder="Filtre os cargos com base na pesquisa"
                        onChange={handleChange}
                        >
                    </Form.Control>
                </Col>
            </Row>

            <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th ><HandleOrdering columName = "Nome" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/office/manage/" 
                                                ordenation = 'name'/>
                            </th>
                            <th ><HandleOrdering columName = "Descrição" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/office/manage/" 
                                                ordenation = 'description'/>
                            </th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Children.toArray(data.map((element, index) =>
                        <tr>
                            <td className="col-2">{((paginateObject.actual_pages - 1) * 2) + index + 1}</td>
                            <td className="col-3 overflow-td-table-5s">{element.name}</td>
                            
                            <td  className="col-6 overflow-td-table-5s">{element.description}</td>
                            
                            <td className="col-1">
                                <Dropdown className="ms-1">
                                    <Dropdown.Toggle variant="dark" className=" btnWreach5S btn_home_createform5s">
                                    
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <PostEditModal 
                                            reloadTableActive = {reloadTable} 
                                            name = {element.name}
                                            description = {element.description}
                                            searchvalue={search} 
                                            is_edit = {true} 
                                            objectName = 'cargo'
                                            id = {element.id} 
                                            route='/office/manage/'
                                            ordering = {ordering}/>
                                        <Delete reloadTableActive = {reloadTable} 
                                                route = "/office/manage/" 
                                                objectName = "cargo" 
                                                searchvalue={search} 
                                                id={element.id} 
                                                name={element.name}
                                                ordering = {ordering}/> 
    
                                    </Dropdown.Menu>
                                </Dropdown>  
                            </td>
                        </tr>))}
                        <NoData table={data} searchvalue={search} colspan='4' messageSearch="Nenhum cargo encontrado" messageNoData="Nenhum cargo cadastrado no sistema"/>
                    </tbody>
            </Table>
            <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/office/manage/"
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'sectors'}/>
                </Col>
            </Row>
        </Container>
    )
}

export default ListOffice;