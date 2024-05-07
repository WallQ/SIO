'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react';

import { cn, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

type Company = {
	value: string;
	label: string;
};

const companys = [
	{
		value: 'apple',
		label: 'Apple',
	},
	{
		value: 'meta',
		label: 'Meta',
	},
	{
		value: 'x',
		label: 'X',
	},
] as Company[];

const CompanySwitcher: React.FunctionComponent = (): React.ReactNode => {
	const [openModal, setOpenModal] = useState(false);
	const [openPopover, setOpenPopover] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState('');

	return (
		<Dialog open={openModal} onOpenChange={setOpenModal}>
			<Popover open={openPopover} onOpenChange={setOpenPopover}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={openPopover}
						className='w-[192px] justify-between'>
						{selectedCompany ? (
							<Avatar className='mr-2 h-5 w-5'>
								<AvatarImage
									src={`https://source.boringavatars.com/beam/128/${selectedCompany}?colors=fafafa,f4f4f5,e4e4e7,d4d4d8,a1a1aa,71717a,52525b,3f3f46,27272a,18181b,09090b`}
									alt='Company logo'
								/>
								<AvatarFallback>
									{getInitials(selectedCompany)}
								</AvatarFallback>
							</Avatar>
						) : null}
						{selectedCompany
							? companys.find((c) => c.value === selectedCompany)
									?.label
							: 'Select company...'}
						<ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[192px] p-0'>
					<Command>
						<CommandInput placeholder='Search company...' />
						<CommandList>
							<CommandEmpty>No company found.</CommandEmpty>
							{companys.length > 0 ? (
								<CommandGroup>
									{companys.map((company) => (
										<CommandItem
											key={company.value}
											value={company.value}
											onSelect={(currentValue) => {
												setSelectedCompany(
													currentValue ===
														selectedCompany
														? ''
														: currentValue,
												);
												setOpenPopover(false);
											}}>
											<Avatar className='mr-2 h-5 w-5'>
												<AvatarImage
													src={`https://source.boringavatars.com/beam/128/${company.value}?colors=fafafa,f4f4f5,e4e4e7,d4d4d8,a1a1aa,71717a,52525b,3f3f46,27272a,18181b,09090b`}
													alt={company.label}
												/>
												<AvatarFallback>
													{getInitials(company.label)}
												</AvatarFallback>
											</Avatar>
											{company.label}
											<Check
												className={cn(
													'ml-auto size-4',
													selectedCompany ===
														company.value
														? 'opacity-100'
														: 'opacity-0',
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							) : null}
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<DialogTrigger asChild>
									<CommandItem
										onSelect={() => {
											setOpenPopover(false);
											setOpenModal(true);
										}}>
										<CirclePlus className='mr-2 size-5' />
										Create Company
									</CommandItem>
								</DialogTrigger>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create team</DialogTitle>
					<DialogDescription>
						Add a new team to manage products and customers.
					</DialogDescription>
				</DialogHeader>
				<div>{/* Upload file component */}</div>
				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => setOpenModal(false)}>
						Cancel
					</Button>
					<Button type='submit'>Continue</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CompanySwitcher;
