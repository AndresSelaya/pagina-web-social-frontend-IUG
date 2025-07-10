export interface Title {
    titleId: number;
    companyId: number;
    titleText: string;
    version: number;
}

export interface CreateTitleRequest {
    companyId: number;
    titleText: string;
    version: number;
}

export interface UpdateTitleRequest {
    titleId: number;
    companyId: number;
    titleText: string;
    version: number;
}