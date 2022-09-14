import { Modal } from 'react-bootstrap';
import loadImage from './gifLoad.gif';
import './loadmodal.css';
import { Oval } from  'react-loader-spinner'

const LoadFullScrean = (props) => {

    return(
        <Modal size="sm" contentClassName='modalRemoveBackground' centered show={props.show} data-backdrop="false" backdrop={'static'}>
        <Modal.Body className="d-flex justify-content-center">
        <Oval
            height = {props.height}
            width = {props.width}
            radius = "9"
            color = "#00004F"
            ariaLabel = 'three-dots-loading'     
            wrapperStyle
            wrapperClass
        />
        </Modal.Body>
        </Modal>
    )
};
 
export default LoadFullScrean;