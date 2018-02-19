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
import { inject, observer} from 'mobx-react';

// Components
import MonthPicker from '../../components/MonthPickerDropdown';
import MapDisplay from '../../components/MapDisplay';
import ChartDisplay from '../../components/ChartDisplay';
//import InfoButton from '../../components/InfoButton';
//import InfoWindow from '../../components/InfoWindow';

// Styles
import '../../styles/App.css';
 
@inject('store') @observer
class App extends Component {

    render() {

        return (
            <div className="App">
                <div className="csftool-input">
                    <MonthPicker />
                </div>
                <div className="csftool-display">
                    <MapDisplay />
                    <ChartDisplay />
                </div>
            </div>
        );
    }
}

export default App;
