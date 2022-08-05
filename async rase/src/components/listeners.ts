import api from './api-functions';
import randomFunc from './randomizer-funcs';
import { animationRun } from './animations';
import { animationReset } from './animations';
import { animationWinner } from './animations';
import { Winner } from './interfaces';
import { getCarX } from './helpers';
import { dataStorage } from './storage';
import { getTableX } from './helpers';


class Listeners {

  createAddCarListener() {
    document.querySelector('.create-btn')?.addEventListener('click', async function (e) {
      const inputValue: HTMLInputElement | null = document.querySelector('.create-placeholder');
      const colorValue: HTMLInputElement | null = document.querySelector('.input-color');
      api.createNewCar(inputValue?.value, colorValue?.value);
   });
  }

  async createRemoveCarListener(id: number, element: HTMLDivElement): Promise<void> {
    const removeBtn = (document.querySelector(`#remove-btn-${id}`)) as HTMLElement;

    removeBtn!.addEventListener('click', async function(e:Event) {
    const currentCar: HTMLDivElement = element;
    const id = (e.target as Element).id.slice(11);

    await api.deleteCar(Number(id));
    await api.checkWinner(Number(id)).then(function(res) {
      if (res !== 404) {
        api.deleteWinner(Number(id));
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
    updateBtn?.addEventListener('click', async function() {
      const updateInputValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
      const updateColorValue: HTMLInputElement | null = document.querySelector('.update-color');
      api.updateCarInfo(Number(updateBtn.id), updateInputValue!.value, updateColorValue!.value);
      document.querySelector(`#model-name-${updateBtn.id}`)!.textContent = updateInputValue!.value;
      const svgCar = <SVGElement>(document.querySelector(`#car-${updateBtn.id}`)!);
      svgCar.style.fill = updateColorValue!.value; 
    })
  }

  createSelectCarListener(objId: number) :void {
    const selectBtn = (document.querySelector(`#select-btn-${objId}`)) as HTMLElement;
    selectBtn!.addEventListener('click', async function(e:Event) {

      const id: number = Number((e.target as Element).id.slice(11));

      const updateInputValue: HTMLInputElement | null = document.querySelector('.update-placeholder');
      const updateColorValue: HTMLInputElement | null = document.querySelector('.update-color');
    
      const carInfo:any = await api.getCarInfo(id);
      updateInputValue!.value = carInfo.name;
      updateColorValue!.value = carInfo.color;

      document.querySelector('.update-btn')!.id = String(id);
    });
  }

  createScrollPagebtn() :void {
    const nextBtn: Element | null = document.querySelector('.next-btn');
    nextBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('.page-num')?.textContent;
      let actualPage = document.querySelector('.page-num')!.textContent = String(+currentPage! + 1);
      api.getGaragePage(actualPage);
    });

    const prevBtn = document.querySelector('.prev-btn');
    prevBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('.page-num')?.textContent;
      if (Number(currentPage) !== 1) {
        let actualPage = document.querySelector('.page-num')!.textContent = String(+currentPage! - 1);
        api.getGaragePage(actualPage);
      }
    });
  }

  createGenerateCarListener() :void {
    const generateBtn: Element | null = document.querySelector('.generate-btn');
    generateBtn?.addEventListener('click', async function() {
    for (let i = 0; i < 100; i += 1) {
      api.createNewCar(randomFunc.randomCarName(), randomFunc.randomCarColor());
    }  
    })
  }

  async createRaceListener(): Promise<void> {
    document.querySelector('.race-btn')?.addEventListener('click', async function() {
      const currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      let winner: any;
      let checkFirstPromise = false;
      const arrPromis = [];
      for (let i = 0; i < resp.length; i ++) { arrPromis.push(animationRun(resp[i].id)); }
      arrPromis.forEach(async  function(car) {
        winner = await car;
        if (winner.raceStatus == true && checkFirstPromise == false) {
          checkFirstPromise = true;
          if (winner !== undefined) {
            const resultTable: HTMLElement | null = document.querySelector('#result-table');
            resultTable!.textContent = `Winner car is ${winner.name}`
            animationWinner();


            await api.checkWinner(Number(+winner.id)).then(async function(res) {
              if (res !== 404) {
                const winnerInfo = (await api.checkWinner(+winner.id)) as Winner;
                await api.updateWinner(+winner.id, winnerInfo.wins! + 1, winnerInfo.time! > winner.date? winner.date: winnerInfo.time);
                console.log('Данные победителя были обновлены');
                
              } else {
                api.createWinner(+winner.id, winner.date); 
                console.log('Автомобиль внесен в список победителей');
             
              }
            });
            
          }
          
        }
      })
      
    });
  }

  async createResetListener(): Promise<void> {
    document.querySelector('.reset-btn')?.addEventListener('click', async function() {
      let currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      const arrPromis = [];

      for (let i = 0; i < resp.length; i ++) { arrPromis.push(animationReset(resp[i].id)); }
      await Promise.all(arrPromis);
      
    });
  }

  async createScrollWinnersListener(): Promise<void> {
    const prevBtn: Element | null = document.querySelector('.winner-prev-btn');
    prevBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('#winners-page-counter')?.textContent;
      if (Number(currentPage) !== 1) {
        let actualPage = document.querySelector('#winners-page-counter')!.textContent = String(+currentPage! - 1);
        api.getWinnersPage(actualPage);
      }
    });

    const nextbtn: Element | null = document.querySelector('.winner-next-btn');
    nextbtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('#winners-page-counter')?.textContent;
      let actualPage = document.querySelector('#winners-page-counter')!.textContent = String(+currentPage! + 1);
      api.getWinnersPage(actualPage);
    });
  }

  createSortBtnsListener(): void {
    const winSorDesctBtn: Element | null = document.querySelector('#wins-up-sort-arrow');
    winSorDesctBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('#winners-page-counter')?.textContent;
      api.getWinnersPage(currentPage!, "wins", "DESC");
    });

    const winSortAscBtn: Element | null = document.querySelector('#wins-down-sort-arrow');
    winSortAscBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('#winners-page-counter')?.textContent;
      api.getWinnersPage(currentPage!, "wins", "ASC");
    });

    const timeSorDesctBtn: Element | null = document.querySelector('#time-up-sort-arrow');
    timeSorDesctBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('#winners-page-counter')?.textContent;
      api.getWinnersPage(currentPage!, "time", "DESC");
    });

    const timeSortAscBtn: Element | null = document.querySelector('#time-down-sort-arrow');
    timeSortAscBtn?.addEventListener('click', async function() {
      let currentPage = document.querySelector('#winners-page-counter')?.textContent;
      api.getWinnersPage(currentPage!, "time", "ASC");
    });
  }
}

export const CreateListeners = new Listeners();