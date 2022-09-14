import { Button, Col, Container, Dropdown, DropdownButton, Form, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBan, faCircleCheck} from '@fortawesome/free-solid-svg-icons'
import './../Sector/ListSector/style.css'
import useAxios from "../../../utils/useAxios";
import { useState, useEffect, Children } from "react";
import { Link, useLocation } from "react-router-dom";
import NoData from "../../Reusable/Messages/MessageTable";
import Paginator from "../../Reusable/Pagination/Paginator";
import Delete from "../../Reusable/Modals/Delete";
import PostEditModal from "./PostEditUsersModal.js";
import moment from "moment";
import HandleOrdering from "../../Reusable/Pagination/OrdenationTable";

function ListUsers(){

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

    return(
        <Container fluid className="ContainerTableSector5s">
            
            <h2 className="text-center mb-3">Usuários do sistema</h2>
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
                            <th>SuperUsuário?</th>
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
                            <th >Cargo</th>
                            <th ><HandleOrdering columName = "Último login" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/user/" 
                                                ordenation = 'last_login'/>
                            </th>
                            <th ><HandleOrdering columName = "Data de criação da conta?" 
                                                reloadTableActive = {reloadTable} 
                                                orderingValue = { (ordering) => {setOrdering(ordering)}}
                                                searchvalue={search} 
                                                route = "/user/" 
                                                ordenation = 'date_joined'/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Children.toArray(data.map((element, index) =>
                        <tr>
                            <td className="col-1">{((paginateObject.actual_pages - 1) * 2) + index + 1}</td>
                            <td  className="col-1 ">{element.is_superuser ? <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon> : <FontAwesomeIcon color="red" icon={faBan}></FontAwesomeIcon>}</td>
                            <td className="col-2">{element.email}</td>
                            
                            <td  className="col-2">{element.first_name} {element.last_name}</td>

                            <td  className="col-2 ">{element.office}</td>

                            <td  className="col-2 ">
                                {element.last_login ? 
                                    (moment(element.last_login).format("DD/MM/YYYY") + ' ás ' +moment(element.last_login).format("HH:mm")) 
                                    : 
                                    ('Nunca fez login')
                                }
                            </td>

                            <td  className="col-2">{moment(element.date_joined).format("DD/MM/YYYY")} ás {moment(element.date_joined).format("HH:mm")}</td>
                            
                        </tr>))}
                        <NoData table={data} searchvalue={search} colspan='7' messageSearch="Nenhum usuário encontrado" messageNoData="Nenhum usuário cadastrado no sistema"/>
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

export default ListUsers;