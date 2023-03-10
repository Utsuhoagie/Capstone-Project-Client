import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
	useConfirmDialogStore,
	useToastStore,
} from '../../../../app/App.store';
import { Button } from '../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../components/atoms/Input/DateTimeInput/DateInput';
import { TimeInput } from '../../../../components/atoms/Input/DateTimeInput/TimeInput';
import { SelectInput } from '../../../../components/atoms/Input/SelectInput';
import { TextInput } from '../../../../components/atoms/Input/TextInput';
import { Employee } from '../../../employee/Employee.interface';
import { useEmployeeStore } from '../../../employee/Employee.store';
import { Applicant } from '../../Applicant.interface';
import { useApplicantStore } from '../../Applicant.store';
import {
	EmployApplicantFormIntermediateValues,
	employApplicantFormSchema,
} from './EmployApplicantForm.form';

export const EmployApplicantForm = () => {
	const navigate = useNavigate();

	const showToast = useToastStore((state) => state.showToast);
	const openConfirmDialog = useConfirmDialogStore(
		(state) => state.openConfirmDialog
	);
	const selectedApplicant = useApplicantStore(
		(state) => state.selectedApplicant
	) as Applicant;

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'applicants/employ',
		async (formData: Employee) => {
			const res = await fetch(
				`https://localhost:5000/api/Applicants/Employ?NationalId=${selectedApplicant.NationalId}`,
				{
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(formData),
				}
			);

			if (res.ok) {
				showToast({ state: 'success' });
			} else {
				showToast({ state: 'error' });
			}
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('applicant');
			},
		}
	);

	const methods = useForm<EmployApplicantFormIntermediateValues>({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
		defaultValues: {
			NationalId: selectedApplicant.NationalId,
			FullName: selectedApplicant.FullName,
			Gender: selectedApplicant.Gender,
			BirthDate: selectedApplicant.BirthDate
				? dayjs(selectedApplicant.BirthDate).toISOString()
				: '',
			Address: selectedApplicant.Address,
			Phone: selectedApplicant.Phone,
			Email: selectedApplicant.Email,
			ExperienceYears: `${selectedApplicant.ExperienceYears}`,
			Position: selectedApplicant.AppliedPosition,
			EmployedDate: dayjs().toISOString(),
			Salary: `${selectedApplicant.AskingSalary}`,
			StartHour: dayjs().hour(9).startOf('hour').toISOString(),
			EndHour: dayjs().hour(18).startOf('hour').toISOString(),
		},
		resolver: zodResolver(employApplicantFormSchema),
	});

	const displayConfigs = useApplicantStore((state) => state.displayConfigs);
	const employeeDisplayConfigs = useEmployeeStore(
		(state) => state.displayConfigs
	);

	const handleSubmit: SubmitHandler<EmployApplicantFormIntermediateValues> = (
		rawData
	) => {
		console.table(rawData);

		const formData: Employee = {
			NationalId: rawData.NationalId,
			FullName: rawData.FullName,
			Gender: rawData.Gender,
			BirthDate: rawData.BirthDate
				? dayjs(rawData.BirthDate).toDate()
				: undefined,
			Address: rawData.Address,
			Phone: rawData.Phone,
			Email: rawData.Email,
			ExperienceYears: parseInt(rawData.ExperienceYears),
			Position: rawData.Position,
			EmployedDate: dayjs(rawData.EmployedDate).toDate(),
			Salary: parseInt(rawData.Salary),
			StartHour: dayjs(rawData.StartHour).hour(),
			EndHour: dayjs(rawData.EndHour).hour(),
		};

		// console.log({ formData });
		openConfirmDialog({
			isClosable: true,
			// title,
			message: 'X??c nh???n tuy???n ???ng vi??n n??y?',
			onConfirm: () => {
				mutation.mutate(formData);
				navigate('/app/applicants');
			},
			onSuccess: () => {
				window.alert('aaaaaa');
			},
		});
	};

	const handleError = (error) => {
		console.table(error);
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Tuy???n ???ng vi??n</h1>
			<FormProvider {...methods}>
				<form
					className='flex flex-col gap-2 p-2'
					onSubmit={methods.handleSubmit(handleSubmit, handleError)}
				>
					<TextInput
						disabled
						required
						name='NationalId'
						placeholder='Nh???p 9 ho???c 12 s???.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						disabled
						required
						name='FullName'
						placeholder='Nh???p h??? t??n ?????y ?????.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<SelectInput
						disabled
						required
						name='Gender'
						width='medium'
						placeholder='Ch???n 1.'
						options={['male', 'female', 'other']}
						displayConfigs={displayConfigs}
					/>

					<DateInput
						disabled
						name='BirthDate'
						placeholder='Ch???n ng??y sinh.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						disabled
						required
						name='Address'
						placeholder='S??? nh??, ???????ng, Ph?????ng/X??, T???nh/Th??nh ph???'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						disabled
						required
						name='Phone'
						placeholder='Nh???p s??? ??i???n tho???i.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						disabled
						name='Email'
						placeholder='Nh???p ?????a ch??? email.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						disabled
						required
						name='ExperienceYears'
						type='number'
						placeholder='Nh???p s??? n??m kinh nghi???m.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='Position'
						placeholder='Nh???p v??? tr??.'
						width='medium'
						displayConfigs={employeeDisplayConfigs}
					/>

					<DateInput
						required
						name='EmployedDate'
						placeholder='Ch???n ng??y b???t ?????u l??m vi???c.'
						width='medium'
						displayConfigs={employeeDisplayConfigs}
					/>

					<TextInput
						required
						name='Salary'
						type='number'
						width='medium'
						placeholder='Nh???p m???c l????ng.'
						displayConfigs={employeeDisplayConfigs}
					/>

					<TimeInput
						required
						name='StartHour'
						width='medium'
						placeholder='Ch???n th???i gian b???t ?????u ca.'
						displayConfigs={employeeDisplayConfigs}
					/>

					<TimeInput
						required
						name='EndHour'
						width='medium'
						placeholder='Ch???n th???i gian k???t th??c ca.'
						displayConfigs={employeeDisplayConfigs}
					/>

					<Button type='submit' width='medium'>
						Th??m
					</Button>
					<Button
						type='button'
						width='medium'
						onClick={() => console.table(methods.getValues())}
					>
						Xem form
					</Button>
					<Button
						type='button'
						secondary
						width='medium'
						onClick={() => navigate('/app/applicants')}
					>
						Tho??t
					</Button>
				</form>
			</FormProvider>
		</div>
	);
};
