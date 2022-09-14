import { faArrowPointer, faBan, faImage, faKey, faQuestion, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Alert, Card, Form, FormControl, InputGroup } from 'react-bootstrap';
import './AskInput.css'
import * as Yup from 'yup';

function AsksRender(props){
    
    const [validateImageType, setValidateImageType] = useState(false)
    const [changeImage, setChangeImage] = useState(false)
    
    const handleResponse = (value, index) => {
        props.handleResponse(value, index, 1)
    }

    const handlecheck = (value, index) => {
        props.handleCheck(value, index, 2)
    }

    const handleimage = (value, index) => {
        
        if (value.type == "image/png" || value.type == "image/jpeg" ){
            setValidateImageType(false)
            props.handleImage(value, index, 3)
        }else{
            setValidateImageType(true)
            props.handleImage('', index, 3)
        }
    }

    const handleImageEdit = (index) => {
        props.handleImageEdit('', index, 4)
    }

    return(
        <Card className="ContainerAskInputs5s col-sm-10 col-md-6"> 
            <div className="titleAsk5s">Pergunta: {props.index + 1} de {props.totalAsks}</div>
            <hr/>
            <div className="text-justify text-wrap mb-3">{props.ask}</div>
            <InputGroup className="mb-3 d-flex flex-nowrap align-items-center ">
            <div className="input-group-append me-3">
                <span className="input-group-text"><FontAwesomeIcon icon={faArrowPointer}/></span>
            </div>
                <Form.Group className={!props.responseCheckValues[props.index].radio_check && props.validateAfterSubmit ?  "errorResponseForm5s" : null}>
                    <Form.Check
                        inline
                        value= '0'
                        name = {`group${props.id}`}
                        id = {`check${props.id}value0`}
                        defaultChecked = {props.responseCheckValues[props.index].radio_check == '0' ? true:false}
                        type="radio"
                        label="Não conformidade"
                        onChange={(e) => handlecheck(e.target.value, props.index)}
                        disabled ={(props.load)?true:false}
                        className = "naoconformidade5s"
                        />
                    <Form.Check
                        inline
                        value= '1'
                        name = {`group${props.id}`}
                        id = {`check${props.id}value1`}
                        defaultChecked = {props.responseCheckValues[props.index].radio_check == '1' ? true:false}
                        type="radio"
                        label="Ruim"
                        onChange={(e) => handlecheck(e.target.value, props.index)}
                        disabled ={(props.load)?true:false}
                        />
                    <Form.Check
                        inline
                        value= '2'
                        name = {`group${props.id}`}
                        id = {`check${props.id}value2`}
                        defaultChecked = {props.responseCheckValues[props.index].radio_check == '2' ? true:false}
                        type="radio"
                        label="Bom"
                        onChange={(e) => handlecheck(e.target.value, props.index)}
                        disabled ={(props.load)?true:false}
                        />
                    <Form.Check
                        inline
                        value= '3'
                        name = {`group${props.id}`}
                        id = {`check${props.id}value3`}
                        defaultChecked = {props.responseCheckValues[props.index].radio_check == '3' ? true:false}
                        type="radio"
                        label="Ótimo"
                        onChange={(e) => handlecheck(e.target.value, props.index)}
                        disabled ={(props.load)?true:false}
                        />
                </Form.Group>
            </InputGroup>
            {!String(props.responseCheckValues[props.index].radio_check) && props.validateAfterSubmit? 
                <p className="text-danger text-left">
                    Você precisa escolher uma opção
                    <div>{props.responseCheckValues[props.index].radio_check}</div>
                </p>
            : null }
            <InputGroup className="">
                <div className="input-group-append">
                    <span className="input-group-text"><FontAwesomeIcon icon={faQuestion}/></span>
                </div>
                <Form.Control
                    required
                    type="textarea"
                    as="textarea"
                    className={props.responseCheckValues[props.index]?.response?.length > props.maxLengthResponse  || 
                        !props.responseCheckValues[props.index]?.response && props.validateAfterSubmit?  "errorResponseForm5s" : null}
                    rows={3}
                    name = {`${props.index}.response`}
                    placeholder={`Digite uma observação para a pergunta ${props.index + 1}`}
                    onChange={(e) => handleResponse(e.target.value, props.index)}
                    value = {props.responseCheckValues[props.index].response}
                    disabled ={(props.load)?true:false}
                />
            </InputGroup>
            {props.responseCheckValues[props.index].response.length > props.maxLengthResponse ? 
                <p className="text-danger text-left">
                    A observação não pode ser tão longa!
                </p>
            : !props.responseCheckValues[props.index].response && props.validateAfterSubmit? 
                <p className="text-danger text-left">
                    A observação não pode ficar vazia!
                </p>
            : null }
            {props.is_image ?
            <>
                {props.responseCheckValues[props.index].image_link?
                    <InputGroup className="mt-3">
                        <div className="input-group-append me-3 iconImagewidth5s">
                            <span className="input-group-text"><FontAwesomeIcon icon={faImage}/></span>
                        </div>
                        <div className='imageWidth5s d-flex nowrap'>
                            <img className="img-thumbnail img-fluid" id='imagem' src={props.responseCheckValues[props.index].image_link}/>
                            <FontAwesomeIcon onClick={(e) => handleImageEdit(props.index)} className="cursor_pointer" icon={faX} size='2x'/>
                        </div>
                    </InputGroup>
                : 
                <InputGroup className="mt-3">
                    <div className="input-group-append me-3">
                        <span className="input-group-text"><FontAwesomeIcon icon={faImage}/></span>
                    </div>
                        <Form.Control 
                        accept="image/png, image/jpeg" 
                        id = {`${props.index}.image`} 
                        type="file" 
                        className={props.is_image && !props.responseCheckValues[props.index].image && props.validateAfterSubmit ||  validateImageType ? "errorResponseForm5s" : null}
                        onChange={(e) => handleimage(e.target.files[0], props.index)}
                        disabled ={(props.load)?true:false}
                        />
                </InputGroup>
                }
            </>
            : null}
            {props.is_image && !props.responseCheckValues[props.index].image && !props.responseCheckValues[props.index].image_id && props.validateAfterSubmit? 
                <p className="text-danger text-left">
                    Você precisa enviar uma imagem válida
                </p>
            :  null}
            { validateImageType? 
                <p className="text-danger text-left">
                    Somente imagens JPG ou PNG podem ser enviadas
                </p>
            : null}
        </Card>
    )
}

export default AsksRender;