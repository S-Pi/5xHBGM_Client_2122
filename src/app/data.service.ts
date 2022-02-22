import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientModel } from './models/PatientModel';
import { catchError } from 'rxjs/operators';

const patientUrl: string = 'http://localhost:8080/api/patient/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  public getPatients(): Observable<PatientModel[]> {
    console.log('getPatients called');
    return this.http
      .get<PatientModel[]>(patientUrl)
      .pipe(catchError(this.handleError('getPatients', [])));
  }
  public getPatientDetail(id: string): Observable<PatientModel> {
    return this.http
      .get<PatientModel>(patientUrl + id)
      .pipe(catchError(this.handleError('getPatientDetail',new PatientModel())));
  }

  public deletePatient (id: string): Observable<{}> {
    return this.http.delete(patientUrl+id, httpOptions)
    .pipe(
    catchError(this.handleError('delete Patient',new PatientModel()))
    );
    }

    public addPatient (patient: PatientModel): Observable<PatientModel> {
      return this.http.post<PatientModel>(patientUrl, patient, httpOptions)
      .pipe(
      catchError(this.handleError('addPatient', patient))
      );
      }
      public updatePatient (patient: PatientModel): Observable<PatientModel> {
        return this.http.put<PatientModel>(patientUrl+patient.id, patient,
        httpOptions)
        .pipe(
        catchError(this.handleError('updatePatient', patient))
        );
        }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
