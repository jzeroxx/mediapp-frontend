import { Component, OnInit, ViewChild } from '@angular/core';
import { Signosvitales } from 'src/app/_model/signosvitales';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { SignosvitalesService } from 'src/app/_service/signosvitales.service';

@Component({
  selector: 'app-signosvitales',
  templateUrl: './signosvitales.component.html',
  styleUrls: ['./signosvitales.component.css']
})
export class SignosvitalesComponent implements OnInit {

  displayedColumns = ['idSignosVitales', 'paciente', 'temperatura', 'pulso','ritmoCardiaco', 'acciones'];
  dataSource: MatTableDataSource<Signosvitales>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number = 0;

  constructor(
    private snackBar : MatSnackBar,
    private signosvitalesService: SignosvitalesService
  ) { }

  ngOnInit(): void {
    /*
    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.pacienteService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });*/

    this.signosvitalesService.listarPageable(0,10).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
  }

  filtrar(valor: string) {
    //this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Signosvitales[]) {
    /*this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/
  }

  eliminar(id: number) {
    /*this.pacienteService.eliminar(id).pipe(switchMap(() => {
      return this.pacienteService.listar();
    })).subscribe(data => {
      this.pacienteService.setPacienteCambio(data);
      this.pacienteService.setMensajeCambio('SE ELIMINO');
    });*/
  }

  mostrarMas(e: any){
    /*this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });*/
  }
}
