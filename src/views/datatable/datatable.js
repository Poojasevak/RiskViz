import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './datatable.scss';
export default function DataTable(props) {
    const { locations, selectedDecade } = useSelector((state) => state);
    const [ tabData, setTabData] = useState([]);
    useEffect(() => {
        setTabData(locations.filter(val => val.Year === selectedDecade));
    }, [locations, selectedDecade]);
    const headers = ['Asset Name','Business Category','Risk Rating','Risk Factors','Year'];
    return <div className='viz-table'>
        <table>
            <tr>
                { headers.map(val => <th>{val}</th>) }
            </tr>
            {
                tabData && tabData.map(val => {
                    return <tr>
                        <td>{val['Asset Name']}</td>
                        <td>{val['Business Category']}</td>
                        <td>{val['Risk Rating']}</td>
                        <td><p className='risk-factor-col' title={val['Risk Factors']}>{val['Risk Factors']}</p></td>
                        <td>{val['Year']}</td>
                    </tr>
                }) 
            }
        </table>
    </div>
}
