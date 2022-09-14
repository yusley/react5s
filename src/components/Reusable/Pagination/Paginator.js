import { Children } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import useAxios from '../../../utils/useAxios'

function Paginator(props){
    
    const api = useAxios()
    const pagesNumber = []
    
    for (let i = 1; i <= props.itens.total_pages; i++){
        pagesNumber.push(i)
    }

    

    const Prev = () =>{
        api.get(props.itens.links.previous)
        .then( element => {
            props.reloadTableActive(element.data)
        })
        .catch(err => console.log(err))
    }

    const Next = () =>{
        api.get(props.itens.links.next)
        .then( element => {
            props.reloadTableActive(element.data)
        
        })
        .catch(err => console.log(err))
    }

    const GetNumber = (num) =>{
       
        api.get(`${props.route}?search=${props.searchvalue ? props.searchvalue : ''}&page=${num}&is_active=${props.is_active ? props.is_active : ''}&ordering=${props.ordering ? props.ordering : ''}&branchName=${props.branchNumber ? props.branchNumber : ''}&sectorGroup=${props.sectorGroup ? props.sectorGroup : ''}&end_at__gte=${props.end_at ? props.end_at : ''}&start_at__lte=${props.start_at ? props.start_at : ''}`)
        .then( element => {
            
            props.reloadTableActive(element.data)
            console.log(element.data)
        })
        .catch(err => console.log(err))
        
    }

    return(
        <Pagination className="justify-content-center no-wa">
             {props.itens.links && props.itens.links.previous ? <Pagination.Prev onClick={Prev}/> : <Pagination.Prev disabled/>}
                {Children.toArray(pagesNumber.map(num => {
                    if(props.itens.actual_pages === num)
                        return <Pagination.Item active >{num}</Pagination.Item>
                    return <Pagination.Item onClick={(e) => GetNumber(num)}>{num}</Pagination.Item>
                }))}
            {props.itens.links && props.itens.links.next ?  <Pagination.Next onClick={Next}/> : <Pagination.Next disabled/>}
        </Pagination>
    )
}

export default Paginator