import { Validation } from '@/presentation/protocols/validation';

export class ValidationStub implements Validation {
  erroMessage: string;

  validate(fildName: string, fildValue: string): string {
    return this.erroMessage;
  }
}
