'use client';

import { useState } from 'react';
import { Paperclip, Upload } from 'lucide-react';

import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from './file-upload';

const FileUploaderTest = () => {
	const [files, setFiles] = useState<File[] | null>(null);

	const dropZoneConfig = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 4,
		multiple: true,
	};

	return (
		<FileUploader
			value={files}
			onValueChange={setFiles}
			dropzoneOptions={dropZoneConfig}
			className='relative rounded-lg p-2'>
			<FileInput className='outline-dashed outline-1 outline-muted-foreground'>
				<div className='flex w-full flex-col items-center justify-center pb-4 pt-3 '>
					<div className='flex flex-col items-center gap-2'>
						<Upload className='size-8 text-muted-foreground' />
						<div className='flex flex-col items-center'>
							<p className='text-sm text-muted-foreground'>
								<span className='font-semibold'>
									Click to upload
								</span>
								&nbsp; or drag and drop
							</p>
							<p className='text-xs text-muted-foreground'>XML</p>
						</div>
					</div>
				</div>
			</FileInput>
			<FileUploaderContent>
				{files &&
					files.length > 0 &&
					files.map((file, i) => (
						<FileUploaderItem key={i} index={i}>
							<Paperclip className='size-4' />
							<span>{file.name}</span>
						</FileUploaderItem>
					))}
			</FileUploaderContent>
		</FileUploader>
	);
};

export default FileUploaderTest;
