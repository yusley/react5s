import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dropdown } from "react-bootstrap"
import useAxios from "../../../utils/useAxios"

const HandleOrdering = (props) =>{
    
    const api = useAxios()

    const getOrdering = (ordenationName) =>{
        api.get(`${props.route}?search=${props.searchvalue}&is_active=${props.is_active}&ordering=${ordenationName}`)
        .then( element => {
            props.reloadTableActive(element.data)
            props.orderingValue(ordenationName)
        })
        .catch(err => console.log(err))
    }

    return(
        <Dropdown>
            <Dropdown.Toggle className = "ButtonOrdering5S">
                {props.columName}    
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => {getOrdering(props.ordenation)}}><FontAwesomeIcon color="#00004F" icon={faArrowUp}></FontAwesomeIcon> Ordenar {props.columName} para cima </Dropdown.Item>
                <Dropdown.Item onClick={() => {getOrdering('-'+props.ordenation)}}><FontAwesomeIcon color="#00004F" icon={faArrowDown}></FontAwesomeIcon> Ordenar {props.columName} para baixo </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>  
    )
}

export default HandleOrdering