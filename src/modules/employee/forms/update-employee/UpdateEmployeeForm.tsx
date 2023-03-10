import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToastStore } from '../../../../app/App.store';
import { Button } from '../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../components/atoms/Input/DateTimeInput/DateInput';
import { TimeInput } from '../../../../components/atoms/Input/DateTimeInput/TimeInput';
import { SelectInput } from '../../../../components/atoms/Input/SelectInput';
import { TextInput } from '../../../../components/atoms/Input/TextInput';
import { Employee } from '../../Employee.interface';
import { useEmployeeStore } from '../../Employee.store';
import {
	UpdateEmployeeFormIntermediateValues,
	updateEmployeeFormSchema,
} from './UpdateEmployeeForm.form';

export const UpdateEmployeeForm = () => {
	const navigate = useNavigate();

	const selectedEmployee = useEmployeeStore(
		(state) => state.selectedEmployee
	) as Employee;

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'employees/update',
		async (formData: Employee) => {
			const res = await fetch(
				`https://localhost:5000/api/Employees/Update?NationalId=${selectedEmployee.NationalId}`,
				{
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'PUT',
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
				queryClient.invalidateQueries('employees');
			},
		}
	);

	const showToast = useToastStore((state) => state.showToast);

	const methods = useForm<UpdateEmployeeFormIntermediateValues>({
		mode: 'onSubmit',
		defaultValues: {
			NationalId: selectedEmployee.NationalId,
			FullName: selectedEmployee.FullName,
			Gender: selectedEmployee.Gender,
			BirthDate: selectedEmployee.BirthDate
				? dayjs(selectedEmployee.BirthDate).toISOString()
				: undefined,
			Address: selectedEmployee.Address,
			Phone: selectedEmployee.Phone,
			Email: selectedEmployee.Email,
			ExperienceYears: `${selectedEmployee.ExperienceYears}`,
			Position: selectedEmployee.Position,
			EmployedDate: dayjs(selectedEmployee.EmployedDate).toISOString(),
			Salary: `${selectedEmployee.Salary}`,
			StartHour: dayjs()
				.hour(selectedEmployee.StartHour)
				.startOf('hour')
				.toISOString(),
			EndHour: dayjs()
				.hour(selectedEmployee.EndHour)
				.startOf('hour')
				.toISOString(),
		},
		resolver: zodResolver(updateEmployeeFormSchema),
	});

	const displayConfigs = useEmployeeStore((state) => state.displayConfigs);

	const handleSubmit: SubmitHandler<UpdateEmployeeFormIntermediateValues> = (
		rawData
	) => {
		console.log(rawData);

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
			EndHour: dayjs(rawData.StartHour).hour(),
		};

		// console.log({ formData });
		mutation.mutate(formData);
	};
	const handleError = (error) => {
		console.log({ error });
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Ch???nh s???a h??? s?? Nh??n vi??n</h1>
			<FormProvider {...methods}>
				<form
					className='flex flex-col gap-2 p-2'
					onSubmit={methods.handleSubmit(handleSubmit, handleError)}
				>
					<TextInput
						required
						name='NationalId'
						placeholder='Nh???p 9 ho???c 12 s???.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='FullName'
						placeholder='Nh???p h??? t??n ?????y ?????.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<SelectInput
						required
						name='Gender'
						placeholder='Ch???n 1.'
						width='medium'
						options={['male', 'female', 'other']}
						displayConfigs={displayConfigs}
					/>

					<DateInput
						name='BirthDate'
						placeholder='Ch???n ng??y sinh.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='Address'
						placeholder='S??? nh??, ???????ng, Ph?????ng/X??, T???nh/Th??nh ph???'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='Phone'
						placeholder='Nh???p s??? ??i???n tho???i.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						name='Email'
						placeholder='Nh???p ?????a ch??? email.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
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
						displayConfigs={displayConfigs}
					/>

					<DateInput
						required
						name='EmployedDate'
						placeholder='Ch???n ng??y b???t ?????u l??m vi???c.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='Salary'
						type='number'
						width='medium'
						placeholder='Nh???p m???c l????ng.'
						displayConfigs={displayConfigs}
					/>

					<TimeInput
						required
						name='StartHour'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TimeInput
						required
						name='EndHour'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<Button type='submit' width='medium'>
						Th??m
					</Button>
					<Button
						type='button'
						width='medium'
						onClick={() => console.log('getValues', methods.getValues())}
					>
						Xem form
					</Button>
					<Button
						type='button'
						secondary
						width='medium'
						onClick={() => navigate('/app/employees')}
					>
						Tho??t
					</Button>
				</form>
			</FormProvider>
		</div>
	);
};
