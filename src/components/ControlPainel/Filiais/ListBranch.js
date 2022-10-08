import { Button, Col, Container, Dropdown, DropdownButton, Form, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBan, faCircleCheck, faEdit} from '@fortawesome/free-solid-svg-icons'
import './../Sector/ListSector/style.css'
import useAxios from "../../../utils/useAxios";
import { useState, useEffect, Children } from "react";
import Paginator from "../../Reusable/Pagination/Paginator";
import Delete from "../../Reusable/Modals/Delete";
import HandleOrdering from "../../Reusable/Pagination/OrdenationTable";
import PostEditBranchModal from "./PostEditBranchModal.js";
import DeleteSector from "../../Reusable/Modals/Inative";
import Active from "../../Reusable/Modals/Active";
import NoData from "../../Reusable/Messages/MessageTable";

function ListBranch(){

    const [ordering, setOrdering] = useState('')
    const api = useAxios()
    const [data, setData] = useState([])
    const [paginateObject, setPaginateObject] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const getData = () =>{

            api.get(`/branch/`)
            .then( element => {
                setData(element.data.results)
                setPaginateObject(element.data)
            })
            .catch(err => console.log(err))
            }
        
            getData()
    },[])

    const handleChange = (event) => {

        setSearch(event.target.value)
        api.get(`/branch/?search=${event.target.value}&ordering=${ordering}`)
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
    console.log(data)
    return(
        <Container fluid className="ContainerTableSector5s">
            
            <h2 className="text-center mb-3">Filiais do sistema</h2>
            <Row className="d-flex justify-content-between p-1">
                <Col sm={2} md={2} >
                    <PostEditBranchModal reloadTableActive = {reloadTable} 
                                    searchvalue={search} 
                                    objectName = 'filial' 
                                    route='/branch/'
                                    ordering = {ordering}/>
                </Col>
                <Col sm={10} md={6}>
                    <Form.Control 
                        className="inputTable5S" 
                        type='text'
                        id="search"
                        name="search"
                        placeholder="Filtre as filiais com base na pesquisa"
                        onChange={handleChange}
                        >
                    </Form.Control>
                </Col>
            </Row>

            <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th >Ativo?</th>
                            <th ><HandleOrdering columName = "Número" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/branch/" 
                                                ordenation = 'number'/>
                            </th>
                            <th ><HandleOrdering columName = "Endereço" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/branch/" 
                                                ordenation = 'address'/>
                            </th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Children.toArray(data.map((element, index) =>
                        <tr>
                            <td  className="col-1 ">{element.is_active ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                            <td className="col-1">{element.number}</td>
                            
                            <td  className="col-9">{element.address}</td>

                            <td className="col-1">
                                <Dropdown className="ms-1">
                                    <Dropdown.Toggle variant="dark" className=" btnWreach5S btn_home_createform5s">
                                    
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <PostEditBranchModal 
                                            reloadTableActive = {reloadTable} 
                                            number = {element.number}
                                            address = {element.address}
                                            searchvalue={search} 
                                            is_edit = {true} 
                                            objectName = 'filial'
                                            id = {element.id} 
                                            route='/branch/'
                                            ordering = {ordering}/>
                                        {element.is_active ? <DeleteSector reloadTableActive = {reloadTable} 
                                                route = "/branch/" 
                                                objectName = "filial"
                                                name = {element.number} 
                                                searchvalue={search} 
                                                id={element.id} 
                                                number={element.number}
                                                ordering = {ordering}/>
                                            :
                                            <Active reloadTableActive = {reloadTable} 
                                                route = "/branch/" 
                                                objectName = "filial"
                                                name = {element.number} 
                                                searchvalue={search} 
                                                id={element.id} 
                                                number={element.number}
                                                ordering = {ordering}/> }
                                    </Dropdown.Menu>
                                </Dropdown>  
                            </td>
                            
                        </tr>))}
                        <NoData table={data} searchvalue={search} colspan='5' messageSearch="Nenhuma filial encontrada para essa pesquisa" messageNoData="Nenhuma filial cadastrada no sistema"/>
                    </tbody>
            </Table>
            <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/branch/"
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'branch'}/>
                </Col>
            </Row>
        </Container>
    )
}

export default ListBranch;