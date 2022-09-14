import { useState, useEffect } from "react";
import {map} from 'lodash'
import {Button, Col, Container,Card, Row, Form, Alert, Modal, Table} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd,faRemove } from '@fortawesome/free-solid-svg-icons'
import "./DynamicForm.css"
import * as Yup from 'yup'
import {useLocation,useNavigate} from 'react-router-dom'
import useAxios from '../../../../utils/useAxios'
import {Image} from "react-bootstrap/";
import Load from "../../../Reusable/Load/Load";
import Paginator from "../../../Reusable/Pagination/Paginator";


function DynamicForm() {
  const api = useAxios()
  const navigate = useNavigate();
  const [load , setLoad] = useState(null);
  const [errorsQuestion,setErrorQuestion] = useState(null);
  const [sectorProfile, setSectorProfile] = useState([]);
  const [questions, setQuestions] = useState([])
  const sectorInformations = useLocation().state
  const [sectorInfos, setSectorInfos ] = useState([]);
  const [validQuest, setModelError] = useState(null)
  const [show, setShow] = useState(false);
  const [showSugest, setShowSugest] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowSugest = () => setShowSugest(true);
  const handleCloseSugest = () => setShowSugest(false);
  const [is_active, setIs_active] = useState(true)
  const [removedQuestionsList , setRemovedQuestionsList] = useState([])
  const [dataformSugest,setFormsSugest] = useState([])
  const [paginateObject, setPaginateObject] = useState([])
  const [search, setSearch] = useState('')
  const [formPaginator, setFormPaginator] = useState([])
  const [nameSectorId, setnameSectorId] = useState([])
  const [sectorsNameList, setSectorsNameList] = useState([])
  const [sugestForm,setSugestForm] = useState('')


  useEffect(() => {
  

    api.get(`/imagesectors/${sectorInformations.sectorImage}/`)
    .then((element) => {
      const objectSector = new Object()
      objectSector.name = sectorInformations.sectorName
      objectSector.img = element.data.image
      setSectorProfile(objectSector)
    })
   
  },[0])

  

  function removeQuestion(){
    let updatequestions = questions
    updatequestions.pop()
    setQuestions([...updatequestions])
  }

  function handleSugest(){
    handleShowSugest()
    
  }


  function handleAddNewQuestion(){
    setModelError(null)
  
    if(!sectorInfos.name || sectorInfos.name == 0 || !sectorInfos.date_at || !sectorInfos.end_at ){
      handleShow()
      setModelError('Escolha um senso e defina as datas!')
      return;
    }

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
          id : questions.length,
          quest : '',
          weigth : 1,
          is_image : false
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
      updatequestions[index].is_image = value
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


  function handleAddFormInfos(value){
    setErrorQuestion(null)
    if(sectorInfos.date_at != null){
      var updatedSectorInfos = sectorInfos
      updatedSectorInfos.name = value
  
      setSectorInfos(updatedSectorInfos)

    }else{
      const formInfos = new Object()
      formInfos.id = sectorInformations.sectorId
      formInfos.name = value
      formInfos.date_at = null
      formInfos.end_at = null
      setSectorInfos(formInfos)
      
    }

  }

  function hadleAddDateForm(value,startOrEnd){
    var updateFormInfos = sectorInfos
    if(startOrEnd == 'inicio'){
      updateFormInfos.date_at = value
    }else{
      updateFormInfos.end_at = value
    }
    
  
  }


  function handleSendDatas(){
    setModelError(null)
    

    if(!sectorInfos.name || sectorInfos.name == 0){
      handleShow()
      setModelError('Escolha um senso!')
      return;
    }
    
    if(!questions[0]){
      handleShow()
      setModelError('Você não pode criar um formulário sem questões!')
      return;
    }

    const showEmptyQuestions = (element,item,actualValue) => {
      if(!item.ask && !item.quest){
        handleShow()
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

    setLoad('ola')

    function initLoad() {
      setLoad(null)
    }





    

    var dataForm = new FormData()


    dataForm.append('title', sectorInfos.name)
    dataForm.append('sectorId', sectorInfos.id)
    dataForm.append('start_at', sectorInfos.date_at)
    dataForm.append('end_at', sectorInfos.end_at)
   
    api.post('/formr/', dataForm, {
      "Content-Type": "application/json"
    })
    .then((element) => {
      let formId = element.data.id
      questions.map((ele) => {

        if(ele.ask){
          var askData = new Object()
        
          askData.ask = ele.ask
          askData.askweight = ele.weigth
          askData.formId = formId
          askData.is_image = ele.is_image

          api.post('/formrask/', askData, {
            "Content-Type":"application/json"
          })
          .then((ele) => {console.log(ele)})
          .catch((err) => console.log(err))
          handleShow()
          const initialLoad = setTimeout(initLoad,5000)
          navigate(`/perfilsetor/${sectorInformations.sectorId}/`)
        }
      })
     

      })
    .catch((err) => {
      console.log(err)
      const initialLoad = setTimeout(initLoad,3000)
    
    })

  }


  //SUGESTÃO DE FORMULÁRIOS

  const handleChange = (event) => {
    setSearch(event.target.value)
  
    setSearch(event.target.value)

    

    api.get(`/formr/?search=${event.target.value}`)
    .then((element) => {
      
        setPaginateObject(element.data)
        setFormPaginator(element.data.results)
        setnameSectorId([])
        async function datasOfForms(){
          let sectorsOfForms = await element.data.results.map((ele) => {
 
            api.get(`/sectors/${ele.sectorId}/`)
            .then((el) => {
              setnameSectorId((prevState) => [...prevState,{
                id: el.data.id,
                name : el.data.name,
                nameSector : ele.title

              }])
            })
            return ele
          })
  
          return sectorsOfForms
        }
        
        datasOfForms()
        .then((ele) => {
          if(ele.length === element.data.results.length){
            setSectorsNameList(nameSectorId)
          }
        })
    })
  }

  const reloadTable = (data) => {
    
    setFormPaginator(data.results)
    setFormsSugest(data)
    setPaginateObject(data)
  }

  const handleAceptSugestForm = (index) =>{
    setShowSugest(false)
   

    if(sugestForm){
      setQuestions([])

      api.get(`/formrask/?formId=${sugestForm}`)
      .then((element) => {
    
        setQuestions(element.data.results)
      })
      .catch((err) => (err))
      }
    
  }

  return (
    <Container>
      
     
      <Row className="justify-content-md-center w-100">

      <Modal backdrop='static' className="w-100 p-3" show={showSugest} onHide={handleClose}>
        <Modal.Header >
        <Modal.Title>Sugestão de Formulários</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <Row className="d-flex justify-content-between p-1">
            
            <Col className="mb-100 p-3">
                <Form.Control 
                    className="inputTable5S" 
                    type='text'
                    id="search"
                    name="search"
                    placeholder="Busque sugestões de formulários"
                    onChange={handleChange}
                    >
                </Form.Control>
            </Col>
        </Row>
        <Table  striped hover responsive>
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Nome</th>
              <th>Setor</th>

            </tr>
          </thead>
          <tbody>
            {formPaginator.map((element,index) => 
              
              <tr key={element.id} onClick={() => setSugestForm(index)}>
                  
                <td >{
                  <Form.Check
                  label=""
                  name="group1"
                  type='radio'
                  id={`reverse-${element.id}-1`}
                  />
                
                }</td>
                <td>{element.id}</td>
                <td>{element.title}</td>
                <td className="nowrap">{nameSectorId[index] ? nameSectorId[index].name : null}</td>
                
              </tr>
              
            )}
            
            
          </tbody>
        </Table>
        <Row className="d-flex">
                <Col col={12}>
                    <Paginator 
                        route = "/formr/"
                        is_active = {is_active} 
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        searchvalue={search}
                        baseUrl = {'formr'}/>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleAceptSugestForm}>
            Confirmar
        </Button>
        
        </Modal.Footer>
      </Modal>



      </Row>
   


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
        
        <Row className="removeButtonRow">
            <Button className="buttonSugest" onClick={() => handleSugest()}  color="secondary">sugestão</Button>
        </Row>

        <Row className="profileDynamic">

       
            <Image
            src={`${sectorProfile.img ? sectorProfile.img : null}`}
            roundedCircle
            className='imageDynamic'
            />
            <h3 className="dynamicTitle">{`${sectorProfile.name ? sectorProfile.name : null}`}</h3>
          
          
          

          <Form.Select className="selectSenso" aria-label="Default select example" onChange={(e) => handleAddFormInfos(e.target.value)}>
              <option value="0">ESCOLHA UM SENSO</option>
              <option value="SEIRE">SEIRE</option>
              <option value="SEITON">SEITON</option>
              <option value="SEISO">SEISO</option>
              <option value="SEIKETSU">SEIKETSU</option>
              <option value="SHITSUKE">SHITSUKE</option>
          </Form.Select>

          {sectorInfos.name ? 
          <Row className=" d-flex align-items-center justify-content-center">
            <Col xs lg="4" className="columDate d-flex justify-content-center">
            
              <Form.Control
                placeholder="oi"
                className="dateInput"
                type="date" 
                onChange={(e) => hadleAddDateForm(e.target.value, 'inicio')}
                />
                
                <Form.Label>Início</Form.Label>
            </Col>
          
            <Col xs lg="4" className="columDate" >
             
              <Form.Control
                className="dateInput"
                type="date"
                onChange={(e) => hadleAddDateForm(e.target.value, 'fim')}
                />
              <Form.Label>fim</Form.Label>
            </Col>

          </Row>
          :
          null
          } 
        </Row>
      </Container>
      
      <Form >
        <Col md="auto" xs={12}>

          
            {/* {map(questions, (element, index)) => 
              
            )} */}

            {
              map(questions, (element, index)=>(
            
              <Row key={element.id} className="justify-content-md-center">
              
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
                    onChange={(e) => handleChangeQuestions(e.target.value, 'quest', index)}
                    required
                    as="textarea"
                    value={element?.name}
                  />
                    
                  {errorsQuestion == index  && <Alert key='warning' variant='warning'>Não pode menos de 10 caracteres</Alert> }

                  

                  <Form.Label>Peso da pergunta :</Form.Label>
                  <Form.Select defaultValue={`${element.askweight}`} className="inputs selectweigth" aria-label="Default select example" onChange={(e) => handleChangeQuestions(e.target.value, 'weigth', index)}>
                      
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        
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

export default DynamicForm;