import { Button, Card, Col, Form, Row} from "react-bootstrap";
import './style.css'
import useAxios from "../../../utils/useAxios";
import { useState, useEffect, Children } from "react";
import Paginator from "../../Reusable/Pagination/Paginator";
import { Link } from "react-router-dom";
import Load from "../../Reusable/Load/Load";

function HomeSectores(){
    
    const api = useAxios()
    const [data, setData] = useState([])
    const [dataBranch, setDataBranch] = useState([])
    const [branchNumber, setBranchNumber] = useState('')
    const [paginateObject, setPaginateObject] = useState([])
    const [paginateObjectBranch, setPaginateObjectBranch] = useState([])
    const [search, setSearch] = useState('')
    const [load, setLoad] = useState(false);
    useEffect(() => {
        setLoad(true)
        const getSectores = () =>{

            api.get(`/sectorsgrouphome/?is_active=true`)
            .then( element => {
                setData(element.data.results)
                setPaginateObject(element.data)
                setLoad(false)
            })
            .catch(err => console.log(err))

            api.get(`/branch/?is_active=true&ordering=number`)
            .then( element => {
                setDataBranch(element.data.results)
                setPaginateObjectBranch(element.data)
            })
            .catch(err => console.log(err))
            }

        getSectores()
    },[])
    
    const handleChange = (event) => {
        setSearch(event.target.value)
    }

    const handleChangeBranch = (event) => {
        setBranchNumber(event.target.value)
    }

    useEffect(() => {
        reload()
    }, [search, branchNumber]);

    const reload = () =>{
        api.get(`/sectorsgrouphome/?search=${search}&is_active=true&branchName=${branchNumber}`)
        .then( element => {
            
            reloadTable(element.data)
        })
        .catch(err => console.log(err))
    }

    const reloadTable = (data) =>{
        setData(data.results)
        setPaginateObject(data) 
    }

    console.log(data)
    return(
        <>
        <Row className=" containerFiltyer5s d-flex justify-content-between p-1 mt-3">
                    <Col sm={2} md={2} >
                    <Form.Select onChange={handleChangeBranch} disabled ={(load)?true:false}>
                        <option value="">Todas as filiais</option>
                        {Children.toArray(dataBranch.map((element, index) =>
                            <option value={element.number}>Filial: {element.number}</option>
                        ))}
                    </Form.Select>
                    </Col>
                    <Col sm={10} >
                        <Form.Control 
                            className="inputTable5S" 
                            type='text'
                            id="search"
                            name="search"
                            placeholder="Filtre os setores com base na pesquisa"
                            onChange={handleChange}
                            disabled ={(load)?true:false}
                            >
                        </Form.Control>
                    </Col>
                </Row>
            <h2 className="text-center mt-4">Setores ativos</h2>
            {!load ?
             <div className="container5S">
                
                { data.length > 0 ? Children.toArray(data.map((element, index) =>

                <Link className="LinkCard5s" to={`/subsetores/${element.id}`}>
                    <Card className='cardHome5S'>
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

                )) : <h5 className="mt-5 text-center">Poxa, nenhum setor foi encontrado :(, Será que você digitou algo errado?</h5>}   
            </div>
            : 
            <div className="d-flex flex-column align-items-center">
                <Load height='' width = '10%'/>
            </div>}
            <div className="paginator-end-page5s">
                <Paginator
                    route = "/sectorsgrouphome/"
                    reloadTableActive = {reloadTable} 
                    itens = {paginateObject} 
                    searchvalue={search}
                    branchNumber={branchNumber}
                    baseUrl = {'sectorsgrouphome'}/>
            </div>
        </>
    )
}

export default HomeSectores;