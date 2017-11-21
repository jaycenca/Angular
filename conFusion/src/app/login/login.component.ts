///<reference path="../../../node_modules/@angular/material/typings/dialog/dialog-ref.d.ts"/>
import { Component, OnInit } from '@angular/core';

import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {remember:false};

  constructor(private dialogRef: MdDialogRef<LoginComponent>) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log("User:", this.user);

    //After submission, the dialog will automatically close
    this.dialogRef.close();
  }
}
