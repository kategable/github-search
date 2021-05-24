import { Component } from '@angular/core';
import { GithubService } from './github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  term = 'kate'
  items: any;
  isMore = this.service.isMore;
  cnt = this.service.cnt;
  page = this.service.page;
  numberofPages = this.cnt / this.page
  /**
   *
   */
  constructor(private readonly service: GithubService) {

  }
  async search(){
    let data = await this.service.getUsers(this.term);
    this.items = data.items;
    this.cnt = this.service.cnt;
    this.page = this.service.page;
    this.numberofPages = Math.ceil( this.cnt / 100);
    this.isMore = this.service.isMore;

  }
}
