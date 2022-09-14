import loadImage from './gifLoad.gif'
import { RotatingLines } from  'react-loader-spinner'

const Load = (props) => (
    <RotatingLines
            height = {props.height}
            width = {props.width}
            radius = "9"
            ariaLabel = 'three-dots-loading'     
            wrapperStyle
            wrapperClass
        />
);
 
export default Load;