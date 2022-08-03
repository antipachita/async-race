import api from './api-functions';
import randomFunc from './randomizer-funcs';
import { animationRun } from './animations';
import { animationReset } from './animations';


class Listeners {

  createAddCarListener() {
    document.querySelector('.create-btn')?.addEventListener('click', async function (e) {
      const inputValue: HTMLInputElement | null = document.querySelector('.create-placeholder');
      const colorValue: HTMLInputElement | null = document.querySelector('.input-color');
      api.createNewCar(inputValue?.value, colorValue?.value);
   });
  }

  createRemoveCarListener(id: number, element: HTMLDivElement) :void {
    const removeBtn = (document.querySelector(`#remove-btn-${id}`)) as HTMLElement;

    removeBtn!.addEventListener('click', async function(e:Event) {
    const currentCar: HTMLDivElement = element;
    const id = (e.target as Element).id.slice(11);

    api.deleteCar(Number(id));
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
      let actualPage = document.querySelector('.page-num')!.textContent = String(+currentPage! - 1);
      api.getGaragePage(actualPage);
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
      let currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      const arrPromis = [];

      for (let i = 0; i < resp.length; i ++) {  arrPromis.push(animationRun(resp[i].id)); }
      const raseResults = await Promise.all(arrPromis);
      console.log(raseResults)
      console.log(raseResults.filter(car => car.isRace === true).sort((a, b) => a.date - b.date)[0])
    });
  }

  async createResetListener(): Promise<void> {
    document.querySelector('.reset-btn')?.addEventListener('click', async function() {
      let currentPage = document.querySelector('.page-num')?.textContent;
      const resp = await fetch(`http://127.0.0.1:3000/garage?_page=${currentPage}&_limit=7`).then(value => value.json());
      const arrPromis = [];

      for (let i = 0; i < resp.length; i ++) {  arrPromis.push(animationReset(resp[i].id)); }
      await Promise.all(arrPromis);
      
    });
  }
}

export const CreateListeners = new Listeners();