import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { Alert, Button, Collapse, Dropdown, Modal } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";

function Delete(props){

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()

    const Delete = () =>{
        api.delete(`${props.route}${props.id}/`,)
        .then(element => {
            if(element){
                console.log(element)
                reloadTableActive()
                handleClose()
            }})
        .catch(err =>  {
            console.log(err.request); 
            if (err.request.status == 403){
                setStateError(`O ${props.objectName} ${props.name} não pode ser deletado! ${err.request.response.replace(/"/g, '')}`)
            }
            else{
                setStateError(`Erro desconhecido! Contate a equipe de TI`)
            }
        })
    }

    const reloadTableActive = () =>{
        api.get(`${props.route}?search=${props.searchvalue}&is_active=${props.is_active}&ordering=${props.ordering}`)
            .then( element => {
                props.reloadTableActive(element.data)
            })
            .catch(err => console.log(err))
            }

    return(
        <>
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="#FF0000" icon={faTrash}></FontAwesomeIcon> </span>Deletar</Dropdown.Item>

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Deletar o {props.objectName} {props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você realmente deseja deletar o {props.objectName} {props.name}? Essa ação é irreversível!
                    <Collapse in={stateError}>
                        <div className="mt-3">
                            <Alert id="state" variant="danger" className={`text-center w-100}`}> {stateError} </Alert>
                        </div>
                    </Collapse>
                    </Modal.Body>
                <Modal.Footer>
                <Button className="ButtonModalSectorForm" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button className="btDelete" onClick={Delete}>
                    Deletar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default Delete;
