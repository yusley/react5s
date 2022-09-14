import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit} from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";

function Inative(props){

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()
    const is_active = false

    
    const Inativate = () =>{
        handleClose()

        api.patch(`${props.route}${props.id}/`, {is_active: is_active})
        .then(element => {
            if(element){
                reloadTableActive()
            }})
        .catch(err =>  {
            console.log(err.request.response); 
        })
    }

    const reloadTableActive = () =>{
        
        api.get(`${props.route}?search=${props.searchvalue}&ordering=${props.ordering}`)
            .then( element => {
                props.reloadTableActive(element.data)
            })
            .catch(err => console.log(err))
    }

    return(
        <>
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="red" icon={faTrash}></FontAwesomeIcon> </span>Inativar {props.objectName}</Dropdown.Item>

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Inativar {props.objectName} {props.name}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>Você realmente deseja invativar {props.objectName} {props.name}?</Modal.Body>
                <Modal.Footer>
                <Button className="ButtonModalSectorForm" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button className="btDelete" onClick={Inativate}>
                    Sim, quero inativar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default Inative
