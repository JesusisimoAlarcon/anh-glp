import React, { Fragment, useState } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, Col, Input, Row, Spinner } from 'reactstrap'
import { useParams } from "react-router-dom";
import Axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import { differenceInDays } from 'date-fns'
export default function RegistrarCompras() {
    let fechaParams = useParams().fecha;
    let fecha = format(new Date(useParams().fecha), 'yyyy-MM-dd');
    let idcamion = useParams().id;
    const [update, setUpdate] = useState(false)
    const [donwload, setDonwload] = useState(false);
    const [ci, setCi] = useState('');
    const [nombrecompleto, setNombrecompleto] = useState('');
    const [direccion, setDireccion] = useState('');
    const [uso, setUso] = useState('');
    const [garrafas, setGarrafas] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cliente, setCliente] = useState('');
    const [compras, setCompras] = useState([]);
    const columns = [
        {
            name: 'ULTIMA COMPRA (Dias)',
            selector: 'COMPRA_FECHA',
            //sortable: true,
            center: true,
            wrap: true,
            format: row => <div>{differenceInDays(new Date(fechaParams), new Date(row.COMPRA_FECHA))}</div>
        },
        {
            name: 'FECHA COMPRA',
            selector: 'COMPRA_FECHA',
            //sortable: true,
            wrap: true,
            format: row => <div>{format(new Date(row.COMPRA_FECHA), 'dd/MM/yy') + ' ' + row.COMPRA_HORA}</div>
        },
        /*
        {
            name: 'HORA COMPRA',
            selector: 'COMPRA_HORA',
            //sortable: true,
            wrap: true,
            //format: row => <div>{format(new Date(row.COMPRA_HORA), 'HH:mm:ss')}</div>
        },
        */
        {
            name: 'GARRAFAS',
            selector: 'NUMERO_GARRAFA',
            sortable: true,
            wrap: true,
            center: true
        },
        {
            name: 'CAMION',
            selector: 'CAMION_NUMERO',
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
    const getClienteByCi = async () => {
        const cliente = await (await Axios.get('http://161.35.66.154:4555/api/cliente/ci/' + ci)).data;
        setCliente(cliente[0]);
        if (cliente[0]) {
            setNombrecompleto(cliente[0].CLIENTE_NOMBRE);
            setDireccion(cliente[0].CLIENTE_DIRECCION);
            setUso(cliente[0].CLIENTE_ACTIVIDAD);
            setUpdate(true)
            const compras = await (await Axios.get('http://161.35.66.154:4555/api/compra/cliente/' + ci)).data;
            setUpdate(false)
            setCompras(compras);
        }
        setDonwload(true)
        console.log(cliente)
    }

    const saveCompra = async () => {
        let respCliente = {};
        if (!cliente) {
            const cliente = {
                CLIENTE_CI: ci,
                CLIENTE_NOMBRE: nombrecompleto,
                CLIENTE_DIRECCION: direccion,
                CLIENTE_ACTIVIDAD: uso
            }
            respCliente = await (await Axios.post('http://161.35.66.154:4555/api/cliente', cliente)).data;
            if (respCliente.state)
                toast.success('🦄 Cliente registrado de forma correcta!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
        }


        const compra = {
            NUMERO_GARRAFA: garrafas,
            COMPRA_FECHA: fecha,
            COMPRA_HORA: format(new Date(), 'HH:mm:ss'),
            DESCRIPCION: descripcion,
            IDCAMION: idcamion,
            IDCLIENTE: cliente ? cliente.IDCLIENTE : respCliente.new_id,
            IDUSUARIO: 2
        };
        const resp = await (await Axios.post('http://161.35.66.154:4555/api/compra', compra)).data;
        if (resp.state) {
            toast.success('🦄 Compra registrada de forma correcta!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            setCliente('')
            setDonwload(false)
            setCi('')
            setNombrecompleto('')
            setDireccion('')
            setDescripcion('')
            setUso('')
            setGarrafas('')
        }
        else
            toast.error('🦄 Problemas al registrar una compra!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
    }

    return (
        <Fragment>
            <Row className='text-center mt-2'>
                <Col lg={2}></Col>
                <Col lg={8}>
                    <Card>
                        <CardHeader>
                            {`REGISTRAR COMPRAS DE ${fecha}`}
                        </CardHeader>
                        <CardBody>
                            <Input
                                name='ci'
                                type='text'
                                placeholder='CEDULA DE IDENTIDAD'
                                value={ci}
                                onChange={e => setCi(e.target.value)}
                            />
                            <Button
                                color='success'
                                disabled={ci.length === 0}
                                block
                                onClick={getClienteByCi}
                            >{'CONSULTAR'}</Button>
                            {donwload &&
                                <div>
                                    {cliente ?
                                        <div>
                                            <Alert color={'success'}>

                                                <b>Felicidades!</b>{' El cliente ya esta registrado. A continuacion verifica sus ultimas compras.'}
                                            </Alert>
                                            <DataTable
                                                title="ULTIMAS COMPRAS REGISTRADAS"
                                                columns={columns}
                                                data={compras}
                                                noHeader
                                                //pagination
                                                progressComponent={<Spinner type='grow' style={{ width: '5rem', height: '5rem' }} color='info' size='md' />}
                                                progressPending={update}
                                                dense
                                            />
                                            {compras[0] && differenceInDays(new Date(fechaParams), new Date(compras[0].COMPRA_FECHA)) < 2 &&
                                                <Alert color={'danger'}>
                                                    <b>Cuidado!</b>{' Este cliente esta comprando muy seguido.'}
                                                </Alert>
                                            }
                                        </div>
                                        :
                                        <Alert color={'warning'}>
                                            <b>Excelente!</b>{' El cliente esta haciendo su primera compra.. registralo.'}
                                        </Alert>
                                    }

                                    <Input
                                        readOnly
                                        value={ci}
                                    />
                                    <Input
                                        name='nombrecompleto'
                                        readOnly={cliente ? true : false}
                                        //value={cliente ? cliente.CLIENTE_NOMBRE : nombrecompleto}
                                        value={nombrecompleto}
                                        type='text'
                                        placeholder='NOMBRE COMPLETO'
                                        onChange={e => setNombrecompleto(e.target.value)}
                                    />
                                    <Input
                                        name='direccion'
                                        readOnly={cliente ? true : false}
                                        //value={cliente ? cliente.CLIENTE_DIRECCION : direccion}
                                        value={direccion}
                                        type='text'
                                        placeholder='DIRECCION'
                                        onChange={e => setDireccion(e.target.value)}
                                    />
                                    <Input
                                        name='uso'
                                        value={uso}
                                        disabled={cliente ? true : false}
                                        type='select'
                                        placeholder='NOMBRE COMPLETO'
                                        onChange={e => setUso(e.target.value)}
                                    >
                                        <option value="">{' - '}</option>
                                        <option value="DOMICILIARIO">USO DOMICILIAR</option>
                                        <option value="COMERCIAL">USO COMERCIAL</option>
                                    </Input>
                                    <Input
                                        name='garrafas'
                                        value={garrafas}
                                        type='number'
                                        placeholder='CANTIDAD DE GARRAFAS'
                                        onChange={e => setGarrafas(e.target.value)}
                                    />
                                    <Input
                                        name='descripcion'
                                        value={descripcion}
                                        type='text'
                                        placeholder='DESCRIPCION'
                                        onChange={e => setDescripcion(e.target.value)}
                                    />
                                    <Button color='primary' onClick={saveCompra} block>
                                        {cliente ? 'REGISTRAR COMPRA' : 'REGISTRAR CLIENTE Y COMPRA'}
                                    </Button>
                                </div>
                            }
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={2}></Col>

            </Row>
        </Fragment>
    )
}
