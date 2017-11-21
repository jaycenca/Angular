import { Component, OnInit, Inject} from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { visibility , flyInOut , expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut()]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishcopy = null;
  dishIds: number[];

  //controlling of dish from one to another
  prev: number;
  next: number;

  commentForm: FormGroup;
  dishComment: Comment;

  //Error Handling for communication with the server
  errMess: string;

  //animation
  visibility = 'shown';

  formErrors = {
    'author' : '',
    'comment' : '',
  }

  validationMessages = {
    'author': {
      'required' : 'Name is required',
      'minlength' : 'Name must be at least 2 characters long. '
    },

    'comment': {
      'required' : 'Comment is require',
      'minlength' : 'Comment must be at least 2 characters long.'
    },

  }


  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds,
      );

    this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']) })
      .subscribe(dish => {
        this.dish = dish;
        this.dishcopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = 'shown';
      }, errMess => { this.dish = null; this.errMess = <any>errMess});


  }

  createForm() {
    this.commentForm = this.fb.group({
      author : ['', [Validators.required, Validators.minLength(2)]],
      comment : ['', [Validators.required, Validators.minLength(2)]],
      rating : 5,
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    //(re)set validation messages now
    this.onValueChanged();


  }
  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);

    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];

    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];

  }

  goBack(): void {
    this.location.back();
  }

  pressLike(): void {

  }

  onValueChanged(data?: any )
  {
    const form=this.commentForm;
    if (form.get('author').valid && form.get('comment').valid) {
      this.dishComment = this.commentForm.value;
    }
    else {
      this.dishComment = {
        rating: 5,
        comment: '',
        author: '',
        date: ''
      };
    }

    for (const field in this.formErrors) {
      //clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if(control.dirty && !control.valid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '';
        }
      }
    }
  }

  onSubmit()
  {
    this.dishComment = this.commentForm.value;
    this.dishComment.date = new Date().toISOString();

    this.dishcopy.comments.push(this.dishComment);

    //the following display the message, which repeat
    /*this.dishcopy.save()
      .subscribe(dish => this.dish = dish);*/

    //console.log(this.dishComment);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: '',
    })

  }




}
