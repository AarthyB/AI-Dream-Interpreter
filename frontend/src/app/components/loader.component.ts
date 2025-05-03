import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  constructor(public loaderService:LoaderService) {}

  message = '';
  messages = [
    "Hold your horses... or hummingbirds 🐦💨",
    "Brewing dream magic... hang tight!",
    "The stars are aligning. Just a sec ✨",
    "Summoning your dream spirit guide...",
    "Flapping wings and fetching dreams...",
    "Waking the subconscious... slowly...",
    "Don't snooze yet, the dream's coming!",
    "Loading... like a turtle in a dream 🐢💤",
    "Patience, dreamer... even clouds take time ☁️"
  ];

  ngOnInit(): void {
    this.message = this.messages[Math.floor(Math.random() * this.messages.length)];
  }
}
