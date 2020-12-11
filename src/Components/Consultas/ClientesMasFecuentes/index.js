import Axios from 'axios';
import React, { Fragment, useState, useEffect } from 'react';
import { Badge, Col, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

import DataTable from 'react-data-table-component';
export default function ClientesMasFrecuentes() {
    const [donwload, setDonwload] = useState(false);
    const [distrito, setDistrito] = useState('');
    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');
    const [distritos, setDistritos] = useState([]);
    const [anos, setAnos] = useState([]);
    const [meses, setMeses] = useState([]);
    const [compras, setCompras] = useState([]);
    const strMeses = [
        '',
        'ENERO',
        'FEBRERO',
        'MARZO',
        'ABRIL',
        'MAYO',
        'JUNIO',
        'JULIO',
        'AGOSTO',
        'SEPTIEMBRE',
        'OCTUBRE',
        'NOVIEMBRE',
        'DICIEMBRE'
    ]
    useEffect(() => {
        getDistritos();
    }, [])

    const getDistritos = async () => {
        setDonwload(true);
        const distritos = await (await Axios.get(`http://161.35.66.154:4555/api/compra/distritos/`)).data;
        setDonwload(false);
        setDistritos(distritos)
    }

    const getYearsByDistrito = async (distrito) => {
        const anos = await (await Axios.get(`http://161.35.66.154:4555/api/compra/years/` + distrito)).data;
        setAnos(anos);
        console.log(anos)
    }

    const getMonthByYearAndDistrito = async (gestion) => {
        const meses = await (await Axios.get(`http://161.35.66.154:4555/api/compra/year/distrito/` + gestion + '/' + distrito)).data;
        setMeses(meses);
        console.log(meses)
    }

    const getComprasFrecuentes = async (mes) => {
        setDonwload(true);
        const compras = await (await Axios.get(`http://161.35.66.154:4555/api/compra/month/year/distrito/${mes}/${ano}/${distrito}`)).data
        setDonwload(false);
        setCompras(compras);
        console.log(compras)
    }
    const columns = [
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
            name: 'COMPRAS',
            selector: 'compras',
            sortable: true,
            wrap: true,
            center: true
        },
        {
            name: 'CANT GARRAFAS',
            selector: 'garrafas',
            sortable: true,
            wrap: true,
            center: true
        },
        /*
        {
            name: 'DISTRIBUIDORA',
            selector: 'DIS_NOMBRE',
            sortable: true,
            wrap: true
        },
        {
            name: 'CIUDAD',
            selector: 'DIS_CIUDAD',
            sortable: true,
            wrap: true,
        },
        */
    ];
    return (
        <Fragment>
            <Row className='text-center'>
                <Col lg={4}>
                    <FormGroup>
                        <Label>{'DISTRITO'}</Label>
                        <Input
                            name=''
                            value={distrito}
                            type='select'
                            bsSize='sm'
                            onChange={e => {
                                //setAnos([])
                                //setMeses([])
                                getYearsByDistrito(e.target.value);
                                setDistrito(e.target.value)
                            }}
                        >
                            <option value=""></option>
                            {distritos.map(d =>
                                <option key={d.DIS_NOMBRE} value={d.DIS_NOMBRE}>{d.DIS_NOMBRE + ' - ' + d.DIS_CIUDAD}</option>
                            )}
                        </Input>
                    </FormGroup>
                </Col>
                <Col lg={4}>
                    <FormGroup>
                        <Label>{'GESTION'}</Label>
                        <Input
                            name='ano'
                            value={ano}
                            type='select'
                            bsSize='sm'
                            onChange={e => {
                                //setMeses([])
                                getMonthByYearAndDistrito(e.target.value);
                                setAno(e.target.value)
                            }}
                        >
                            <option value=""></option>
                            {anos.map(a =>
                                <option value={a.ANO} key={a.ANO}>{a.ANO}</option>
                            )}
                        </Input>
                    </FormGroup>
                </Col>
                <Col lg={4}>
                    <FormGroup>
                        <Label>{'MES'}</Label>
                        <Input
                            name='mes'
                            value={mes}
                            type='select'
                            bsSize='sm'
                            onChange={e => {
                                getComprasFrecuentes(e.target.value);
                                setMes(e.target.value)
                            }}
                        >
                            <option value=""></option>
                            {meses.map(m =>
                                <option value={m.MES} key={m.MES}>{strMeses[m.MES]}</option>
                            )}
                        </Input>
                    </FormGroup>
                </Col>
                {/*}
                <Col lg={2}>
                    <FormGroup>
                        <Label>{'  *  '}</Label>
                        <Button size='sm' block color='success'>
                            <small>
                                {'CONSULTAR'}
                            </small>
                        </Button>
                    </FormGroup>
                </Col>
                {*/}
            </Row>
            {mes &&
                <div>
                    <Row className='text-center'>
                        <Col>
                            <Badge>{strMeses[mes] + ' / ' + ano + '   -   ' + distrito}</Badge>
                        </Col>
                    </Row>
                    <Row className='text-center mt-2 pt-2'>
                        <Col lg={6}>
                            <Pie dataKey="value" data={{
                                labels: compras.map(c => c.CLIENTE_NOMBRE),
                                datasets: [{
                                    data: compras.map(c => c.garrafas),
                                    backgroundColor: compras.map((c, i) => i % 2 === 0 ? '#2fa4e7' :
                                        '#73a839'),
                                    hoverBackgroundColor:
                                        compras.map((c, i) => i % 2 === 0 ? '#2fa4e7' :
                                            '#73a839'),
                                }]
                            }} />
                        </Col>
                        <Col lg={6}>
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
                </div>
            }
        </Fragment>
    )
}
