import api from './api-functions';
import randomFunc from './randomizer-funcs';
import { animationRun } from './animations';
import { animationReset } from './animations';
import { animationWinner } from './animations';
import { Winner } from './interfaces';
import { Car } from './interfaces';
import { WinnerInfo } from './interfaces';
import { dataStorage } from './storage';


class Listeners {

  createInputListener() {
    const inputValue: HTMLInputElement | null = document.querySelector('.create-placeholder');
    const colorValue: HTMLInputElement | null = document.querySelector('.input-color');

    inputValue?.addEventListener('input', function (e) {
      dataStorage.createInputValue =  inputValue.value;
    });

    colorValue?.addEventListener('input', function (e) {
      dataStorage.createColorValue =  colorValue.value;
    });

    const updateValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
    const updateColor: HTMLInputElement | null = document.querySelector('.update-color');

    updateValue?.addEventListener('input', function (e) {
      dataStorage.updateInputValue =  updateValue.value;
    });

    updateColor?.addEventListener('input', function (e) {
      dataStorage.updateColorValue =  updateColor.value;
    });
  }

  createAddCarListener() {
    document.querySelector('.create-btn')?.addEventListener('click', async function (e) {
      const inputValue: HTMLInputElement | null = document.querySelector('.create-placeholder');
      const colorValue: HTMLInputElement | null = document.querySelector('.input-color');
      api.createNewCar(inputValue?.value, colorValue?.value);
    });
  }

  async createRemoveCarListener(id: number, element: HTMLDivElement): Promise<void> {
    const removeBtn = (document.querySelector(`#remove-btn-${id}`)) as HTMLElement;

    removeBtn!.addEventListener('click', async function (e:Event) {
      const currentCar: HTMLDivElement = element;
      const idCar = (e.target as Element).id.slice(11);

      await api.deleteCar(Number(idCar));
      await api.checkWinner(Number(idCar)).then(function (res) {
        if (res !== 404) {
          api.deleteWinner(Number(idCar));
          console.log('Данные победителя были удалены');
        } else {
          console.log('Данный автомобиль не был найден в таблице победителей');
        }
      });
      currentCar.remove();
    
    });
  }

  createUpdateCarListener() :void {
    const updateBtn: HTMLInputElement | null = document.querySelector('.update-btn');
    updateBtn?.addEventListener('click', async function () {
      const updateInputValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
      const updateColorValue: HTMLInputElement | null = document.querySelector('.update-color');
      api.updateCarInfo(Number(updateBtn.id), updateInputValue!.value, updateColorValue!.value);
      document.querySelector(`#model-name-${updateBtn.id}`)!.textContent = updateInputValue!.value;
      const svgCar = <SVGElement>(document.querySelector(`#car-${updateBtn.id}`)!);
      svgCar.style.fill = updateColorValue!.value; 
    });
  }

  createSelectCarListener(objId: number) :void {
    const selectBtn = (document.querySelector(`#select-btn-${objId}`)) as HTMLElement;
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

  createScrollPagebtn() :void {
    const nextBtn: Element | null = document.querySelector('.next-btn');
    nextBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('.page-num')?.textContent;
      const actualPageNum = document.querySelector('.page-num')!.textContent = String(+currentPage! + 1);
      dataStorage.pageNumber = actualPageNum;
      api.getGaragePage(dataStorage.pageNumber);
    });

    const prevBtn = document.querySelector('.prev-btn');
    prevBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('.page-num')?.textContent;
      if (Number(currentPage) !== 1) {
        const actualPageNum = document.querySelector('.page-num')!.textContent = String(+currentPage! - 1);
        dataStorage.pageNumber = actualPageNum;
        api.getGaragePage(dataStorage.pageNumber);
      }
    });
  }

  createGenerateCarListener() :void {
    const generateBtn: Element | null = document.querySelector('.generate-btn');
    generateBtn?.addEventListener('click', async function () {
      for (let i = 0; i < 100; i += 1) {
        api.createNewCar(randomFunc.randomCarName(), randomFunc.randomCarColor());
      }  
    });
  }

  async createRaceListener(): Promise<void> {
    document.querySelector('.race-btn')?.addEventListener('click', async function () {
      const currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      let checkFirstPromise = false;
      const arrPromis = [];
      for (let i = 0; i < resp.length; i ++) { arrPromis.push(animationRun(resp[i].id)); }
      arrPromis.forEach(async  function (car) {
        const winner = (await car) as WinnerInfo;
        
        if (winner.raceStatus == true && checkFirstPromise == false) {
          checkFirstPromise = true;
          if (winner !== undefined) {
            const resultTable: HTMLElement | null = document.querySelector('#result-table');
            resultTable!.textContent = `Winner car is ${winner.name}`;
            animationWinner();


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
    winSorDesctBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('#winners-page-counter')?.textContent;
      dataStorage.sortType = 'wins';
      dataStorage.orderType = 'DESC';
      api.getWinnersPage(currentPage!, dataStorage.sortType, dataStorage.orderType);
    });

    const winSortAscBtn: Element | null = document.querySelector('#wins-down-sort-arrow');
    winSortAscBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('#winners-page-counter')?.textContent;
      dataStorage.sortType = 'wins';
      dataStorage.orderType = 'ASC';
      api.getWinnersPage(currentPage!, dataStorage.sortType, dataStorage.orderType);
    });

    const timeSorDesctBtn: Element | null = document.querySelector('#time-up-sort-arrow');
    timeSorDesctBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('#winners-page-counter')?.textContent;
      dataStorage.sortType = 'time';
      dataStorage.orderType = 'DESC';
      api.getWinnersPage(currentPage!, dataStorage.sortType, dataStorage.orderType);
    });

    const timeSortAscBtn: Element | null = document.querySelector('#time-down-sort-arrow');
    timeSortAscBtn?.addEventListener('click', async function () {
      const currentPage = document.querySelector('#winners-page-counter')?.textContent;
      dataStorage.sortType = 'time';
      dataStorage.orderType = 'ASC';
      api.getWinnersPage(currentPage!, dataStorage.sortType, dataStorage.orderType);
    });
  }
}

export const CreateListeners = new Listeners();