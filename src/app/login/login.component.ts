import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal from 'sweetalert2';

interface LoginResponse {
  token:string;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formulario:FormGroup;

  constructor(private http:HttpClient, private router:Router){
    this.formulario = new FormGroup({
      correo: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&_]{8,}$')]),
    })
  }

  onSubmit(){
    if(this.formulario.valid){
      const formUsuario = this.formulario.value;
      //enviar los datos del usuario y encadenar la segunda
      //peticion
      this.enviarDatos(formUsuario);
      this.router.navigate(['/listar-estudiante']);
    }
    else{
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Formulario invalido",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }


  enviarDatos(data: any) {
    this.http.post<LoginResponse>('https://back-end-slim-uth-production.up.railway.app/login', data).subscribe({
      next: (response: LoginResponse) => {
        const token = response.token;
        // const jwt_decode = require('jwt-decode');
        // const decoded = jwt_decode(token);
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        localStorage.setItem('token', token);
        // console.log(decodedToken);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "info",
          title: "Datos enviados"
        });
      },
      error: (error) => {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error al enviar los datos:" + error,
          showConfirmButton: false,
          timer: 1500
        });
      },
      complete: () => {
        // Swal.fire({
        //   position: "top",
        //   icon: "success",
        //   title: "Datos enviados correctamente",
        //   showConfirmButton: false,
        //   timer: 1500
        // });
      }
    });
  }

  get correo(){
    return this.formulario.get('correo')
  }
  get password(){
    return this.formulario.get('password')
  }
}
