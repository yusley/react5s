import { faCheck, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import AuthContext from "../../../utils/AuthService/AuthContext";
import useAxios from "../../../utils/useAxios";

function ModalAddPermision(props){

    const { authTokens} = useContext(AuthContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()
    const [adminValue, setAdminValue] = useState(props.is_admin)
    const [superAdminValue, setSuperAdminValue] = useState(props.is_superAdmin)
    
    const is_active = true

    
    const save = () =>{
        handleClose()
        
        api.patch(`${props.route}${props.id}/`, {is_admin: adminValue, is_superuser: superAdminValue})
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
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="green" icon={faCheck}></FontAwesomeIcon> </span>Adicionar permissões {props.objectName}</Dropdown.Item>

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Adicionar novas permissões {props.objectName} {props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Administrador"
                        defaultChecked={props.is_admin}
                        onChange={(e) => {setAdminValue(e.target.checked)}}
                    />
                    {authTokens.user.is_superuser ?
                    <Form.Check 
                        type="switch"
                        label="Super administrador"
                        defaultChecked={props.is_superAdmin}
                        id="disabled-custom-switch"
                    />
                    : 
                    <Form.Check 
                        disabled
                        type="switch"
                        label="Super administrador"
                        defaultChecked={props.is_superAdmin}
                        id="disabled-custom-switch"
                        onChange={(e) => {setSuperAdminValue(e.target.checked)}}
                    />}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button className="ButtonModalSectorForm" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button className="btnAdd" onClick={save}>
                    Salvar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalAddPermision;