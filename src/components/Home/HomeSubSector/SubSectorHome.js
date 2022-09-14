import { Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import '../homeServices/style.css'
import useAxios from "../../../utils/useAxios";
import { useState, useEffect, Children } from "react";
import Paginator from "../../Reusable/Pagination/Paginator";
import { Link, useParams } from "react-router-dom";
import Load from "../../Reusable/Load/Load";

function SubSectorHome(){
    
    const api = useAxios()
    const [data, setData] = useState([])
    const [paginateObject, setPaginateObject] = useState([]) 
    const sector = useParams()
    const [load, setLoad] = useState(false);
    const [sectorGroup, setSectorGroup] = useState('');

    useEffect(() => {
        setLoad(true)
        const getSectores = () =>{
            console.log(sector)
            api.get(`/sectorshome/?is_active=true&sectorGroup=${sector.id}`)
            .then( element => {
                console.log(element)
                setData(element.data.results)
                setPaginateObject(element.data)
                setLoad(false)
            })
            .catch(err => console.log(err))
            api.get(`/sectorsgrouphome/${sector.id}/?is_active=true`)
            .then( element => {
                setSectorGroup(element.data)
                console.log(element.data)
            })
            .catch(err => console.log(err))
        }
        getSectores()
    },[])

    const reloadTable = (data) =>{
        setData(data.results)
        setPaginateObject(data) 
    }

    return(
        <Container fluid>
            {sectorGroup ? 
                <h2 className="text-center mt-4">Subsetores do {<Link className="LinkCard5s" to='/'>setor</Link>} {sectorGroup.name} na filial {sectorGroup.branchName}</h2>
            :   <h2 className="text-center mt-4">Nenhum subsetor encontrado!</h2>
            }
             {!load ?
             <div className="container5S">
                
                { data.length > 0 && sectorGroup ? Children.toArray(data.map((element, index) =>

                <Link className="LinkCard5s" to={`/formularios/${element.id}`}>
                    <Card  className='cardHome5S'>
                        <Col md='6' xl='6' xs='6' mb='6' className="card-img-5S" style={{backgroundImage : `url(${element.image})`}}>
                        </Col>
                        <Col>
                            <Card.Body className=" d-flex justify-content-center align-items-center h-100 text-center">    
                                <Card.Title className="titleHome5S">{element.name}</Card.Title>
                                <Card.Text className="Numberbranch5s">Filial: {element.branchName}</Card.Text>
                            </Card.Body>
                        </Col>
                    </Card>
                </Link>
                )) : sectorGroup ? <h5 className="mt-5 text-center">Ainda não existe nenhum subsetor cadastrado para esse setor!</h5>
                : <h5 className="mt-5 text-center">Você digitou algo errado? Parece que esse setor está inativo ou não existe! vamos voltar a <Link to='/'>tela inicial</Link></h5>}     
            </div>
            :<div className="d-flex flex-column align-items-center"> <Load height='' width = '8%'/> </div> }
            {sectorGroup && data.length > 0? 
                <div className="paginator-end-page5s">
                    <Paginator 
                        route = "/sectorshome/"
                        is_active = 'true'
                        sectorGroup= {sector.id}
                        reloadTableActive = {reloadTable} 
                        itens = {paginateObject} 
                        baseUrl = {'sectorshome'}/>
                </div>
            : null }
        </Container>
    )
}

export default SubSectorHome;