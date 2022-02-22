import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PatientModel } from '../models/PatientModel';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  constructor(private service: DataService) {}
  patientArr$: PatientModel[] = [];
  selectedPatient: PatientModel = new PatientModel();

  ngOnInit(): void {
    this.getPatients();
  }
  

  getPatients() {
    this.service.getPatients().subscribe((data: PatientModel[]) => {
      console.log(data);
      this.patientArr$ = data;
    });
  }
  selectPatient(selected: PatientModel) {
    console.log('clicked Patient' + selected.id);
    this.selectedPatient = selected;
  }
  onPatientModified(hidePatient: boolean) {
    console.log('Patient modified ' + hidePatient);
    if (hidePatient) {
      this.selectedPatient = new PatientModel();
    }
    this.getPatients();
  }
  createPatient() {
    var newPatient: PatientModel = new PatientModel();
    this.service.addPatient(newPatient).subscribe((patient) => {
      console.log('Patient created');
      this.onPatientModified(true);
    });
  }
}
