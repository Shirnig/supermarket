import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import cities from '../../../../assets/cities';
import {StepTwo} from "../../../interfaces/signup-page.interface";

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {
  @Output() outStepTwo: EventEmitter<Object> = new EventEmitter<Object>();
  cities: Array<String>;
  step_two: StepTwo;
  error: String;


  constructor() {
    this.cities = cities;
    this.step_two = {first_name: '', last_name: '', city: '', street: ''};
    this.error = '';
  }


  pageValid() {
    const {first_name, last_name, city, street} = this.step_two;
    if(first_name && last_name && city && street) {
      this.error = '';
      this.outStepTwo.emit(this.step_two);
    } else{
        this.error = 'please fill all fields'
    }
  }

  ngOnInit() {
  }

}
