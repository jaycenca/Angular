import { Component, OnInit } from '@angular/core';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish = DISHES[0];
  constructor() { }

  ngOnInit() {
  }

}
