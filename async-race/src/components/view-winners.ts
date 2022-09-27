import { render } from './render';
import api from './api-functions';
import { listeners } from './create-listeners';


class Winners {
  
  render(): void {
    render.renderwinners();
    api.getWinnersPage();
    api.updateGarageCounter();
    listeners.createScrollWinnersListener();
    listeners.createSortBtnsListener();
  }
}

export const winners = new Winners();
