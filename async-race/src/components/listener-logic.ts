import { dataStorage } from './storage';
import api from './api-functions';

export function createInputListeners(firstInputElement: HTMLInputElement, secondInputElement: HTMLInputElement): void {
  firstInputElement?.addEventListener('input', function () {
    if (firstInputElement.id === 'create-name') {
      dataStorage.createInputValue =  firstInputElement.value;
    } else if (firstInputElement.id === 'update-name') {
      dataStorage.updateInputValue =  firstInputElement.value;
    }
  });

  secondInputElement?.addEventListener('input', function () {
    if (secondInputElement.id === 'create-color') {
      dataStorage.createColorValue =  secondInputElement.value;
    } else if (secondInputElement.id === 'update-color') {
      dataStorage.updateColorValue =  secondInputElement.value;
    }
  });
}

export function createSortBtnsListeners(elem: Element, sortType: string, orderType: string): void {
  elem?.addEventListener('click', async function () {
    const currentPage: string | null | undefined = document.querySelector('#winners-page-counter')?.textContent;
    dataStorage.sortType = sortType;
    dataStorage.orderType = orderType;
    api.getWinnersPage(currentPage!, dataStorage.sortType, dataStorage.orderType);
  });
}
