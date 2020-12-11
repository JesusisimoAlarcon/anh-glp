import React, { Fragment, useState, useEffect } from 'react'
import { Alert, Button, Col, Row, Spinner } from 'reactstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { format } from 'date-fns';
import gas from '../../Images/gas.png';
//import { Link } from 'react-router-dom';
//import { withRouter } from 'react-router-dom';
import { useHistory } from "react-router-dom";


const CamionesList = () => {
    const [donwload, setDonwload] = useState(false);
    const [camiones, setCamiones] = useState([]);
    let history = useHistory();

    useEffect(() => {
        getCamiones()
    }, [])

    const getCamiones = async () => {
        setDonwload(true);
        const camiones = await (await axios.get('http://161.35.66.154:4555/api/camion')).data;
        setDonwload(false);
        setCamiones(camiones);
        console.log(camiones)
    }

    const columns = [
        {
            name: '',
            wrap: true,
            buttom: true,
            center: true,
            cell: row => <Button
                className='m-1 p-1'
                outline
                color='success'
                size='sm'
                //onClick={() => history.push(`/registrarcompras/${format(new Date(row.CAMION_FECHA), 'yyyy-MM-dd')}/${row.IDCAMION}`)}
                onClick={() => history.push(`/registrarcompras/${(row.CAMION_FECHA)}/${row.IDCAMION}`)}
            >
                <img src={gas} alt="" width='20' />
                <small>{'REGISTRAR'}</small>
            </Button >
        },
        {
            name: 'FECHA COMPRA',
            selector: 'CAMION_FECHA',
            //sortable: true,
            wrap: true,
            format: row => <div>{format(new Date(row.CAMION_FECHA), 'dd/MM/yy')}</div>
        },
        {
            name: 'VENDEDOR',
            selector: 'CAMION_VENDEDOR',
            sortable: true,
            wrap: true
        },
        {
            name: 'CANTIDAD GARRAFAS',
            selector: 'CAMION_VENTA_MAXIMA',
            sortable: true,
            wrap: true,
            center: true
        },

        {
            name: 'DISTRIBUIDORA',
            selector: 'DIS_NOMBRE',
            sortable: true,
            wrap: true
        },


    ];
    return (
        <Fragment>
            <Alert color='info' className='m-2 text-center'>
                <small>
                    {'Seleccione el camion al cual se registraran sus compras'}
                </small>
            </Alert>
            <Row className='mt-2 pt-2'>
                <Col>
                    <DataTable
                        title="ULTIMAS COMPRAS REGISTRADAS"
                        columns={columns}
                        data={camiones}
                        noHeader
                        pagination
                        progressComponent={<Spinner type='grow' style={{ width: '5rem', height: '5rem' }} color='info' size='md' />}
                        progressPending={donwload}
                        dense
                    />
                </Col>
            </Row>
        </Fragment>
    )
}
export default (CamionesList);