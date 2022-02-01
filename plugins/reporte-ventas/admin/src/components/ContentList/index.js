import axios from 'axios';
import React, { Component } from 'react';
import { Button, Card, CardTitle, Col, CardBody, CardText } from 'reactstrap';
import exportCSVFile from '../../utils/convertToCSV';

class ContentList extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false, data: [], reportData: [] };
    }

    componentDidMount = () => {
        this.setState({
            isLoading: true
        });

        axios.get('https://promotora.innovaciones.co/ventas/count').then((response) => {
            if (response.status === 200) {
                const total = response.data;
                const size = 50;

                this.getData(total, size)
            }

        });
    }

    getData(total, size) {
        let start = 0;

        while (start < total) {
            let url = `https://promotora.innovaciones.co/ventas?_limit=${size}&_start=${start}`;
            axios.get(url)
                .then((response) => {
                    if (response.status === 200) {
                        let sales = this.state.data.concat(response.data);
                        this.setState({
                            data: sales,
                            reportData: this.getReportData(sales),
                            isLoading: !(sales.length >= total)
                        });
                    }
                }, (error) => {
                    console.log(error);
                });

            start += size;
        }
    }

    getReportData(data) {
        return data.map((item) => {
            return {
                "ID": item.id,
                "Cliente": this.titleCase(item.client),
                "ID cliente": item.id_client,
                "Tipo": item.category?.title ?? item.type,
                "Asesor": this.titleCase(`${item.user?.name} ${item.user?.surname}`),
                "Código asesor": item.user?.username,
                "Fecha venta": item.date,
                "Fecha registro": item.created_at,
            }
        });
    }

    titleCase(str) {
        str = str.toLowerCase();
        str = str.split(' ');

        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }

        return str.join(' ');
    }

    downloadFile() {
        const date = new Date().toISOString().slice(0, 16).replace("T", "_");
        const filename = `reporte_ventas_${date}`;
        let headers = {
            "ID": "ID",
            "Cliente": "Cliente",
            "ID cliente": "ID cliente",
            "Tipo": "Tipo",
            "Asesor": "Asesor",
            "Código asesor": "Código asesor",
            "Fecha venta": "Fecha venta",
            "Fecha registro": "Fecha registro",
        }

        let data = this.state.reportData;
        exportCSVFile(headers, data, filename);
    }

    render() {
        if (!this.state.isLoading) {
            return (
                <Card>
                    <CardBody>
                        <CardTitle>Reporte de Ventas</CardTitle>
                        <CardText>
                            Descarga aquí el reporte de ventas
                        </CardText>
                        <Button color="primary" onClick={() => this.downloadFile()}>Descargar</Button>
                    </CardBody>
                </Card>
            );
        } else {
            return (
                <Card>
                    <CardTitle>
                        <Col>
                            <p>Cargando...</p>
                        </Col>
                    </CardTitle>
                </Card>
            );
        }

    }
}

export default ContentList;
