import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../../../../utils/useAxios";

const ModalResponseForm = (props) => {
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const navigate = useNavigate();

    const responseStatus = formidd =>{
        
        api.get(`/formresponse/?formId=${formidd}`)
        .then((element) => {
            if (element.data.results.length > 0){
                handleShow()
            }
            else{
                navigate(`/responderformulario/${formidd}`)
            }
        })
        .catch((err) => console.log(err))
    }

    return(
        
        <>
            <a className="link5S linksTableForm5s" onClick={(e) => {responseStatus(props.id)}}>
                <FontAwesomeIcon size="2x" icon={faFolderOpen}/>
            </a>
            <Modal show={show} keyboard={true} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Esse formulário já foi respondido!
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>Você gostaria de editar a resposta?</Modal.Body>
                <Modal.Footer>
                    <Button className="btDelete" onClick={handleClose}>Não</Button>
                    <Button className="btnAdd" as={Link} to={`/responderformulario/${props.id}`} onClick={handleClose}>Sim</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default ModalResponseForm;