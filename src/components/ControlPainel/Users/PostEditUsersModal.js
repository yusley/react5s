import { useState } from "react";
import * as Yup from 'yup'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faEdit,faPencil } from '@fortawesome/free-solid-svg-icons'
import { Alert, Button, Col, Collapse, Dropdown, Form, InputGroup, Modal, Row } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";

function PostEditUsersModal(props){

    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const id = props.id
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()


    const SignupSchema = Yup.object().shape({
        name : Yup.string()
            .min(1, `Nome muito curto`)
            .max(15, `O nome deve ter menos de 15 characteres!`)
            .required(`você deve informar o nome do ${props.objectName}!`),
        description : Yup.string()
            .min(5, `Descrição muito curta!`)
            .max(110, `A descrição do ${props.objectName} não pode ser tão grande!`)
            .required(`A descrição do ${props.objectName} não pode ficar vazia!`)
        
    })

    const formik = useFormik({
        
        initialValues : {name : props.is_edit ? props.name : '', description : props.is_edit ? props.description : ''},
        validationSchema: SignupSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: validateAfterSubmit,
        enableReinitialize: true,
      
        onSubmit: values => {
            if(props.is_edit){
                
                api.put(`${props.route}${id}/`, {
                    name: values.name,
                    description : values.description
                })
                .then(element => {
                    if(element.status === 200){
                        reloadTableActive()
                        setStateError()
                        handleClose()
                    }})
                .catch(err =>  {
                    console.log(err.request.response); 
                    setStateError(`Já existe um ${props.objectName} registrado com esse nome!`); 
                    setState();})

            }else{
                
                var data = new FormData()
                data.append('name',values.name)
                data.append('description', values.description)

                api.post(`${props.route}`,data, {
                    "Content-Type": "application/json"
                })
                .then(element => {
                    if(element.status === 201){
                        setState(`${props.objectName} criado com sucesso!`)
                        setStateError()
                        setTimeout(function(){setState() }, 3000);
                        setValidateAfterSubmit(false)
                        
                        formik.values.name = ""
                        formik.values.description = ""
                        reloadTableActive()
                    }
                })
                .catch(err =>  {
                    console.log(err.request.response); 
                    setStateError(`Já existe um ${props.objectName} registrado com esse nome!`); 
                    setState();})
            }
        }
    })

    const reloadTableActive = () =>{
        api.get(`${props.route}?search=${props.searchvalue}&is_active=${props.is_active}&ordering=${props.ordering}`)
            .then( element => {
                props.reloadTableActive(element.data)
            })
            .catch(err => console.log(err))
            }

    return(
        <>
            {props.is_edit ? 
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="green" icon={faEdit}></FontAwesomeIcon> </span>Editar {props.objectName}</Dropdown.Item>
            :
            <Button onClick={handleShow} className="text-nowrap">Novo cargo</Button>
            }

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{props.is_edit ? `Editar o ${props.objectName} ${props.name}`: `Criar um novo ${props.objectName} cargo`}</Modal.Title>
                </Modal.Header>
                <Form id="sectoresform" onSubmit={formik.handleSubmit} noValidate>
                    <Modal.Body>

                        <Form.Group className="form-group mb-3">
                            <InputGroup>
                            <div className="input-group-append">
                                <span className="input-group-text"><FontAwesomeIcon icon={faUserGroup}/></span>
                            </div>
                            <Form.Control 
                                type="name"
                                id="name"
                                name="name"
                                aria-describedby="nameError"
                                placeholder={`Nome do ${props.objectName}`}
                                onChange={(e) => {formik.handleChange("name")(e); setStateError()}}
                                className={formik.errors.name || stateError ? "error" : null}
                                value={formik.values.name}
                            />
                            </InputGroup>
                            {formik.errors.name ? <Form.Text id="nameError" className="text-danger">{formik.errors.name}</Form.Text> : null}
                            {stateError ? <Form.Text id="backenderror" className="text-danger">{stateError}</Form.Text> : null}
                        </Form.Group>

                        <div id="fa-icon-chooser-container"></div>
                        <Form.Group className="form-group mb-3">
                            <Row>
                            <Col>
                                <InputGroup>
                                <div className="input-group-append">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faPencil}/></span>
                                </div>
                                <Form.Control
                                    rows={2}
                                    type="text"
                                    id="description"
                                    as="textarea"
                                    name="description"
                                    aria-describedby="descriptionError"
                                    placeholder={`Descrição do ${props.objectName}`}
                                    onChange={formik.handleChange}
                                    className={formik.errors.description ? "error textAreaFormSector5S" : 'textAreaFormSector5S'}
                                    value={formik.values.description}
                                />
                                </InputGroup>
                                {formik.errors.description ? <Form.Text id="descriptionError" className="text-danger">{formik.errors.description}</Form.Text> : null}
                            </Col>
                            
                            </Row>
                        </Form.Group>          
                        <Collapse in={state}>
                            <div className="mt-3">
                                <Alert id="state" className={`text-success text-center w-100}`}> {state} </Alert>
                            </div>
                        </Collapse>
                
                    </Modal.Body>
                <Modal.Footer>
                <Button className="ButtonModalSectorForm" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button type='submit' onClick= {() =>{setValidateAfterSubmit(true)}}>
                    Enviar
                </Button>
                </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}


export default PostEditUsersModal;
