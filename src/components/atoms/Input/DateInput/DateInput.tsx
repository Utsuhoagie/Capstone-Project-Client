import ReactDatePicker from 'react-datepicker';
import './DateInput.css';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorIcon } from '../../../../assets/icons/ErrorIcon';
import { Label } from '../Label';
import { DisplayConfigs, getLabelForField } from '../../../../app/App.display';

interface DateInputProps {
	name: string;
	required?: boolean;
	placeholder?: string;
	width: 'medium' | 'full';
	displayConfigs: DisplayConfigs;
}

export const DateInput = ({
	name,
	required,
	placeholder,
	width,
	displayConfigs,
}: DateInputProps) => {
	const { formState } = useFormContext();
	const error = formState.errors[name];

	// const hasLabel: boolean = label !== undefined;

	return (
		<div className='flex flex-row items-center gap-0'>
			{/* {hasLabel && (
				<Label
					label={getLabelForField({
						labellers: displayConfigs.labellers,
						field: name,
					})}
					required={required}
				/>
			)} */}

			<Label
				label={getLabelForField({
					labellers: displayConfigs.labellers,
					field: name,
				})}
				required={required}
			/>

			{/* <input
				className={
					' h-h-input rounded border bg-neutral-white px-2 py-1.5 text-neutral-gray-9 outline-none ' +
					` ${error ? 'border-state-error' : 'border-primary-normal'} ` +
					' hover:shadow focus:shadow ' +
					` ${width === 'full' ? 'w-full' : 'w-w-input-medium'} `
				}
				{...register(name, { valueAsDate: true })}
			/> */}
			<Controller
				name={name}
				render={({ field, fieldState, formState }) => {
					return (
						<ReactDatePicker
							className={
								' mx-2 h-h-input rounded border bg-neutral-white px-2 py-1.5 text-neutral-gray-9 outline-none' +
								` ${error ? 'border-state-error' : 'border-primary-normal'} ` +
								' hover:shadow focus:shadow ' +
								` ${width === 'full' ? 'w-full' : 'w-w-input-medium'} `
							}
							placeholderText={placeholder}
							dateFormat='dd/MM/yyyy'
							selected={field.value}
							// onChange={(date) => setValue(name, date ?? dayjs().toDate())}
							onChange={field.onChange}
							ref={field.ref}
						/>
					);
				}}
			/>

			{error && (
				<div className='flex flex-row items-center gap-2 text-state-error'>
					<ErrorIcon size={24} />
					<p>{error?.message?.toString()}</p>
				</div>
			)}
		</div>
	);
};