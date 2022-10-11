import '../Styles/Accounts.css';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, InputGroup, Row, Alert, Collapse } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import axios from "axios";
import Load from '../../Reusable/Load/Load';

function PasswordReset(){

  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
  const [success, setSuccess] = useState('');
  const [error,setError] = useState()
  const [load, setLoad] = useState(false)

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email('Esse endereço de email é invalido!')
      .required('O Email não pode ficar em branco'),
  });
  
  const formik = useFormik({
    initialValues: { email: ""},
    validationSchema : SignupSchema,
    validateOnChange : validateAfterSubmit,
    validateOnBlur : validateAfterSubmit,
    onSubmit: values => {
        setSuccess()
        setError()
        setLoad(true)

        axios.post(`/users/password_reset/`, {
            email: values.email,
        })
        .then((element) => {
            setSuccess(`Pedido de reset enviado com sucesso para o email ${values.email}, verifique sua caixa de spam e a lixeira caso o email não seja recebido!`); 
            setError();
            setLoad(false)
            values.email = ''
        })
        .catch((err) => {
            if (err.response.data.email){
              console.log(err)
              setError('Não existe nenhuma conta com esse email no sistema'); 
            }
            else{
              console.log(err)
              setError('Ocorreu um erro desconhecido! Contate a equipe de TI para mais informações');
            }
            setSuccess()
            setLoad(false)
            values.email = ''
        })
    }});

    return(
      <Container className="h-100">
        <Row className="row d-flex justify-content-center align-items-center h-100">
          <Col md={6}>
            <Card className="card_5S">
              <Card.Body>
                
                <Form id="loginform"  onSubmit={formik.handleSubmit} noValidate>
                  <Col className="d-flex justify-content-center form-group mb-3">
                    <h2>Solicitar recuperação de senha</h2>
                  </Col>
                  
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
                        onChange={(e) => {formik.handleChange("email")(e)}}
                        className={formik.errors.email || error ? "error" : null}
                        value={formik.values.email}
                        disabled ={(load)?true:false}
                      />
                    </InputGroup>
                    {formik.errors.email ? <Form.Text id="emailError" className="text-danger">{formik.errors.email}</Form.Text> : null}
                  
                  </Form.Group>
                  <Col className="d-flex mt-3 w-100 justify-content-center">
                    {load ? <Load height='' width = '8%'/> 
                    : <Button type="submit" onClick={() => {setValidateAfterSubmit(true)}} className="w-100">Enviar</Button>
                    }
                  </Col>
                  <Collapse in={success}>
                    <div className='mt-3'>
                      <Alert id="state" className={`text-success w-100 text-center`}> {success} </Alert>
                    </div>
                  </Collapse>
                  <Collapse in={error}>
                    <div className='mt-3'>
                      <Alert variant={'danger'} id="state" className={`text-danger w-100 text-center`}> {error} </Alert>
                    </div>
                  </Collapse>
                  <Col className="mt-4">
                    <p><Link className="text-justify" to="/login">Voltar ao login</Link></p>
                    <Link className="text-justify" to="/cadastro">Ainda não tem uma conta?</Link>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
}

export default PasswordReset