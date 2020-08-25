import React, {Component} from 'react';
import axios from 'axios';
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from '../constants'
import WorldMap from "./WorldMap";
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';

class Main extends Component {
    constructor(){
        super();
        this.state = {
            satInfo: null,
            settings: null,
            satList: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = (setting) => {
        this.setState({
            settings: setting
        });
        this.fetchSatellite(setting);
    };

    fetchSatellite = (setting => {
        const {
            observerLat,
            observerLong,
            observerElevation,
            satAlt
        } = setting;

        const url = `${NEARBY_SATELLITE}/${observerLat}/${observerLong}/${observerElevation}/${satAlt}/
        ${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true
        });

        axios.get(url)
            .then(response => {
                console.log(response.data);
                this.setState({
                    satInfo: response.data,
                    isLoadingList: false
                })
            })
            .catch(err => {
                console.log('fetch satellite failed -> ', err);
            })
    });

    showMap = (selected) => {
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))
    }

    render() {
        const { satInfo } = this.state;
        return (
            <div className='main'>
                <div className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                                   onShowMap={this.showMap} />
                </div>
                <div className="right-side">
                    <WorldMap satData={this.state.satList}
                              observerData={this.state.settings}/>
                </div>
            </div>
        );
    }
}

export default Main;
