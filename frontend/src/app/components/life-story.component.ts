import { Component, Injectable, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-life-story',
  templateUrl: './life-story.component.html',
  styleUrls: ['./life-story.component.css']
})
export class LifeStoryComponent implements OnInit {
  story: string = '';
  editedStory: string = '';
  isEditing: boolean = false;
  showFull: boolean = false;
  status: string = '';

  constructor(private api: ApiService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.api.getLifeStory().subscribe(data => {
      this.story = data.story;
      this.editedStory = this.story;
    });
  }

  toggleFull(): void {
    this.showFull = !this.showFull;
  }

  startEdit(): void {
    this.isEditing = true;
    this.editedStory = this.story;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveStory(): void {
    this.loaderService.show();
    this.api.saveLifeStory(this.editedStory).subscribe({
      next: () => {
        this.story = this.editedStory;
        this.status = '✅ Life story saved!';
        this.isEditing = false;
      },
      error: () => {
        this.status = '❌ Failed to save life story.';
      }
    });
  }

  deleteStory(): void {
    this.api.saveLifeStory('').subscribe({
      next: () => {
        this.story = '';
        this.editedStory = '';
        this.status = '🗑️ Life story deleted.';
        this.isEditing = false;
      },
      error: () => {
        this.status = '❌ Failed to delete life story.';
      }
    });
  }
}

