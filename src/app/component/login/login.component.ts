import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { Login } from '../../interfaces/login';
import { AuthserviceService } from '../../service/authservice.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  hidePassword: boolean = true;

  loginObj: Login = {
    Email: '',
    Password: ''
  };

  constructor(
    private ser: AuthserviceService,
    private router: Router
  ) {}

  login() {

    this.ser.login(this.loginObj).subscribe({

      next: (res: any) => {

        localStorage.setItem("user", JSON.stringify(res));
        localStorage.setItem("role", res.role);

        console.log(res);

        if (res.role == "Admin") {
          this.router.navigate(['/dashboard']);
        }
        else {
          this.router.navigate(['/task']);
        }
      },

      error: () => {
        alert("Invalid Email or Password");
      }

    });
  }
}