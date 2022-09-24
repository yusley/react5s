import { useState, useEffect } from "react";
import {map} from 'lodash'
import {Button, Col, Container,Card, Row, Form, Alert, Modal} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd,faRemove } from '@fortawesome/free-solid-svg-icons'
import "./DynamicForm.css"
import * as Yup from 'yup'
import {useNavigate, useParams} from 'react-router-dom'
import useAxios from '../../../../utils/useAxios'
import {Image} from "react-bootstrap/";
import Load from "../../../Reusable/Load/Load";
import moment from "moment";


function DynamicFormEdit() {
  const api = useAxios()
  const navigate = useNavigate();
  const [load , setLoad] = useState(null);
  const [errorsQuestion,setErrorQuestion] = useState(null);
  const [sectorProfile, setSectorProfile] = useState([]);
  const [questions, setQuestions] = useState([])
  // const [updatedForm, setupdatedForm ] = useState([]);
  const [validQuest, setModelError] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [form, setForm] = useState([])
  const [removedQuestionsList , setRemovedQuestionsList] = useState([])
  
  const idFormAndIdSector = useParams();



  useEffect(() => {
    
    api.get(`/sectors/${idFormAndIdSector.sectorId}/`)
    .then((element) => {
      
      
      const objectSectorProfile = {
        id: element.data.id,
        name: element.data.name,
        image: ''
      }

      api.get(`/imagesectors/${element.data.image}/`)
      .then((element) => {
        objectSectorProfile.image = element.data.image
       
        setSectorProfile(objectSectorProfile)
      })
    })
    .catch((err) => (err))

    api.get(`/formr/${idFormAndIdSector.id}/`)
    .then((element) => {
      setForm(element.data)
     
    })
    .catch((err) => (err))

    
    
    api.get(`/formrask/?formId=${idFormAndIdSector.id}`)
    .then((element) => {
  
      setQuestions(element.data.results)
    })
    .catch((err) => (err))

   

  },[0])



  const updatedForm = {
    id: form.sectorId,
    name : form.title,
    date_at : moment(form.start_at).format("YYYY-MM-DD"),
    end_at : moment(form.end_at).format("YYYY-MM-DD")
  }

  function removeQuestion(){
    let updatequestions = questions
    let questRange = updatequestions.length
    
    if(updatequestions[questRange-1].id){
      let RemovedQuest = updatequestions[questRange-1]
      setRemovedQuestionsList((prevState)=> ([...prevState,RemovedQuest]))
      
    }
    updatequestions.pop()
    
    setQuestions([...updatequestions])
  }



  function removeQuestionsOnButton(position){
    setModelError(null)
    setErrorQuestion(null)
   
    var removeElement = questions
   

    
    if(removeElement[position].id){
      let removedQuestion = removeElement[position]
      setRemovedQuestionsList((prevState) => ([...prevState,removedQuestion]))
    }
    removeElement.splice(position,1)
   
    setQuestions([...removeElement])
   
  }



  function handleAddNewQuestion(){
    
    const showEmptyQuestions = (element,item,actualValue) => {


      if(!item.ask && !item.quest){
        handleShow()
        setModelError(`A questão ${actualValue+1} está vazia!`)
        return element + 1
      }else {
        return 0
      }

      

    }

    var total = questions.reduce(showEmptyQuestions, 0)

    if(total){
      return;
    }


    setQuestions((prevState)=>(
      [
        ...prevState,
        {
          quest : '',
          weigth : 1,
          images : false
        }
      ]
    ))

  
  }


  function handleChangeQuestions(value, property, index){

    let updatequestions = questions
    

    if(questions[index].id){
      if(property == 'quest'){
        updatequestions[index].ask = value
      }else if(property == 'weigth'){
        updatequestions[index].askweight = value
      }else{
        updatequestions[index].is_image = value
      }
      
      
      setQuestions(updatequestions)
    }

    if(property == 'quest') {
      updatequestions[index].quest = value
      validateQuestion(value,index)
    }else if(property == 'weigth'){
      updatequestions[index].weigth = value
    }else{
      updatequestions[index].images = value
    }
    
    
  }

  



  function validateQuestion (inputvalue,index){
    setErrorQuestion(null)
    
    

    const signupInput = Yup.object().shape({
      question : Yup.string().min(10,'muito curto')
    })

    signupInput.isValid({
      question : inputvalue
    })
    .then((e) => {
      if(!e){
     
        setErrorQuestion(index)
      }else{
        setErrorQuestion(null)
      }
    } )
    
  }
  

  function handleAddFormInfos(value){
    setModelError(null)
    setErrorQuestion(null)
    
    updatedForm.id = form.id
    updatedForm.name = value
  

  }

  function handleUpdateDate(value,dateUpdate){
    
    
    if(dateUpdate === 'inicio'){
      updatedForm.date_at = value
    }else{
      updatedForm.end_at = value
    }
   
  }




  function handleSendDatas(){
    setLoad('ola')
 

    function initLoad() {
      setLoad(null)
    }


    setModelError(null)
   
    //validação de dados do formulário
    
    if(!questions[0]){
      handleShow()
      setModelError('Você não pode criar um formulário sem questões!')
      return;
    }

    const showEmptyQuestions = (element,item,actualValue) => {
      

      if(!item.ask && !item.quest){
     
        setModelError(`A questão ${actualValue+1} está vazia!`)
        return element + 1
      }else{
        return 0
      }
    }

    var total = questions.reduce(showEmptyQuestions, 0)

    if(total){
      return;
    }




    //verificando perguntas que serão adicionadas na edição

    var listUpdatesQuest = []
    var listNewQuest = []

    let quest = 0;
    for(quest of questions){
      if(quest.id){
        listUpdatesQuest.push(quest)
      }else{
        listNewQuest.push(quest)
      }
    }

 

    //se for aterado o nome do formulário 
    
  

    if(updatedForm.id){
   
      const data = new FormData()
      data.append('title', updatedForm.name)
      data.append('start_at', moment( updatedForm.start_at).format("YYYY-MM-DD"))
      data.append('end_at',moment( updatedForm.end_at).format("YYYY-MM-DD"))
      data.append('sectorId',updatedForm.id)

      api.put(`/formr/${form.id}/`, data, {
      "Content-Type" : "application/json"
      })
      .then((element) => (element))
      .catch((err) => (err))
    }


    //alterando os dados das perguntas do formulário
  
    handleShow()

    //Deletando as perguntas excluídas


    removedQuestionsList.map(removeFormQuestions)

    function removeFormQuestions(value,index,array){
      
      api.delete(`formrask/${value.id}/`)
      .then((element) => (element))
      .catch((err) => (err))
    }

    //Alterando as peguntas

    questions.map(updatedFormQuestion)
    
        
    function updatedFormQuestion(value,index,array) {
        
        if(value.id){
          
          let objectPutQuest = new Object()
          objectPutQuest.ask = value.ask
          objectPutQuest.askweight = value.askweight
          objectPutQuest.formId = value.formId
          objectPutQuest.is_image = value.is_image
          api.put(`https:/webmercale.mercale.net/formrask/${value.id}/`, objectPutQuest)
          .then((element) => (element))
          .catch((err) => (err))
        }else{
          var askData = new Object()
          askData.ask = value.quest
          askData.askweight = value.weigth
          askData.formId = form.id
          askData.is_image = value.images

          api.post('/formrask/', askData, {
            "Content-Type":"application/json"
          })
          .then((ele) => (ele))
          .catch((err) => (err))
          
        }
        
    }
    setTimeout(initLoad,5000)

  }



  return (
    <Container>


      

      {load != null && 

      
      <Row className="justify-content-md-center ">

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Atenção!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalLoad">

          
            <Load
                width={100}
                heigth={100}
              />

            <p>Seu formulário está sendo criado</p>
          

        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Fechar
        </Button>
        
        </Modal.Footer>
      </Modal>



    </Row>
      
      }




      {validQuest ? 

      

      <Row className="justify-content-md-center ">

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Atenção!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{validQuest}</Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Fechar
          </Button>
          
          </Modal.Footer>
        </Modal>

  

      </Row>
      : null}

    <Container fluid className="forms">

     

      <Container className="profileSectorDynamic">
        

        <Row className="profileDynamic">
        
       
            <Image
            src={`${sectorProfile.image ? sectorProfile.image : null}`}
            roundedCircle
            className='imageDynamic'
            />
            <h3 className="dynamicTitle">{`${sectorProfile.name ? sectorProfile.name : null}`}</h3>
          
          {sectorProfile.isResponses == null ?

          <Form.Select value={form.title}  className="selectSenso" aria-label="Default select example" onChange={(e) => handleAddFormInfos(e.target.value)}>
              
              <option value="SEIRE">SEIRE</option>
              <option value="SEITON">SEITON</option>
              <option value="SEISO">SEISO</option>
              <option value="SEIKETSU">SEIKETSU</option>
              <option value="SHITSUKE">SHITSUKE</option>
          </Form.Select>

            :
            null
            }
          
          <Row className=" d-flex align-items-center justify-content-center">
            <Col xs lg="4" className="columDate d-flex justify-content-center">
            
              <Form.Control
                defaultValue={form.start_at}
               
                className="dateInput"
                type="date" 
                onChange={(e) => handleUpdateDate(e.target.value,'inicio')}
                />
                
                <Form.Label>Início</Form.Label>
            </Col>
          
            <Col xs lg="4" className="columDate" >
             
              <Form.Control
                defaultValue={form.end_at}
                className="dateInput"
                type="date"
                onChange={(e) => handleUpdateDate(e.target.value,'fim')}
                />
              <Form.Label>fim</Form.Label>
            </Col>

          </Row>
        

        </Row>
      </Container>
        
      <Form >
        <Col md="auto" xs={12}>

            
            

            {


              

              map(questions, (element, index)=>(
              <Row key={element.id ? element.id : ''} className="justify-content-md-center">
              
              <Card className="questionCard">

                  <Row className="removeButtonRow">
                    <Button className="buttonRemoveQuest"  onClick={() => removeQuestionsOnButton(index)} color="secondary"><FontAwesomeIcon icon={faRemove}/></Button>
                  </Row>
                  <Form.Label>Pergunta :</Form.Label>
           
                  <Form.Control
                    
                    defaultValue={element.ask}
                    name={`question${element}`}
                    className="question inputs"
                    type="text" 
                    onChange={(e) => handleChangeQuestions(e.target.value , 'quest', index)}
                    required
                    as="textarea"
                    maxLength="255"
                 
                  />
                    
                  {errorsQuestion == index  && <Alert key='warning' variant='warning'>Não pode menos de 10 caracteres</Alert> }

                  

                  <Form.Label>Peso da pergunta :</Form.Label>
                  <Form.Select defaultValue={`${element.askweight}`} className="inputs selectweigth" aria-label="Default select example" onChange={(e) => handleChangeQuestions(e.target.value, 'weigth', index)}>
                      
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Form.Select>
                  
                  <Row xs={12} className='toimages'>
                    
                    
                    <Col xs={6} >
                      <Form.Label xs={6}>Contem imagens ?</Form.Label>
                    </Col>

                    
                    
                    <Col className="check" xs={6} >
                      
                      <Form.Check
                        
                        type='checkbox'
                        defaultChecked={questions[index].is_image}
                        xs={6}
                        className="checkinput"
                        onChange={(e) => handleChangeQuestions(e.target.checked, 'images', index)}
                      />
                      
                    </Col>
                     
                    
                    
                    
                  </Row>

                
                
              </Card>
            </Row>))
            }
            
       
          
        </Col>
        
        

      </Form>

          
        <Col className="buttonAddNewForm" xs={12} >
              <div xs={12}>
                <Button className="button5S" onClick={() => handleAddNewQuestion()} color="secondary"><FontAwesomeIcon icon={faAdd}/></Button>
                <Button className="button5S"  onClick={() => removeQuestion()} color="secondary"><FontAwesomeIcon icon={faRemove}/></Button>
                <Button className="button5S" onClick={(e) => handleSendDatas(e)} color="secondary">OK</Button>
              </div>
            
        </Col>
        <Col className="buttonAddNewForm" xs={12} >
            
        </Col>

        <Col className="buttonAddNewForm" xs={12} >
            
        </Col>

    </Container>
    </Container>
  );
}

export default DynamicFormEdit;