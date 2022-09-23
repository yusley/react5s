import { useState, useEffect, useContext } from "react";
import '../Styles/Accounts.css';
import logo from '../../../styles/img/logo/mercale5s.jpg';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faEnvelope, faUser, faAddressCard, faUserTag} from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Image, InputGroup, Row, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import AuthContext from "../../../utils/AuthService/AuthContext";
import * as Yup from 'yup';
import GetOffice from "./OfficeServices/Offices";
import Load from "../../Reusable/Load/Load";

function Register(){

  const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
  const [office, setOffice] = useState([]);
  const [userData, setUserData] = useState()
  const {registerUser } = useContext(AuthContext)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    GetOffice().then(data => setOffice(data))
  }, []);
 
  const SignupSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Senha muito curta!')
      .max(15, 'Senha muito longa!')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'Sua senha deve conter caracteres especiais como ! @ # $ % ^ & * = + , . ; : etc), além de letras maiúsculas e minúsculas')
      .required('A senha não pode ficar em branco'),
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
  });
  
  const formik = useFormik({
    initialValues: { email: "",password: "", first_name: "", last_name: "", office: ""},
    validationSchema : SignupSchema,
    validateOnChange : validateAfterSubmit,
    validateOnBlur : validateAfterSubmit,
    
    onSubmit: values => {
      setLoad(true)
      registerUser(values.email,values.password,values.first_name,values.last_name,values.office)
      .then(data => {setUserData(data); setLoad(false)})
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
                  {formik.errors.email ? <Form.Text id="emailError" className="text-danger">{formik.errors.email}</Form.Text> : null}
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
                      aria-describedby="passworderror"
                      placeholder="Digite sua Senha"
                      onChange={formik.handleChange}
                      className={formik.errors.password ? "error" : null}
                      value={formik.values.password}
                      disabled ={(load)?true:false}
                    />
                  </InputGroup>
                  {formik.errors.password ? <Form.Text id="passworderror" className="text-danger">{formik.errors.password}</Form.Text> : null}
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
                          disabled ={(load)?true:false}
                        />
                      </InputGroup>
                      {formik.errors.first_name ? <Form.Text id="passworderror" className="text-danger">{formik.errors.first_name}</Form.Text> : null}
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
                          disabled ={(load)?true:false}
                        />
                      </InputGroup>
                      {formik.errors.last_name ? <Form.Text id="passworderror" className="text-danger">{formik.errors.last_name}</Form.Text> : null}
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
                      disabled ={(load)?true:false}
                      >                      
                      <option value="" disabled>Selecione um cargo</option>
                      {office.map((office) => <option key={office.id} value={office.id}>{office.name}</option>)}
                    </Form.Select>
                  </InputGroup>
                  {formik.errors.office ? <Form.Text id="officeerror" className="text-danger">{formik.errors.office}</Form.Text> : null}
                </Form.Group>
                <Col className="d-flex mt-3 w-100 justify-content-center">
                  {load ? <Load type='bubbles' color='#00004f' height='' width = '10%'/> :
                  <Button type="submit" onClick={() => {setValidateAfterSubmit(true); formik.handleSubmit();}} className="w-100">Cadastrar</Button>}
                </Col>
                <Col className="d-flex">
                  { userData ? <Form.Text id="registerError" className={"text-danger text-center w-100 mt-1"}>{userData.email} </Form.Text > : null}
                </Col>
                
                <Col className="mt-4">
                  <Link className="text-justify" to="/login">Já tem uma conta?</Link>
                </Col>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Register