import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { Limit, clearErrors, detectChange, getFormData, validateFields } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit{
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService
  ) {}

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.payments
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Nombre', 'Apellido', 'Fecha Reserva', 'Fecha Pago', 'Total Pago', 'Estado', 'Imagen', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = [
    'index',
    'Reservation.UserRole.User.name',
    'Reservation.UserRole.User.lastname',
    'Reservation.date',
    'date',
    'total',
    'PaymentStatus.status',
    'image'
  ]
  // Campos de la consulta que se renderizaran como imagenes
  images: string[] = ['image']
  // campo de moneda o dinero
  money: string[] = ['total']
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Titulo de la sección
  sectionTitle: string = 'Actualizar'
  // Action que hará el formulario
  formAction: string = 'Nueva'
  // Id seleccionado para editar
  selectedId!: number
  // Texto del modal para ejecutar las acciones de crear o actualizar
  modalBtnHeader: string = '¿Deseas guardar el pago?'
  // Imagen que guardaras al enviar el formulario
  selectedFile!: File
  // Tipos de estado de pago
  paymentStatuses: any = []
  // Mensajes de error de formulario
  formData: FormData = new FormData()
  errors: any = {
    type: '',
    price: '',
    image: '',
    description:'',
    result: ''
  }
  // Propiedades del formulario
  formGroup: FormGroup = new FormGroup({
    paymentStatusId: new FormControl('', [Validators.required])
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

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)


  // Ventana modal de Si o No
  @ViewChild('modal') modal!: IonModal;
  ngOnInit(){
    this.loadStatuses()
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    const modal = event.target
  }

  loadStatuses() {
    this.restApi.get(API_PATHS.payments + 'statuses').subscribe((response) => {
      if(response.data) {
        this.paymentStatuses = response.data
      }
    })
  }

  updateStatus() {
    const isValid = validateFields(this.formGroup, this.errors)
    if(isValid.valid) {
      this.restApi.put(API_PATHS.payments + 'status/'+ this.selectedId, this.formGroup.value).subscribe((response: any) => {
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
      this.errors.result = 'Complete todos los campos requeridos'
    }
  }

  showUpdate(payment: any) {
    // Limpiamos el formulario
    this.formGroup.reset()
    // Limpiamos los errores
    clearErrors(this.errors)
    // Definimos el id que fue seleccionado
    this.selectedId = payment.id
    // Rellenamos el formulario con los datos del registro que actualizaremos
    this.formGroup.setValue({
      paymentStatusId: payment.paymentStatusId
    })

    this.modalBtnHeader = '¿Deseas guardar los cambios?'
    // Actualizamos el método que ejecutará el boton de aceptar
    this.alertButtons[1].handler = () => this.updateStatus()
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
    this.restApi.delete(API_PATHS.chairs + this.selectedId).subscribe((response:any) => {
      if(response.error) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: response.msg
        })
      } else {
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
}




