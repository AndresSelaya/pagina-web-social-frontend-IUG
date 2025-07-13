export interface PersonType {
    personTypeId: number;
    companyId: number;
    personTypeName: string;
    version: number;
}

export interface CreatePersonTypeRequest {
    companyId: number;
    personTypeName: string;
    version: number;
}

export interface UpdatePersonTypeRequest {
    personTypeId: number;
    companyId: number;
    personTypeName: string;
    version: number;
}