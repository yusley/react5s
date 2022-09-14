import { useEffect, useState } from "react";
import * as Yup from 'yup'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faEdit,faPencil, faEnvelope, faKey, faUser, faUserTag, faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { Alert, Button, Col, Collapse, Dropdown, Form, InputGroup, Modal, Row } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";
import GetOffice from "../Register/OfficeServices/Offices";

function ImageEditModal(props){
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const [office, setOffice] = useState([]);
    const [officeInitialValue, setOfficeInitialValue] = useState(1);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const id = props.id
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
        .max(50, 'Ta me zoando é? Não existe um email desse tamanho!')
        .email('Esse endereço de email é invalido!')
        .required('O Email não pode ficar em branco'),
        first_name: Yup.string()
        .min(2, 'Muito curto!')  
        .max(50, 'Ta me zoando é? Não existe um nome desse tamanho! E se existir você deveria processar seus pais')
        .required('Não pode ficar em branco'),
        last_name: Yup.string()
        .min(2, 'Muito curto!')  
        .max(50, 'Ta me zoando é? Não existe um sobrenome desse tamanho! E se existir você deveria processar seus pais')
        .required('Não pode ficar em branco'),
        office: Yup.string()
        .required('Selecione um cargo da lista'),
    })

    const formik = useFormik({
        
        initialValues : {first_name : props.first_name, last_name : props.last_name, email: props.email, office: officeInitialValue},
        validationSchema: SignupSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: validateAfterSubmit,
        enableReinitialize: true,
      
        onSubmit: values => {
                console.log(formik.values.office)
                api.patch(`${props.route}${id}/`, {
                    first_name: values.first_name,
                    last_name : values.last_name,
                    email: values.email,
                    office: values.office
                })
                .then(element => {
                    if(element.status === 200){
                        reloadTableActive()
                        setStateError()
                        handleClose()
                    }})
                .catch(err =>  {
                    setStateError('Já existe um usuário cadastrado com esse email!'); 
                    setState();})
        }
    })

    useEffect(() => {
        GetOffice().then(data => setOffice(data))
        GetOffice().then(data => 
            data.map(item => {
                if(item.name == props.office){
                    setOfficeInitialValue(item.id)
            }})
    )},[])

    const reloadTableActive = () =>{
        api.get(`${props.routeGet}`)
            .then( element => {
                props.reloadTableActive(element.data)
            })
            .catch(err => console.log(err))
            }
            
    return(
        <>
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="green" icon={faEdit}></FontAwesomeIcon> </span>Editar meus dados</Dropdown.Item>

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Editar meus dados</Modal.Title>
                </Modal.Header>
                <Form id="sectoresform" onSubmit={formik.handleSubmit} noValidate>
                    <Modal.Body>

                    <Form.Group className="form-group mb-3">
                        <InputGroup>
                            <div className="input-group-append">
                            <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope}/></span>
                            </div>
                            <Form.Control 
                            type="email"
                            id="email"
                            name="email"
                            aria-describedby="emailError"
                            placeholder="Digite seu email"
                            onChange={(e) => {formik.handleChange("email")(e); setState()}}
                            className={formik.errors.email || stateError ? "error" : null}
                            value={formik.values.email}
                            />
                        </InputGroup>
                        {formik.errors.email ? <Form.Text id="emailError" className="text-danger">{formik.errors.email}</Form.Text> : null}
                    </Form.Group>

                    <Form.Group className="form-group mb-3">
                        <Row>
                            <Col>
                                <InputGroup>
                                    <div className="input-group-append">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faUser}/></span>
                                    </div>
                                    <Form.Control
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    aria-describedby="first_nameError"
                                    placeholder="Primeiro nome"
                                    onChange={formik.handleChange}
                                    className={formik.errors.first_name ? "error" : null}
                                    value={formik.values.first_name}
                                    />
                                </InputGroup>
                                {formik.errors.first_name ? <Form.Text id="first_nameError" className="text-danger">{formik.errors.first_name}</Form.Text> : null}
                            </Col>
                            <Col>
                                <InputGroup>
                                    <div className="input-group-append">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faUserTag}/></span>
                                    </div>
                                    <Form.Control
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    aria-describedby="last_nameError"
                                    placeholder="Sobrenome"
                                    onChange={formik.handleChange}
                                    className={formik.errors.last_name ? "error" : null}
                                    value={formik.values.last_name}
                                    />
                                </InputGroup>
                                {formik.errors.last_name ? <Form.Text id="last_nameError" className="text-danger">{formik.errors.last_name}</Form.Text> : null}
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="form-group mb-3">
                        <InputGroup>
                            <div className="input-group-append">
                            <span className="input-group-text"><FontAwesomeIcon icon={faAddressCard}/></span>
                            </div>
                            <Form.Select 
                            id="office"
                            name="office"
                            aria-describedby="officederror"
                            onChange={formik.handleChange}
                            className={formik.errors.office ? "error" : null}
                            value={formik.values.office}
                            >                      
                            <option value="" disabled>Selecione um cargo</option>
                            {office.map((office) => <option key={office.id} value={office.id}>{office.name}</option>)}
                            </Form.Select>
                        </InputGroup>
                        {formik.errors.office ? <Form.Text id="officederror" className="text-danger">{formik.errors.office}</Form.Text> : null}
                    </Form.Group>         
                        <Collapse in={stateError}>
                            <div className="mt-3">
                                <Alert variant={'danger'} id="state" className={`text-danger text-center w-100}`}> {stateError} </Alert>
                            </div>
                        </Collapse>
                
                    </Modal.Body>
                <Modal.Footer>
                <Button className="ButtonModalSectorForm" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button type='submit' onClick= {() =>{setValidateAfterSubmit(true)}}>
                    Salvar
                </Button>
                </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ImageEditModal;