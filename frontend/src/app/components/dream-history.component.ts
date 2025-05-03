import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';


@Component({
  selector: 'app-dream-history',
  templateUrl: './dream-history.component.html',
  styleUrls: ['./dream-history.component.css']
})
export class DreamHistoryComponent implements OnInit {
  dreams: any[] = [];
  followups: any[] = [];
  groupedFollowups: any[] = [];

  showAllDreams = false;
  showAllFollowups = false;

  editingId: string | null = null;
  editingFollowupId: number | null = null;

  editedFollowups: { [id: number]: string } = {};

  constructor(private api: ApiService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.loadHistory();
  }

  loadHistory(): void {
    this.api.getDreamHistory().subscribe(data => {
      this.dreams = data.dreams;
      this.followups = data.followups;
      console.log('data', data);
      this.dreams.forEach(d => {
        d.editText = d.dream;
        d.interpretationEdit = d.interpretation;
      });

      this.groupFollowups();

    });
  }

  groupFollowups() {
    const grouped: any = {};
    for (const f of this.followups) {
      if (!grouped[f.timestamp]) {
        grouped[f.timestamp] = [];
      }

      grouped[f.timestamp].push(f);
    }
    this.groupedFollowups = Object.keys(grouped).map(timestamp => ({
      timestamp,
      followups: grouped[timestamp]
    }));
    console.log('group', this.groupedFollowups);
  }

  startEdit(dream: any) {
    this.editingId = dream.id;
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(dream: any) {
    this.api.updateDream(dream.id, {
      dream: dream.editText,
      interpretation: dream.interpretationEdit
    }).subscribe({
      next: () => {
        dream.dream = dream.editText;
        dream.interpretation = dream.interpretationEdit;
        this.editingId = null;
      },
      error: () => alert("❌ Failed to update dream.")
    });
  }

  deleteDream(id: number) {
    if (confirm("Are you sure you want to delete this dream?")) {
      this.api.deleteDream(id).subscribe({
        next: () => {
          this.dreams = this.dreams.filter(d => d.id !== id);
        },
        error: () => alert("❌ Failed to delete dream.")
      });
    }
  }


  startEditFollowup(f: any) {
    this.editingFollowupId = f.id;
    this.editedFollowups[f.id] = f.answer;
  }
  
  cancelEditFollowup() {
    this.editingFollowupId = null;
  }
  
  saveFollowupEdit(f: any) {
    const edited = this.editedFollowups[f.id]?.trim();
    if (!edited) return;
  
    this.api.updateFollowup(f.id, edited).subscribe({
      next: () => {
        f.answer = edited;
        this.editingFollowupId = null;
        this.groupFollowups();
      },
      error: () => alert("❌ Failed to update follow-up.")
    });
  }
  
  deleteFollowup(f: any) {
    if (confirm("Are you sure you want to delete this follow-up?")) {
      this.api.deleteFollowup(f.id).subscribe({
        next: () => {
          this.followups = this.followups.filter(fu => fu.id !== f.id); 
          this.groupFollowups(); 
        },
        error: () => alert("❌ Failed to delete follow-up.")
      });
    }
  }
  
}