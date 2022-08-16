import api from './api-functions';
import randomFunc from './randomizer-funcs';
import { animationRun } from './animations';
import { animationReset } from './animations';
import { TableWinneranimation } from './animations';
import { Winner } from './interfaces';
import { Car } from './interfaces';
import { WinnerInfo } from './interfaces';
import { dataStorage } from './storage';
import  { createInputListeners } from './listener-logic';
import  { createSortBtnsListeners } from './listener-logic';
import { createEngineStopBtn } from './animations';

class Listeners {

  Inputs() {
    const createInputValue: HTMLInputElement | null = document.querySelector('.create-placeholder');
    const createColorValue: HTMLInputElement | null = document.querySelector('.input-color');

    createInputListeners(createInputValue!, createColorValue!);

    const updateInputValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
    const updateColorValue: HTMLInputElement | null = document.querySelector('.update-color');

    createInputListeners(updateInputValue!, updateColorValue!);
    
  }

  createAddCarListener() {
    document.querySelector('.create-btn')?.addEventListener('click', async () => {
      const inputValue: HTMLInputElement | null = document.querySelector('.create-placeholder');
      const colorValue: HTMLInputElement | null = document.querySelector('.input-color');
      await api.createNewCar(inputValue?.value, colorValue?.value);
      await this.changeTurnPageBtnsStyle()
    });
  }

  async createRemoveCarListener(id: number, element: HTMLDivElement): Promise<void> {
    const removeBtn = (document.querySelector(`#remove-btn-${id}`)) as HTMLElement;

    removeBtn!.addEventListener('click', async (e:Event) => {
      const currentCar: HTMLDivElement = element;
      const idCar = (e.target as Element).id.slice(11);

      await api.deleteCar(Number(idCar));
      await api.checkWinner(Number(idCar)).then((res) => {
        if (res !== 404) {
          api.deleteWinner(Number(idCar));
          console.log('Данные победителя были удалены');
        } else {
          console.log('Данный автомобиль не был найден в таблице победителей');
        }
      });
      currentCar.remove();
      this.changeTurnPageBtnsStyle()
    });
  }

  createUpdateCarListener() :void {
    const updateBtn: HTMLInputElement | null = document.querySelector('.update-btn');
    updateBtn?.addEventListener('click', async function () {
      const updateInputValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
      const updateColorValue: HTMLInputElement | null = document.querySelector('.update-color');
      const idCar = Number(updateBtn.id);
      api.updateCarInfo(idCar, updateInputValue!.value, updateColorValue!.value);
      document.querySelector(`#model-name-${idCar}`)!.textContent = updateInputValue!.value;
      const svgCar = <SVGElement>(document.querySelector(`#car-${idCar}`)!);
      svgCar.style.fill = updateColorValue!.value; 
    });
  }

  createSelectCarListener(carId: number) :void {
    const selectBtn = (document.querySelector(`#select-btn-${carId}`)) as HTMLElement;
    selectBtn!.addEventListener('click', async function (e:Event) {

      const id = Number((e.target as Element).id.slice(11));

      const updateInputValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
      const updateColorValue: HTMLInputElement | null = document.querySelector('.update-color');
    
      const carInfo = (await api.getCarInfo(id)) as Car;
      updateInputValue!.value = carInfo.name!;
      updateColorValue!.value = carInfo.color!;

      document.querySelector('.update-btn')!.id = String(id);
    });
  }

  createTurnPagebtn() :void {
    const nextBtn: Element | null = document.querySelector('.next-btn');
    nextBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('.page-num')?.textContent;
      const actualPageNum = document.querySelector('.page-num')!.textContent = String(+currentPage! + 1);
      dataStorage.pageNumber = Number(actualPageNum);
      const checkExistPage = await api.getGaragePageInfo(dataStorage.pageNumber + 1);
      prevBtn!.classList.remove('inactive');
      dataStorage.turnPagePrevBtnStyle = '';
      if (checkExistPage?.length === 0) {
        nextBtn.classList.add('inactive');
      }
      await api.getGaragePage(dataStorage.pageNumber);
    });

    const prevBtn = document.querySelector('.prev-btn');
    prevBtn?.addEventListener('click', async () => {
      const currentPage = document.querySelector('.page-num')?.textContent;
        const actualPageNum = document.querySelector('.page-num')!.textContent = String(+currentPage! - 1);
        dataStorage.pageNumber = Number(actualPageNum);
        if (Number(actualPageNum) - 1 < 1) {
          prevBtn!.classList.add('inactive');
        }
        await api.getGaragePage(dataStorage.pageNumber);
        await this.changeTurnPageBtnsStyle();
    });
  }

  createGenerateCarListener() :void {
    const generateBtn: Element | null = document.querySelector('.generate-btn');
    generateBtn?.addEventListener('click', async () => {
      for (let i = 0; i < 100; i += 1) {
        await (api.createNewCar(randomFunc.randomCarName(), randomFunc.randomCarColor()));
      }  
      await this.changeTurnPageBtnsStyle();
    });
  }

  async createRaceListener(): Promise<void> {
    document.querySelector('.race-btn')?.addEventListener('click', async function () {
      const currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      let checkFirstPromise = false;
      const arrPromis = [];
      for (let i = 0; i < resp.length; i ++) { arrPromis.push(animationRun(resp[i].id, true)); }
      arrPromis.forEach(async  function (car) {
        const winner = (await car) as WinnerInfo;
        
        if (winner.raceStatus == true && checkFirstPromise == false) {
          checkFirstPromise = true;
          if (winner !== undefined) {
            const resultTable: HTMLElement | null = document.querySelector('#result-table');
            resultTable!.textContent = `Winner car is ${winner.name}`;
            TableWinneranimation();

            await api.checkWinner(Number(+winner.id)).then(async function (res) {
              if (res !== 404) {
                const winnerInfo = (await api.checkWinner(+winner.id)) as Winner;
                await api.updateWinner(+winner.id, winnerInfo.wins! + 1, winnerInfo.time! > winner.date! ? winner.date! : winnerInfo.time!);
                console.log('Данные победителя были обновлены');
              } else {
                api.createWinner(+winner.id, winner.date!); 
                console.log('Автомобиль внесен в список победителей');
              }
            });
          }
        }
      });
      
    });
  }

  async createResetListener(): Promise<void> {
    document.querySelector('.reset-btn')?.addEventListener('click', async function () {
      const currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      const arrPromis = [];

      for (let i = 0; i < resp.length; i ++) { arrPromis.push(animationReset(resp[i].id)); }
      await Promise.all(arrPromis);
      
    });
  }

  async createScrollWinnersListener(): Promise<void> {
    const prevBtn: Element | null = document.querySelector('.winner-prev-btn');
    prevBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('#winners-page-counter')?.textContent;
      if (Number(currentPage) !== 1) {
        const actualPage = document.querySelector('#winners-page-counter')!.textContent = String(+currentPage! - 1);
        dataStorage.winennerPageNumber = actualPage;
        api.getWinnersPage(dataStorage.winennerPageNumber);
      }
    });

    const nextbtn: Element | null = document.querySelector('.winner-next-btn');
    nextbtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('#winners-page-counter')?.textContent;
      const actualPage = document.querySelector('#winners-page-counter')!.textContent = String(+currentPage! + 1);
      dataStorage.winennerPageNumber = actualPage;
      api.getWinnersPage(dataStorage.winennerPageNumber);
    });
  }

  createSortBtnsListener(): void {
    const winSorDesctBtn: Element | null = document.querySelector('#wins-up-sort-arrow');
    createSortBtnsListeners(winSorDesctBtn!, 'wins', 'DESC');

    const winSortAscBtn: Element | null = document.querySelector('#wins-down-sort-arrow');
    createSortBtnsListeners(winSortAscBtn!, 'wins', 'ASC');

    const timeSorDesctBtn: Element | null = document.querySelector('#time-up-sort-arrow');
    createSortBtnsListeners(timeSorDesctBtn!, 'time', 'DESC');

    const timeSortAscBtn: Element | null = document.querySelector('#time-down-sort-arrow');
    createSortBtnsListeners(timeSortAscBtn!, 'time', 'ASC');
  }

  async changeTurnPageBtnsStyle(): Promise<void> {
    const currentPage = document.querySelector('.page-num')?.textContent;
      const checkExistPage = await api.getGaragePageInfo(+currentPage! + 1);
      if (checkExistPage?.length === 0) {
        document.querySelector('.next-btn')!.classList.add('inactive');
      } else {
        document.querySelector('.next-btn')!.classList.remove('inactive');
      }
  }

  createCarListeners (carId: number, car: HTMLDivElement):void {
    listeners.createRemoveCarListener(carId, car);
    listeners.createSelectCarListener(carId);
    createEngineStopBtn(carId);
    document.querySelector(`.engine-run-${carId}`)?.addEventListener('click', async function () {animationRun(carId, false);});
  }
}

export const listeners = new Listeners();