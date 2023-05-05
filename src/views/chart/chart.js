import React, { useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import './chart.scss';
import * as d3 from 'd3';

export default function Chart(props) {
    const { locations } = useSelector((state) => state);
    const [ selLatLong, setSelLatLong ] = useState('');
    const [ asset, setAsset ] = useState('');
    useEffect(() => {
        if ( locations && locations.length > 0 ) {
            setSelLatLong(locations[0].Lat+","+locations[0].Long);
            renderGraph(locations[0].Lat+","+locations[0].Long, 'LatLong'); 
        }        
    }, [locations]);

    const getLatLongList = () => {
        let data = [];
        if (locations) {
            data = locations.map(val => ({ Lat: val.Lat, Long: val.Long }));
        }
        return data;
    };

    const getAssetList = () => {
        let data = [];
        if (locations) {
            data = locations.map(val => val['Asset Name']);
        }
        return data;
    };
    const renderGraph = (selVal, type) => {
        let parseTime = d3.timeParse("%Y");
        let data = [];
        if ( locations ) {
            data = locations.filter(val => {
                let canBeSelected = false;
                if ( type === 'Asset' ) {
                    canBeSelected = val['Asset Name'] === selVal;
                }
                if ( type === 'LatLong' ) {
                    canBeSelected = (val['Lat'] === selVal.split(",")[0] || val['Long'] === selVal.split(",")[1]);
                }
                return canBeSelected;
            });
            data = data.map( val => ({ asset: val['Asset Name'], lat: val['Lat'], long: val['Long'], year: val.Year, value: val['Risk Rating']}))
            data = data.sort((val1, val2) => {
                if ( val1.year === val2.year ) {
                    return parseFloat(val1.value) - parseFloat(val2.value);
                }
                return parseInt(val1.year) - parseInt(val2.year);
            });
        }
        data.forEach((d) => {
            d.year = parseTime(d.year);
            d.value = +d.value
        });
        let margin = { top: 20, right: 20, bottom: 50, left: 70 },
            width = 400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        d3.selectAll(".viz-chart-container svg").remove();
        let svg = d3.select(".viz-chart-container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},     ${margin.top})`);
        // Add X axis and Y axis
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);
        x.domain(d3.extent(data, (d) => { return d.year; }));
        y.domain([0, d3.max(data, (d) => { return d.value; })]);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
        svg.append("g")
        .call(d3.axisLeft(y));
        // add the Line
        let valueLine = d3.line()
            .x((d) => { return x(d.year); })
            .y((d) => { return y(d.value); });
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", valueLine)
    };
    return <div className='viz-chart'>
        <div className='viz-chart-controls'>
            <p> Latitude and Longitude: </p>
                <select value={selLatLong} onChange={(event) => {setSelLatLong(event.currentTarget.value); renderGraph(event.currentTarget.value,'LatLong'); setAsset(''); }}>
                    <option value=''>Please select</option>
                    {
                        getLatLongList().map(val => <option value={val.Lat+","+val.Long}>{val.Lat+","+val.Long}</option>)
                    }
                </select>
            
            <p>
                Asset: </p>
                <select value={asset} onChange={(event) => {setSelLatLong(''); renderGraph(event.currentTarget.value,'Asset'); setAsset(event.currentTarget.value); }}>
                    <option value=''>Please select</option>
                    {
                        getAssetList().map(val => <option value={val}>{val}</option>)
                    }
                </select>
        </div>
        <div className='viz-chart-container'>

        </div>
    </div>
}