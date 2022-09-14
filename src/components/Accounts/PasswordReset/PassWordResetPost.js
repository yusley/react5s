import '../Styles/Accounts.css';
import logo from '../../../styles/img/logo/mercale5s.jpg';
import {Link, useLocation} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faEnvelope, faCode } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Alert, Collapse } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useContext, useEffect, useState } from "react";
import axios from "axios";

function PassWordResetPost(){

  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
  const [success, setSuccess] = useState('');
  const [error,setError] = useState()

  const SignupSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Senha muito curta!')
      .max(15, 'Senha muito longa!')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'Sua senha deve conter caracteres especiais como ! @ # $ % ^ & * = + , . ; : etc), além de letras maiúsculas e minúsculas')
      .required('A senha não pode ficar em branco'),
    code: Yup.string()
      .required('O código não pode ficar em branco'),
  });
  
  const formik = useFormik({
    initialValues: { email: "", password: ""},
    validationSchema : SignupSchema,
    validateOnChange : validateAfterSubmit,
    validateOnBlur : validateAfterSubmit,
    onSubmit: values => {
        setSuccess()
        setError()

        axios.post(`/users/password_reset/confirm/`, {
            token: values.code,
            password: values.password,
        })
        .then((element) => {
            setSuccess(`Parabéns! Sua senha foi alterada com sucesso! agora vamos fazer o login, para isso basta clicar `); 
            setError();
            
        })
        .catch((err) => {
            setError(err.response.data); 
            setSuccess()
        })

        values.email = ''
    }});

    return(
      <Container className="h-100">
        <Row className="row d-flex justify-content-center align-items-center h-100">
          <Col md={6}>
            <Card className="card_5S">
              <Card.Body>
                <Form id="loginform" onSubmit={formik.handleSubmit} noValidate>
                    {success ? null
                    :
                    <>
                    <Col className="d-flex justify-content-center form-group mb-3">
                        <h2>Inserir nova senha</h2>
                    </Col>
                    
                    <Form.Group className="form-group mb-3">
                        <InputGroup>
                        <div className="input-group-append">
                            <span className="input-group-text"><FontAwesomeIcon icon={faCode}/></span>
                        </div>
                        <Form.Control 
                            type="text"
                            id="code"
                            name="code"
                            aria-describedby="codeError"
                            placeholder="Digite o código recebido no seu email"
                            onChange={(e) => {formik.handleChange("code")(e)}}
                            className={formik.errors.code || error ? "error" : null}
                            value={formik.values.code}
                        />
                        </InputGroup>
                        {formik.errors.code ? <Form.Text id="emailError" className="text-danger">{formik.errors.code}</Form.Text> : null}
                    
                        </Form.Group>
                        <Form.Group className="form-group mb-3">
                            <InputGroup>
                            <div className="input-group-append">
                                <span className="input-group-text"><FontAwesomeIcon icon={faKey}/></span>
                            </div>
                            <Form.Control
                                type="password"
                                id="password"
                                name="password"
                                aria-describedby="passwo rderror"
                                placeholder="Digite sua nova senha"
                                onChange={(e) => {formik.handleChange("password")(e)}}
                                className={formik.errors.password ? "error" : null}
                                value={formik.values.password}
                            />
                            </InputGroup>
                            {formik.errors.password ? <Form.Text id="passworderror" className="text-danger">{formik.errors.password}</Form.Text> : null}
                        </Form.Group>
                        <Col className="d-flex mt-3 w-100">
                            <Button type="submit" onClick={() => {setValidateAfterSubmit(true)}} className="w-100">Salvar nova senha</Button>
                        </Col>
                    </>
                    }
                
                  <Collapse in={success}>
                    <div className='mt-3'>
                      <Alert id="state" className={`text-success w-100 text-center`}> <h4>{success}<Link to="/login">aqui!</Link></h4></Alert>
                    </div>
                  </Collapse>
                  <Collapse in={error}>
                    <div className='mt-3'>
                      <Alert id="state" className={`text-success w-100 text-center`}> {error}</Alert>
                    </div>
                  </Collapse>
                  {success ? null
                    :
                  <Col className="mt-4">
                    <p><Link className="text-justify" to="/login">Cancelar</Link></p>
                  </Col>
                  }
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
}

export default PassWordResetPost