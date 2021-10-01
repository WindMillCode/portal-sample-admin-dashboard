

// remember on key down on the form to prevent enter submitting the form
// 

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  template:`
  <div>
    <h2 class="western" align="center">Contact Development Team</h2>
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" onkeydown="return event.key != 'Enter';">
        <div align="center">
        <p>Email: <input type="text" size="40" formControlName="email" /></p>
        </div>
        <div align="center">
        <p>Subject: <input type="text" size="40" formControlName="subject" /></p>
        </div>
        <p align="center">Message:</p>
        <div align="center">
        <p>
            <textarea rows="12" cols="50" style="width: 3.48in; height: 2.02in" formControlName="message"> </textarea>
        </p>
        </div>
        <div>
        <p align="center"><button class="button" type="submit" ng-click="onSubmit()" [disabled]="!contactForm.valid">Send</button></p>
        </div>
    </form>
    <p align="center" style="margin-bottom: 0in">{{ errorMessage }}</p>
  </div>
  `
})
export class ContactComponent {
  contactForm = new FormGroup({
    email: new FormControl('', [Validators.email]),
    subject: new FormControl(''),
    message: new FormControl('', [Validators.required]),
  });
  success = false;
  errorMessage = '';
  constructor(private contactService: ContactService) {}

  onSubmit(): void {
    const email = this.contactForm.value.email;
    const subject = this.contactForm.value.subject;
    const message = this.contactForm.value.message;
    this.contactService.sendMessage({ email, subject, message }).subscribe(
      () => (this.success = true),
      response => this.processError(response)
    );
    this.clear();
  }

  private clear(): void {
    this.contactForm.setValue({
      email: '',
      subject: '',
      message: '',
    });
  }

  private processError(response: HttpErrorResponse): void {
    if (Math.trunc(response.status / 100) === 2) {
      this.errorMessage = '';
    } else {
      this.errorMessage = `${response.status}: ${response.statusText}`;
    }
  }
}
