import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { catchError, combineAll, map, switchMap, tap } from 'rxjs/operators';
export interface IGrid {
  term: string | null;

  currentPage: number;
  totalCnt: number;
  hasMoreRecords: boolean;
  numberofPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private page: number = 1;
  private lastTerm: string | null = null;
  private initValue: IGrid = {
    currentPage: 0,
    totalCnt: 0,
    hasMoreRecords: false,
    numberofPages: 0,
    term: null
  };
  private readonly gridSubject = new BehaviorSubject<IGrid>(this.initValue);
  gridData$ = this.gridSubject.asObservable();

  private readonly dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  private readonly termSubject = new BehaviorSubject<string | null>(null);

  url: string = 'https://api.github.com/search/users';
  constructor(private readonly http: HttpClient) {}

  search(term: string) {
    this.termSubject.next(term.trim());
  }

  searchUsers(term: string | null): Observable<any> {
    this.setPageNumber(term);
    const searchUrl = `${this.url}?q=${term}&page=${this.page}&per_page=100`;
    return this.http.get(searchUrl).pipe(
      tap((d) => console.log(d)),
      catchError(this.handleError)
    );
  }
  setPageNumber(term: string | null) {
    let gridData = this.gridSubject.value;
    if (gridData.term != term) {
      this.page = 1;
    }
    if (gridData.term == term && gridData.hasMoreRecords) {
      this.page++;
    }
  }

  searchData$ = this.termSubject.pipe(
    switchMap((term) => {
      if (!term) return of([]);

      return this.searchUsers(term).pipe(
        map((response) => {
          let isMore = false;
          const cnt = response.total_count;
          const numberofPages = Math.ceil(cnt / 100);
          if (!term.length) return;

          if (this.page < numberofPages) {
            isMore = true;
          }

          let obj = {
            term: term,
            currentPage: this.page,
            totalCnt: response.total_count,
            hasMoreRecords: isMore,
            numberofPages: numberofPages,
          };
          this.gridSubject.next(obj);
          return response.items;
        })
      );
    })
  );

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

      if (this.page < numberofPages) {
        isMore = true;
        this.page++;
      }

      this.lastTerm = term;
      let obj = {
        term: term,
        currentPage: this.page,
        totalCnt: response.data.total_count,
        hasMoreRecords: isMore,
        numberofPages: numberofPages,
      };
      this.gridSubject.next(obj);
      this.dataSubject.next(response.data.items);
    } catch (error) {
      console.error(error);
    }
  }
}
