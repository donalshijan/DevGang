import { Component } from '@angular/core';
import { LoadingService } from '../loading.service'; // Correct the path as needed
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  isVisible: boolean = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(isLoading => {
      this.isVisible = isLoading;
    });
  }
}
