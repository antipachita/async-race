import { render } from './components/render';
import './global.css';
import api from './components/api-functions';
import { creatrlocRes } from './components/location-resolver';
import { garage } from './components/view-garage';



render.renderHtml();
garage.renderGarage();

creatrlocRes();








