import React from 'react';
import { useState, useEffect } from 'react';
import Header from './layouts/Header';
import './css/chart.css';
import {getCountryData, getCdataBySI, getIndicators} from '../service';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const chartColors = [
    {
        borderColor: 'rgb(0,51,153)',
        backgroundColor: 'rgba(0,51,153,0.5)' 
    },
    {
        borderColor: 'rgb(255,56,0)',
        backgroundColor: 'rgba(255,56,0,0.5)'
    },
    {
        borderColor: 'rgb(145,54,179)',
        backgroundColor: 'rgba(145,54,179,0.5)'
    },
    {
        borderColor: 'rgb(175,91,8)',
        backgroundColor: 'rgba(175,91,8,0.5)'
    }
];
const countryList = ['Sweden', 'Mexico', 'New Zealand', 'Thailand'];
const Main = () => {
    const [numberOfCountry, setNumberOfCountry] = useState([1]);
    const [numberOfIndicator, setNumberOfIndicator] = useState([1]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedIndicators, setSelectedIndicators] = useState([]);
    const [dataChanged, setdataChanged] = useState(1);
    const [countryData, setCountryData] = useState();
    const [indicatorData, setIndicatorData] = useState();
    const [loading, setLoading] = useState(false);

    const [indicatorList, setIndicatorList] = useState();

    const [chartData, setChartData] = useState();
    const [chartOptions, setChartOptions] = useState();

    const fetchIndicatorList = async()=>{
        const list = await getIndicators();
        await setIndicatorList(list);
    }

    useEffect(() => {fetchIndicatorList();}, []);
    useEffect(() => {}, [dataChanged]);

    const fetchCountryData = async()=>{
        if(selectedCountries.length !== 0){
            if(selectedIndicators.length === 0){
                const data = await getCountryData(selectedCountries.toString());
                await setCountryData(data);
            }else if(selectedIndicators.length > 0){
                const data = await getCdataBySI(selectedCountries.toString(), selectedIndicators.toString());
                await setIndicatorData(data);
                await setChart(data);
            }else{}
            //await setdataChanged(dataChanged + 1);
        }
    }

    const countryDataHandler = async(countryName, index) =>{
        await setLoading(true);
        if(countryList.indexOf(countryName) !== -1 && selectedCountries.indexOf(countryName) === -1 && selectedCountries.lastIndexOf(countryName) === -1){
            let temp = selectedCountries;
            temp[index] = countryName;
            await setSelectedCountries(temp);
            let temp1 = numberOfCountry;
            temp1[index + 1] = 1;
            await setNumberOfCountry(temp1);
            //await setdataChanged(dataChanged + 1);
            await fetchCountryData();
        }
        await setLoading(false);
    }

    const deleteCountryValue = async(index)=>{
        await setLoading(true);
        let temp = selectedCountries;
        temp.splice(index, 1);
        await setSelectedCountries(temp);
        let temp1 = numberOfCountry;
        temp1.pop(1);
        await setNumberOfCountry(temp1);
        await fetchIndicatorData();
        await setLoading(false);
    }

    const fetchIndicatorData = async()=>{
        if(selectedIndicators.length !== 0){
            if(selectedCountries.length === 0){
                const data = await getCdataBySI('all', selectedIndicators.toString());
                await setIndicatorData(data);
                await setChart(data);
            }else if(selectedCountries.length > 0){
                const data = await getCdataBySI(selectedCountries.toString(), selectedIndicators.toString());
                await setIndicatorData(data);
                await setChart(data);
            }else{}
            //await setdataChanged(dataChanged + 1);
        }
    }

    const indicatorDataHandler = async(indicatorName, index) =>{
        await setLoading(true);
        if(selectedIndicators.indexOf(indicatorName) === -1 && selectedIndicators.lastIndexOf(indicatorName) === -1){
            let temp = selectedIndicators;
            temp[index] = indicatorName;
            await setSelectedIndicators(temp);
            let temp1 = numberOfIndicator;
            temp1[index + 1] = 1;
            await setNumberOfIndicator(temp1);
            await fetchIndicatorData();
        }
        await setLoading(false);
    }

    const deleteIndicatorValue = async(index)=>{
        await setLoading(true);
        let temp = selectedIndicators;
        temp.splice(index, 1);
        await setSelectedIndicators(temp);
        let temp1 = numberOfIndicator;
        temp1.pop(1);
        await setNumberOfIndicator(temp1);
        if(selectedIndicators.length === 0){
            await fetchCountryData();
        }
        await setLoading(false);
    }

    const setChart = async( indicatorAPIData )=>{
        if(loading === false && indicatorAPIData){
            let optionTemp = {}, dataTemp = {};
            await selectedIndicators.map((indicatorName)=>{
                if(indicatorAPIData[`${indicatorName}`]){
                    optionTemp[`${indicatorName}`] = {
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                ticks:{
                                    color: 'rgb(2,28,30)'
                                },grid: {
                                    tickColor: 'rgb(2,28,30)',
                                    color: 'rgb(2,28,30)',
                                    borderColor: 'rgb(2,28,30)'
                                },title: {
                                    color: 'black',
                                    display: true,
                                    text: 'Values'
                                }
                            },
                            y: {
                                ticks:{
                                    color: 'rgb(2,28,30)'
                                },
                                grid: {
                                    tickColor: 'rgb(2,28,30)',
                                    color: 'rgb(2,28,30)',
                                    borderColor: 'rgb(2,28,30)'
                                },
                                title: {
                                    color: 'black',
                                    display: true,
                                    text: indicatorAPIData[`${indicatorName}`][0]['Unit']
                                },
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: "rgb(2,28,30)"
                                }
                            },
                            title: {
                                display: true,
                                text: `${indicatorName} Indicator`,
                                color: 'black'
                            }
                        },
                    };
                    dataTemp[`${indicatorName}`] = {
                        labels: ['Previous Value', 'Latest Value'],
                        datasets: indicatorAPIData[`${indicatorName}`].map((dataObject, i)=>{ return {
                                label: dataObject.Country,
                                data: [dataObject.PreviousValue ,dataObject.LatestValue],
                                borderColor: chartColors[i].borderColor,
                                borderWidth: 4,
                                backgroundColor: chartColors[i].backgroundColor
                            }})
                        ,
                    };
                }
                return null
            });
            await setChartOptions(optionTemp);
            await setChartData(dataTemp);
        }
    }


    return (
    <>
        <Header/>
        <br/>
        <div className="container-fluid">
            <div className="row ">
                <div className="col-12 col-sm-6">
                    <div className="form-group ">
                        <label htmlFor="country" className='h5 light-text'>Country:</label>
                        {numberOfCountry ? numberOfCountry.map((val, ind)=>{
                        return <div className='row'>
                            <div className='col-10'>
                                <select id="country" className='mb-3' value={selectedCountries[ind]? selectedCountries[ind] : 'c'} onChange={e=>countryDataHandler(e.target.value, ind)}>
                                    <option value="c" hidden>Choose country</option>
                                    {countryList.map((element)=>{
                                        return <option value={element}>{element}</option>
                                    })}
                                </select>
                            </div>
                            <div className={`${ind === numberOfCountry.length-1 ? 'd-none' : 'col-2 p-0'}`}>
                                <button className='btn btn-sm btn-outline-light' onClick={e=>deleteCountryValue(ind)}><span className="fas fa-minus-circle"></span></button>
                            </div>
                        </div>
                        }):null}
                    </div>
                </div>
                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label htmlFor="indicator" className='light-text h5'>Indicator:</label>
                        {numberOfIndicator ? numberOfIndicator.map((val, ind)=>{
                        return <div className='row' >
                            <div className='col-10'>
                                <select id="indicator" className='mb-3 selectpicker' value={selectedIndicators[ind] ? selectedIndicators[ind] : 'c'} onChange={e=>indicatorDataHandler(e.target.value, ind)}>
                                    <option value='c' hidden>Choose indicator</option>
                                    {indicatorList ? Object.keys(indicatorList).map((element)=>{
                                    return <>
                                        <option className="text-center" disabled>---{element}---</option>
                                        {indicatorList[`${element}`].map((value)=>{
                                            return <option value={value.Category}>{value.Category}</option>
                                        })}
                                    </>
                                    }):null}
                                </select>
                            </div>
                            <div className={`${ind === numberOfIndicator.length-1 ? 'd-none' : 'col-2 p-0'}`}>
                                <button className='btn btn-sm btn-outline-light' onClick={e=>deleteIndicatorValue(ind)}><span className="fas fa-minus-circle"></span></button>
                            </div>
                        </div>
                        }):null}
                    </div>
                </div>
            </div>

            {/* Display Data */}
            {selectedIndicators.length === 0 ? selectedCountries.length !== 0 && loading === false && countryData ? selectedCountries.map((countryName)=>{
                return <>
                    <h4 className='light-text border-bottom p-3 mt-2'>{countryName}</h4>
                    {countryData[`${countryName}`] ? <>
                        <ul className="nav nav-tabs" role="tablist">
                            {Object.keys(countryData[`${countryName}`]).map((categoryGroup,i)=>{ return <li className="nav-item">
                                <a className={`nav-link light-text ${i===0? 'active' : ''}`} data-toggle="tab" href={`#${categoryGroup}`}>{`${categoryGroup}`}</a>
                                </li>
                            })}
                        </ul>

                        <div className="tab-content">
                            {Object.keys(countryData[`${countryName}`]).map((categoryGroup,i)=>{
                            return <div id={`${categoryGroup}`} className={`p-0 container tab-pane ${i===0? 'active' : ''}`}><br/>
                                <div className="table-responsive">
                                    <table className="w-100 table table-light">
                                        <thead className='thead-color'>
                                            <tr>
                                                <th>Category</th>
                                                <th>Latest Value</th>
                                                <th>Previous Value</th>
                                                <th>Unit</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody className='tbody-color'>
                                            {countryData[`${countryName}`][`${categoryGroup}`] ? countryData[`${countryName}`][`${categoryGroup}`].map((dataObject)=>{ return <tr>
                                                    <td>{dataObject.Category}</td>
                                                    <td>{dataObject.LatestValue}</td>
                                                    <td>{dataObject.PreviousValue}</td>
                                                    <td>{dataObject.Unit}</td>
                                                    <td><Link to={{
                                                        pathname: "/graph-representation",
                                                        state: dataObject
                                                    }}>View Details</Link></td>
                                                </tr>
                                            }):null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            })}
                        </div> 
                    </>:null}
                </>
            })
            :'':
                loading === false && indicatorData ?  selectedIndicators.map((indicatorName)=>{
                return <>
                    <h4 className='light-text border-bottom p-3 mt-2'>{indicatorName}</h4>
                    {indicatorData[`${indicatorName}`] ? <>
                        {chartOptions  && chartData && chartOptions[`${indicatorName}`] && chartData[`${indicatorName}`] && chartData[`${indicatorName}`].datasets ? 
                        <div className="w-100 d-flex justify-content-center my-2">
                            <div className="chartBox">
                            <Line options={chartOptions[`${indicatorName}`]} data={chartData[`${indicatorName}`]}/>
                        </div>
                        </div>
                        : ''}
                        <div className="table-responsive">
                            <table className="w-100 table table-light">
                                <thead className='thead-color'>
                                    <tr>
                                        <th>Country</th>
                                        <th>Latest Value</th>
                                        <th>Previous Value</th>
                                        <th>Unit</th>
                                        <th>Updated Date</th>
                                    </tr>
                                </thead>
                                <tbody className='tbody-color'>
                                    {indicatorData[`${indicatorName}`].map((dataObject)=>{ return <tr>
                                            <td>{dataObject.Country}</td>
                                            <td>{dataObject.LatestValue}</td>
                                            <td>{dataObject.PreviousValue}</td>
                                            <td>{dataObject.Unit}</td>
                                            <td>{new Date(dataObject.LatestValueDate).toLocaleDateString()}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                        </>
                    :<div className='text-light ml-4 mb-1'><h5>Sorry: This Indicator data is not available for selected countries.</h5></div>}
                </>})
            : ''}
            <div className="w-100 footer p-3 text-center">
                <h5>Developed By Mayank</h5>
                <h5>Email: mayankpandey12112000@gmail.com or earthtoeavens@gmail.com</h5>
                <h6>HOPE YOU LIKED IT</h6>
            </div>
        </div>
    </>
    )
}

export default Main
