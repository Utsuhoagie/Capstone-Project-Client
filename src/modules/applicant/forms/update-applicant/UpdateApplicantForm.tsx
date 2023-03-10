import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToastStore } from '../../../../app/App.store';
import { Button } from '../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../components/atoms/Input/DateTimeInput/DateInput';
import { SelectInput } from '../../../../components/atoms/Input/SelectInput';
import { TextInput } from '../../../../components/atoms/Input/TextInput';
import { Applicant } from '../../Applicant.interface';
import { useApplicantStore } from '../../Applicant.store';
import {
	UpdateApplicantFormIntermediateValues,
	updateApplicantFormSchema,
} from './UpdateApplicantForm.form';

export const UpdateApplicantForm = () => {
	const navigate = useNavigate();

	const selectedApplicant = useApplicantStore(
		(state) => state.selectedApplicant
	) as Applicant;

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'applicants/update',
		async (formData: Applicant) => {
			const res = await fetch(
				`https://localhost:5000/api/Applicants/Update?NationalId=${selectedApplicant.NationalId}`,
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
				queryClient.invalidateQueries('applicant');
			},
		}
	);

	const showToast = useToastStore((state) => state.showToast);

	const methods = useForm<UpdateApplicantFormIntermediateValues>({
		mode: 'onSubmit',
		defaultValues: {
			NationalId: selectedApplicant.NationalId,
			FullName: selectedApplicant.FullName,
			Gender: selectedApplicant.Gender,
			BirthDate: Boolean(selectedApplicant.BirthDate)
				? dayjs(selectedApplicant.BirthDate).toISOString()
				: undefined,
			Address: selectedApplicant.Address,
			Phone: selectedApplicant.Phone,
			Email: selectedApplicant.Email,
			ExperienceYears: `${selectedApplicant.ExperienceYears}`,
			AppliedPosition: selectedApplicant.AppliedPosition,
			AppliedDate: dayjs(selectedApplicant.AppliedDate).toISOString(),
			AskingSalary: `${selectedApplicant.AskingSalary}`,
		},
		resolver: zodResolver(updateApplicantFormSchema),
	});

	const displayConfigs = useApplicantStore((state) => state.displayConfigs);

	const handleSubmit: SubmitHandler<UpdateApplicantFormIntermediateValues> = (
		rawData
	) => {
		console.log(rawData);

		const formData: Applicant = {
			NationalId: rawData.NationalId,
			FullName: rawData.FullName,
			Gender: rawData.Gender,
			BirthDate: Boolean(rawData.BirthDate)
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
		console.log({ error });
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Ch???nh s???a h??? s?? ???ng vi??n</h1>
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
						type='number'
						name='ExperienceYears'
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
						type='number'
						name='AskingSalary'
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
						onClick={() => console.log('getValues', methods.getValues())}
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
