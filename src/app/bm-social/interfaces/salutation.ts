export interface Salutation {
    salutationId: number;
    addressTextId: number;
    companyId: number;
    letterTextId: number;
    salutationLabel: string;
    version: number;
}

export interface CreateSalutationRequest {
    addressTextId: number;
    companyId: number;
    letterTextId: number;
    salutationLabel: string;
    version: number;
}

export interface UpdateSalutationRequest {
    salutationId: number;
    addressTextId: number;
    companyId: number;
    letterTextId: number;
    salutationLabel: string;
    version: number;
}