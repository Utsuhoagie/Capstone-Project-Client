import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { range } from 'ramda';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../../../app/App.store';
import { Button } from '../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../components/atoms/Input/DateTimeInput/DateInput';
import { TimeInput } from '../../../../components/atoms/Input/DateTimeInput/TimeInput';
import { SelectInput } from '../../../../components/atoms/Input/SelectInput';
import { TextInput } from '../../../../components/atoms/Input/TextInput';
import { Employee } from '../../Employee.interface';
import { useEmployeeStore } from '../../Employee.store';
import {
	CreateEmployeeFormIntermediateValues,
	createEmployeeFormSchema,
} from './CreateEmployeeForm.form';

export const CreateEmployeeForm = () => {
	const navigate = useNavigate();

	const showToast = useToastStore((state) => state.showToast);

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'employees/create',
		async (formData: Employee) => {
			const res = await fetch('https://localhost:5000/api/Employees/Create', {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify(formData),
			});

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

	const methods = useForm<CreateEmployeeFormIntermediateValues>({
		mode: 'onSubmit',
		defaultValues: {
			NationalId: '',
			FullName: '',
			Gender: 'male',
			BirthDate: '',
			Address: '',
			Phone: '',
			Email: '',
			ExperienceYears: '',
			Position: '',
			EmployedDate: dayjs().toISOString(),
			Salary: '',
			StartHour: dayjs().hour(9).startOf('hour').toISOString(),
			EndHour: dayjs().hour(18).startOf('hour').toISOString(),
		},
		resolver: zodResolver(createEmployeeFormSchema),
	});

	const displayConfigs = useEmployeeStore((state) => state.displayConfigs);

	const handleSubmit: SubmitHandler<CreateEmployeeFormIntermediateValues> = (
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
			EmployedDate: dayjs(rawData.BirthDate).toDate(),
			Salary: parseInt(rawData.Salary),
			StartHour: dayjs(rawData.StartHour).hour(),
			EndHour: dayjs(rawData.EndHour).hour(),
		};

		// console.log({ formData });
		mutation.mutate(formData);
	};
	const handleError = (error) => {
		console.log({ error });
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Th??m h??? s?? Nh??n vi??n m???i</h1>
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
						type='number'
						name='ExperienceYears'
						placeholder='Nh???p s??? n??m kinh nghi???m.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='Position'
						placeholder='Nh???p v??? tr?? ???ng tuy???n.'
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
						type='number'
						name='Salary'
						width='medium'
						placeholder='Nh???p m???c l????ng.'
						displayConfigs={displayConfigs}
					/>

					{/* <SelectInput
						required
						name='StartHour'
						placeholder=''
						width='medium'
						displayConfigs={displayConfigs}
						options={range(0, 23)}
					/> */}

					<TimeInput
						required
						name='StartHour'
						placeholder='Ch???n th???i gian b???t ?????u ca.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TimeInput
						required
						name='EndHour'
						placeholder='Ch???n th???i gian k???t th??c ca.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<Button type='submit' width='medium'>
						Th??m
					</Button>
					<Button
						type='button'
						width='medium'
						onClick={() => console.log(methods.getValues())}
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
