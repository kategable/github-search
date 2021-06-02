import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GithubService } from './github.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  term = 'kate'
  items: any;


  gridData$ = this.service.grid$;
  data: any;

  constructor(private readonly service: GithubService) {

  }

  async search(){
    await this.service.getUsers(this.term);
  }
  search2(){
    const sub = this.service.searchUsers(this.term).subscribe((data: any)=>{
      this.data = data.items;
      sub.unsubscribe();
    })
  }
}
