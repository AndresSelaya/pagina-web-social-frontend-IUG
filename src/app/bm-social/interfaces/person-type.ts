export interface PersonType {
    personTypeId: number;
    companyId: number;
    personTypeName: string;
    version: number;
}

export interface CreatePersonTypeRequest {
    personTypeName: string;
    version: number;
}

export interface UpdatePersonTypeRequest {
    personTypeId: number;
    personTypeName: string;
    version: number;
}