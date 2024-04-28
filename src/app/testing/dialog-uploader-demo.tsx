'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import { FileUploader } from './file-uploader';

export function DialogUploaderDemo() {
	const [open, setOpen] = useState<boolean>(false);
	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
		if (files) {
			setOpen(false);
			toast({
				title: 'Files uploaded successfully!',
				description: (
					<ul>
						{files.map((file) => (
							<li key={file.name}>{file.name}</li>
						))}
					</ul>
				),
			});
		}
	}, [files]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>
					Upload files {files.length > 0 && `(${files.length})`}
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Upload files</DialogTitle>
					<DialogDescription>
						Drag and drop your files here or click to browse.
					</DialogDescription>
				</DialogHeader>
				<FileUploader
					maxFiles={1}
					maxSize={4 * 1024}
					onValueChange={setFiles}
				/>
			</DialogContent>
		</Dialog>
	);
}
