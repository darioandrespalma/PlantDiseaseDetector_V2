import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lunar-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './lunar-calendar.html',
  styleUrls: ['./lunar-calendar.css']
})
export class LunarCalendarComponent {
  // Aquí irá la lógica para llamar al servicio de la API Lunar
  faseLunar = "Luna Creciente";
  recomendacion = "Momento ideal para sembrar cultivos de fruto (tomate, maíz).";
}
