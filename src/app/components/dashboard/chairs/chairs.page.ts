import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-chairs',
  templateUrl: './chairs.page.html',
  styleUrls: ['./chairs.page.scss'],
})
export class ChairsPage {
  constructor() { }
  chair: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.saveChair()
      }
    },
  ];


  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {

  }

  onWillDismiss(event: any) {
    const modal = event.target
  }

  saveChair() {
    console.log('dentro');

  }

  detectChange($event: any, name: string) {
    const value = ($event.target as HTMLInputElement).value
    let cleanText = value.replace(/\s/g, '')
    const isEmpty = cleanText === ''


  }
}
