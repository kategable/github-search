import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent  {
  @Input() items: any[] = [];

  trackByFn(index: any, item: any ) {
    return item.id ;
  }
  constructor() { }


}
