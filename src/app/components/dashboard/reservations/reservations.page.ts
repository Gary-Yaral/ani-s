import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { clearErrors, getFormData, validateFields } from 'src/app/utilities/functions';
import { generateHours } from 'src/app/utilities/generateTimes';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit{
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}


  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.reservations
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Tipo', 'Precio', 'Descripción', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'type', 'price', 'description', 'image']
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Reservación'
  // Action que hará el formulario
  formAction: string = 'Nueva'
  // Id seleccionado para editar
  selectedId!: number
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Arreglo de locales
  rooms: any = []
  // Arreglo de paquetes
  packages: any = []
  // Horas de inicio
  initialsTime: any = []
  // Horas para finalizar
  finalsTime: any = []
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    roomId: '',
    packageId: '',
    initalTime: '',
    finalTime: '',
    date: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    roomId: new FormControl('', [Validators.required]),
    packageId: new FormControl('', [Validators.required]),
    date: new FormControl('', Validators.required),
    initalTime: new FormControl('', [Validators.required]),
    finalTime: new FormControl('', [Validators.required]),
  })
  // Propiedades de botonoes de alerta
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {}
    },
  ];

  // Ventana modal de Si o No
  @ViewChild(IonModal) modal!: IonModal;

  ngOnInit() {
    this.initialsTime = generateHours(8, 23.5)
    this.finalsTime = generateHours(8.5, 24)
    this.loadLocals()
    this.loadPackages()
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    const modal = event.target
  }

  loadFile($event: any) {
    if($event.target.files.length > 0) {
      const file = $event.target.files[0]
      this.selectedFile = file
      this.errors['image'] = ''
    }
  }

  saveRegister() {
    if(this.formGroup.invalid){
      // Validamos y mostrarmos mensajes de error
      validateFields(this.formGroup.value, this.errors)
    } else {
      this.restApi.post(API_PATHS.chairs, getFormData(this.formRef)).subscribe((result: any) => {
        if(result.error) {
          this.errors['result'] = result.error
        } else {
          clearErrors(this.errors)
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: result.message
          }).then((value: any) => {
            // Reseteamos el formGroup
            this.formGroup.reset()
            this.cancel()
          })
          // Notificamos que hubo cambios para que se refresque la tabla
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          // Limpiamos los errores de los campos
          clearErrors(this.errors)
        }
      })
    }

  }

  updateRegister() {
    const isValid = validateFields(this.formGroup, this.errors)
    if(isValid.valid) {
      this.restApi.put(API_PATHS.chairs + this.selectedId, getFormData(this.formRef)).subscribe((result: any) => {
        if(result.error) {
          this.errors['result'] = result.error
        } else {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: result.message
          }).then((value: any) => {
            // Reseteamos el formGroup
            this.formGroup.reset()
            this.cancel()
          })

          // Notificamos que hubo cambios para que se refresque la tabla
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.UPDATE})
          // Limpiamos los errores de los campos
          clearErrors(this.errors)
        }
      })
    } else {
      this.errors.result = 'Complete todos los campos requeridos'
    }
  }

  showToAdd() {
    // Asignamos el manejador del evento
    this.alertButtons[1].handler = () => this.saveRegister()
    // Reseteamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos la acción del formulario
    this.formAction = FORM_ACTIONS.ADD
    // Mostramos el formulario
    this.modal.present()
  }

  showUpdate(data: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = data.id
    // Rellenamos el formulario con los datos del registro que actualizaremos
    const keys = Object.keys(this.formGroup.value)
    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Mostramos el formulario
    this.modal.present()
  }

  async showDelete(id: any) {
    this.selectedId =id
    // Creamos la modal que mostraremos
    await this.alert.getDeleteAlert(() =>{
      this.deleteRegister()
    })
  }

  deleteRegister() {
    this.restApi.delete(API_PATHS.chairs + this.selectedId).subscribe((result:any) => {
      if(result.error) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: result.error
        })
      } else {
        this.Swal.fire({
          title: 'Ok',
          icon: 'success',
          text: result.messaje
        })
        // Hacemos que la tabla se refresque notificando que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
    })
  }

  // Detecta cuando se está escribiendo en los campo de texto y verifica los errores
  detectChange($event: any, name: string, type='text') {
    const value = ($event.target as HTMLInputElement).value
    console.log(value);

    const currentErrors = this.formGroup.get(name)?.errors
    if(currentErrors) {
      if(type === 'text') {
        if(currentErrors['required']) {
          this.errors[name] = 'Campo es requerido'
        }
        if(currentErrors['pattern']) {
          this.errors[name] = 'No se permiten espacios al pricipio ni al final, tampoco espacios dobles'
        }
      }

      if(type === 'number') {
        if(currentErrors['required']) {
          this.errors[name] = 'Ingrese un número valido'
        }
      }

      if(currentErrors['pattern'] && type === 'number') {
        this.errors[name] = 'Solo se permiten números positivos enteros o decimales'
      }
    } else {
      this.errors[name] = ''
    }
  }

  loadLocals() {
    this.restApi.get(API_PATHS.rooms + 'list').subscribe((response) => {
      if(response.data) {
        this.rooms = response.data
      }
    })
  }

  loadPackages() {
    this.restApi.get(API_PATHS.packages+ 'list').subscribe((response) => {
      if(response.data) {
        this.packages = response.data
      }
    })
  }
}





