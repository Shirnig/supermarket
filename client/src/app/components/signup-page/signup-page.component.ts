import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SignupPageService } from "../../services/signup-page.service";
import {NewUser, StepOne, StepTwo} from "../../interfaces/signup-page.interface";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
  private router: Router;
  private service;
  step_one: StepOne;
  step_two: StepTwo;
  new_user: NewUser;

  constructor(router: Router, service: SignupPageService) {
    this.router = router;
    this.service = service;
    this.step_one = null;
    this.step_two = null;
    this.new_user = null;
  }

  getStepOne(step_one) {
    this.step_one = step_one;
  }

  getStepTwo(step_two) {
    this.step_two = step_two;
    this.new_user = {...this.step_one, ...this.step_two};
    this.createUser();
  }

  createUser() {
    this.service.createUser(this.new_user).subscribe(()=>{
      this.router.navigate([''])
    }, err => console.log(err));
  }

  ngOnInit() {
  }

}
