import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailRegexValidator(
    control: AbstractControl
): ValidationErrors | null {
    const email = control.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return null;
    }

    return emailRegex.test(email.trim()) ? null : { emailRegex: true };
}
