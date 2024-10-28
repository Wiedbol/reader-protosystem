import React from'react';
import ReactDOM from 'react-dom';
import "./assets/styles/reset.css";
import "./assets/styles/global.css";
import "./assets/styles/style.css";
import { Provider } from 'react-redux';
// import store from './'
import { initSystemFont, initTheme } from './utils/serviceUtils/launchUtil';


declare var window: any;
initTheme();
initSystemFont();
ReactDOM.render(
	<Provider>
			
	</Provider>,
	document.getElementById("root")
)