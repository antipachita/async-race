import { Car } from './interfaces';
import { Winner } from './interfaces';
import api from './api-functions';
import { CreateListeners } from './listeners';
import { getCarX } from './helpers';
import { createEngineRunBtn } from './animations';
import { createEngineStopBtn } from './animations';


class Render {
  renderHtml() {
    document.body.innerHTML = `<header>
      <nav>
        <div class="nav-button" id="garage-view" data-href="#/">To garage</div>
        <div class="nav-button" id="winners-view" data-href="#/results/">To winners</div>
      </nav>
    </header>
    <main class="content-container">
    </main>`
  }

  renderGarage() {
    const main: Element | null = document.querySelector('.content-container');
    main!.innerHTML = `
      <div class="control-panel">
        <div class="create-panel panel-item">
          <input placeholder="input name" type="text" class="create-placeholder control-panel-item" value="" autocomplete="off">
          <div class="color-btn control-panel-item">
            <input type="color" id="head" value="#e66465" class="input-color">
            <label for="head"></label>
          </div>
          <button class="create-btn control-panel-item">CREATE</button>
        </div>
        <div class="update-panel panel-item">
          <input placeholder="input name" type="text" class="update-placeholder control-panel-item" value="" autocomplete="off">
          <div class="color-btn control-panel-item">
            <input type="color" id="head value="#e66465" class="update-color">
            <label for="head"></label>
          </div>
          <button class="update-btn control-panel-item">UPDATE</button>
        </div>
        <div class="garage-panel panel-item">
          <div class="garage-button race-btn" id="garage-view">RACE</div>
          <div class="garage-button reset-btn" id="garage-view">RESET</div>
          <div class="garage-button generate-btn" id="garage-view">GENERATE CARS</div>
        </div>
      </div>
      <div class="garage">
        <div class="garage-counter">Garage 0</div>
        <div class="page-number">Page <span class="page-num">1</span></div>
        <div class="cars-container"></div>
      </div>
      <div class="nav-page">
        <div class="nav-page-btn prev-btn">prev</div>
        <div class="nav-page-btn next-btn">next</div>
      </div>`
  }


  renderCar(carObj:Car) {
    const car: HTMLDivElement =  document.createElement("div");
    car.classList.add("car");
    car.innerHTML = `<div class="control-car-btns">
      <div class="control-car-button select-btn" id="select-btn-${carObj.id}">SELECT</div>
      <div class="control-car-button remove-btn" id="remove-btn-${carObj.id}">REMOVE</div>
      <div class="control-car-button model" id="model-name-${carObj.id}">${carObj.name}</div>
    </div>
    <div class="engine-btns">
      <div class="engine-run-${carObj.id} engine-btn">A</div>
      <div class="engine-stop-${carObj.id} engine-btn">B</div>
    </div>
    <div class="race-track">
      <div class="car-image race-track-item">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 20" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style>
        <g transform="matrix(0.2 0 0 0.2 25 5.5) scale(-1,1)" style="fill: ${carObj.color};" id="car-${carObj.id}"><path class="st0" d="M103.94,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76c-5.39,0-9.76-4.37-9.76-9.76 C94.18,28.34,98.55,23.97,103.94,23.97L103.94,23.97z M23,29.07v3.51h3.51C26.09,30.86,24.73,29.49,23,29.07L23,29.07z M26.52,34.87H23v3.51C24.73,37.97,26.09,36.6,26.52,34.87L26.52,34.87z M20.71,38.39v-3.51H17.2 C17.62,36.6,18.99,37.96,20.71,38.39L20.71,38.39z M17.2,32.59h3.51v-3.51C18.99,29.49,17.62,30.86,17.2,32.59L17.2,32.59z M105.09,29.07v3.51h3.51C108.18,30.86,106.82,29.49,105.09,29.07L105.09,29.07z M108.6,34.87h-3.51v3.51 C106.82,37.97,108.18,36.6,108.6,34.87L108.6,34.87z M102.8,38.39v-3.51h-3.51C99.71,36.6,101.07,37.96,102.8,38.39L102.8,38.39z M99.28,32.59h3.51v-3.51C101.07,29.49,99.71,30.86,99.28,32.59L99.28,32.59z M49.29,12.79c-1.54-0.35-3.07-0.35-4.61-0.28 C56.73,6.18,61.46,2.07,75.57,2.9l-1.94,12.87L50.4,16.65c0.21-0.61,0.33-0.94,0.37-1.55C50.88,13.36,50.86,13.15,49.29,12.79 L49.29,12.79z M79.12,3.13L76.6,15.6l24.13-0.98c2.48-0.1,2.91-1.19,1.41-3.28c-0.68-0.95-1.44-1.89-2.31-2.82 C93.59,1.86,87.38,3.24,79.12,3.13L79.12,3.13z M0.46,27.28H1.2c0.46-2.04,1.37-3.88,2.71-5.53c2.94-3.66,4.28-3.2,8.65-3.99 l24.46-4.61c5.43-3.86,11.98-7.3,19.97-10.2C64.4,0.25,69.63-0.01,77.56,0c4.54,0.01,9.14,0.28,13.81,0.84 c2.37,0.15,4.69,0.47,6.97,0.93c2.73,0.55,5.41,1.31,8.04,2.21l9.8,5.66c2.89,1.67,3.51,3.62,3.88,6.81l1.38,11.78h1.43v6.51 c-0.2,2.19-1.06,2.52-2.88,2.52h-2.37c0.92-20.59-28.05-24.11-27.42,1.63H34.76c3.73-17.75-14.17-23.91-22.96-13.76 c-2.67,3.09-3.6,7.31-3.36,12.3H2.03c-0.51-0.24-0.91-0.57-1.21-0.98c-1.05-1.43-0.82-5.74-0.74-8.23 C0.09,27.55-0.12,27.28,0.46,27.28L0.46,27.28z M21.86,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76 c-5.39,0-9.76-4.37-9.76-9.76C12.1,28.34,16.47,23.97,21.86,23.97L21.86,23.97z"/></g>
        <g transform="matrix(0.1 0 0 0.1 260 1) scale(-1,1)" style="fill: red;"><path d="M18,17.8C42.77,3.24,55.21,10,66.7,16.16,76.22,21.3,84.92,26,103.75,10a4.45,4.45,0,0,1,6.2.44,4.22,4.22,0,0,1,1,2.42l5.78,56.89a4.23,4.23,0,0,1-1.38,3.57c-21.79,19.84-35,13.16-48.6,6.27C55.74,74,44.35,68.25,25.21,84.12a3.94,3.94,0,0,1-.53.38l3.09,30.81a6.89,6.89,0,1,1-13.71,1.35L4.21,18.38a10.15,10.15,0,1,1,13.68-1.67L18,17.8Z"/></g>
        <line x1="0" y1="15" x2="300" y2="15" stroke="white"
        stroke-dasharray="4" />
        </svg>
      </div>
      <div class="flag race-track-item">B</div>
    </div>
    `;
     
    
    
    const carsContainer: HTMLDivElement | null = document.querySelector('.cars-container');
    carsContainer?.append(car);

    CreateListeners.createRemoveCarListener(carObj.id, car);
    CreateListeners.createSelectCarListener(carObj.id);
    createEngineRunBtn(carObj.id);
    createEngineStopBtn(carObj.id);
  }

  renderwinners(): void {
    const main: Element | null = document.querySelector('.content-container');
    main!.innerHTML = `
    <h2 id="winners-title">Winners</h2>
    <table id="table">
      <thead>
        <tr>
          <th>Number</th>
          <th>Car</th>
          <th>Name</th>
          <th>Wins</th>
          <th>Best time</th>
        </tr>
      </thead>
      <tbody class="tbody">
      </tbody>
    </table>
    `;
  }

  renderWinner(winner: Winner, num: number, name: string, color: string):void {
    const tbody: Element | null = document.querySelector('.tbody');
    const tr: Element | null = document.createElement('tr');
    tr!.innerHTML = `
      <td>${num}</td>
      <td >
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 70" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style>
        <g transform="matrix(1.5 0 0 1.5 210 5.5) scale(-1,1)" style="fill: ${color};" ><path class="st0" d="M103.94,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76c-5.39,0-9.76-4.37-9.76-9.76 C94.18,28.34,98.55,23.97,103.94,23.97L103.94,23.97z M23,29.07v3.51h3.51C26.09,30.86,24.73,29.49,23,29.07L23,29.07z M26.52,34.87H23v3.51C24.73,37.97,26.09,36.6,26.52,34.87L26.52,34.87z M20.71,38.39v-3.51H17.2 C17.62,36.6,18.99,37.96,20.71,38.39L20.71,38.39z M17.2,32.59h3.51v-3.51C18.99,29.49,17.62,30.86,17.2,32.59L17.2,32.59z M105.09,29.07v3.51h3.51C108.18,30.86,106.82,29.49,105.09,29.07L105.09,29.07z M108.6,34.87h-3.51v3.51 C106.82,37.97,108.18,36.6,108.6,34.87L108.6,34.87z M102.8,38.39v-3.51h-3.51C99.71,36.6,101.07,37.96,102.8,38.39L102.8,38.39z M99.28,32.59h3.51v-3.51C101.07,29.49,99.71,30.86,99.28,32.59L99.28,32.59z M49.29,12.79c-1.54-0.35-3.07-0.35-4.61-0.28 C56.73,6.18,61.46,2.07,75.57,2.9l-1.94,12.87L50.4,16.65c0.21-0.61,0.33-0.94,0.37-1.55C50.88,13.36,50.86,13.15,49.29,12.79 L49.29,12.79z M79.12,3.13L76.6,15.6l24.13-0.98c2.48-0.1,2.91-1.19,1.41-3.28c-0.68-0.95-1.44-1.89-2.31-2.82 C93.59,1.86,87.38,3.24,79.12,3.13L79.12,3.13z M0.46,27.28H1.2c0.46-2.04,1.37-3.88,2.71-5.53c2.94-3.66,4.28-3.2,8.65-3.99 l24.46-4.61c5.43-3.86,11.98-7.3,19.97-10.2C64.4,0.25,69.63-0.01,77.56,0c4.54,0.01,9.14,0.28,13.81,0.84 c2.37,0.15,4.69,0.47,6.97,0.93c2.73,0.55,5.41,1.31,8.04,2.21l9.8,5.66c2.89,1.67,3.51,3.62,3.88,6.81l1.38,11.78h1.43v6.51 c-0.2,2.19-1.06,2.52-2.88,2.52h-2.37c0.92-20.59-28.05-24.11-27.42,1.63H34.76c3.73-17.75-14.17-23.91-22.96-13.76 c-2.67,3.09-3.6,7.31-3.36,12.3H2.03c-0.51-0.24-0.91-0.57-1.21-0.98c-1.05-1.43-0.82-5.74-0.74-8.23 C0.09,27.55-0.12,27.28,0.46,27.28L0.46,27.28z M21.86,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76 c-5.39,0-9.76-4.37-9.76-9.76C12.1,28.34,16.47,23.97,21.86,23.97L21.86,23.97z"/></g>
      </td>
      <td>${name}</td>
      <td>${winner.wins}</td>
      <td>${winner.time}</td>
    `;
    tbody?.append(tr);
  }

}

export const render = new Render();