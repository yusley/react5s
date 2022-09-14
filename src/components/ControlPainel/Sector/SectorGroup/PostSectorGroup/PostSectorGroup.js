import {useFormik} from "formik";
import * as Yup from 'yup'
import { Alert, Button, Card, Col, Collapse, Container, Form, Image, InputGroup, Row, Dropdown} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faIndustry} from '@fortawesome/free-solid-svg-icons'
import {Link, Navigate, useLocation, useNavigate, useParams} from 'react-router-dom'
import {useEffect, useState } from "react";
import React from "react";
import useAxios from "../../../../../utils/useAxios";
import ModalGalery from "../../PostSector/ModalGalery";
import Gallery from "react-photo-gallery";
import styles from './SectorGroup.module.css'

function PostSectorGroup(){
    const sectorData = useLocation().state
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const api = useAxios()
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()
    const {id} = useParams();
    const navigate = useNavigate()
    const [photoPreview, setPhotoPreview] = useState([])
    const [branchs, setBranchs] = useState([])

    const SignupSchema = Yup.object().shape({
        branch: Yup.string()
            .required('Você precisa selecionar uma filial!'),
        imageId: Yup.string()
            .required('Você precisa selecionar uma imagem!'),
        name : Yup.string()
            .min(1, 'Nome muito curto')
            .max(15, 'O nome deve ter menos de 15 characteres!')
            .required('você deve informar o nome do setor!'),
        description : Yup.string()
            .min(5, 'Descrição muito curta!')
            .max(110, 'A descrição do setor não precisa ser tão grande!')
            .required('A descrição do setor não pode ficar vazia!')
        
    })
    
    const formik = useFormik({

        initialValues : {branch : sectorData ? sectorData.branch : '', name : sectorData ? sectorData.name : '', id: '', imageId: sectorData ? sectorData.imageId : '', description : sectorData ? sectorData.description : ""},
        validationSchema: SignupSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: validateAfterSubmit,
        enableReinitialize: true,
      
        onSubmit: values => {
            if(sectorData){
                
                api.patch(`/sectorsGroup/${id}/`, {
                    name: values.name,
                    image: values.imageId,
                    branchName: values.branch,
                    description : values.description
                })
                .then(element => {
                    if(element.status === 200){
                        navigate('/setores')
                    }})
                .catch(err =>  {
                    console.log(err.request.response); 
                    setStateError("Já existe um setor registrado com esse nome!"); 
                    setState();})

            }else{
                
                var data = new FormData()
                
                data.append('branchName',values.branch)
                data.append('image',values.imageId)
                data.append('name',values.name)
                data.append('description', values.description)
                data.append('is_active', true)

                api.post("/sectorsGroup/",data, {
                    "Content-Type": "application/json"
                })
                .then(element => {
                    if(element.status === 201){
                        setState('Setor Criado com sucesso!')
                        setStateError()
                        setTimeout(function(){setState() }, 3000);
                        setValidateAfterSubmit(false)
                        
                        formik.values.name = ""
                        formik.values.imageId = ""
                        formik.values.description = ""
                        formik.values.branch = ""
                        setPhotoPreview([])
                    }
                })
                .catch(err =>  {
                    console.log(err.request.response); 
                    setStateError("Já existe um setor registrado com esse nome!"); 
                    setState();})
            }
        }
    })

    useEffect(() => {
        
        
        api.get(`/branch/`)
        .then((element) => {
         
            setBranchs(element.data.results)
        })
        .catch((err) => {console.log(err)})



        if (sectorData){
            
            api.get(`/imagesectors/${sectorData.id}/`) 
            .then(returnImage => {
               
                setPhotoPreview([{src: returnImage.data.image,
                    width: 3,
                    height: 1}])
            })
    }},[])

    

    const ImageClicked = (id, src) =>{
        formik.setFieldValue('imageId', id);
        setPhotoPreview([{src: src,
            width: 3,
            height: 1}])
    }

    return(

        <Container className="h-100">

            <Row className="d-flex justify-content-center align-items-center h-100">
                <Col sm={10} md={8} lg={6} xl={6} xxl={6}>
            
                    <Card className="card_5S">

                    

                    <Card.Body>
                        
                        
                        <Form id="sectoresform" onSubmit={formik.handleSubmit} noValidate>
                    
                        <Form.Group className="form-group mb-3 text-center">
                        {sectorData ? <h2>Editar o setor: {formik.values.name} </h2> : <h2>Cadastrar Setor</h2>}
                        </Form.Group>

                        <Gallery photos={photoPreview}></Gallery>
                        <Col className="w-100">
                            <ModalGalery className="w-100" clickImage = {ImageClicked}></ModalGalery>
                        </Col>
                        <Form.Control 
                                type="number"
                                id="imageId"
                                name="imageId"
                                aria-describedby="imageidError"
                                placeholder="ID da imagem"
                                onChange={formik.handleChange}
                                className="d-none"
                                value={formik.values.imageId}
                            />

                        <Form.Group className="form-group mb-3">
                            
                            {formik.errors.imageId ? <Form.Text id="imageidError" className="text-danger">{formik.errors.imageId}</Form.Text> : null}
                        </Form.Group>

                        <Form.Group className="form-group mb-3">

                            <InputGroup className={styles.selectSectorsGroups}>
                                <div className="input-group-append">
                                    <span className="input-group-text"><FontAwesomeIcon icon={faIndustry}/></span>
                                </div>

                                <Form.Select aria-label="select" 
                                    name = "branch"
                                    id = "branch"
                                    onChange={(e) => {formik.handleChange("branch")(e); setStateError()}}
                                    value={formik.values.branch}

                                >
                                    <option>Selecione a filial</option>
                                    {
                                        branchs.map((element) => <option value={element.id}>{`${element.id} - ${element.address}`}</option>)
                                        
                                    }
                                    
                                    
                                </Form.Select>


                                
                                
                               
                            </InputGroup>
                            <Form.Group className="form-group mb-3">
                                    {formik.errors.branch ? <Form.Text id="imageidError" className="text-danger">{formik.errors.branch}</Form.Text> : null}
                            </Form.Group>
                            

                            

                           

                            <InputGroup>
                            <div className="input-group-append">
                                <span className="input-group-text"><FontAwesomeIcon icon={faIndustry}/></span>
                            </div>
                            <Form.Control 
                                type="name"
                                id="name"
                                name="name"
                                aria-describedby="emailError"
                                placeholder="Nome do Setor"
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
                                    placeholder="Descrição do setor"
                                    onChange={formik.handleChange}
                                    className={formik.errors.description ? "error textAreaFormSector5S" : 'textAreaFormSector5S'}
                                    value={formik.values.description}
                                />
                                </InputGroup>
                                {formik.errors.description ? <Form.Text id="passworderror" className="text-danger">{formik.errors.description}</Form.Text> : null}
                            </Col>
                            
                            </Row>
                        </Form.Group>
                        <Col className="d-flex mt-3 w-100">
                            <Button type="submit" onClick= {() =>{setValidateAfterSubmit(true)}} className="w-100">{sectorData ? <text>Confirmar edição</text> : <text>Cadastrar Setor</text>}</Button>
                        </Col>
                        <Col className="d-flex mt-2">
                            <Link to="/setores">Lista de setores</Link>
                        </Col>
                        
                        <Collapse in={state}>
                            <div className="mt-3">
                                <Alert id="state" className={`text-success text-center w-100}`}> {state} </Alert>
                            </div>
                        </Collapse>
                        
                        </Form>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )


}

export default PostSectorGroup;