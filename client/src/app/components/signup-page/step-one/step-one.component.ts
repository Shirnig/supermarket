import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { SignupPageService } from "../../../services/signup-page.service";
import { Router } from '@angular/router';
import {ErrorsStepOne, StepOne, ValidateStepOne} from "../../../interfaces/signup-page.interface";


@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit {
  @Output() outStepOne: EventEmitter<Object> = new EventEmitter<Object>();
  private service;
  router: Router;
  step_one: StepOne;
  re_password: String;
  validate: ValidateStepOne;
  errors: ErrorsStepOne;


  constructor(service: SignupPageService, router: Router) {
    this.service = service;
    this.router = router;
    this.step_one = {user_id:null, email:'', password:''};
    this.re_password = null;
    this.validate = {id_valid: false, email_valid: false, password_valid: false, step_one_valid: false};
    this.errors = {error_id: null, error_email: null, error_password: null, error_page: null};
  }

  checkId(){
    this.service.checkId(this.step_one.user_id).subscribe(()=>{
      this.validate.id_valid = true;
      this.errors.error_id = null;
    }, err => {this.errors.error_id = err.error;this.validate.id_valid = false});
  }

  checkEmail(){
    this.service.checkEmail(this.step_one.email).subscribe(()=>{
      this.validate.email_valid = true;
      this.errors.error_email = null;
    }, err => {this.errors.error_email = err.error;this.validate.email_valid=false});
  }

  checkPassword(){
    if(this.step_one.password === this.re_password) {
      this.validate.password_valid = true;
      this.errors.error_password = null;
    }else {
      this.validate.password_valid = false;
      this.errors.error_password = 'Passwords not match';
    }
  }

  pageValid() {
    this.checkPassword();
    const {user_id,email,password} = this.step_one;
    const {id_valid,email_valid,password_valid} = this.validate;
    if (user_id&&email&&password&&id_valid&&email_valid&&password) {
      this.validate.step_one_valid = true;
      this.outStepOne.emit(this.step_one);
    }else {
      this.errors.error_page = 'Some fields are empty';
    }
  }

  ngOnInit() {
  }

}
