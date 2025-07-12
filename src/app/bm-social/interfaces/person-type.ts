export interface PersonType {
    personTypeId: number;
    companyId: number;
    name: string;
    version: number;
}

export interface CreatePersonTypeRequest {
    companyId: number;
    name: string;
    version: number;
}

export interface UpdatePersonTypeRequest {
    personTypeId: number;
    companyId: number;
    name: string;
    version: number;
}