import { render } from './render';
import api from './api-functions';
import { listeners } from './create-listeners';


class Garage {
  
  renderGarage(): void {
    render.renderGarage();
    api.getGaragePage();
    listeners.createAddCarListener();
    listeners.createUpdateCarListener();
    listeners.createTurnPagebtn();
    listeners.createGenerateCarListener();
    listeners.createRaceListener();
    listeners.createResetListener();
    listeners.Inputs();
    listeners.changeTurnPageBtnsStyle();
  }
}

export const garage = new Garage();
