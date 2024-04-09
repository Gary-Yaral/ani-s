import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonCheckbox, IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { Limit, clearErrors, detectChange, getFormData, validateFields } from 'src/app/utilities/functions';
import { formatTime, generateHours, generateLabel, tranformTimeToHour } from 'src/app/utilities/generateTimes';
import { API_PATHS } from 'src/constants';
import { fields, hours, images, m2, money, theads } from './required-data';
import { TIME_TYPES } from './constants-required';

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
  @ViewChild('formToSend') formRef!: ElementRef
  // Checkbox para reservar todo el dia
  @ViewChild('checkbox') checkbox!: IonCheckbox

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.reservations
  // Path para cargar las imagenes
  pathimages: string = API_PATHS.images
  // Cabeceras de la tabla
  theads: string[] = theads
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = fields
  money: string[] = money
  m2: string[] = m2
  hours: string[] = hours
  images: string[] = images

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
  // TIpos de reservacion para seleccionar
  reservationsTypes: any = []
  // Detectar si reservó todo el dia
  isSelectedAllDay: boolean = false
  // Permite mostrar u ocultar las opciones de las reservaciiones
  roomHasBeenSelected: boolean = false
  // mensaje que aparece cuando se selecciona por dia
  msgPerDay: string = ''
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    roomId: '',
    packageId: '',
    initialTime: '',
    finalTime: '',
    timeTypeId: '',
    date: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    roomId: new FormControl('', [Validators.required]),
    packageId: new FormControl(''),
    date: new FormControl('', Validators.required),
    initialTime: new FormControl('', [Validators.required]),
    finalTime: new FormControl('', [Validators.required]),
    timeTypeId: new FormControl('', [Validators.required]),
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

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)


  ngOnInit() {
    this.initialsTime = generateHours(0, 23.5)
    this.finalsTime = generateHours(0.5, 24)
    this.loadLocals()
    this.loadPackages()
    this.loadReservationsTypes()
  }

  cancel() {
    if(this.checkbox) {
      this.checkbox.checked = false
      this.isSelectedAllDay = false
    }
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    const modal = event.target
    this.formGroup.reset()
  }

  saveRegister() {
    let optionals = ['packageId']
    let validation = validateFields(this.formGroup, this.errors, optionals)
    if(validation.valid && this.validateTimes()){
      this.restApi.post(API_PATHS.reservations, this.formGroup.value).subscribe((response: any) => {
        if(response.error) {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `${response.msg}`
          })
        }
        if(response.done) {
          clearErrors(this.errors)
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.msg
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
    let optionals = ['packageId']
    let validation = validateFields(this.formGroup, this.errors, optionals)
    if(validation.valid && this.validateTimes()){
      this.restApi.put(API_PATHS.reservations + this.selectedId, this.formGroup.value).subscribe((response: any) => {
        console.log(response)

        if(response.error) {
          this.Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.msg
          })
        }
        if(response.done) {
          this.Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: response.msg
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
      this.errors.response = 'Complete todos los campos requeridos'
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

  showUpdate(reservation: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = reservation.id
    this.roomHasBeenSelected = true
    let propValues = {
      roomId: reservation.roomId,
      packageId: reservation.packageId,
      date: reservation.date,
      initialTime: formatTime(reservation.initialTime, 'h', 'm'),
      finalTime: formatTime(reservation.finalTime, 'h', 'm'),
      timeTypeId: reservation.timeTypeId
    }
    this.formGroup.setValue(propValues)
    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateRegister()
    // Definimos la acción que realizará el formulario
    this.formAction = FORM_ACTIONS.UPDATE
    // Mostramos el formulario
    this.modal.present()
  }

  async showDelete(reservation: any) {
    this.selectedId = reservation.id
    // Creamos la modal que mostraremos
    await this.alert.getDeleteAlert(() =>{
      this.deleteRegister()
    })
  }

  deleteRegister() {
    this.restApi.delete(API_PATHS.reservations + this.selectedId).subscribe((response:any) => {
      console.log(response);

      if(response.error) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: `${response.msg}`
        })
      }
      if(response.done) {
        this.Swal.fire({
          title: 'Ok',
          icon: 'success',
          text: response.msg
        })
        // Hacemos que la tabla se refresque notificando que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
    })
  }

  checking($event: any) {
    this.isSelectedAllDay = $event.target.checked
    this.resetTimeFields()
    // Asignamos horario del todo el dia
    if(this.isSelectedAllDay) {
      this.setAllDay()
    }
  }

  isTimeValid($event: any) {
    let id = $event.target.value
    console.log(id)
    const room = this.rooms.find((room: any) => room.id === parseInt(id))
    console.log(room);


  }

  resetTimeFields() {
    this.formGroup.get('initialTime')?.reset()
    this.formGroup.get('finalTime')?.reset()
    this.errors.initialTime = ''
    this.errors.finalTime = ''
  }

  setAllDay() {
    this.formGroup.get('initialTime')?.setValue('00:00')
    this.formGroup.get('finalTime')?.setValue('23:30')
  }

  loadLocals() {
    this.restApi.get(API_PATHS.rooms + 'list').subscribe((response) => {
      console.log(response)

      if(response.data) {
        this.rooms = response.data
      }
    })
  }

  validateTimes() {
    // Si ha escogido todo el dia no hacemos la validacion y retornamos true
    if (this.isSelectedAllDay) { return true }
    // Si ha selecciona por horas, entonces validamos que cumpla con el tiempo minimo de reservacion
    let initial = this.formGroup.get('initialTime')?.value
    let final = this.formGroup.get('finalTime')?.value
    let roomId = this.formGroup.get('roomId')?.value
    let selectedRoom  = this.rooms.find((room: any) => room.id === parseInt(roomId))
    let minTimeForRent = generateLabel(selectedRoom.minTimeRent)
    initial = tranformTimeToHour(initial)
    final = tranformTimeToHour(final)
    const reservedTime = final - initial
    let isValid = reservedTime >= selectedRoom.minTimeRent
    if(!isValid) {
      this.Swal.fire({
        title: '¡Atención!',
        icon: 'warning',
        confirmButtonText: 'Ok. Entiendo',
        text: `El tiempo minimo de reserva para el local ${selectedRoom.name} es de: ${minTimeForRent}`
      })
    }
    return isValid
  }

  loadPackages() {
    this.restApi.get(API_PATHS.packages+ 'list').subscribe((response) => {
      if(response.data) {
        this.packages = response.data
      }
    })
  }

  loadReservationsTypes() {
    this.restApi.get(API_PATHS.reservations+ 'types').subscribe((response) => {
      if(response.data) {
        this.reservationsTypes = response.data
      }
    })
  }

  showOptions() {
    let value = this.formGroup.get('timeTypeId')?.value
    if(value === TIME_TYPES.PER_HOURS) {
      this.formGroup.get('initialTime')?.reset()
      this.formGroup.get('finalTime')?.reset()
      this.errors.initialTime = ''
      this.errors.finalTime = ''
      this.msgPerDay = ''
      this.isSelectedAllDay = false
    }
    if(value === TIME_TYPES.PER_DAY) {
      this.formGroup.get('initialTime')?.setValue(this.initialsTime[0].hour)
      this.formGroup.get('finalTime')?.setValue(this.finalsTime[this.finalsTime.length - 1].hour)
      this.errors.initialTime = ''
      this.errors.finalTime = ''
      this.msgPerDay = 'EXCELENTE: Se reservará todo el dia'
      this.isSelectedAllDay = true
    }
  }

  perHoursIsSelected() {
    let value = this.formGroup.get('timeTypeId')?.value
    return value === TIME_TYPES.PER_HOURS
  }

  showReservationTypes() {
    let roomId = this.formGroup.get('roomId')?.value
    this.roomHasBeenSelected = !isNaN(roomId)
    if(!this.roomHasBeenSelected) {
      // Resetamos los campos y los mensajes de error
      this.formGroup.get('initialTime')?.reset()
      this.formGroup.get('finalTime')?.reset()
      this.formGroup.get('timeTypeId')?.reset()
      this.errors.initialTime = ''
      this.errors.finalTime = ''
      this.errors.roomId = ''
    }
  }
}





