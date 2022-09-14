
import { faTrash, faEdit, faBook, faMedal, faPencil} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, Children } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Col, Container, Dropdown, DropdownButton, Form, Row, Table, Image } from "react-bootstrap";
import useAxios from '../../../utils/useAxios';
import './Profile.css'
import Moment from 'moment'
import ImageEditModal from './imageEditModal';
import PasswordChange from './PasswordChange';

// import DeleteSector from "./DeleteSector";
// import ActiveSector from "./ActiveSector";
//import NoSectors from "./MessageTable";
// import Paginator from "../../../Reusable/Pagination/Paginator";

function Profile(){
    const [data, setData] = useState()
    const [dataImage, setDataImage] = useState()
    const api = useAxios()

    useEffect(() =>{

        api.get(`/users/profile/`)
        .then((element) => {
            setData(element.data)
            setDataImage(element.data.results[0].image)
        })
        .catch((err) => console.log(err))
    },[])

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
          <FontAwesomeIcon className="m-2 btnPencilDropdown5s" color="#00004F" icon={faPencil}/>
        </a>
      ));

    const reloadTable = (data) =>{
        setData(data)
    }

    console.log(data)
    
    return(
        <> 
        <Container fluid className="ContainerTableProfile5s">
            <Container fluid className='profileUser5s'>
                <Col className="imageDiv" xs={2}>
                    <Image roundedCircle className='image5S' 
                    src={dataImage ? dataImage : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg'}/>
                </Col>
                <Col className="sectorTitle" xs={10}>
                    {data ? <h2>{data.results[0].first_name} {data.results[0].last_name}</h2> : null}
                    {data ? <p>{data.results[0].office}</p> : null}
                </Col>
            </Container>
            <Container fluid className='containerContentProfile5s'>
                <Container fluid className="d-flex flex-wrap justify-content-between">
                    <Col  className="m-3">
                        <Col className="d-flex flex-nowrap">
                            <h3 className="">Dados cadastrados </h3>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} variant="dark"></Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <ImageEditModal
                                        reloadTableActive = {reloadTable} 
                                        first_name = {data? data.results[0].first_name : ''}
                                        last_name = {data? data.results[0].last_name : ''}
                                        email = {data? data.results[0].email : ''}
                                        objectName = 'Usuário'
                                        office = {data? data.results[0].office : ''}
                                        id = {data? data.results[0].id : ''} 
                                        route='/users/profileEdit/'
                                        routeGet='/users/profile/'/>
                                    <PasswordChange 
                                        route='/users/profile/changepassword/'
                                        id = {data? data.results[0].id : ''}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        {data ? <p>Data do cadastro: {Moment(data.results[0].date_joined).format("DD/MM/YYYY")}</p> : null}
                        {data ? <p>Última edição realizada no perfil em: {Moment(data.results[0].updated_at).format("DD/MM/YYYY")}</p> : null}
                        {data ? <p>Último login em: {Moment(data.results[0].last_login).format("DD/MM/YYYY")} ás {Moment(data.results[0].last_login).format("HH:mm")}</p> : null}
                        {data ? <p>Email: {data.results[0].email}</p> : null}
                        {data ? <p>Nome: {data.results[0].first_name}</p> : null}
                        {data ? <p>Sobrenome: {data.results[0].last_name}</p> : null}
                        {data ? <p>Cargo: {data.results[0].office}</p> : null}
                    </Col>
                    <Col  className=" text-center m-5">
                        <FontAwesomeIcon color="#cd7f32" size="10x" icon={faMedal}/>
                    </Col>
                </Container>
            </Container>
        </Container>
   </>
    )

}

export default Profile;