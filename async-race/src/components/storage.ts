class Storage {

  pageNumber: number;

  sortType: string;

  orderType: string;

  winennerPageNumber: string | number;

  createInputValue: string;

  createColorValue: string;

  updateInputValue: string;

  updateColorValue: string;

  turnPagePrevBtnStyle: string;
  
  turnPageNextBtnStyle: string;

  constructor() {
    this.pageNumber = 1;
    this.sortType = 'time';
    this.orderType = 'DESC';
    this.winennerPageNumber = '1';
    this.createInputValue = '';
    this.createColorValue = '#e66465';
    this.updateInputValue = '';
    this.updateColorValue = '#e66465';
    this.turnPagePrevBtnStyle = 'inactive';
    this.turnPageNextBtnStyle = 'inactive';
  }

}

export const dataStorage = new Storage();
