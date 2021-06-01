import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
export interface IGrid {
  data: any[];
  currentPage: number;
  totalCnt: number;
  hasMoreRecord: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private page: number = 1;
  private lastTerm: string | undefined = undefined;
  private initValue = {
    data: [],
    currentPage: 0,
    totalCnt: 0,
    hasMoreRecord: false,
    numberofPages: 0,
  };
  private readonly gridSubject = new BehaviorSubject<any>(this.initValue);
  gridData$ = this.gridSubject.asObservable();

  constructor() {}

  async getUsers(term: string): Promise<void> {
    let isMore = false;

    try {
      if (!term.length) return;
      if (term != this.lastTerm) {
        this.page = 1;
        isMore = false;
      }
      const response = await axios.get(
        `https://api.github.com/search/users?q=${term}&page=${this.page}&per_page=100`
      );

      const cnt = response.data.total_count;
      const numberofPages = Math.ceil(cnt / 100);

      if (numberofPages < this.page) {
        isMore = true;
        this.page++;
      }

      this.lastTerm = term;
      let obj = {
        data: response.data.items,
        currentPage: this.page,
        totalCnt: response.data.total_count,
        hasMoreRecord: isMore,
        numberofPages: numberofPages,
      };
      this.gridSubject.next(obj);
    } catch (error) {
      console.error(error);
    }
  }
}
