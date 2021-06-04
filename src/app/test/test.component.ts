import { DataService } from './../data.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  @Input() title: string = '';
  constructor(private readonly service: DataService) {
  
   }
  message = "Hello Live!"
  customer = { name:'Dasha', address:'111 Main st'}
  ngOnInit(): void {
  }

}
