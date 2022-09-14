
function NoData(props){
    if(props.table.length <= 0 && props.searchvalue != '')
        return(<tr><td className="text-center" colSpan={props.colspan}>{props.messageSearch}</td></tr>)

    else if (props.table.length <= 0)
        return(<tr><td className="text-center" colSpan={props.colspan}>{props.messageNoData}</td></tr>)
}

export default NoData;