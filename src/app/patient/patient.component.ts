import { DataService } from '../data.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import { PatientModel } from '../models/PatientModel';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit, OnChanges {
  
  //Input parameter from patient list, which patient details should be displayed
  @Input()
  id: string = '';

  //Notify the parent View to refresh the list
  @Output()
  patientModified = new EventEmitter<boolean>();

    //Das Datenmodell für die Anzeige
  patient: PatientModel = new PatientModel();

    //Die Formulardaten, das wird auch im html verwendet
  public patientForm: FormGroup = this.createPatientForm();

  //FormBuilder wird verwendet, um einfach Formulare für die Benutzereingabe zu bauen
  constructor(private service: DataService,private formBuilder: FormBuilder) 
  {
    
    //this.createPatientForm();
  }

  //Lifecycle Hooks
  ngOnInit(): void {
    this.getPatient();
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.getPatient();
  }


  //DataService Aufrufe
  getPatient() {
    this.service.getPatientDetail(this.id).subscribe((data: PatientModel) => {
      console.log(data);
      this.patient = data;
      this.updatePatientForm();
    });
  }
  deletePatient() {
    this.service.deletePatient(this.patient.id!)
    //! => Promise, that it will not be null
    .subscribe((x) => this.patientModified.emit(true));
  }
  updatePatient() {
    var newPatient: PatientModel = this.patient;
    this.service.updatePatient(newPatient).subscribe((patient) => {
      console.log('Patient updated');
      this.patient = patient;
      this.patientModified.emit(false);
    });
  }
  //Formularfunktionen

    //Die Formularstruktur erstellen
  createPatientForm() :FormGroup{
    return this.formBuilder.group({
      active: [""],
      gender: ["unknown"],
      deceasedBoolean: [""],
      deceasedDateTime: [""],
      birthDate: [""],
      name: this.formBuilder.array([]),
    });
  }

  get namesArray() {
    return this.patientForm.get("name") as FormArray;
  }
  set namesArray(namesArray: FormArray) {
    this.patientForm.controls.name = namesArray;
  }

  createName(): FormGroup {
    return this.formBuilder.group({
      id: [""],
      use: ["official"],
      text: [""],
      family: [""],
    });
  }
  //Wenn ein Patient vom Server geladen wurde, sollen die Patientendaten in das Formular übernommen werden
  updatePatientForm() {
    this.patientForm.controls.active.setValue(this.patient.active);
    this.patientForm.controls.gender.setValue(this.patient.gender);
    this.patientForm.controls.deceasedDateTime.setValue(this.patient.deceasedDateTime);
    this.patientForm.controls.deceasedBoolean.setValue(this.patient.deceasedBoolean);
    this.patientForm.controls.birthDate.setValue(this.patient.birthDate);

    this.clearFormArray(this.namesArray);
    
    this.patient.name?.forEach((name) => {
      console.log("push name" + name.family);
      this.namesArray.push(
        this.formBuilder.group({
          id: [name.id],
          text: [name.text],
          use: [name.use],
          family: [name.family],
        })
      );
    });
  }

    //Formular wird abgeschickt
  onSubmitUpdate() {
    console.log("Update from form data" + this.patientForm.value);
    this.patient.active = this.patientForm.value.active;
    this.patient.gender = this.patientForm.value.gender;
    this.patient.birthDate = this.patientForm.value.birthDate;
    this.patient.deceasedDateTime = this.patientForm.value.deceasedDateTime;
    this.patient.deceasedBoolean = this.patientForm.value.deceasedBoolean;
    this.patient.name = this.patientForm.value.name;
    this.updatePatient();
  }

  //Einen Namen hinzufügen
  public addName() {
    this.namesArray.push(this.createName());
  }
 

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

}
