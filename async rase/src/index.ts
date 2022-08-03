import {render} from './components/render';
import './global.css';
import api from './components/api-functions';
import {CreateListeners} from './components/listeners';
import { EngineStatus } from './components/interfaces';



render.renderHtml();
api.getGaragePage();
CreateListeners.createAddCarListener();
CreateListeners.createUpdateCarListener();
CreateListeners.createScrollPagebtn();
CreateListeners.createGenerateCarListener();
CreateListeners.createRaceListener();
CreateListeners.createResetListener();







