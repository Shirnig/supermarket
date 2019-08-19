import { Component, OnInit } from '@angular/core';
import { MainPageService } from "../../services/main-page.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private service;
  private router;
  username: String;

  constructor(service: MainPageService, router: Router) {
    this.service = service;
    this.router = router;
    this.username = '';
  }

  setUsername(username){
    this.username = username;
  }

  getUsername(){
    if (this.service.subsVar === undefined) {
      this.service.subsVar =
        this.service.getUsername.subscribe((name: String) => {
          this.setUsername(name);
        });
    }
  }

  logout(){
    this.service.logout().subscribe(()=>{
      this.service.onLogout();
      this.router.navigate(['']);
      this.username = '';
    }, err => console.log(err));
  }


  ngOnInit() {
    this.getUsername()
  }

}

