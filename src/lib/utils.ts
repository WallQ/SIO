import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const convertFileToBase64 = (file: File) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

export const convertStringToXML = (base64: string) => {
	const base64Data = base64.replace(/^data:text\/xml;base64,/, '');

	const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');

	return decodedData;
};
