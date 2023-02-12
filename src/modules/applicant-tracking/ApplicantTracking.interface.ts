export interface Applicant {
	NationalId: string;
	FullName: string;
	Gender: 'male' | 'female';
	BirthDate?: Date;
	Address?: string;
	Phone: string;
	Email?: string;
	AppliedPosition: string;
	AppliedDate: Date;
	AskingSalary: number;
}

// NOTE: This changes together with Applicant
export const APPLICANT_COLUMNS = [
	'NationalId',
	'FullName',
	'Gender',
	'BirthDate',
	'Address',
	'Phone',
	'Email',
	'AppliedPosition',
	'AppliedDate',
	'AskingSalary',
];
