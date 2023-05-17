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

import React from 'react';
import ReactDOM from 'react-dom';

//Components
import App from './components/App';

//Mobx
import store from "./stores";
import { Provider } from "mobx-react";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('csftool-content')
);