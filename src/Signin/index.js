import React, { Fragment, useState } from 'react'
import { Button, Card, CardBody, CardImg, CardTitle, Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import Logo from '../Images/logoanh.png';
import { useHistory } from "react-router-dom";


export default function Signin() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();
    const startSession = () => {
        if (user === 'admin' && password === '123')
            history.push(`/controlglp`)
    }

    return (
        <Fragment>
            <Container>
                <Row className='text-center mt-2 pt-2'>
                    <Col lg={4}>
                    </Col>
                    <Col>
                        <Card>
                            <CardBody>
                                <CardImg src={Logo}></CardImg>
                                <CardTitle >
                                    {'INICIAR SESION'}
                                </CardTitle>
                                <div className='p-1 m-1'>
                                    <FormGroup>
                                        <Label>{'USUARIO'}</Label>
                                        <Input
                                            name='user'
                                            bsSize='sm'
                                            value={user}
                                            type='text'
                                            onChange={e => setUser(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>{'CONTRASEÑA'}</Label>
                                        <Input
                                            name='password'
                                            bsSize='sm'
                                            type='password'
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </FormGroup>
                                    <Button
                                        color='info'
                                        onClick={startSession}
                                    >{'INICIAR SESION'}</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={4}>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
