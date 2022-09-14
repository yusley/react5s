import '../Styles/Accounts.css';
import logo from '../../../styles/img/logo/mercale5s.jpg';
import {Link, useLocation} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Alert, Collapse } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useContext, useEffect, useState } from "react";
import AuthContext from '../../../utils/AuthService/AuthContext';
import Load from '../../Reusable/Load/Load';

function Login(){

  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
  const registerSuccess = useLocation().state;
  const { loginUser } = useContext(AuthContext);
  const [userData, setUserData] = useState()
  const [showStore, setShowStore] = useState(false)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (registerSuccess){
      setShowStore(true);
      setTimeout(function(){setShowStore(false); window.history.replaceState({}, document.title);}, 5000);
    }
  }, []);

  const SignupSchema = Yup.object().shape({
    password: Yup.string()
      .required('A senha não pode ficar em branco'),
    email: Yup.string()
      .email('Esse endereço de email é invalido!')
      .required('O Email não pode ficar em branco'),
  });
  
  const formik = useFormik({
    initialValues: { email: "", password: "", },
    validationSchema : SignupSchema,
    validateOnChange : validateAfterSubmit,
    validateOnBlur : validateAfterSubmit,
    onSubmit: values => {
      setLoad(true)
      loginUser(values.email, values.password).then(data => {setUserData(data); setLoad(false)})

    }});

    return(
      <Container className="h-100">
        <Row className="row d-flex justify-content-center align-items-center h-100">
          <Col md={6}>
            <Card className="card_5S">
              <Card.Body>
                
                <Form id="loginform" onSubmit={formik.handleSubmit} noValidate>
                  <Col className="d-flex justify-content-center">
                    <Col className="brand_logo_container">
                      <Image className="img-fluid brand_logo" alt="Imagem responsiva" src={logo}/>
                    </Col> 
                  </Col>
                  
                  <Form.Group className="push-top-logo form-group mb-3">
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
                        onChange={(e) => {formik.handleChange("email")(e); setUserData()}}
                        className={formik.errors.email || userData ? "error" : null}
                        value={formik.values.email}
                        disabled ={(load)?true:false}
                      />
                    </InputGroup>
                    {formik.errors.email ? <Form.Text id="passworderror" className="text-danger">{formik.errors.email}</Form.Text> : null}
                  
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
                        placeholder="Digite sua Senha"
                        onChange={(e) => {formik.handleChange("password")(e); setUserData()}}
                        className={formik.errors.password || userData ? "error" : null}
                        value={formik.values.password}
                        disabled ={(load)?true:false}
                      />
                    </InputGroup>
                    {formik.errors.password ? <Form.Text id="passworderror" className="text-danger">{formik.errors.password}</Form.Text> : null}
                  </Form.Group>
                  { userData ? <Form.Text id="loginError" className={`text-danger`}> {userData} </Form.Text> : null}
                  <Col className="d-flex mt-3 w-100 justify-content-center">
                    {load ? <Load type='bubbles' color='#00004f' height='' width = '10%'/> :
                    <Button type="submit" onClick={() => {setValidateAfterSubmit(true)}} className="w-100">Logar</Button>}
                  </Col>
                  <Collapse in={showStore}>
                    <div className='mt-3'>
                      <Alert id="state" className={`text-success w-100 text-center`}> {registerSuccess} </Alert>
                    </div>
                  </Collapse>
                  <Col className="mt-4">
                    <p><Link className="text-justify" to="/resetarsenha">Esqueceu sua senha?</Link></p>
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

export default Login