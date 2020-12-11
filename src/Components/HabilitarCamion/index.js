import Axios from 'axios';
import { format } from 'date-fns'
import React, { Fragment, useState, useEffect } from 'react'
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Row, Spinner } from 'reactstrap'
import { toast } from 'react-toastify';

export default function HabilitarCamion() {
    const [donwload, setDonwload] = useState(false);
    const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [vendedor, setVendedor] = useState('');
    const [cantidadGarrafas, setCantidadGarrafas] = useState('');
    const [iddis, setIddis] = useState('');
    const [distribuidores, setDistribuidores] = useState([]);
    useEffect(() => {
        getDistribuidores()
    }, [])

    const getDistribuidores = async () => {
        setDonwload(true);
        const distribuidores = await (await Axios.get('http://161.35.66.154:4555/api/distribuidor')).data;
        setDonwload(false);
        setDistribuidores(distribuidores);
        console.log(distribuidores)
    }

    const registrarCamion = async () => {
        if (!(vendedor && cantidadGarrafas && iddis)) {
            toast.error('🦄 No deje campos vacios!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        } else {
            const camion = {
                CAMION_NUMERO: 'CAMION01',
                CAMION_VENTA_MAXIMA: cantidadGarrafas,
                CAMION_UBICACION: 'FEDERICO ROMAN',
                CAMION_VENDEDOR: vendedor,
                CAMION_FECHA: fecha,
                IDDIS: iddis,
            }
            const resp = await (await Axios.post('http://161.35.66.154:4555/api/camion', camion)).data;
            if (resp.state) {
                toast.success('🦄 Habilitacion de camion realizada de forma correcta!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            }
            else
                toast.error('🦄 Problemas al habilitar un camion!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
        }

    }


    return (
        <Fragment>
            <Row className='text-center'>
                <Col lg={3}>
                </Col>
                <Col lg={6}>
                    <Card className='mt-2' >
                        <CardHeader>
                            {'HABILITACION DE SALIDA DE CAMIONES GLP'}
                        </CardHeader>
                        {donwload ?
                            <div className='text-center'>
                                <Spinner type='grow' style={{ width: '5rem', height: '5rem' }} color='info' size='md' />
                            </div>
                            :
                            <CardBody>
                                <FormGroup>
                                    <Input
                                        name='fecha'
                                        type='date'
                                        value={fecha}
                                        onChange={e => setFecha(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        name='vendedor'
                                        type='text'
                                        placeholder={'VENDEDOR'}
                                        value={vendedor}
                                        onChange={e => setVendedor(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        name='cantidadGarrafas'
                                        type='number'
                                        placeholder={'CANTIDAD DE GARRAFAS'}
                                        value={cantidadGarrafas}
                                        onChange={e => setCantidadGarrafas(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        name='IDDIS'
                                        value={iddis}
                                        type='select'
                                        onChange={e => setIddis(e.target.value)}
                                    >
                                        <option value="">{'-'}</option>
                                        {distribuidores.map(d =>
                                            <option value={d.IDDIS} key={d.IDDIS}>
                                                {d.DIS_NOMBRE + ' - ' + d.DIS_CIUDAD}
                                            </option>
                                        )}
                                    </Input>
                                </FormGroup>
                                <Button
                                    color='success'
                                    onClick={registrarCamion}
                                    block>
                                    {'HABILITAR'}
                                </Button>
                            </CardBody>
                        }
                    </Card>
                </Col>
                <Col lg={3}>
                </Col>
            </Row>
        </Fragment>
    )
}
