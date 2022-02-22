export class PatientModel {
  constructor(
    public id: string = '',
    public resourceType: string = 'Patient',
    public identifier?: Array<Identifier>,
    public name?: Array<HumanName>,
    public telecom?: Array<ContactPoint>,
    public active: boolean = false,
    public gender: string = 'unknown',
    public birthDate: Date = new Date(1000, 1, 1),
    public deceasedBoolean?: boolean,
    public deceasedDateTime?: Date,
    public multipleBirthBoolean?: boolean,
    public multipleBirthInteger?: number
  ) {}
}
export class HumanName {
  constructor(
    public id: string = '',
    public use: string = '',
    public text: string = '',
    public family: string = ''
  ) {}
}
export class Identifier {
  constructor(public value: string = '') {}
}
export class ContactPoint {
  constructor() {}
}
