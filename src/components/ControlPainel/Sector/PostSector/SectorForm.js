import {useFormik} from "formik";
import * as Yup from 'yup'
import { Alert, Button, Card, Col, Collapse, Container, Form, Image, InputGroup, Row, Dropdown} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faIndustry} from '@fortawesome/free-solid-svg-icons'
import {Link, Navigate, useLocation, useNavigate, useParams} from 'react-router-dom'
import {useEffect, useState } from "react";
import React from "react";
import useAxios from "../../../../utils/useAxios";
import ModalGalery from "../PostSector/ModalGalery";
import Gallery from "react-photo-gallery";



function PostSectorGroup(){
    
    const sectorData = useParams();
    
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const api = useAxios()
    const [state, setState] = useState()
    const [stateError, setStateError] = useState()
    const navigate = useNavigate()
    const [photoPreview, setPhotoPreview] = useState([])
    const [sectorItem, setSectorItem] = useState()
    const SignupSchema = Yup.object().shape({
        
        imageId: Yup.string()
            .required('Você precisa selecionar uma imagem!'),
        name : Yup.string()
            .min(1, 'Nome muito curto')
            .max(15, 'O nome deve ter menos de 15 characteres!')
            .required('você deve informar o nome do setor!')
            .matches(/^([a-zA-Zà-úÀ-Ú0-9]|-|_|\s)+$/, 'Você não pode inserir characteres especiais como /,# etc'),
        description : Yup.string()
            .min(5, 'Descrição muito curta!')
            .max(110, 'A descrição do setor não precisa ser tão grande!')
            .required('A descrição do setor não pode ficar vazia!')
        
    })
    
   

    const formik = useFormik({

        initialValues : {name : sectorItem ? sectorItem.name : '', imageId: sectorItem ? sectorItem.image : '', description : sectorItem  ? sectorItem.description : ''},
        validationSchema: SignupSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: validateAfterSubmit,
        enableReinitialize: true,
      
       
        onSubmit: values => {
            if(sectorData.is_edit != 'no'){
                api.patch(`/sectors/${sectorData.sectorid}/`, {
                    name: values.name,
                    image: values.imageId,
                    description : values.description
                })
                .then(element => {
                    if(element.status === 200){
                        navigate(`/setores/perfil/${sectorData.sectorGroupId}`)
                    }})
                .catch(err =>  {
                    console.log(err)
                    setStateError("Já existe um Subsetor registrado com esse nome!"); 
                    setState();})

            }else{
                var data = new FormData()

                data.append('branchName', Number(sectorData.sectorBranch))
                data.append('sectorGroup', Number(sectorData.sectorGroupId))
                data.append('image',values.imageId)
                data.append('name',values.name)
                data.append('description', values.description)
                data.append('is_active', true)
                
                api.post("/sectors/",data, {
                    "Content-Type": "application/json"
                })
                .then(element => {
                    if(element.status === 201){
                        setState(`SubSetor de ${sectorData.sectorGroupName} criado com sucesso!`)
                        setStateError()
                        setTimeout(function(){setState() }, 3000);
                        setValidateAfterSubmit(false)
                        
                        formik.values.name = ""
                        formik.values.imageId = ""
                        formik.values.description = ""
                        setPhotoPreview([])
                    }
                })
                .catch(err =>  {
                    console.log(err.request.response); 
                    setStateError("Já existe um SubSetor registrado com esse nome!"); 
                    setState();})
            }
        }
    })

    useEffect(() => {
        console.log(sectorData)
        if (sectorData.is_edit === 'yes'){
            api.get(`/imagesectors/${sectorData.image}/`) 
            .then(returnImage => {
                setPhotoPreview([{src: returnImage.data.image,
                    width: 3,
                    height: 1}])
            })
            api.get(`/sectors/${sectorData.sectorid}/`) 
            .then(element => {
                setSectorItem(element.data)
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
                        {sectorData.is_edit ? <h2>Editar o setor: {sectorItem?.name} </h2> : <h2>Cadastrar novo Subsetor de: {sectorData.sectorGroupName}</h2>}
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
                            <Link to={`/setores/perfil/${sectorData.sectorGroupId}`}>Lista de SubSetores</Link>
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