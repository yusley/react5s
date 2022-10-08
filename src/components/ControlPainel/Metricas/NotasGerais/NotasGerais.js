import { Children, useEffect, useState } from 'react'
import {Button, Col, Container, Form, Table} from 'react-bootstrap'
import useAxios from '../../../../utils/useAxios'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './metrics.css'
import NoData from '../../../Reusable/Messages/MessageTable';

function NotasGerais (){
    
    const api = useAxios()
    const [dataForm, SetDataForm] = useState([])
    const [dataAsks, SetDataAsks] = useState([])
    const [dataResponses, SetDataResponses] = useState([])
    const [validateAfterSubmit, setValidateAfterSubmit] = useState(false);
    const [load, setLoad] = useState(false)
    const [branchs, setBranchs] = useState([])
    const [notes, setNotes] = useState([])
    const [notesOrdenate, setNotesOrdenate] = useState([])
    const [sectorGroups, setSectorGroups] = useState([])
    const [sectorGroupsOrdenate, setSectorGroupsOrdenate] = useState([])

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
            //setLoad(true)
            // pesquisa os formulários
            api.get(`/metrics/form/?end_at__lte=${values.endDate}&start_at__gte=${values.startDate}&title=${values.form}`)
            .then(setNotes([]), setSectorGroups([]))
            .then( forms => {
                SetDataForm(forms.data.results)
                //pesquisa as perguntas
                forms.data.results.map((element, index) => {

                    api.get(`/metrics/relatory/?formId=${element.id}`)
                    .then()
                    .then( relatory => {
                       console.log(relatory.data.results)
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

                })
            })
            .catch(err => console.log(err))
    
    }});
 
    useEffect(() => {
        var NewArray = notes.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t === value
        ))
        )
        
        const valuesArray = NewArray.sort((a, b) => a.sector.toLowerCase() > b.sector.toLowerCase() ? 1 : -1)
        setNotesOrdenate(valuesArray)
    }, [notes]); 

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
                    <Button type='submit' onClick={setValidateAfterSubmit}>Teste</Button>
                </Col>
            </Form>

            <Table hover responsive>
                <thead>
                    <tr>
                        <th>SubSetor</th>
                        <th>Pontuação</th>
                        <th>Média do setor</th>
                    </tr>
                </thead>
                <tbody>
                    {Children.toArray(sectorGroupsOrdenate.map((sectorGroupElement, inde) => {
                        let first = true
                        return notesOrdenate.map((element, index) => {   

                            if (element.sectorGroupId == sectorGroupElement.sectorGroupId && element.is_response && first){
                                first = false
                                return(
                                    <tr>
                                        <td>{element.sector}</td>
                                        <td>{element.note.toFixed(2)}</td>
                                        <td rowspan={sectorGroupElement.cont}>
                                            {(((sectorGroupElement.note / sectorGroupElement.cont) * 100) / 3).toFixed(2)}%
                                        </td>
                                    </tr>
                                )
                            }
                            else if(element.sectorGroupId == sectorGroupElement.sectorGroupId && element.is_response){
                                return(
                                    <tr>
                                        <td>{element.sector}</td>
                                        <td>{element.note.toFixed(2)}</td>
                                    </tr>
                                )
                            }
                            else if(element.sectorGroupId == sectorGroupElement.sectorGroupId && !element.is_response){
                                return(
                                    <tr>
                                        <td>{element.sector}</td>
                                        <td>O formulário desse SubSetor não foi respondido</td>
                                        <td></td>
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
                    <NoData table={dataForm} colspan='7' messageNoData="Nenhum senso encontrado"/>
                </tbody>
            </Table>
        </Container>
    )
}

export default NotasGerais;