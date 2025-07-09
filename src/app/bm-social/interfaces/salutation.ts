export interface Salutation {
    salutationId: number;
    companyId: number;
    salutationText: string;
    version: number;
}

export interface CreateSalutationRequest {
    companyId: number;
    salutationText: string;
    version: number;
}

export interface UpdateSalutationRequest {
    salutationId: number;
    companyId: number;
    salutationText: string;
    version: number;
}