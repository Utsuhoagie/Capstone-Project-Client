import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from './Label';
import { DropdownIcon } from '../../../assets/icons/DropdownIcon';
import { CheckboxIcon } from '../../../assets/icons/CheckboxIcon';
import {
	DisplayConfigs,
	getDisplayForFieldValue,
	getLabelForField,
} from '../../../app/App.display';
import { useApplicantStore } from '../../../modules/applicant/Applicant.store';

interface SelectInputProps extends React.ComponentPropsWithRef<'select'> {
	name: string;
	width: 'full' | 'medium';
	options: any[];
	displayConfigs: DisplayConfigs;
}

interface SelectInputSingleProps extends SelectInputProps {
	optionPairs: { value: any; display: string | undefined }[];
	selectedValue: any;
}

interface SelectInputMultipleProps extends SelectInputProps {
	optionPairs: { value: any; display: string | undefined }[];
	selectedValues: any[];
}

/**
 * ======= NOTE:NOTE:NOTE:NOTE:NOTE:NOTE: =======
 * REMEMBER THERE ARE STYLES FOR MULTIPLE OR SINGLE SELECTINPUT
 * ======= NOTE:NOTE:NOTE:NOTE:NOTE:NOTE: =======
 */

const SelectInputSingle = ({
	name,
	optionPairs,
	width,
	displayConfigs,
	selectedValue,
	multiple,
	placeholder,
	required,
	disabled,
	...props
}: SelectInputSingleProps) => {
	// console.log({
	// 	displayConfigs,
	// 	field: name,
	// 	value: selectedValue,
	// });

	return (
		<Controller
			name={name}
			// defaultValue={options[0].value}
			render={({ field, fieldState, formState }) => (
				<Listbox
					disabled={disabled}
					as='div'
					className='flex w-full flex-row items-center gap-2'
					value={field.value}
					onChange={field.onChange}
				>
					<Listbox.Label className='block'>
						<Label
							label={getLabelForField({
								labellers: displayConfigs.labellers,
								field: name,
							})}
							required={required}
						/>
					</Listbox.Label>

					<div className='flex flex-col'>
						<Listbox.Button
							className={
								' flex h-h-input flex-row justify-between border border-primary-normal bg-neutral-white px-2 py-1.5 text-left text-neutral-gray-9 outline-none ' +
								` ${width === 'full' ? 'w-full' : 'w-w-input-medium'} ` +
								' ui-open:rounded-t ui-not-open:rounded ' +
								' disabled:cursor-not-allowed disabled:bg-neutral-gray-3 disabled:opacity-75 '
							}
							disabled={disabled}
						>
							<p className='overflow-ellipsis'>
								{selectedValue !== ''
									? getDisplayForFieldValue({
											displayConfigs,
											field: name,
											value: selectedValue,
									  })
									: placeholder}
							</p>
							<DropdownIcon
								size={24}
								direction='down'
								className='ui-open:rotate-180'
							/>
						</Listbox.Button>

						<div className='relative'>
							<Listbox.Options className='absolute z-50 box-border w-w-input-medium divide-y divide-neutral-gray-4 overflow-hidden rounded-b border-x border-b border-primary-normal'>
								{optionPairs.map((optionPair) => (
									<Listbox.Option
										key={optionPair.value}
										value={optionPair.value}
										className={
											' h-h-input w-w-input-medium cursor-pointer bg-neutral-white px-2 py-1.5 text-neutral-gray-9 ' +
											' hover:bg-secondary-normal ui-selected:bg-secondary-normal '
										}
									>
										{optionPair.display}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</div>
					</div>
				</Listbox>
			)}
		/>
	);
};

const SelectInputMultiple = ({
	name,
	optionPairs,
	width,
	displayConfigs,
	selectedValues,
	multiple,
	placeholder,
	required,
	disabled,
	...props
}: SelectInputMultipleProps) => {
	return (
		<Controller
			name={name}
			defaultValue={[]}
			render={({ field, fieldState, formState }) => (
				<Listbox
					disabled={disabled}
					as='div'
					className='flex w-full flex-row items-center gap-2'
					multiple
					value={field.value}
					onChange={field.onChange}
				>
					<Listbox.Label className='block'>
						<Label
							label={getLabelForField({
								labellers: displayConfigs.labellers,
								field: name,
							})}
							required={required}
						/>
					</Listbox.Label>

					<div className='flex flex-col'>
						<Listbox.Button
							className={
								' flex h-h-input w-w-input-medium flex-row justify-between border border-primary-normal bg-neutral-white px-2 py-1.5 text-left text-neutral-gray-9 outline-none ' +
								' ui-open:rounded-t ui-not-open:rounded ' +
								' disabled:cursor-not-allowed disabled:bg-neutral-gray-3 disabled:opacity-75 '
							}
						>
							<p className='overflow-ellipsis'>
								{selectedValues.length > 0
									? // ? selectedValues.join(', ')
									  'Nhi???u...'
									: placeholder}
							</p>
							<DropdownIcon
								size={24}
								direction='down'
								className='ui-open:rotate-180'
							/>
						</Listbox.Button>

						<div className='relative'>
							<Listbox.Options className='absolute z-50 box-border w-w-input-medium divide-y divide-neutral-gray-4 overflow-hidden rounded-b border-x border-b border-primary-normal'>
								{optionPairs.map((optionPair) => (
									<Listbox.Option
										key={optionPair.value}
										value={optionPair.value}
										className={
											' z-50 flex h-h-input w-w-input-medium cursor-pointer flex-row items-center gap-2 bg-neutral-white px-2 py-1.5 text-neutral-gray-9 ' +
											' hover:bg-secondary-normal ui-selected:bg-secondary-normal '
										}
									>
										<CheckboxIcon
											checked={selectedValues.includes(optionPair.value)}
											size={24}
										/>
										<p>{optionPair.display}</p>
									</Listbox.Option>
								))}
							</Listbox.Options>
						</div>
					</div>
				</Listbox>
			)}
		/>
	);
};

export const SelectInput = ({
	// name,
	// options,
	// label,
	// multiple,
	// placeholder,
	// required,
	// ...props
	...props
}: SelectInputProps) => {
	const { watch } = useFormContext();

	// Can be multiple; different vars used based on `multiple`
	const selectedValue = watch(props.name) as string;
	const selectedValues = watch(props.name) as string[];

	const displayConfigs = useApplicantStore((state) => state.displayConfigs);

	const optionPairs = props.options.map((option) => ({
		value: option,
		display: getDisplayForFieldValue({
			displayConfigs,
			field: props.name,
			value: option,
		}),
	}));

	if (props.multiple) {
		return (
			<SelectInputMultiple
				optionPairs={optionPairs}
				selectedValues={selectedValues}
				{...props}
			/>
		);
	} else {
		return (
			<SelectInputSingle
				optionPairs={optionPairs}
				selectedValue={selectedValue}
				{...props}
			/>
		);
	}
};
