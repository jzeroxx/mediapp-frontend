import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Paciente } from '../../../_model/paciente';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Signosvitales } from '../../../_model/signosvitales';
import * as moment from 'moment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignosvitalesService } from '../../../_service/signosvitales.service';
import { MatDialog } from '@angular/material/dialog';
import { PacienteDialogComponent } from '../paciente-dialog/paciente-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signosvitales-edicion',
  templateUrl: './signosvitales-edicion.component.html',
  styleUrls: ['./signosvitales-edicion.component.css']
})
export class SignosvitalesEdicionComponent implements OnInit {

  form: FormGroup;
  idSignosVitales : number;
  pacientes: Paciente[];
  fechaSeleccionada: Date = new Date();
  edicion: boolean;

  maxFecha: Date = new Date();
  //utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();

  pacientesFiltrados$: Observable<Paciente[]>;


  constructor(
    private pacienteService : PacienteService,
    private signosVitalesServices: SignosvitalesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idSignosVitales': new FormControl(0),
      'paciente' : this.myControlPaciente,
      'fecha' : new FormControl(new Date()),
      'temperatura' : new FormControl(''),
      'pulso' : new FormControl(''),
      'ritmoCardiaco' : new FormControl('')
    });

    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.pacientes = data;
    });

    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.listarPacientes();
    //agrego el evento change al control paciente y filtro los pacientes
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    //manejo de ruta para edición
    this.route.params.subscribe((data: Params) => {
      this.idSignosVitales = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

  }

  filtrarPacientes(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
      //EMPTY de RxJS
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }


  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  operar(){
    let signosVitales = new Signosvitales();
    signosVitales.idSignosVitales = this.form.value['idSignosVitales'];
    signosVitales.paciente = this.form.value['paciente'];
    signosVitales.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signosVitales.ritmoCardiaco = this.form.value['ritmoCardiaco'];
    signosVitales.pulso = this.form.value['pulso'];
    signosVitales.temperatura = this.form.value['temperatura'];

    if(this.edicion){
      this.signosVitalesServices.modificar(signosVitales).pipe(switchMap(()=>{
        return this.signosVitalesServices.listar();
      })).subscribe(data =>{
        this.signosVitalesServices.setSignosVitalesCambio(data);
        this.signosVitalesServices.setMensajeCambio('SE MODIFICO');
      });
    }else{

      this.signosVitalesServices.registrar(signosVitales).pipe(switchMap(()=>{
          return this.signosVitalesServices.listar();
        })).subscribe(data =>{
          this.signosVitalesServices.setSignosVitalesCambio(data);
          this.signosVitalesServices.setMensajeCambio('SE REGISTRO');
        });
    }

    this.router.navigate(['pages/signos-vitales']);
  }

  initForm() {
    if (this.edicion) {
      this.signosVitalesServices.listarPorId(this.idSignosVitales).subscribe(data => {
        this.form = new FormGroup({
          'idSignosVitales': new FormControl(data.idSignosVitales),
          'paciente' : new FormControl(data.paciente),
          'fecha' : new FormControl(data.fecha),
          'temperatura' : new FormControl(data.temperatura),
          'pulso' : new FormControl(data.pulso),
          'ritmoCardiaco' : new FormControl(data.ritmoCardiaco)
        });
      });
    }
  }

  agregarPaciente(){
    this.dialog.open(PacienteDialogComponent,{
      data: {
        "isPacienteModal" : true
      },
      width: '450px'
    });
  }

}
