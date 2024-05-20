'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';

import { convertFileToBase64 } from '@/lib/utils';
import FileUploader from '@/components/file-uploader';

const Testing: React.FunctionComponent = (): React.ReactNode => {
	const [files, setFiles] = useState<File[]>([]);

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
		<div>
			<h1>Testing</h1>
			<FileUploader
				maxFiles={1}
				maxSize={1 * 1024 * 1024}
				onValueChange={setFiles}
				onUpload={handleUpload}
			/>
		</div>
	);
};

export default Testing;
