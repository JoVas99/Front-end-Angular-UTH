import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstudianteComponent } from '../estudiante/estudiante.component';
import Swal from 'sweetalert2';

interface UsuarioResponse {
  message:string;
  id:number;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  formData: any;
  formulario:FormGroup;

  constructor(private http:HttpClient, private router:Router){
    this.formulario = new FormGroup({
      correo: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&_]{8,}$')]),
      repetir_password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&_]{8,}$')]),
      rol: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.formData = history.state.formData;
    // this.formulario.patchValue({
    //   nombre_usuario:this.formData.nombre.toLowerCase()+'.'+this.formData.apellido.toLowerCase(),
    // })
    console.log('Datos recibidos:', this.formData)
  }

  onSubmit(){
    if(this.formulario.valid){
      if(this.formulario.get('password')?.value === this.formulario.get('repetir_password')?.value)
      {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Las contraseñas son iguales",
          showConfirmButton: false,
          timer: 1500
        });

        //Asignar el rol por defecto si no se ha seleccionado
        if(this.formulario.get('rol')?.value == ''){
          this.formulario.patchValue({rol:'estudiante'});
        }

        //Remover el campo 'repetir password' antes de enviar
        this.formulario.removeControl('repetir_password');

        const formUsuario = this.formulario.value;

        //enviar los datos del usuario y encadenar la segunda
        //peticion
        this.enviarDatos(formUsuario);
      }
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
    this.http.post<UsuarioResponse>('https://back-end-slim-uth-production.up.railway.app/register', data).subscribe({
      next: (response: UsuarioResponse) => {

         // Asumimos que el ID del usuario viene en el campo 'id' de la respuesta
        const usuarioId = response.id;

        // Ahora hacemos la segunda petición, enviando el ID del usuario y formData
        this.enviarFormData(usuarioId, this.formData);

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

  // Método para enviar formData y el ID del usuario (segunda petición)
  enviarFormData(usuarioId: number, formData: any) {
  const datosConId = { ...formData, usuario_id: usuarioId };

    this.http.post('https://back-end-slim-uth-production.up.railway.app/estudiante', datosConId).subscribe({
      next: (response) => {
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
          title: "Error al enviar los datos adicionales:" + error,
          showConfirmButton: false,
          timer: 1500
        });
      },
      complete: () => {
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "Datos guardados",
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
  get repetir_password(){
    return this.formulario.get('repetir_password')
  }
}
