'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { LoaderCircle } from 'lucide-react';

import { convertFileToBase64 } from '@/lib/utils';
import FileUploader from '@/components/file-uploader';

import PopulateButton from './populate-button';

const Testing: React.FunctionComponent = (): React.ReactNode => {
	const [files, setFiles] = useState<File[]>([]);

	const uploadFile = api.upload.file.useMutation({
		onSuccess: (res) => {
			console.log(res);
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
		<div>
			<h1>Testing</h1>
			<PopulateButton />
			<FileUploader
				maxFiles={1}
				maxSize={1 * 1024 * 1024}
				onValueChange={setFiles}
				onUpload={handleUpload}
				disabled={uploadFile.isPending}
			/>
			{uploadFile.isPending && (
				<LoaderCircle className='size-8 animate-spin' />
			)}
		</div>
	);
};

export default Testing;
