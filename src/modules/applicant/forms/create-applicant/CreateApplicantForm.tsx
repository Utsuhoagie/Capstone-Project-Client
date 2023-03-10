import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../../../../app/App.store';
import { Button } from '../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../components/atoms/Input/DateTimeInput/DateInput';
import { SelectInput } from '../../../../components/atoms/Input/SelectInput';
import { TextInput } from '../../../../components/atoms/Input/TextInput';
import { Applicant } from '../../Applicant.interface';
import { useApplicantStore } from '../../Applicant.store';
import {
	CreateApplicantFormIntermediateValues,
	createApplicantFormSchema,
} from './CreateApplicantForm.form';

export const CreateApplicantForm = () => {
	const navigate = useNavigate();

	const showToast = useToastStore((state) => state.showToast);

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'applicants/create',
		async (formData: Applicant) => {
			const res = await fetch('https://localhost:5000/api/Applicants/Create', {
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
				queryClient.invalidateQueries('applicant');
			},
		}
	);

	const methods = useForm<CreateApplicantFormIntermediateValues>({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
		defaultValues: {
			NationalId: '',
			FullName: '',
			Gender: 'male',
			BirthDate: '',
			Address: '',
			Phone: '',
			Email: '',
			ExperienceYears: '',
			AppliedPosition: '',
			AppliedDate: dayjs().toISOString(),
			AskingSalary: '',
		},
		resolver: zodResolver(createApplicantFormSchema),
	});

	const displayConfigs = useApplicantStore((state) => state.displayConfigs);

	const handleSubmit: SubmitHandler<CreateApplicantFormIntermediateValues> = (
		rawData
	) => {
		console.log(rawData);

		const formData: Applicant = {
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
			AppliedPosition: rawData.AppliedPosition,
			AppliedDate: dayjs(rawData.AppliedDate).toDate(),
			AskingSalary: parseInt(rawData.AskingSalary),
		};

		// console.log({ formData });
		mutation.mutate(formData);
	};
	const handleError = (error) => {
		console.table(error);
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Th??m h??? s?? ???ng vi??n m???i</h1>
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
						width='medium'
						placeholder='Ch???n 1.'
						options={['male', 'female', 'other']}
						displayConfigs={displayConfigs}
					/>

					<DateInput
						isClearable
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
						name='AppliedPosition'
						placeholder='Nh???p v??? tr?? ???ng tuy???n.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<DateInput
						required
						name='AppliedDate'
						placeholder='Ch???n ng??y n???p h??? s?? ???ng tuy???n.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='AskingSalary'
						type='number'
						width='medium'
						placeholder='Nh???p m???c l????ng ????? ngh???.'
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
						onClick={() => navigate('/app/applicants')}
					>
						Tho??t
					</Button>
				</form>
			</FormProvider>
		</div>
	);
};
