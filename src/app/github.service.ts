import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, throwError } from 'rxjs';
export interface IGrid {
  data: any[];
  currentPage: number;
  totalCount: number;
  hasMoreRecords: boolean;
  numberofPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private page: number = 1;
  private lastTerm: string | undefined = undefined;
  private initValue: IGrid = {
    data: [],
    currentPage: 0,
    totalCount: 0,
    hasMoreRecords: false,
    numberofPages: 0,
  };
  private readonly gridSubject = new BehaviorSubject<IGrid>(this.initValue);
  grid$ = this.gridSubject.asObservable();
  url= "https://api.github.com/search/users"

  constructor(private readonly http: HttpClient) {}

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

      if (this.page < numberofPages ) {
        isMore = true;
        this.page++;
      }

      this.lastTerm = term;
      let obj: IGrid = {
        data: response.data.items,
        currentPage: this.page,
        totalCount: response.data.total_count,
        hasMoreRecords: isMore,
        numberofPages: numberofPages,
      };
      this.gridSubject.next(obj);
    } catch (error) {
      console.error(error);
    }
  }

  searchUsers(term: string){
    const searchUrl = `${this.url}?q=${term}&page=${this.page}&per_page=100`;
    return this.http.get(searchUrl).pipe(catchError(this.handleError))
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
