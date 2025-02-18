import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estudiante',
  imports: [RegisterComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent {

  formulario:FormGroup;
  estudianteId:number | null = null;
  usuarioId: number | null =  null;

  constructor(private http:HttpClient, private router: Router, private route: ActivatedRoute){
    this.formulario = new FormGroup({
      nombre: new FormControl('',[Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('',[Validators.required, Validators.minLength(3)]),
      edad: new FormControl('',[Validators.required, Validators.pattern('^[0-9]*$')]),
      genero: new FormControl('',[Validators.required]),
    })
  }

  ngOnInit(): void {
    this.estudianteId = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioId = Number(this.route.snapshot.paramMap.get('usuario_id'));

    if (this.estudianteId) {
      // Si hay un ID en la URL, cargar datos para edición
      this.http
        .get<any>(`https://back-end-slim-uth-production.up.railway.app/estudiante/${this.estudianteId}`)
        .subscribe({
          next: (data) => this.formulario.patchValue(data),
          error: (error) =>
            Swal.fire({
              position: "top",
              icon: "error",
              title: "Error al enviar los datos:" + error,
              showConfirmButton: false,
              timer: 1500
            }),
        });
    }
  }

  onSubmit(){
    if(this.formulario.valid){
      if(this.estudianteId)
      {
        const datosConId = { ...this.formulario.value, usuario_id: Number(this.usuarioId) };
        // Actualizar estudiante
        this.http
        .put(`https://back-end-slim-uth-production.up.railway.app/estudiante/${this.estudianteId}`, datosConId)
        .subscribe({
          next: () => {
            Swal.fire({
              position: "top",
              icon: "success",
              title: "Datos enviados correctamente",
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/listar-estudiante']);
          },
          error: (error) =>
            Swal.fire({
              position: "top",
              icon: "error",
              title: "Error al enviar los datos:" + error,
              showConfirmButton: false,
              timer: 1500
            }),
        });
      }
      else
      {
        this.router.navigate(['/register'],{ state:{formData:this.formulario.value } });
        // console.log('Formulario válido:', this.formulario.value);
      }
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
