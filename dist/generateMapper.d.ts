import { TransformType } from './constants';
export interface FullSchema {
    transformType: TransformType;
    exclude?: string[];
    include?: string[];
    nestedObjKey?: {
        [key: string]: DataSchema;
    };
    nestedArrayKey?: {
        [key: string]: DataSchema;
    };
}
export declare type DataSchema = TransformType | FullSchema;
export declare const generateMapper: (dataSchema: DataSchema) => (data: any) => {};
