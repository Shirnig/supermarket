import { Component, OnInit, Input } from '@angular/core';
import {StoreInfo} from "../../../interfaces/main-page.interface";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  @Input() inInfo: StoreInfo;

  constructor() { }

  ngOnInit() {
  }

}
