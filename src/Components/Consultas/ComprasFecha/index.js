import React, { useState, useEffect, Fragment } from 'react';

import DataTable from 'react-data-table-component';
import axios from 'axios';
import { format } from 'date-fns';
import garrafa from '../../../Images/garrafa.png';
import garrafas from '../../../Images/garrafas.png';
import esLocale from 'date-fns/locale/es';
import { Badge, Card, CardBody, CardHeader, Col, Input, Row, Spinner } from 'reactstrap';

const ComprasFecha = () => {
    const [donwload, setDonwload] = useState(false);
    const [compras, setCompras] = useState([]);
    const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect((fecha) => {
        getCompras(fecha);
    }, [])

    const getCompras = async (fecha) => {
        setDonwload(true);
        const compras = await (await axios.get(`http://161.35.66.154:4555/api/compra/fecha/${fecha}`)).data;
        setDonwload(false);
        setCompras(compras);
        console.log(compras)
    }

    const columns = [
        {
            name: 'FECHA COMPRA',
            selector: 'COMPRA_FECHA',
            sortable: true,
            wrap: true,
            format: row => <div>{format(new Date(row.COMPRA_FECHA), 'dd/MMM/yy', { locale: esLocale })}</div>
        },
        {
            name: 'HORA COMPRA',
            selector: 'COMPRA_HORA',
            sortable: true,
            wrap: true

        },
        {
            name: 'GARRAFAS',
            selector: 'NUMERO_GARRAFA',
            sortable: true,
            wrap: true,
            cell: row => <div>{row.NUMERO_GARRAFA}<img src={row.NUMERO_GARRAFA > 1 ? garrafas : garrafa} alt="" width='35%' /></div>
        },
        {
            name: 'CI CLIENTE',
            selector: 'CLIENTE_CI',
            sortable: true,
            wrap: true
        },
        {
            name: 'CLIENTE',
            selector: 'CLIENTE_NOMBRE',
            sortable: true,
            wrap: true
        },
        {
            name: 'ACTIVIDAD',
            selector: 'CLIENTE_ACTIVIDAD',
            sortable: true,
            wrap: true,
            cell: row => <small>{row.CLIENTE_ACTIVIDAD}</small>
        },
        {
            name: 'CAMION',
            selector: 'CAMION_NUMERO',
            sortable: true,
            wrap: true
        },
        {
            name: 'VENDEDOR',
            selector: 'CAMION_VENDEDOR',
            sortable: true,
            wrap: true
        },
        {
            name: 'DISTRIBUIDORA',
            selector: 'DIS_NOMBRE',
            sortable: true,
            wrap: true
        },
        {
            name: 'DIRECCION DE COMPRA',
            selector: 'DIS_DIRECCION',
            sortable: true,
            wrap: true,
            cell: row => <small>{row.DIS_DIRECCION}</small>
        },
    ];
    return (
        <Fragment>
            <Row className='text-center mt-2'>
                <Col>

                    <Card>
                        <CardHeader>{'CONSULTA DE COMPRAS REALIZADAS POR FECHA'}</CardHeader>
                        <CardBody>



                            <Row className='text-center'>
                                <Col lg={4}>
                                    <Badge color='success'>
                                        <Badge pill color='light'>{compras.length}</Badge>
                                        {' COMPRAS REGISTRADAS'}
                                    </Badge>
                                </Col>
                                <Col lg={4}>
                                    <Input
                                        name='fecha'
                                        type='date'
                                        bsSize='sm'
                                        value={fecha}
                                        onChange={e => {
                                            getCompras(e.target.value);
                                            setFecha(e.target.value)
                                        }}
                                    />
                                </Col>
                                <Col lg={4}>
                                </Col>
                            </Row>
                            <Row className='mt-2 pt-2'>
                                <Col>
                                    <DataTable
                                        title="ULTIMAS COMPRAS REGISTRADAS"
                                        columns={columns}
                                        data={compras}
                                        noHeader
                                        pagination
                                        progressComponent={<Spinner type='grow' style={{ width: '5rem', height: '5rem' }} color='info' size='md' />}
                                        progressPending={donwload}
                                        dense
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default (ComprasFecha);
