class Urls {
  public baseUrl: string = "http://127.0.0.1:3000";
  public garage: string = `${this.baseUrl}/garage/`;
  public engine: string = `${this.baseUrl}/engine/`;
  public winners: string = `${this.baseUrl}/winners/`;
  getGaragePageUrl(numPage: number | string | null): string {
    return `${this.garage}?_page=${numPage}&_limit=7`
  }
  getEngineStatusUrl(id: number | string | null, status: string): string {
    return `${this.engine}?id=${id}&status=${status}`
  }

 
  
}

export  const urls = new Urls();
