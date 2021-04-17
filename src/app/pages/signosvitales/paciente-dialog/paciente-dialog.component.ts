import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignosvitalesEdicionComponent } from '../signosvitales-edicion/signosvitales-edicion.component';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {

  isPacienteDialog: boolean;
  refDialog: MatDialogRef<SignosvitalesEdicionComponent>;

  constructor(
    //solo para llamadas a paciente nuevo modal
    @Inject(MAT_DIALOG_DATA) public data:{ isPacienteModal: boolean},
    private dialogRef: MatDialogRef<SignosvitalesEdicionComponent>
    //->fin modal
  ) {
    this.isPacienteDialog = this.data.isPacienteModal;
    this.refDialog = this.dialogRef;
   }

  ngOnInit(): void {
  }

}
