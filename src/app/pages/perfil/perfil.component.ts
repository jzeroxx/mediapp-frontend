import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from 'src/app/_service/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  authorities: string[];

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService;
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const decodeToken = helper.decodeToken(token);
    this.usuario = decodeToken.user_name;
    this.authorities = decodeToken.authorities;
    console.log(this.authorities);
  }

}
