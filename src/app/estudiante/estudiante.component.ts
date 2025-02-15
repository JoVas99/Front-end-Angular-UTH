import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estudiante',
  imports: [RegisterComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent {

  formulario:FormGroup;

  constructor(private http:HttpClient, private router: Router){
    this.formulario = new FormGroup({
      nombre: new FormControl('',[Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('',[Validators.required, Validators.minLength(3)]),
      edad: new FormControl('',[Validators.required, Validators.pattern('^[0-9]*$')]),
      genero: new FormControl('',[Validators.required]),
    })
  }

  onSubmit(){
    if(this.formulario.valid){
      this.router.navigate(['/register'],{ state:{formData:this.formulario.value } });
      // console.log('Formulario válido:', this.formulario.value);
    }
    else{
      console.log('Formulario inválido');
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Formulario invalido",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  get nombre(){
    return this.formulario.get('nombre');
  }
  get apellido(){
    return this.formulario.get('apellido');
  }
  get edad(){
    return this.formulario.get('edad');
  }
  get genero(){
    return this.formulario.get('genero');
  }
}
