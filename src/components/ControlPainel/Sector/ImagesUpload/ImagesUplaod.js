import './style.css'
import { Alert, Button, Card, Collapse, Container, Form } from "react-bootstrap";
import useAxios from '../../../../utils/useAxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircleArrowLeft, faCloudUpload} from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'


function ImagesUpload (){
    const [img, setImg] = useState()
    const [imagemPost,setImagemPost] = useState()
    const [error,setError] = useState()
    const [success, setSuccess] = useState()
    const api = useAxios()
    const fileref = useRef(null)
    const navigate = useNavigate()
    const changImg =(e)=>{

        var image = e.target.files[0]
        setImagemPost(image)
        
        const reader = new FileReader();
        reader.readAsDataURL(image)
        reader.onload = () => {
            setImg(reader.result)
        }
       
        var data = new FormData()
        data.append("image",img)
        setImg({image})
        
    }

    const sendImg = () => {
        
        var data = new FormData()
        data.append("image",imagemPost)
 
    
        api.post("/imagesectors/", data, {
            "contentType": false,
        })
        .then((element) => {
            setSuccess("Imagem enviada com sucesso para o sistema!");
            setError(null);
            setTimeout(function(){setSuccess();}, 3000);})
        .catch((err) => {
            if (!imagemPost){
                setError('Você deve selecionar uma imagem!')
            }else{
                setError(err.response.data.image)
            }
            setTimeout(function(){setError();}, 3000);
        })

        setImg();
        setImagemPost();

    }
    

    return(
        
        <Container className='container5Supload'>
            
   
            <Card className='card5Supload'>
                <Form className='form'>
                    <div className='imgdiv' >
                        <div >
                            <img id='imagem' src={img}></img>
                        </div>
                        <FontAwesomeIcon 
                            onClick={() => {
                                fileref.current.click()
                            }}
                            id='icon'
                            size='5x'
                            icon={faCloudUpload}>

                        </FontAwesomeIcon>
                        <input hidden ref={fileref} accept="image/png, image/gif, image/jpeg"  type="file"
                        onChange={changImg}
                        />
                        
                        <Collapse in={error}>
                           <div><Alert variant={'danger'} id="state" className={`text-danger text-center`}> {error} </Alert></div>
                        </Collapse>
                        <Collapse in={success}>
                           <div><Alert id="state" className={`text-success text-center`}> {success} </Alert></div>
                        </Collapse>
                      <Button className='btn5S' onClick={sendImg}>Enviar Imagem</Button>
                    </div>
                    
                </Form>
            </Card>
                

            
        </Container>
        
    )
        
}

export default ImagesUpload;