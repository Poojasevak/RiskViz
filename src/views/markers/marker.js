import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './marker.scss';

export default function Marker (props) {
    const dispatch = useDispatch();
    const [locations, setLocations] = useState([]);
    const [decades, setDecades] = useState([]);
    const [selDecade, setSelDecade] = useState('');
    const csvToJson = (data, delimiter = ',') => {
        const titles = data.slice(0, data.indexOf('\n')).trim().split(delimiter);
        return data
            .slice(data.indexOf('\n') + 1)
            .split('\n')
            .map(v => {
                let values = [];
                v.trim().replace(/^(".*"|.*),(.*),(.*),(.*),(.*),("\{.*\}"),(.*)/g, (...args) => {
                    values = args.slice(1);
                });
                return titles.reduce(
                    (obj, title, index) => ((obj[title] = values[index]), obj),
                    {}
                );
        });
    };

    const loadGoogleMaps = (latitude, longitude) => {
        if ( window.google ) {
            var mapOptions = {
                // eslint-disable-next-line
                center:new google.maps.LatLng(latitude, longitude), 
                zoom:9,
                // eslint-disable-next-line
                mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            // eslint-disable-next-line
            return new google.maps.Map(document.getElementById("gm-container"),mapOptions);
        }
        return null;
    };

    const onDecadeChange = (val) => {
        setSelDecade(val);
        dispatch({
            type: 'SET_SELECTED_DECADE',
            payload: val
        })
        let filteredResults = locations.filter(loc => loc.Year === val);
        if ( filteredResults.length > 0 ) {
            let map = loadGoogleMaps(filteredResults[0].Lat, filteredResults[0].Long);
            if ( map ) {
                filteredResults.forEach(res => {
                    // eslint-disable-next-line
                    let marker = new google.maps.Marker({
                        // eslint-disable-next-line
                        position: new google.maps.LatLng(res.Lat,res.Long),
                        title: res['Asset Name']+"-"+res["Business Category"]
                    });
                    marker.setMap(map);
                });
            }
        }                
    }

    useEffect(() => {
        fetch('sample_data.csv').then(response => response.text()).then(data => {
            data = csvToJson(data);
            setLocations(data);
            dispatch({
                type: 'SAVE_LOCATIONS',
                payload: data
            });
            let decadesList = [...(new Set((data.map(val => val.Year))))];
            decadesList = decadesList.sort((val1, val2) => { return val1 - val2; });
            setDecades(decadesList);
        });                
    }, []);
    useEffect(() => {
        if ( decades.length > 0 && !selDecade ) {
            onDecadeChange(decades[0]);
        }
    }, [decades]);
    return (<div className='marker-selection'>
        <p className='decade-selection'>Decade selection: <select value={selDecade} onChange={(event) => onDecadeChange(event.currentTarget.value)}>
            <option value=''>All</option>
            { decades?.map(decade => {
                return <option value={decade}>{decade}</option>
            })}
        </select></p>        
        <div id="gm-container" className='map-container'>
            <p>Loading google maps</p>
        </div>
    </div>)
}