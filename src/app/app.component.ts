import { Component } from '@angular/core';
import { GithubService } from './github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  term = 'kate'

  gridData$ = this.service.gridData$;
  searchData$ = this.service.searchData$;
 
  constructor(private readonly service: GithubService) {

  }
  async search(){
    await this.service.getUsers(this.term);

  }
  search2(){
    this.service.search(this.term);
  }
}
