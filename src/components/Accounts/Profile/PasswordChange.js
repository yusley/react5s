import { useState } from "react";
import * as Yup from 'yup'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faKey, faFileEdit, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import { Alert, Button, Collapse, Dropdown, Form, InputGroup, Modal } from "react-bootstrap";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";

function PasswordChange(props){
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const api = useAxios()
    const id = props.id
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()
    const [stateErrorNewPassword, setStateErrorNewPassword] = useState()

    const SignupSchema = Yup.object().shape({
        oldpassword: Yup.string()
        .min(8, 'Senha muito curta!')
        .max(15, 'Senha muito longa!')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'Sua senha deve conter caracteres especiais como ! @ # $ % ^ & * = + , . ; : etc), além de letras maiúsculas e minúsculas')
        .required('A senha não pode ficar em branco'),
        newpassword: Yup.string()
        .min(8, 'Senha muito curta!')
        .max(15, 'Senha muito longa!')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'Sua senha deve conter caracteres especiais como ! @ # $ % ^ & * = + , . ; : etc), além de letras maiúsculas e minúsculas')
        .required('A senha não pode ficar em branco'),
        newpassword2: Yup.string()
        .min(8, 'Senha muito curta!')
        .max(15, 'Senha muito longa!')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'Sua senha deve conter caracteres especiais como ! @ # $ % ^ & * = + , . ; : etc), além de letras maiúsculas e minúsculas')
        .required('A senha não pode ficar em branco'),
    })

    const formik = useFormik({
        
        initialValues : {oldpassword : '', newpassword : '', newpassword2: ''},
        validationSchema: SignupSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: validateAfterSubmit,
        enableReinitialize: true,
      
        onSubmit: values => {
                api.patch(`${props.route}${id}/`, {
                    old_password: values.oldpassword,
                    new_password1 : values.newpassword,
                    new_password2: values.newpassword2
                })
                .then(element => {
                    if(element.status === 200){
                        setStateError()
                        setStateErrorNewPassword()
                        setState('Senha alterada com sucesso!')
                    }})
                .catch(err =>  {
                    console.log(err)
                    if (err.response.data['old_password']){
                        setStateError(err.response.data['old_password'][0]);
                        setStateErrorNewPassword() 
                    }
                    else if (err.response.data['non_field_errors']){
                        setStateErrorNewPassword(err.response.data['non_field_errors'][0]); 
                        setStateError()
                    }
                    else{
                        setStateErrorNewPassword(err.response.data); 
                        setStateError()
                    }
                    setState();})
        }
    })
            
    return(
        <>
            <Dropdown.Item onClick={handleShow}><span><FontAwesomeIcon color="green" icon={faFileEdit}></FontAwesomeIcon> </span>Trocar senha</Dropdown.Item>

            <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Trocar minha senha</Modal.Title>
                </Modal.Header>
                <Form id="sectoresform" onSubmit={formik.handleSubmit} noValidate>
                    <Modal.Body>

                    <Form.Group className="form-group mb-5">
                        <InputGroup>
                            <div className="input-group-append">
                            <span className="input-group-text"><FontAwesomeIcon icon={faKey}/></span>
                            </div>
                            <Form.Control 
                            type="password"
                            id="oldpassword"
                            name="oldpassword"
                            aria-describedby="oldpasswordError"
                            placeholder="Digite sua senha atual"
                            onChange={(e) => {formik.handleChange("oldpassword")(e); setState()}}
                            className={formik.errors.oldpassword || stateError ? "error" : null}
                            value={formik.values.oldpassword}
                            />
                        </InputGroup>
                        {formik.errors.oldpassword ? <Form.Text id="emailError" className="text-danger">{formik.errors.oldpassword}</Form.Text> : null}
                    </Form.Group>
                    
                    <Form.Group className="form-group mb-3">
                        <InputGroup>
                            <div className="input-group-append">
                            <span className="input-group-text"><FontAwesomeIcon icon={faKeyboard}/></span>
                            </div>
                            <Form.Control 
                            type="password"
                            id="newpassword"
                            name="newpassword"
                            aria-describedby="newpasswordError"
                            placeholder="Digite sua nova senha"
                            onChange={(e) => {formik.handleChange("newpassword")(e)}}
                            className={formik.errors.newpassword || stateErrorNewPassword ? "error" : null}
                            value={formik.values.newpassword}
                            />
                        </InputGroup>
                        {formik.errors.newpassword ? <Form.Text id="emailError" className="text-danger">{formik.errors.newpassword}</Form.Text> : null}
                    </Form.Group> 
                    
                    <Form.Group className="form-group mb-3">
                        <InputGroup>
                            <div className="input-group-append">
                            <span className="input-group-text"><FontAwesomeIcon icon={faKeyboard}/></span>
                            </div>
                            <Form.Control 
                            type="password"
                            id="newpassword2"
                            name="newpassword2"
                            aria-describedby="newpassword2Error"
                            placeholder="Repita sua nova senha"
                            onChange={(e) => {formik.handleChange("newpassword2")(e)}}
                            className={formik.errors.newpassword2 || stateErrorNewPassword ? "error" : null}
                            value={formik.values.newpassword2}
                            />
                        </InputGroup>
                        {formik.errors.newpassword2 ? <Form.Text id="emailError" className="text-danger">{formik.errors.newpassword2}</Form.Text> : null}
                    </Form.Group>        
                    <Collapse in={stateError}>
                        <div className="mt-3">
                            <Alert variant={'danger'} id="state" className={`text-danger text-center w-100}`}> {stateError} </Alert>
                        </div>
                    </Collapse>
                    <Collapse in={stateErrorNewPassword}>
                        <div className="mt-3">
                            <Alert variant={'danger'} id="state" className={`text-danger text-center w-100}`}> {stateErrorNewPassword} </Alert>
                        </div>
                    </Collapse>
                    <Collapse in={state}>
                        <div className="mt-3">
                            <Alert variant={'success'} id="state" className={`text-success text-center w-100}`}> {state} </Alert>
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

export default PasswordChange;