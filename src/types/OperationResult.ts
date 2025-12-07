export interface OperationResult<T> {
  isSuccess: boolean;
  errors: string[];
  data: T | null;
}
