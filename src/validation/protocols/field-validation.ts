export interface FieldValidation {
  field: string
  valdiate (value: string): Error
}
