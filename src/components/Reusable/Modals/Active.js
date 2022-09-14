import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { Button, Dropdown, Modal } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";

function Active(props){

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()
    const is_active = true

    
    const Activate = () =>{
        handleClose()

        api.patch(`${props.route}${props.id}/`, {is_active: is_active})
        .then(element => {
            if(element){
                console.log(element)
                reloadTableActive()
            }})
        .catch(err =>  {
            console.log(err.request.response); 
        })
    }

    const reloadTableActive = () =>{
        console.log(props.searchvalue)
        api.get(`${props.route}?search=${props.searchvalue}&ordering=${props.ordering}`)
            .then( element => {
                props.reloadTableActive(element.data)
                console.log(element.data)
            })
            .catch(err => console.log(err))
            }

    return(
        <>
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="#00004F" icon={faToggleOn}></FontAwesomeIcon> </span>Ativar {props.objectName}</Dropdown.Item>

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Ativar {props.objectName} {props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Você realmente deseja reativar {props.objectName} {props.name}?</Modal.Body>
                <Modal.Footer>
                <Button className="ButtonModalSectorForm" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button className="btnAdd" onClick={Activate}>
                    Ativar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default Active
