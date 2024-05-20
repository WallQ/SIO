'use client';

import { useCompanyStore } from '@/stores/companies';
import { api } from '@/trpc/react';
import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react';
import { useState } from 'react';

import FileUploader from '@/components/file-uploader';
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
import { cn, convertFileToBase64, getInitials } from '@/lib/utils';

const CompanySwitcher: React.FunctionComponent = (): React.ReactNode => {
	const [openModal, setOpenModal] = useState(false);
	const [openPopover, setOpenPopover] = useState(false);
	const [files, setFiles] = useState<File[]>([]);

	const selectedCompany = useCompanyStore((state) => state.selectedCompany);
	const setSelectedCompany = useCompanyStore(
		(state) => state.setSelectedCompany,
	);

	const { data: companies } = api.companies.getCompanies.useQuery();

	const uploadFile = api.post.file.useMutation({
		onSuccess: () => {
			console.log('File uploaded');
		},
		onError: (error) => {
			console.log('Error uploading file', error);
		},
	});

	const handleUpload = async (files: File[]) => {
		const base64 = (await convertFileToBase64(files[0]!)) as string;
		uploadFile.mutate({ file: base64 });
	};

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
									src={`https://source.boringavatars.com/beam/128/${selectedCompany.name}?colors=fafafa,f4f4f5,e4e4e7,d4d4d8,a1a1aa,71717a,52525b,3f3f46,27272a,18181b,09090b`}
									alt='Company logo'
								/>
								<AvatarFallback>
									{getInitials(selectedCompany.name)}
								</AvatarFallback>
							</Avatar>
						) : null}
						{selectedCompany
							? selectedCompany.name
							: 'Select company...'}
						<ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[192px] p-0'>
					<Command>
						<CommandInput placeholder='Search company...' />
						<CommandList>
							<CommandEmpty>No company found.</CommandEmpty>
							{companies && companies.length > 0 ? (
								<CommandGroup>
									{companies.map((company) => (
										<CommandItem
											key={company.id}
											value={`${company.id}`}
											onSelect={() => {
												setSelectedCompany(company);
												setOpenPopover(false);
											}}>
											<Avatar className='mr-2 h-5 w-5'>
												<AvatarImage
													src={`https://source.boringavatars.com/beam/128/${company.name}?colors=fafafa,f4f4f5,e4e4e7,d4d4d8,a1a1aa,71717a,52525b,3f3f46,27272a,18181b,09090b`}
													alt={company.name}
												/>
												<AvatarFallback>
													{getInitials(company.name)}
												</AvatarFallback>
											</Avatar>
											{company.name}
											<Check
												className={cn(
													'ml-auto size-4',
													selectedCompany === company
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
					<DialogTitle>Create Company</DialogTitle>
					<DialogDescription>
						Add the data of the company you want to create.
					</DialogDescription>
				</DialogHeader>
				<FileUploader
					maxFiles={1}
					maxSize={1 * 1024 * 1024}
					onValueChange={setFiles}
					onUpload={handleUpload}
				/>
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
