export class ContactPersonStateService {
  private contactPersons: any[] = [];

  getContactPersons(): any[] {
    return this.contactPersons;
  }

  addContactPerson(contactPerson: any): void {
    this.contactPersons.push(contactPerson);
  }

  updateContactPerson(index: number, contactPerson: any): void {
    if (index >= 0 && index < this.contactPersons.length) {
      this.contactPersons[index] = contactPerson;
    }
  }

  deleteContactPerson(index: number): void {
    if (index >= 0 && index < this.contactPersons.length) {
      this.contactPersons.splice(index, 1);
    }
  }
}