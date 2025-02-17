import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
  userRole:string | null = null

  constructor(private http:HttpClient, private router:Router, private authService: AuthService){
    this.formulario = new FormGroup({
      correo: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&_]{8,}$')]),
      repetir_password: new FormControl('',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&_]{8,}$')]),
      rol: new FormControl('',[Validators.required]),
    })
  }

  ngOnInit(): void {
    this.formData = history.state.formData;
    this.userRole = this.authService.getUserRole();
    // this.formulario.patchValue({
    //   nombre_usuario:this.formData.nombre.toLowerCase()+'.'+this.formData.apellido.toLowerCase(),
    // })
    // console.log('Datos recibidos:', this.formData)
  }

  onSubmit(){
    if(this.formulario.valid){
      if(this.formulario.get('password')?.value === this.formulario.get('repetir_password')?.value) {
        if(this.validarRol()){

          //Remover el campo 'repetir password' antes de enviar
          this.formulario.removeControl('repetir_password');

          //enviar los datos del usuario y encadenar la segunda
          //peticion
          this.enviarDatos(this.formulario.value);
          console.log(this.formulario.value);
        }else{
          console.log("1");
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permiso para crear este tipo de usuario.',
          });
        }
      }
      else{
        console.log("2");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden',
        });
      }
    }
    else{
      console.log("3");
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
      });
    }
  }

  validarRol(): boolean {
    if (this.userRole === 'admin') {
      return true; // Puede crear cualquier rol
    }
    if (this.userRole === 'director') {
      return ['estudiante', 'maestro', 'director'].includes(this.formulario.get('rol')?.value);
    }
    return false;
  }

  enviarDatos(data: any) {
    this.http.post<UsuarioResponse>('https://back-end-slim-uth-production.up.railway.app/register', data).subscribe({
      next: (response: UsuarioResponse) => {

         // Asumimos que el ID del usuario viene en el campo 'id' de la respuesta
        const usuarioId = response.id;

        // Ahora hacemos la segunda petición, enviando el ID del usuario y formData
        this.enviarFormData(usuarioId, this.formData);

      },
      error: (error) => {
        console.log("4");
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error al enviar los datos:" + error.error.message,
          showConfirmButton: true,
          timer: 4500
        });
      },
    });
  }

  // Método para enviar formData y el ID del usuario (segunda petición)
  enviarFormData(usuarioId: number, formData: any) {
  const datosConId = { ...formData, usuario_id: Number(usuarioId) };

    this.http.post('https://back-end-slim-uth-production.up.railway.app/estudiante', datosConId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'El estudiante ha sido registrado correctamente.',
        }).then(() => {
          this.router.navigate(['/listar-estudiantes']);
        });
      },
      error: (error) => {
        console.log(datosConId);
        console.log(error.error.message);
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Error al enviar los datos adicionales:" + error.error.message,
          showConfirmButton: true,
        });
      },
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
  get rol(){
    return this.formulario.get('rol');
  }
}
