import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandler, NgZone } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler {
  private baseUrl = environment.baseUrl
  private endpoint = `${this.baseUrl}/errors`;

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar, private zone: NgZone) {}

  handleError(error: any): void {
    console.error('An error occurred:', error);

    // Optional: Send error to the server
    this.logErrorToServer(error);

    // Ensure UI changes are handled in Angular zone
    if (this.zone.isStable) {
      this.zone.run(() => {
        this.snackBar.open('An unexpected error occurred.', 'Dismiss', { duration: 3000 });
      });
    } else {
      console.warn('Attempted to run snackBar before Angular was stable.');
    }
  }

  private logErrorToServer(error: any): void {
    // Here, you would typically convert the error to a format your backend expects
    const errorPayload = { message: error.message || 'Unknown error', stack: error.stack || 'No stack info' };
    this.httpClient.post(this.endpoint, errorPayload).subscribe({
      error: err => console.error('Could not send error to server:', err)
    });
  }
}
