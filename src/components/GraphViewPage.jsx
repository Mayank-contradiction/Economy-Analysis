import React from 'react'
import { useState, useEffect } from 'react';
import Header from './layouts/Header';
import './css/chart.css'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GraphViewPage = (props) => {
    const [data, setData] = useState();
    const [propsData, setPropsData] = useState();
    const [options, setOptions] = useState();

    const history = useHistory();
    useEffect(() => {
        if(props && props.location.state){
            let propsData = props.location.state;
            setPropsData(props.location.state);
            console.log(propsData);
            setData({
                labels: ['Previous Value', 'Latest Value'],
                datasets: [{
                    label: props.location.state.Category,
                    data: [props.location.state.LatestValue, props.location.state.PreviousValue],
                    borderColor: 'rgb(44,120,115)',
                    backgroundColor: 'rgba(44,120,115, 0.5)',
                }],
            });
            setOptions({
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks:{
                            color: '#f5f5f5'
                        },
                        grid: {
                            tickColor: '#f5f5f5',
                            color: '#f5f5f5',
                            borderColor: '#f5f5f5'
                        },
                        title: {
                            color: 'white',
                            display: true,
                            text: 'Values'
                        }
                    },
                    y: {
                        ticks:{
                            color: '#f5f5f5'
                        },
                        grid: {
                            tickColor: '#f5f5f5',
                            color: '#f5f5f5',
                            borderColor: '#f5f5f5'
                        },
                        title: {
                            color: 'white',
                            display: true,
                            text: props.location.state.Unit
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#f5f5f5"
                        }
                    },
                    title: {
                        display: true,
                        text: props.location.state.Title,
                        color: 'white'
                    },
                },
            });
        }
    }, []);

    return (
        <>
            <Header/>
            <br/>
            <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-xl-4">
                    {propsData ? <div className="table-responsive pl-2">
                    <table className="w-100 table table-light">
                        <thead className='thead-color'>
                            <tr>
                                <th colSpan='2' className="text-center">{propsData.Title}</th>
                            </tr>
                        </thead>
                        <tbody className='tbody-color'>
                            <tr>
                                <th>Latest Value</th>
                                <td>{propsData.LatestValue}</td>
                            </tr>
                            <tr>
                                <th>Latest Value Date</th>
                                <td>{propsData.LatestValueDate}</td>
                            </tr>
                            <tr>
                                <th>Previous Value</th>
                                <td>{propsData.PreviousValue}</td>
                            </tr>
                            <tr>
                                <th>Previous Value Date</th>
                                <td>{propsData.PreviousValueDate}</td>
                            </tr>
                            <tr>
                                <th>Unit</th>
                                <td>{propsData.Unit}</td>
                            </tr>
                            <tr>
                                <th>Frequency of Updating Data</th>
                                <td>{propsData.Frequency}</td>
                            </tr>
                            <tr>
                                <th>Historical Data Symbol</th>
                                <td>{propsData.HistoricalDataSymbol}</td>
                            </tr>
                            <tr>
                                <th>Source of Data</th>
                                <td>{propsData.Source}</td>
                            </tr>
                        </tbody>
                    </table> 
                    </div>
                    : ''}
                </div>
                <div className="col-12 col-xl-8">
                    {data && options ? 
                        <div className='w-100 d-flex justify-content-center'>
                            <div className="chartBox2">
                                <Bar options={options} data={data} />
                            </div>
                        </div>
                    : ''}
                </div>
            </div>
            <div className="text-center m-2 mb-4">
                <button className="btn btn-outline-light" onClick={e=> history.goBack()}>Go Back</button>
            </div>
            <div className="w-100 footer p-3 text-center">
                <h5>Developed By Mayank</h5>
                <h5>Email: mayankpandey12112000@gmail.com or earthtoeavens@gmail.com</h5>
                <h6>HOPE YOU LIKED IT</h6>
            </div>
        </div>
        </>
    )
}

export default GraphViewPage
