import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Chart } from 'chart.js/auto';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrl:'./insights.component.css'
})
export class InsightsComponent implements OnInit {
  symbolChart: any;
  emotionChart: any;

  constructor(private api: ApiService, private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.show();
    this.loadCharts();
  }

  loadCharts() {
    this.api.getSymbols().subscribe(data => {
      const labels = data.map((s: any) => s[0]);
      const counts = data.map((s: any) => s[1]);

      if (this.symbolChart) this.symbolChart.destroy(); 
      this.symbolChart = new Chart("symbolChart", {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Symbols',
            data: counts,
            backgroundColor: 'purple'
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                color: 'white', // ➔ white x-axis labels (symbols)
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)' // ➔ optional: soften the x-grid lines
              }
            },
            y: {
              ticks: {
                color: 'white', 
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)' 
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            }
          }
        }
        
      });
    });

    this.api.getEmotionSummary().subscribe(stats => {
      const labels = Object.keys(stats);
        const values = Object.values(stats);

        const pastelColors = [
          'rgba(255, 182, 193, 0.7)',  // Light Pink
          'rgba(176, 224, 230, 0.7)',  // Powder Blue
          'rgba(255, 215, 0, 0.7)',    // Soft Gold
          'rgba(230, 230, 250, 0.7)',  // Lavender
          'rgba(152, 251, 152, 0.7)',  // Pale Green
          'rgba(255, 222, 173, 0.7)',  // Navajo White
          'rgba(135, 206, 250, 0.7)',  // Light Sky Blue
          'rgba(255, 250, 205, 0.7)',  // Lemon Chiffon
          'rgba(240, 128, 128, 0.7)',  // Light Coral
          'rgba(216, 191, 216, 0.7)',  // Thistle
          'rgba(175, 238, 238, 0.7)',  // Pale Turquoise
          'rgba(255, 192, 203, 0.7)',  // Pink
        ];

        // Ensure colors match labels length
        const backgroundColors = labels.length <= pastelColors.length
        ? pastelColors.slice(0, labels.length)
        : labels.map(() => `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`); 

        new Chart("emotionChart", {
        type: 'pie',
        data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors,
          borderColor: 'black',
          borderWidth: 1.5  
        }]
        },
        options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'white',
              boxWidth: 20,
              font: { size: 14 }
            }
          }
        }
        }
        });

        })
        }
}
