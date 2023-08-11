///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming New York State / Northeast Drought Atlas
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import Loader from 'react-loader-advanced';
import Control from 'react-leaflet-control';
import { Map, ImageOverlay, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import legend from '../../img/pdsi_map_colorbar.png'
import logo from '../../img/ecrl_logo_transparent.png'

const mapCenter = [42.8, -75.5];
const zoomLevel = 5;
const minZoomLevel = 5;
const maxZoomLevel = 8;
const spinner = <div className="loader"></div>
var app;

@inject("store") @observer
export default class MapDisplay extends Component {

  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  handleImageLoad = () => {
    if (app.getLoaderImageOverlay === true) {
        app.updateLoaderImageOverlay(false);
    }
  }

  render() {

      if (app.getCountyGeojson) {

            return (
                <div className="csftool-display-map">
                  <Loader message={spinner} show={app.getLoader} priority={10} backgroundStyle={{backgroundColor: null}} hideContentOnLoad={false}>
                    <Map
                        center={mapCenter}
                        zoom={zoomLevel}
                        minZoom={minZoomLevel}
                        maxZoom={maxZoomLevel}
                        attributionControl={false}
                    >
                        <ImageOverlay
                            url={'https://nedatool-worker.benlinux915.workers.dev/fetch-map/?name=pdsi_Amon_NRCC-R1_PM-4km_1950-2016_'+app.yearMonthText+'.png'}
                            opacity={1.0}
                            bounds={[[35.40,-87.50],[49.25,-62.30]]}
                            onLoad={this.handleImageLoad}
                        >
                        </ImageOverlay>
                        <GeoJSON
                            data={app.getCountyGeojson}
                            style={app.countyFeatureStyle}
                            onEachFeature={app.countyOnEachFeature}
                        />
                        <Control position="topright">
                            <img src={legend} alt="Map Legend" width={61} height={340}></img>
                        </Control>
                        <Control position="bottomleft">
                            <img src={logo} alt="ECRL Logo" width={128} height={100}></img>
                        </Control>
                    </Map>
                  </Loader>
                </div>
            )

      } else {
        return (false)
      }

  }

}

//export default MapDisplay;

