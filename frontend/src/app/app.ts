import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'SecureCart';

  health: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.healthCheck().subscribe({
      next: (response: any) => {
        this.health = response;
        console.log('Backend connected:', response.status);
      },
      error: (err: any) => {
        console.error('Backend connection failed:', err);
      }
    });
  }
}