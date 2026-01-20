import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface NewsItem {
  title: string;
  summary: string;
  link: string;
  source: string;
  date: string;
  image: string;
}

@Component({
  selector: 'app-boletin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="boletin-container">
      <header class="boletin-header">
        <h2 class="title">📰 Actualidad Agrícola</h2>
        <p class="subtitle">Noticias relevantes para Manabí y el Ecuador</p>
        <div class="divider"></div>
      </header>

      <div *ngIf="isLoading()" class="news-grid">
        <div class="news-card skeleton" *ngFor="let i of [1,2,3]"></div>
      </div>

      <div *ngIf="!isLoading()" class="news-grid">
        <article *ngFor="let news of newsList()" class="news-card">
          
          <div class="card-image-wrapper">
            <span class="source-badge">{{ news.source }}</span>
            <img [src]="news.image || 'assets/images/placeholder.jpg'" 
                 (error)="news.image = 'assets/images/placeholder.jpg'"
                 alt="Imagen noticia">
          </div>
          
          <div class="card-content">
            <div class="card-meta">
              <i class="far fa-calendar-alt"></i> {{ news.date | date:'mediumDate' }}
            </div>
            
            <h3 class="card-title">
              <a [href]="news.link" target="_blank">{{ news.title }}</a>
            </h3>
            
            <p class="card-summary">{{ news.summary }}</p>
            
            <a [href]="news.link" target="_blank" class="read-more">
              Leer más <span>&rarr;</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  `,
  styleUrls: ['./boletin.css'] // Asegúrate de crear este archivo
})
export class BoletinComponent implements OnInit {
  private http = inject(HttpClient);
  newsList = signal<NewsItem[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.http.get<NewsItem[]>('http://localhost:3000/api/news')
      .subscribe({
        next: (data) => {
          this.newsList.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }
}