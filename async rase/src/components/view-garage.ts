import { render } from './render';
import api from './api-functions';
import { CreateListeners } from './listeners';


class Garage {
  
  renderGarage(): void {
    render.renderGarage();
    api.getGaragePage();
    CreateListeners.createAddCarListener();
    CreateListeners.createUpdateCarListener();
    CreateListeners.createScrollPagebtn();
    CreateListeners.createGenerateCarListener();
    CreateListeners.createRaceListener();
    CreateListeners.createResetListener();
    CreateListeners.createInputListener();
  }
}

export const garage = new Garage();