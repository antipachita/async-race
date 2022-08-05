import {render} from './render';
import api from './api-functions';
import {CreateListeners} from './listeners';


class Winners {
  
  render(): void {
    render.renderwinners();
    api.getWinnersPage();
    CreateListeners.createScrollWinnersListener();
    CreateListeners.createSortBtnsListener();
  }
}

export const winners = new Winners();