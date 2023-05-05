import React from 'react';
import logo from './logo.svg';
import './App.css';
import Marker from './views/markers';
import DataTable from './views/datatable';
import Chart from './views/chart';
import {Provider} from 'react-redux';
import store from './store';
function App() {
  return (
    <Provider store={store}>
      <div className='app'>
        <h1 className='header-title'>Risk Viz</h1>
        <main>
          <div className='cmp-sec'>
            <Marker></Marker>
          </div>
          <div className='cmp-sec'>
            <DataTable></DataTable>
          </div>
          <div className='cmp-sec'>
            <Chart></Chart>
          </div>
        </main>
      </div>
    </Provider>
  );
}

export default App;
