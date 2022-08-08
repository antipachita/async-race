import { garage } from './view-garage';
import { winners } from './view-winners';

export function creatrlocRes(): void {
  const locationResolver = (location: string) => {
    const main: Element | null = document.querySelector('.content-container');
    switch (location) {
      case '#/results/': 
        winners.render();
        break;
      case '#/': 
        garage.renderGarage();  
        break;  
    }
  };
  
  window.addEventListener('load', () => {
    const location: string = window.location.hash;
    if (location) {
      locationResolver(location);
    }
  
  });
  
  const resultsView: HTMLElement | null = document.querySelector('#winners-view');
  
  resultsView?.addEventListener('click', function () {
    locationResolver(resultsView.dataset.href!);
  });
  
  const garageView: HTMLElement | null = document.querySelector('#garage-view');
  
  garageView?.addEventListener('click', function () {
    locationResolver(garageView.dataset.href!);
  });
  
  
}
