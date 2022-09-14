import { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Gallery from "react-photo-gallery";
import { useLocation } from "react-router-dom";
import useAxios from "../../../../utils/useAxios";
import Paginator from "../../../Reusable/Pagination/Paginator";
import "./ModalGalery.css";
import SelectedImage from "./SelectedImage";

function ModalGalery(props) {
    const url  = useLocation().pathname;
    const [show, setShow] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [paginateObject, setPaginateObject] = useState([])
    
    const api = useAxios()
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        function getImages(){
            api.get('/imagesectors/')
            .then(element => {
                renderImages(element.data.results)
                setPaginateObject(element.data)
            })
            .catch(err => console.log(err))
        }
        getImages()
    },[])

    const reloadTable = (data) =>{
      renderImages(data.results)
      setPaginateObject(data)
    }

    function renderImages(element){
        setPhotos([])
        const addphotos = element.map((data) => setPhotos(state => [...state, {id: data.id, src: data.image,
            width: 3,
            height: 2}]));
    }

    function ImageClicked(id, src){
        props.clickImage(id, src)
        handleClose()
      }

      const imageRenderer = useCallback(
        ({ index, left, top, key, photo } ) => (
          <SelectedImage
            clickImage = {ImageClicked}
            selected={selectAll ? true : false}
            key={key}
            margin={"2px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
          />
        ),
        [selectAll]
      );

    return (
      <>
        <Button className="w-100 ButtonModalSectorForm" onClick={handleShow}>
          Escolha uma imagem
        </Button>
  
        <Modal show={show} size='lg' onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Galeria de imagens</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-sectorForm5S">
            <Gallery photos={photos} renderImage={imageRenderer} />
          </Modal.Body>
          <Modal.Footer closeButton>
            <Paginator 
                route = "/imagesectors/"
                reloadTableActive = {reloadTable} 
                itens = {paginateObject}/>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default ModalGalery