import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Login from "../../components/Accounts/Login/Login";
import PasswordReset from "../../components/Accounts/PasswordReset/PasswordReset";
import PassWordResetPost from "../../components/Accounts/PasswordReset/PassWordResetPost";
import Profile from "../../components/Accounts/Profile/Profile";
import Register from "../../components/Accounts/Register/Register";
import ControlPainel from "../../components/ControlPainel/ControlPainel";
import ListBranch from "../../components/ControlPainel/Filiais/ListBranch";
import ListOffice from "../../components/ControlPainel/Office/ListOffice";
import PermissionManager from "../../components/ControlPainel/Permissions/PermissionManager";
import DynamicForm from "../../components/ControlPainel/Sector/DynamicForm/DynamicForm";
import ImagesUpload from "../../components/ControlPainel/Sector/ImagesUpload/ImagesUplaod";
import SectorForm from "../../components/ControlPainel/Sector/PostSector/SectorForm";
import SectorProfile from "../../components/ControlPainel/Sector/SectorProfile/SectorProfile";
import ListUsers from "../../components/ControlPainel/Users/ListUsers";
import Forbidden from "../../components/ErrorPages/Forbidden";
import PageNotFound from "../../components/ErrorPages/PageNotFound";
import Home from "../../components/Home/Home";
import NavBar from "../../components/Reusable/Navbar/Navbar";
import { AdminPrivateRoute, LoginPrivateRoute, PrivateRoute, SuperAdminPrivateRoute } from "../PrivateRoute";
import "./animations.css"
import DynamicFormEdit from "../../components/ControlPainel/Sector/DynamicForm/EditForms";
import SubSectorHome from "../../components/Home/HomeSubSector/SubSectorHome";
import PostSectorGroup from "../../components/ControlPainel/Sector/SectorGroup/PostSectorGroup/PostSectorGroup";
import SectorGroup from "../../components/ControlPainel/Sector/SectorGroup/SectorGroupList/SectorGroupList";
import SectorGroupProfile from "../../components/ControlPainel/Sector/SectorGroup/SectorGroupProfile/SectorGroupProfile";
import HomeRenposeForm from "../../components/Home/homeServices/HomeRenposeForm/HomeRenposeForm";
import FormResponseInput from "../../components/Home/homeServices/HomeRenposeForm/FormResponseInput/FormResponseInput";
import NotasGerais from "../../components/ControlPainel/Metricas/NotasGerais/NotasGerais";

function AnimatedRoutes(){

    const location = useLocation();

    return(
        
        <TransitionGroup className="h-100">
        <NavBar/>
          <CSSTransition key={location.key} classNames='transition' timeout={500}>
            <Routes location={location}>
                <Route path="/proibido" element={<Forbidden/>}></Route>
                <Route element={<LoginPrivateRoute />}>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/cadastro" element={<Register />}/>
                    <Route path="/resetarsenha" element={<PasswordReset />}/>
                    <Route path="/resetarsenha/confirmar" element={<PassWordResetPost />}/>
                </Route>
                <Route element={<PrivateRoute/>}>
                    <Route exact path='/conta/perfil' element={<Profile/>}/>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/subsetores/:id" element={<SubSectorHome />} />
                    <Route exact path="/formularios/:id" element={<HomeRenposeForm/>} />
                    <Route exact path="/responderformulario/:id" element={<FormResponseInput/>} />
                </Route>
                <Route element={<AdminPrivateRoute />}>

                    {/*SubSectores*/}

                    <Route exact path="/admin" element={<ControlPainel/>} />
                    <Route exact path='/subsetor/criarsetor/:sectorGroupId/:sectorBranch/:sectorGroupName/:is_edit' element={<SectorForm/>} />
                    <Route exact path='/subsetor/editar/:sectorGroupId/:image/:sectorid/:sectorGroupName/:is_edit/' element={<SectorForm/>} />
                    <Route exact path='/setores/senso' element={<DynamicForm/>} />
                    <Route exact path='/setores/enviarimagem' element={<ImagesUpload/>}/>
                    <Route exact path='/perfilsetor/:sectorid' element={<SectorProfile/>}/>

                    {/*Cargos*/}
                    
                    <Route exact path='/cargos' element={<ListOffice/>}/>

                    {/*Usuario*/}

                    <Route exact path='/usuarios' element={<ListUsers/>}/>

                    {/*Filiais*/}

                    <Route exact path='/filiais' element={<ListBranch/>}/>

                    {/*Sectores*/}

                    <Route exact path='/setores/senso/:sectorId/editar/:id' element={<DynamicFormEdit/>} />
                    <Route exact path='/setores/' element={<SectorGroup/>}/>
                    <Route exact path='/setores/adicionarsetor' element={<PostSectorGroup/>} />
                    <Route exact path='/setores/editarsetor/:id' element={<PostSectorGroup/>} />
                    <Route exact path='/setores/perfil/:id' element={<SectorGroupProfile/>}/>
                   
                    {/* Métricas */}

                    <Route exact path="/notasgerais" element={<NotasGerais/>} />


                </Route>
                <Route element={<SuperAdminPrivateRoute />}>
                    <Route exact path='/permissoes' element={<PermissionManager/>}/>
                </Route>
                <Route path="*" element={<PageNotFound/>}></Route>
            </Routes>
        </CSSTransition>
    </TransitionGroup>
    )
}

export default AnimatedRoutes;