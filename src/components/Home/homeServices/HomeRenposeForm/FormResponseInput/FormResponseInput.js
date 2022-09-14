import { useFormik } from "formik";
import { useState, useEffect, Children, useContext } from "react";
import {Button, Container, Form, FormControl, Row, Modal, Image, Col} from "react-bootstrap/";
import {Link, useLocation,useNavigate, useParams} from 'react-router-dom'
import useAxios from "../../../../../utils/useAxios";
import Load from "../../../../Reusable/Load/Load";
import AsksRender from "./AsksRender";
import AuthContext from "../../../../../utils/AuthService/AuthContext";
import LoadFullScrean from "../../../../Reusable/Load/loadfullscrean";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckCircle, faKey } from "@fortawesome/free-solid-svg-icons";

function FormResponseInput(){
    const api = useAxios()
    const formInformations = useParams();
    const [load , setLoad] = useState(false);
    const [asks, setAsks] = useState([])
    const [totalAsk , setTotalAsks] = useState(0)
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false)
    const [validateResponseLength, setValidateResponseLength] = useState(false)
    const [responseCheckValues, setResponseCheckValues] = useState([]);
    const [responseValues, setResponseValues] = useState([]);
    const maxLengthResponse = 1000
    const {authTokens} = useContext(AuthContext);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [inputSubmit, setInputSubmit] = useState(false);
    const [edit, setEdit] = useState(false);
    const [sectorProfile, setSectorProfile] = useState([]);
    const [formProfile, setFormProfile] = useState([]);

    useEffect(() => {
        setLoad(true)

        api.get(`/formr/${formInformations.id}/`)
        .then((element) => {

            setFormProfile(element.data)
            
            api.get(`/sectorshome/${element.data.sectorId}/`)
            .then((element) => {
            console.log(element)
            setSectorProfile(element.data)
        })})
        .catch((err) => (err))

        api.get(`/formresponse/?formId=${formInformations.id}`)
        .then((element) => {
            if (element.data.results.length > 0){
                
                setEdit(true)
                api.get(`/formrask/?formId=${formInformations.id}`)
                .then((element) => {
                    setAsks(element.data.results)
                    setTotalAsks(element.data.count)
                    
                    api.get(`/formresponse/?formId=${formInformations.id}`)
                    .then((responses) => {
                        
                        responses.data.results.map((response,index) => {
                            api.get(`/formresponseimage/?id=${response.image?response.image:'98598598598'}`)
                            .then((images) => {
                                
                                setResponseValues(responseValues => 
                                    [...responseValues, {
                                        askid: response.askId,
                                        id:  response.id,
                                        response: response.response, 
                                        radio_check : response.responseweight, 
                                        image : '', 
                                        image_id: images.data.results[0]?.id? images.data.results[0].id: '',
                                        image_old_id: images.data.results[0]?.id? images.data.results[0].id: '',
                                        image_link : images.data.results[0]?.image? images.data.results[0].image: '',
                                        is_image : images.data.results.length > 0 ? true : false}])
                                })
                            .catch((err) => {console.log(err)})

                            if (index + 1 >= responses.data.results.length){
                                setTimeout(function(){  setLoad(false)} , 500);
                            }
                            })
                        })
                    })

                }
            else{
                setEdit(false)
                //busca os dados das perguntas
                api.get(`/formrask/?formId=${formInformations.id}`)
                .then((element) => {
                    setAsks(element.data.results)
                    setTotalAsks(element.data.count)
                    
                    element.data.results.map(element => {setResponseCheckValues(responseCheckValues => 
                        [...responseCheckValues, {
                            askid: element.id,
                            id:  '', 
                            response: '', 
                            radio_check : '', 
                            image : '', 
                            image_id: '',
                            image_old_id: '',
                            image_link : '',
                            is_image : element.is_image}])})
                    
                        setTimeout(function(){ setLoad(false)} , 1000);
                })
                .catch((err) => {console.log(err)})
            }
        })
        .catch((err) => console.log(err))
    
      },[0])
      
    useEffect(() => {
        var NewArray = responseValues.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.askid === value.askid
        ))
        )
        const valuesArray = NewArray.sort((a, b) => a.askid > b.askid ? 1:-1)
        setResponseCheckValues(valuesArray)
    }, [responseValues]);

    const handleChange = (value, index, type) => {
        
        switch (type) {
            case 1:
                const newResponseCheckValues = responseCheckValues.slice()
                newResponseCheckValues[index].response = value
                setResponseCheckValues(newResponseCheckValues)
                if (value.length > maxLengthResponse){
                    setValidateResponseLength(true);
                }else{
                    setValidateResponseLength(false);
                }
                break;
            case 2:
                const newCheckValues = responseCheckValues.slice()
                newCheckValues[index].radio_check = value
                setResponseCheckValues(newCheckValues)
                break;
            case 3:
                const newImageValues = responseCheckValues.slice()
                newImageValues[index].image = value
                
                const reader = new FileReader();
                reader.readAsDataURL(value)
                reader.onload = () => {
                    newImageValues[index].image_link = reader.result
                    setResponseCheckValues(newImageValues)
                }
                break;
            case 4:
                const newImageLinkValues = responseCheckValues.slice()
                newImageLinkValues[index].image_link = ''
                newImageLinkValues[index].image = ''
                newImageLinkValues[index].image_id = ''
                setResponseCheckValues(newImageLinkValues)
                break;
        }

        console.log(responseCheckValues)
    }

    const HandleSubmit = (event) => {
        setLoad(true)
        event.preventDefault();
        event.stopPropagation();

        if(Validate()){
            
            if (!edit){
                asks.map((element, index) => {

                    if (responseCheckValues[index].is_image){
                        var dataimage = new FormData()
                        dataimage.append('image', responseCheckValues[index].image)

                        api.post("/formresponseimage/", dataimage, {
                            "Content-Type": "application/json"
                        })
                        .then(element => {
                            if(element.status === 201){
                                var data = new FormData()
                                data.append('response', responseCheckValues[index].response)
                                data.append('responseweight', Number(responseCheckValues[index].radio_check) )
                                data.append('askId', responseCheckValues[index].askid)
                                data.append('image', element.data.id)
                                data.append('formId', formInformations.id)
        
                                api.post("/formresponse/", data, {
                                    "Content-Type": "application/json"
                                })
                                .catch(err =>  {
                                    console.log(err); 
                                ;})
                            }
                        })
                        .catch(err =>  {
                            console.log(err);  
                        ;})
                    }else{
                        var data = new FormData()
                        data.append('response', responseCheckValues[index].response)
                        data.append('responseweight', Number(responseCheckValues[index].radio_check) )
                        data.append('askId', responseCheckValues[index].askid)
                        data.append('formId', formInformations.id)

                        api.post("/formresponse/", data, {
                            "Content-Type": "application/json"
                        })
                        .then(element => {
                            console.log(element);
                        })
                        .catch(err =>  {
                            console.log(err.request.response); 
                        ;})
                    }

                    if(index == totalAsk - 1){
                        setTimeout(function(){
                            setLoad(false)
                            setInputSubmit(true) 
                        }, 1000);
                    }
                }) 
            }else{
                asks.map((element, index) => {
                    
                    var data = new FormData()
                    data.append('response', responseCheckValues[index].response)
                    data.append('responseweight', Number(responseCheckValues[index].radio_check) )

                    api.patch(`/formresponse/${responseCheckValues[index].id}/`, data, {
                        "Content-Type": "application/json"
                    })
                    .then(element => {
                        
                        if(element.status === 200){
                            var dataimage = new FormData()
                            
                            if (responseCheckValues[index].is_image && responseCheckValues[index].image && !responseCheckValues[index].image_id){
                                dataimage.append('image', responseCheckValues[index].image)
        
                                api.patch(`/formresponseimage/${responseCheckValues[index].image_old_id}/`, dataimage, {
                                    "Content-Type": "application/json"
                                })
                                .then(element => {console.log(element)})
                                .catch(err =>  {
                                    console.log(err.request.response); 
                                ;})
                            }
                            if(index == totalAsk - 1){
                                setTimeout(function(){
                                    setLoad(false)
                                    setInputSubmit(true) 
                                }, 1000);
                            }
                        }
                    })
                    .catch(err =>  {
                        console.log(err.request.response);  
                    ;})
                })
            }
        }else{
            setLoad(false);
        }
    }

    const Validate = () => {

        let validate = true;

        asks.map((element, index) => {
            if (!responseCheckValues[index].response || 
                !String(responseCheckValues[index].radio_check) || 
                !responseCheckValues[index].image_id && !responseCheckValues[index].image && responseCheckValues[index].is_image){
                console.log(responseCheckValues)
                validate = false;
                setValidateAfterSubmit(true);
            }

            if (validateResponseLength){
                validate = false;
            }
        })

        if (validate){
            return true
        }else{
            return false
        }
    }

    return(
        <Container fluid className="mt-4">
             { inputSubmit ? 
                <div className="text-center mt-3 container5Supload">
                    <FontAwesomeIcon color='green' size='10x' icon={faCheckCircle}/>
                    <h4 className="mt-3">Muito obrigado! Suas respostas foram enviadas com sucesso!</h4>
                    <h5 className="mt-2"> Vamos voltar a lista de setores ok? :)</h5>
                    <Link to='/' replace> Retornar a lista de setores</Link>
                </div>
            :
            !load ?
            <>
                <Form noValidate onSubmit={HandleSubmit} className="PanelAskInputs5s ">
                    <Container className="ContainerAskInputs5s ContainerAskInputsTitle5s col-sm-10 col-md-6">
                        <Row className="profileDynamic">
                            <Image
                            src={`${sectorProfile.image ? sectorProfile.image : null}`}
                            roundedCircle
                            className='imageDynamic'/>

                            <h3 className="dynamicTitle">
                                SubSetor {`${sectorProfile.name ? sectorProfile.name : null}`}
                            </h3>
                        
                            {formProfile && !edit? 
                                <div>Responder o senso {formProfile.title}</div> 
                            : formProfile && edit ? 
                                <div>Editar respostas do senso {formProfile.title}</div> 
                            : null }
                    
                        </Row>
                    </Container>
                    {Children.toArray(asks.map((element, index) => 
                        <AsksRender 
                            ask = {element.ask}
                            askweight = {element.askweight}
                            id = {element.id}
                            is_image = {element.is_image}
                            image_id = {element.image_id}
                            index = {index}
                            totalAsks = {totalAsk}
                            handleResponse = {handleChange}
                            handleCheck = {handleChange}
                            handleImage = {handleChange}
                            handleImageEdit = {handleChange}
                            responseCheckValues = {responseCheckValues}
                            validateAfterSubmit = {validateAfterSubmit}
                            validateResponseLength = {validateResponseLength}
                            maxLengthResponse = {maxLengthResponse}
                            load = {load}
                            edit = {edit}
                            />
                    ))}
                    <Row className="col-sm-10 col-md-6 mb-4 mt-4"> 
                        <>
                            <Link to={`/formularios/${formInformations.id}`} className="col-sm-6 btn btDelete">Cancelar</Link>
                            <Button type="submit" className="col-sm-6"> Enviar</Button>
                        </>
                    </Row>
                </Form>
                </>
            :
                <div className="d-flex flex-column align-items-center"> 
                    <Load height='' width = '20%'/> 
                    Só um momento, estamos preparando tudo para você... :)
                </div>}
        </Container>
    )
}

export default FormResponseInput;