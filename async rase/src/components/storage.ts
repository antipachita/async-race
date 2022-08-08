class Storage {

  pageNumber: string;

  sortType: string;

  orderType: string;

  winennerPageNumber: string | number;

  createInputValue: string;

  createColorValue: string;

  updateInputValue: string;

  updateColorValue: string;

  constructor() {
    this.pageNumber = '1';
    this.sortType = 'time';
    this.orderType = 'DESC';
    this.winennerPageNumber = '1';
    this.createInputValue = '';
    this.createColorValue = '#e66465';
    this.updateInputValue = '';
    this.updateColorValue = '#e66465';
  }

}

export const dataStorage = new Storage();