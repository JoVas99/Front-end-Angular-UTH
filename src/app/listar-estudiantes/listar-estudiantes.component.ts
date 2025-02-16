import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-estudiantes',
  imports: [CommonModule],
  templateUrl: './listar-estudiantes.component.html',
  styleUrl: './listar-estudiantes.component.css'
})
export class ListarEstudiantesComponent implements OnInit {
  estudiantes: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerEstudiantes();
  }

  // Obtener estudiantes desde la API
  obtenerEstudiantes() {
    this.http.get<any[]>('https://back-end-slim-uth-production.up.railway.app/estudiante').subscribe({
      next: (data) => (this.estudiantes = data),
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

  // Redirigir al formulario de edición con el ID del estudiante
  editarEstudiante(id: number) {
    this.router.navigate(['/editar-estudiante', id]);
  }

  // Eliminar estudiante con confirmación
  eliminarEstudiante(id: number) {
    Swal.fire({
      title: "Esta seguro de eliminar el estudiante?",
      text: "No podra revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://back-end-slim-uth-production.up.railway.app/estudiante/${id}`).subscribe({
          next: () => {
            Swal.fire({
              title: "Eliminado!",
              text: "Estudiante eliminado correctamente",
              icon: "success"
            });
            this.obtenerEstudiantes(); // Actualizar lista
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
    });
  }
}
