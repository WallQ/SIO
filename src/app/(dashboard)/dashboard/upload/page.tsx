'use client';

import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { convertFileToBase64 } from '@/lib/utils';

const formSchema = z.object({
	file: z.instanceof(File),
});

type IformSchema = z.infer<typeof formSchema>;

export default function Wasd() {
	const form = useForm<IformSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			file: new File([], ''),
		},
	});

	const onSubmit = async (data: IformSchema) => {
		const file = data.file;
		const base64 = (await convertFileToBase64(file)) as string;
		console.log(base64);

		uploadFile.mutate({ file: base64 });
	};

	const uploadFile = api.post.file.useMutation({
		onSuccess: () => {
			console.log('File uploaded');
		},
		onError: (error) => {
			console.log('Error uploading file', error);
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name='file'
					render={({ field }) => (
						<FormItem>
							<FormLabel>File</FormLabel>
							<FormControl>
								<Input
									accept='.xml'
									type='file'
									onChange={(e) =>
										field.onChange(
											e.target.files
												? e.target.files[0]
												: null,
										)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	);
}
