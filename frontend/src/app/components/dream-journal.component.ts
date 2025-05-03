
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-dream-journal',
  templateUrl: './dream-journal.component.html'
})
export class DreamJournalComponent {
  dreamText = '';
  result: string | null = null;
  questions: string[] = [];
  answers: string[] = [];
  showSuccessMessage = false;

  clarificationStage = false;
  clarificationQuestions: string[] = [];
  clarificationAnswers: string[] = [];
  clarifiedDream = '';
  userRating = 0;
  rating = false;


  constructor(private api: ApiService, private loaderService: LoaderService) {}
  

  submitDream() {
    this.loaderService.show();
  
    this.result = '';
    this.questions = [];
    this.answers = [];
    this.clarificationQuestions = [];
    this.clarificationAnswers = [];
    this.clarificationStage = false;
 
    this.api.clarifyDream(this.dreamText).subscribe(res => {
      if (res.questions.length > 0) {
        this.clarificationStage = true;
        this.clarificationQuestions = res.questions;
        this.clarificationAnswers = new Array(res.questions.length).fill('');
        this.loaderService.hide();
      } else {
        this.dreamText = res.clarified || this.dreamText;;
        this.sendToInterpreter();
      }
    }, err => {
      this.result = 'Error clarifying dream.';
      this.loaderService.hide();
    });
  }
  
  submitClarifications() {
    this.loaderService.show();
    const combined = this.clarificationAnswers.join(' ');
    this.dreamText += ' ' + combined; // Simple merge
    this.clarificationStage = false;
    this.sendToInterpreter();
  }
  

  submitRating() {
  this.api.sendRating({ dream: this.dreamText, rating: this.userRating }).subscribe({
    next: () => {
      this.rating = true;
      alert("Thanks for your feedback!")},
    error: () => alert("Failed to send feedback ❌")
  });
}

  sendToInterpreter() {
    this.api.interpretDream({ dream: this.dreamText }).subscribe(res => {
      this.result = res.interpretation;
      this.questions = res.questions || [];
      this.answers = this.questions.map(() => '');
      this.loaderService.hide();
    }, err => {
      this.result = 'Error interpreting dream.';
      this.loaderService.hide();
    });
  }
  

  submitFollowUps() {
  this.loaderService.show();
  const responses = this.questions.map((q, i) => ({
    question: q,
    answer: this.answers[i]
  }));

  this.api.submitFollowUps(responses).subscribe({
    next: () => { 
      this.showSuccessMessage = true;
      },
    error: () => alert("Failed to submit answers ❌")
  });
}

reset() {
  this.dreamText = '';
  this.result = '';
  this.questions = [];
  this.answers = [];
  this.showSuccessMessage = false;
}

}
