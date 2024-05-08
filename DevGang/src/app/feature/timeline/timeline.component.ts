import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent implements OnInit {
  tasks = [
      { id: '1', title: 'Task 1', startDate: new Date(2024, 0, 15), endDate: new Date(2024, 0, 20), status: 'Open' },
      { id: '2', title: 'Task 2', startDate: new Date(2024, 0, 16), endDate: new Date(2024, 0, 18), status: 'InProgress' },
      { id: '3', title: 'Task 3', startDate: new Date(2024, 0, 17), endDate: new Date(2024, 0, 22), status: 'Completed' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  calculatePosition(date: Date): string {
      const startDate = new Date(2024, 0, 15); // set your timeline start date
      const daysDifference = (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      return `${daysDifference * 100}px`; // 100px per day for example
  }

  calculateDuration(startDate: Date, endDate: Date): string {
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      return `${duration * 100}px`; // 100px per day for example
  }
}