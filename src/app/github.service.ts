import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  page: number = 1;
  lastTerm: string = '';
  isMore = false;
  cnt = 0;
  constructor() { }

  async getUsers(term: string){
      try {
        if(term != this.lastTerm) {
          this.page = 1;
          this.isMore = false;
        }
        const response = await axios.get(`https://api.github.com/search/users?q=${term}&page=${this.page}&per_page=100`);
        if(response.data.total_count > 100 && term != this.lastTerm) {
          this.isMore = true;
        }
        this.page ++;
        this.cnt = response.data.total_count; 
        console.info(response);
        this.lastTerm = term;
        return( response.data );

      } catch (error) {
        console.error(error);
      }

  }
}
