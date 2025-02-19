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
  loading:boolean = false

  constructor(private http:HttpClient, private router:Router){
    this.formulario = new FormGroup({
      correo: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&_]{8,}$')]),
    })
  }

  //Si el formulario es valido enviamos para hacer login en la API REST
  onSubmit(){
    if(this.formulario.valid){

      this.loading = true //bloqueamos el formulario

      const formUsuario = this.formulario.value;
      //enviar los datos del usuario y encadenar la segunda
      //peticion
      this.enviarDatos(formUsuario);

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

  //Hacemos el login y agregamos en el localstorage el token
  enviarDatos(data: any) {
    this.http.post<LoginResponse>('https://back-end-slim-uth-production.up.railway.app/login', data).subscribe({
      next: (response: LoginResponse) => {
        const token = response.token;
        localStorage.setItem('token', token);
        // Mostrar mensaje de éxito
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 1500
        });

        // Redirigir solo después de que el token se haya guardado
        this.router.navigate(['/listar-estudiante']);
      },
      error: (error) => {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error al enviar los datos:" + error.error.message,
          showConfirmButton: false,
          timer: 1500
        });
      },
      complete: () => {
        this.loading = false;
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
