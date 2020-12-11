import React, { Fragment, useState } from 'react';
//import { withRouter } from 'react-router-dom';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
  NavLink
} from 'reactstrap';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  //NavLink as NavLinkRoute
} from "react-router-dom";
import HabilitarCamion from './Components/HabilitarCamion';
import Inicio from './Components/Inicio';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Logo from './Images/logoanh.png';
import CamionesList from './Components/CamionesList';
import RegistrarCompras from './Components/RegistrarCompras';
import ComprasFecha from './Components/Consultas/ComprasFecha';
import ClientesMasFrecuentes from './Components/Consultas/ClientesMasFecuentes';
//import { useHistory } from "react-router-dom";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  //let history = useHistory();

  return (
    <Router>
      <Fragment>
        <Container>

          <img src={Logo} alt="" width='150' />
          <Navbar color="light" light expand="md">
            <NavbarBrand
              href="/inicio"
            //onClick={() => history.push('/')}
            >
              {'CONTROL GLP'}
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href='/habilitarcamion' >HABILITAR CAMION</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/listcamiones">REGISTRAR COMPRAS</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/comprasfecha">CONSULTAS</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    ESTADISTICAS
              </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <NavLink href='/clientesmasfrecuentes' >CLIENTES FRECUENTES</NavLink>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      RESUMEN VENTAS MENSUALES
                </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <NavbarText>
                {"ANH RIBERALTA"}
              </NavbarText>
            </Collapse>
          </Navbar>
          <Switch>
            <Route path='/registrarcompras/:fecha/:id'>
              <RegistrarCompras />
            </Route>
            <Route path='/habilitarcamion'>
              <HabilitarCamion />
            </Route>
            <Route path='/listcamiones'>
              <CamionesList />
            </Route>
            <Route path='/comprasfecha'>
              <ComprasFecha />
            </Route>
            <Route path='/clientesmasfrecuentes'>
              <ClientesMasFrecuentes />
            </Route>
            <Route path='/'>
              <Inicio />
            </Route>
          </Switch>
          <ToastContainer />
        </Container>
      </Fragment>
    </Router>
  );
}

export default App;
