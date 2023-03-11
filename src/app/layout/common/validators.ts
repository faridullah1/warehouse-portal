import { FormGroup } from '@angular/forms';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function confirmedValidator(controlName: string, matchingControlName: string) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (formGroup: FormGroup) =>
	{
		const control = formGroup.controls[controlName];
		const matchingControl = formGroup.controls[matchingControlName];

		if ( matchingControl.errors && !matchingControl.errors['confirmedValidator']) {return;}

		if (control.value !== matchingControl.value) {
			matchingControl.setErrors({ confirmedValidator: true });
		}
		else {
			matchingControl.setErrors(null);
		}
    };
}
