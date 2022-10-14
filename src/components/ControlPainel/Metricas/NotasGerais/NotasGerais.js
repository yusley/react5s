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

function NotasGerais (){
    
    const api = useAxios()
    const [dataForm, SetDataForm] = useState([])
    const [dataZero, SetDataZero] = useState([])
    const [dataZeroOrdenate, SetDataZeroOrdenate] = useState([])
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const [load, setLoad] = useState(false)
    const [titleValues, setTitleValues] = useState(false)
    const [branchs, setBranchs] = useState([])
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

    const SignupSchema = Yup.object().shape({
        form: Yup.string()
            .required('Você precisa selecionar um senso'),
        branch: Yup.string()
            .required('Você precisa selecionar uma filial'),
        startDate: Yup.date()
            .required('Escolha uma data inicial'),
        endDate: Yup.date()
            .min(Yup.ref('startDate'), "A data final não pode ser maior que a data inicial")
            .required('Escolha uma data final')
    });

    const formik = useFormik({
        initialValues: { form: "", branch: "", startDate: "", endDate: ""},
        validationSchema : SignupSchema,
        validateOnChange : validateAfterSubmit,
        validateOnBlur : validateAfterSubmit,
        onSubmit: values => {
            setLoad(true)
            setTitleValues([{
                form: formik.values.form,
                branch: formik.values.branch,
                startDate: formik.values.startDate,
                endDate: formik.values.endDate,
            }])

            // pesquisa os formulários
            api.get(`/metrics/form/?end_at__lte=${values.endDate}&start_at__gte=${values.startDate}&title=${values.form}&sectorId__branchName__number=${values.branch}`)
            .then(setNotes([]), setSectorGroups([]), SetDataZero([]))
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
                        if (relatory.data.results.length == 0) {
                            setNotes(notes => [...notes, {note: 0, 
                                sector: element.sector,
                                sectorGroup: element.sectorGroup,
                                sectorId: element.sectorId,
                                sectorGroupId: element.sectorGroupId,
                                is_response: false}])
                            
                            setSectorGroups(sectorGroups => [...sectorGroups, 
                                {sectorGroupId: element.sectorGroupId,
                                cont : 0,
                                note: 0}]) 
                        }
                        else{
                            let contNote = 0
                            relatory.data.results.map((element, index) => {
                                
                                contNote += element.responseweight

                                if (element.responseweight === 0){
                                    console.log(element)
                                    SetDataZero(dataZero => [...dataZero, {
                                        response: element.response, 
                                        sector: element.sector,
                                        sectorGroup: element.sectorGroup,
                                        image: element.image,}])
                                }

                                if (relatory.data.results.length == index + 1){
                                    let noteFinish = contNote / relatory.data.results.length
                                    setNotes(notes => [...notes, {note: noteFinish, 
                                                                sectorGroup: relatory.data.results[0].sectorGroup,
                                                                sectorGroupId: relatory.data.results[0].sectorGroupId,
                                                                sector: relatory.data.results[0].sector,
                                                                sectorId: relatory.data.results[0].sectorId,
                                                                is_response: true}])
                                    
                                    setSectorGroups(sectorGroups => [...sectorGroups, 
                                        {sectorGroupId: relatory.data.results[0].sectorGroupId,
                                        cont : 0,
                                        note: 0}]) 
                                }
                            })
                        }
                        
                    })
                    .catch(err => console.log(err))

                if (forms.data.results.length == index + 1){
                    setTimeout(function(){  handleClose()} , 1000);
                }
                })
            })
            .catch(err => console.log(err))
    
    }});
 
    //ordena e filtra o array de notas
    useEffect(() => {
        var NewArray = notes.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t === value
        ))
        )
        
        const valuesArray = NewArray.sort((a, b) => a.sector.toLowerCase() > b.sector.toLowerCase() ? 1 : -1)
        setNotesOrdenate(valuesArray)
    }, [notes]);

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

    //ordena e filtra o array de setores
    useEffect(() => {
        var NewArray = sectorGroups.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t?.sectorGroupId === value?.sectorGroupId
        ))
        )

        NewArray.map((element, index) => {
            element.note = 0
            element.cont = notesOrdenate.filter(item => item.sectorGroupId == element.sectorGroupId).length
            notesOrdenate.map((note, index) => {
                if (note.sectorGroupId == element.sectorGroupId){
                    element.note = note.note + element.note
                }
            })
        })

        const valuesArray = NewArray.sort((a, b) => a?.sectorGroupId > b?.sectorGroupId ? 1:-1)
        setSectorGroupsOrdenate(valuesArray)
    }, [notesOrdenate]); 
    
    return(
        <Container fluid className="ContainerTableProfile5s p-3">
            <h2 className='text-center mt-3'>Gerar relatório de notas</h2>
            
            <Form id="notesRelatoryForm" onSubmit={formik.handleSubmit} noValidate>
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

                <Form.Select 
                    placeholder="Filial" 
                    id="branch"
                    name="branch"
                    aria-describedby="brancherror"
                    onChange={formik.handleChange}
                    className={formik.errors.branch ? "error mt-3" : 'mt-3'}
                    value={formik.values.branch}
                    disabled ={(load)?true:false}>

                    <option default value="" disabled>Escolha uma filial</option>
                    {branchs ? branchs.map((branch) =>
                        <option key={branch.id} value={branch.number}>{branch.number} - {branch.address}</option>
                    ) : null}
                </Form.Select>
                {formik.errors.branch ? <Form.Text id="brancherror" className="text-danger">{formik.errors.branch}</Form.Text> : null}

                <Form.Control
                    placeholder="data inicial"
                    type="date" 
                    id="startDate"
                    name="startDate"
                    aria-describedby="startDateerror"
                    onChange={formik.handleChange}
                    className={formik.errors.startDate ? "error mt-3" : 'mt-3'}
                    value={formik.values.startDate}
                    disabled ={(load)?true:false}
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
                    disabled ={(load)?true:false}
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
                <h2 className='text-center'> Média de notas por setor</h2>
                {titleValues ?
                    <p className='text-center'> {titleValues[0].form} Loja {titleValues[0].branch}:  
                                                {moment(titleValues[0].startDate).format(" DD/MM/YYYY")} -
                                                {moment(titleValues[0].endDate).format(" DD/MM/YYYY")}
                    </p>
                : null }
                <Table hover responsive className="NotesResult table-remove-border">
                    <thead>
                        <tr>
                            <th>SubSetor</th>
                            <th className='text-end'>Pontuação</th>
                            <th className='text-center'>%</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {Children.toArray(sectorGroupsOrdenate.map((sectorGroupElement, inde) => {
                            let first = true
                            return notesOrdenate.map((element, index) => {   

                                if (element.sectorGroupId == sectorGroupElement.sectorGroupId && first){
                                    first = false
                                    return(
                                        <tr>
                                            <td className='col-6'>{element.sector}</td>
                                            <td className='text-end col-4'>{element.note.toFixed(2)}</td>
                                            <td className={"center-rowspan col-2 leftborder " + ((((sectorGroupElement.note / sectorGroupElement.cont) * 100) / 3) >= 70 ? 
                                            "aprovedClass" : (((sectorGroupElement.note / sectorGroupElement.cont) * 100) / 3) < 70 && 
                                            (((sectorGroupElement.note / sectorGroupElement.cont) * 100) / 3) >= 50 ? "semiaprovedClass" : "text-color-white reprovedClass")} rowspan={sectorGroupElement.cont}>
                                                
                                                {element.sectorGroup} {(((sectorGroupElement.note / sectorGroupElement.cont) * 100) / 3).toFixed(2)}%
                                            
                                            </td>
                                        </tr>
                                    )
                                }
                                else if(element.sectorGroupId == sectorGroupElement.sectorGroupId && element.is_response){
                                    return(
                                        <tr>
                                            <td className='col-6'>{element.sector}</td>
                                            <td className='text-end col-4'>{element.note.toFixed(2)}</td>
                                        </tr>
                                    )
                                }
                                else if(element.sectorGroupId == sectorGroupElement.sectorGroupId && !element.is_response){
                                    return(
                                        <tr>
                                            <td className='col-6'>{element.sector}</td>
                                            <td className='text-start col-4'>O formulário desse SubSetor não foi respondido</td>
                                        </tr>
                                    )
                                }

                                if (notesOrdenate.length == index + 1){
                                    return(
                                        <tr>
                                            <td class="topB"></td>
                                            <td class="topB"></td>
                                            <td class="topB"></td>
                                        </tr>
                                    )
                                }

                        })
                        }))}
                        <NoData table={notesOrdenate} messageSearch="Nenhum senso encontrado nesssa data" messageNoData="Nenhum senso encontrado" colspan='3'/>
                    </tbody>
                </Table>

                <h2 className='text-center mt-5'> Lista de não conformidades</h2>
                <Table hover striped responsive className="table-remove-border">
                    <thead>
                        <tr>
                            <th>Setor</th>
                            <th>SubSetor</th>
                            <th>Motivo</th>
                            <th>Imagem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Children.toArray(dataZeroOrdenate.map((dataZeroElement, index) =>  
                        <tr>
                            <td className="col-2"> {dataZeroElement.sectorGroup} </td>
                            <td className="col-2"> {dataZeroElement.sector} </td>
                            <td className="col-6"> {dataZeroElement.response}</td>
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

export default NotasGerais;