import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Limit, clearErrors, detectChange, emailValidator, usernameValidator, validateFields } from 'src/app/utilities/functions';
import { API_PATHS, API_SERVER } from 'src/constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(
    private router: Router,
    private restApi: RestApiService,
    private Swal: SweetAlertService
  ) { }

  errors: any = {
    username: '',
    email: ''
  }

  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, usernameValidator()]),
    email: new FormControl('', [Validators.required, emailValidator()])
  })

  ngOnInit() {
    console.log('');
  }
  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)


  sendData() {
    const validation = validateFields(this.formGroup, this.errors)
    if(!validation.valid) { return }
    this.Swal.fire({
      title: '¡Atención!',
      text: '¿Desea enviar los datos?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ok, Enviar'
    }).then((action) => {
      if(action.isConfirmed && validation.valid) {
        this.restApi.postNotToken(API_PATHS.passwordReset, this.formGroup.value).subscribe((response) => {
          if(response.error) {
            this.Swal.fire({
              title: '¡Error!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'Ok, Entiendo'
            })
          }
          if(response.done) {
            this.Swal.fire({
              title: 'Ok',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'Ok, list'
            }).then((action) => {
              this.formGroup.reset()
              clearErrors(this.errors)
            })
          }
        })
      }
    })

  }

  goBack(){
    this.router.navigate(['login'])
  }
}
