import { Children, useEffect, useState } from 'react'
import {Button, Col, Container, Form, Table} from 'react-bootstrap'
import useAxios from '../../../../utils/useAxios'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './metrics.css'
import NoData from '../../../Reusable/Messages/MessageTable';
import Load from '../../../Reusable/Load/Load';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';

function Responses(){
    
    const api = useAxios()
    const [dataForm, SetDataForm] = useState([])
    const [dataZero, SetDataZero] = useState([])
    const [dataZeroOrdenate, SetDataZeroOrdenate] = useState([])
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const [load, setLoad] = useState(false)
    const [titleValues, setTitleValues] = useState(false)
    const [branchs, setBranchs] = useState([])
    const [sectorsDate, setSectorsDate] = useState([])
    const [subSectorsDate, setSubSectorsDate] = useState([])
    const [notes, setNotes] = useState([])
    const [notesOrdenate, setNotesOrdenate] = useState([])
    const [sectorGroups, setSectorGroups] = useState([])
    const [sectorGroupsOrdenate, setSectorGroupsOrdenate] = useState([])
    const handleClose = () => setLoad(false);
    const handleShow = () => setLoad(true);

    useEffect(() => {

        api.get(`/branch/?limit=20&is_active=true`)
        .then( element => {
            setBranchs(element.data.results)

        })
        .catch(err => console.log(err))
        
    },[0])

    const selectSector = (branch) => {
        api.get(`/sectorsGroup/?limit=50&is_active=true&branchName=${branch}`)
        .then( element => {
            setSectorsDate(element.data.results)
        })
        .catch(err => console.log(err))
    }

    const selectSubSector = (sectorsGroup) => {
        api.get(`/sectors/?limit=50&is_active=true&sectorGroup=${sectorsGroup}`)
        .then( element => {
            setSubSectorsDate(element.data.results)
        })
        .catch(err => console.log(err))
    }

    const SignupSchema = Yup.object().shape({
        form: Yup.string()
            .required('Você precisa selecionar um senso'),
        branch: Yup.string()
            .required('Você precisa selecionar uma filial'),
        sector: Yup.string()
            .required('Você precisa selecionar um setor'),
        subSector: Yup.string()
            .required('Você precisa selecionar um sub setor'),
        startDate: Yup.date()
            .required('Escolha uma data inicial'),
        endDate: Yup.date()
            .min(Yup.ref('startDate'), "A data final não pode ser maior que a data inicial")
            .required('Escolha uma data final')
    });

    const formik = useFormik({
        initialValues: { form: "", branch: "", startDate: "", endDate: "", sector: "", subSector: ""},
        validationSchema : SignupSchema,
        validateOnChange : validateAfterSubmit,
        validateOnBlur : validateAfterSubmit,
        onSubmit: values => {
            setLoad(true)
            setTitleValues([{
                form: formik.values.form,
                branch: formik.values.branch,
                sector: formik.values.sector,
                subSector: formik.values.subSector,
                startDate: formik.values.startDate,
                endDate: formik.values.endDate,
            }])

            // pesquisa os formulários
            api.get(`/metrics/form/?end_at__lte=${values.endDate}&start_at__gte=${values.startDate}&title=${values.form}
            &sectorId__branchName__number=${values.branch}&sectorId__sectorGroup=${values.sector}&sectorId=${values.subSector}`)
            .then(SetDataZero([]))
            .then( forms => {
                SetDataForm(forms.data.results)

                if (forms.data.results.length === 0){
                    setTimeout(function(){  handleClose()} , 500);
                }
                
                //pesquisa as perguntas
                forms.data.results.map((element, index) => {

                    api.get(`/metrics/relatory/?formId=${element.id}`)
                    .then()
                    .then( relatory => {
                            relatory.data.results.map((element, index) => {
                                
                                if (element.responseweight === 0){
                                    console.log(element)
                                    SetDataZero(dataZero => [...dataZero, {
                                        response: element.response, 
                                        sector: element.sector,
                                        sectorGroup: element.sectorGroup,
                                        image: element.image,}])
                                }

                            })
                        })
                    .catch(err => console.log(err))

                if (forms.data.results.length == index + 1){
                    setTimeout(function(){  handleClose()} , 1000);
                }
                })
            })
            .catch(err => console.log(err))
    
    }});

    //ordena e filtra o array de não conformidades
    useEffect(() => {
        var NewArray = dataZero.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t === value
        ))
        )
        
        const valuesArray = NewArray.sort((a, b) => a.sector.toLowerCase() > b.sector.toLowerCase() ? 1 : -1)
        SetDataZeroOrdenate(valuesArray)
    }, [dataZero]); 
    
    return(
        <Container fluid className="ContainerTableProfile5s p-3">
            <h2 className='text-center mt-3'>Obter lista de respostas</h2>
            
            <Form id="notesRelatoryForm" className='d-flex flex-wrap' onSubmit={formik.handleSubmit} noValidate>
                <div className='col-12 col-sm-3 pe-sm-3'>
                    <Form.Select 
                        placeholder="Senso" 
                        id="form"
                        name="form"
                        aria-describedby="formerror"
                        onChange={formik.handleChange}
                        className={formik.errors.form ? "error mt-3" : 'mt-3'}
                        value={formik.values.form}
                        disabled ={(load)?true:false}>

                        <option value="" disabled>Escolha um senso</option>
                        <option value="SEIRE">Seire</option>
                        <option value="SEITON">Seiton</option>
                        <option value="SEISO">Seiso</option>
                        <option value="SEIKETSU">Seiketsu</option>
                        <option value="SHITSUKE">Shitsuke</option>
                    </Form.Select>
                    {formik.errors.form ? <Form.Text id="formerror" className="text-danger">{formik.errors.form}</Form.Text> : null}
                </div>

                <div className='col-12 col-sm-3 pe-sm-3'>
                    <Form.Select 
                        placeholder="Filial" 
                        id="branch"
                        name="branch"
                        aria-describedby="brancherror"
                        onChange={(e) => {selectSector(e.target.value); formik.handleChange(e);}}
                        className={formik.errors.branch ? "error mt-3" : 'mt-3'}
                        value={formik.values.branch}
                        disabled ={(load)?true:false}>

                        <option default value="" disabled>Escolha uma filial</option>
                        {branchs ? branchs.map((branch) =>
                            <option key={branch.id} value={branch.number}>{branch.number} - {branch.address}</option>
                        ) : null}
                    </Form.Select>
                    {formik.errors.branch ? <Form.Text id="brancherror" className="text-danger">{formik.errors.branch}</Form.Text> : null}
                </div>

                <div className='col-12 col-sm-3 pe-sm-3'>
                    <Form.Select 
                        placeholder="Setor" 
                        id="sector"
                        name="sector"
                        aria-describedby="sectorherror"
                        onChange={(e) => {selectSubSector(e.target.value); formik.handleChange(e);}}
                        className={formik.errors.sector ? "error mt-3" : 'mt-3'}
                        value={formik.values.sector}
                        disabled ={(load) || sectorsDate.length == 0 ? true:false}>

                        <option key='defaultts' default value="" disabled>Escolha um Setor</option>
                        {sectorsDate ? sectorsDate.map((sectorsDate) =>
                            <option key={sectorsDate.id} value={sectorsDate.id}>{sectorsDate.name}</option>
                        ) : null}
                    </Form.Select>
                    {formik.errors.sector ? <Form.Text id="brancherror" className="text-danger">{formik.errors.sector}</Form.Text> : null}
                </div>

                <div className='col-12 col-sm-3'>
                    <Form.Select 
                        placeholder="subSector" 
                        id="subSector"
                        name="subSector"
                        aria-describedby="subSectorerror"
                        onChange={formik.handleChange}
                        className={formik.errors.subSector ? "error mt-3" : 'mt-3'}
                        value={formik.values.subSector}
                        disabled ={(load) || subSectorsDate.length == 0 ?true:false}>

                        <option default value="" disabled>Escolha um sub setor</option>
                        {subSectorsDate ? subSectorsDate.map((subSectorsDate) =>
                            <option key={subSectorsDate.id} value={subSectorsDate.id}>{subSectorsDate.name}</option>
                        ) : null}
                    </Form.Select>
                    {formik.errors.subSector ? <Form.Text id="subSectorerror" className="text-danger">{formik.errors.subSector}</Form.Text> : null}
                </div>
                
                <Form.Control
                    placeholder="data inicial"
                    type="date" 
                    id="startDate"
                    name="startDate"
                    aria-describedby="startDateerror"
                    onChange={formik.handleChange}
                    className={formik.errors.startDate ? "error mt-3" : 'mt-3'}
                    value={formik.values.startDate}
                    disabled ={(load) || subSectorsDate.length == 0 ?true:false}
                    />
                {formik.errors.startDate ? <Form.Text id="startDateerror" className="text-danger">{formik.errors.startDate}</Form.Text> : null}
                
                <Form.Control
                    placeholder="data final"
                    type="date" 
                    id="endDate"
                    name="endDate"
                    aria-describedby="endDateerror"
                    onChange={formik.handleChange}
                    className={formik.errors.endDate ? "error mt-3" : 'mt-3'}
                    value={formik.values.endDate}
                    disabled ={(load) || subSectorsDate.length == 0 ?true:false}
                    />
                {formik.errors.endDate ? <Form.Text id="endDateerror" className="text-danger">{formik.errors.endDate}</Form.Text> : null}

                <Col className='mt-3' >
                    <Button type='submit' disabled ={(load)?true:false} onClick={setValidateAfterSubmit}>Gerar relatório</Button>
                </Col>
            </Form>
             
            <Modal style={{ background: '#00004F' }} show={load} backdrop="static" keyboard={false} centered onHide={handleClose}>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center">
                        <Load height='' width = '30%'/> 
                        Só um momento, estamos gerando seu relatório :)
                    </div>
                </Modal.Body>
            </Modal>   
                      
            {validateAfterSubmit ?
            <>
                <h2 className='text-center'> Lista de respostas</h2>
                {titleValues ?
                    <p className='text-center'> {titleValues[0].form} Loja {titleValues[0].branch}:  
                                                {moment(titleValues[0].startDate).format(" DD/MM/YYYY")} -
                                                {moment(titleValues[0].endDate).format(" DD/MM/YYYY")}
                    </p>
                : null }

                <Table hover striped responsive className="table-remove-border">
                    <thead>
                        <tr>
                            <th>Setor</th>
                            <th>SubSetor</th>
                            <th>Pergunta</th>
                            <th>Resposta</th>
                            <th>Imagem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Children.toArray(dataZeroOrdenate.map((dataZeroElement, index) =>  
                        <tr>
                            <td className="col-1"> {dataZeroElement.sectorGroup} </td>
                            <td className="col-1"> {dataZeroElement.sector} </td>
                            <td className="col-4"> {dataZeroElement.ask}</td>
                            <td className="col-5"> {dataZeroElement.response}</td>
                            <td className="col-1"> <a href={dataZeroElement.image} target="_blank" rel="noopener noreferrer">Anexo</a></td>
                        </tr>
                        ))}
                        <NoData table={dataZeroOrdenate} messageSearch="Nenhuma Não conformidade encontrada"  messageNoData="Nenhuma Não conformidade encontrada" colspan='3'/>
                    </tbody>
                </Table> 
            </>
            : null}
        </Container>
    )
}

export default Responses;