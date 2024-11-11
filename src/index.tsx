import React from'react';
import ReactDOM from 'react-dom';
import "./assets/styles/reset.css";
import "./assets/styles/global.css";
import "./assets/styles/style.css";
import { Provider } from 'react-redux';
import store from './store'
import { initSystemFont, initTheme } from './utils/serviceUtils/launchUtil';
import Router from './router';


declare var window: any;
initTheme();
initSystemFont();
ReactDOM.render(
	<Provider store={store}>
			<Router />
	</Provider>,
	document.getElementById("root")
)