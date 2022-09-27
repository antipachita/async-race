import './global.css';
import { render } from './components/render';
import { creatrlocRes } from './components/location-resolver';
import { garage } from './components/view-garage';

render.renderHtml();
garage.renderGarage();
creatrlocRes();


