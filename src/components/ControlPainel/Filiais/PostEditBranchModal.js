import { useState } from "react";
import * as Yup from 'yup'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faEdit,faPencil } from '@fortawesome/free-solid-svg-icons'
import { Alert, Button, Col, Collapse, Dropdown, Form, InputGroup, Modal, Row } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";

function PostEditBranchModal(props){

    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const id = props.id
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()


    const SignupSchema = Yup.object().shape({
        address : Yup.string()
            .min(10, `Endereço muito curto`)
            .max(255, `O endereço está longo de mais!`)
            .required(`você deve informar o endereço da ${props.objectName}!`),
        number : Yup.string()
            .min(1, `Número muito curto!`)
            .max(9, `O número do ${props.objectName} não pode ser tão grande!`)
            .required(`O número da ${props.objectName} não pode ficar vazio!`)
        
    })

    const formik = useFormik({
        
        initialValues : {address : props.is_edit ? props.address : '', number : props.is_edit ? props.number : ''},
        validationSchema: SignupSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: validateAfterSubmit,
        enableReinitialize: true,
      
        onSubmit: values => {
            if(props.is_edit){
                
                api.patch(`${props.route}${id}/`, {
                    address: values.address,
                    number : values.number
                })
                .then(element => {
                    if(element.status === 200){
                        reloadTableActive()
                        setStateError()
                        handleClose()
                    }})
                .catch(err =>  {
                    console.log(err.request.response); 
                    setStateError(`Já existe uma ${props.objectName} registrada com esse número!`); 
                    setState();})

            }else{
                
                var data = new FormData()
                data.append('address',values.address)
                data.append('number', values.number)
                data.append('is_active', true)

                api.post(`${props.route}`,data, {
                    "Content-Type": "application/json"
                })
                .then(element => {
                    if(element.status === 201){
                        setState(`${props.objectName} criada com sucesso!`)
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
                    setStateError(`Já existe uma ${props.objectName} registrada com esse número!`); 
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
            <Button onClick={handleShow} className="text-nowrap">Nova Filial</Button>
            }

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{props.is_edit ? `Editar a ${props.objectName} ${props.name}`: `Criar uma nova ${props.objectName}`}</Modal.Title>
                </Modal.Header>
                <Form id="sectoresform" onSubmit={formik.handleSubmit} noValidate>
                    <Modal.Body>

                        <Form.Group className="form-group mb-3">
                            <InputGroup>
                            <div className="input-group-append">
                                <span className="input-group-text"><FontAwesomeIcon icon={faUserGroup}/></span>
                            </div>
                            <Form.Control 
                                type="number"
                                id="number"
                                name="number"
                                aria-describedby="numberError"
                                placeholder={`Número da ${props.objectName}`}
                                onChange={(e) => {formik.handleChange("number")(e); setStateError()}}
                                className={formik.errors.number || stateError ? "error" : null}
                                value={formik.values.number}
                            />
                            </InputGroup>
                            {formik.errors.number ? <Form.Text id="numberError" className="text-danger">{formik.errors.number}</Form.Text> : null}
                            {stateError ? <Form.Text id="backenderror" className="text-danger">{stateError}</Form.Text> : null}
                        </Form.Group>

                        <div id="fa-icon-chooser-container"></div>
                        <Form.Group className="form-group mb-3">
                            <Col>
                                <InputGroup>
                                <div className="input-group-append">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faPencil}/></span>
                                </div>
                                <Form.Control
                                    rows={3}
                                    type="textarea"
                                    id="address"
                                    as="textarea"
                                    name="address"
                                    aria-describedby="addressError"
                                    placeholder={`Endereço da ${props.objectName}`}
                                    onChange={formik.handleChange}
                                    className={formik.errors.address ? "error textAreaFormSector5S" : 'textAreaFormSector5S'}
                                    value={formik.values.address}
                                />
                                </InputGroup>
                                {formik.errors.address ? <Form.Text id="addressError" className="text-danger">{formik.errors.address}</Form.Text> : null}
                            </Col>
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


export default PostEditBranchModal;
