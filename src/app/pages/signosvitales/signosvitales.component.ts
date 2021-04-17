import { Component, OnInit, ViewChild } from '@angular/core';
import { Signosvitales } from 'src/app/_model/signosvitales';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { SignosvitalesService } from 'src/app/_service/signosvitales.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SignosVitalesDTO } from '../../_dto/signosVitalesDTO';

@Component({
  selector: 'app-signosvitales',
  templateUrl: './signosvitales.component.html',
  styleUrls: ['./signosvitales.component.css']
})
export class SignosvitalesComponent implements OnInit {

  displayedColumns = ['idSignosVitales', 'nombresCompletos', 'fecha', 'temperatura', 'pulso','ritmoCardiaco', 'acciones'];
  dataSource: MatTableDataSource<SignosVitalesDTO>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number = 0;

  constructor(
    private snackBar : MatSnackBar,
    private signosvitalesService: SignosvitalesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.signosvitalesService.getSignosVitalesCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosvitalesService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.signosvitalesService.listarPageable(0,10).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(this.convertToSignosVitalesDTO(data.content));
      this.dataSource.sort = this.sort;
    })
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Signosvitales[]) {
    this.dataSource = new MatTableDataSource(this.convertToSignosVitalesDTO(data));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.signosvitalesService.eliminar(id).pipe(switchMap(() => {
      return this.signosvitalesService.listar();
    })).subscribe(data => {
      this.signosvitalesService.setSignosVitalesCambio(data);
      this.signosvitalesService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any){
    this.signosvitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(this.convertToSignosVitalesDTO(data.content));
      this.dataSource.sort = this.sort;
    });
  }

  convertToSignosVitalesDTO(data: Signosvitales[]){

    let dataDTO: SignosVitalesDTO[] = [];

    console.log("dataDTO: "+dataDTO);

    data.forEach(t=>{
      let dto = new SignosVitalesDTO();
      dto.idSignosVitales = t.idSignosVitales;
      dto.nombresCompletos = t.paciente.nombres+ ' '+ t.paciente.apellidos;
      dto.fecha = t.fecha;
      dto.pulso = t.pulso;
      dto.ritmoCardiaco = t.ritmoCardiaco;
      dto.temperatura = t.temperatura;
      dataDTO.push(dto);
    });

    return dataDTO;
  }
}
