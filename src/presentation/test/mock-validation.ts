import { Validation } from '@/presentation/protocols/validation';

export class ValidationSpy implements Validation {
  erroMessage: string;
  fildName: string;
  fildValue: string;

  validate(fildName: string, fildValue: string): string {
    this.fildName = fildName;
    this.fildValue = fildValue;
    return this.erroMessage;
  }
}
