import { env } from '@/env';
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

export const formatCurrency = (
	value: number,
	compact = false,
	showCents = true,
) => {
	return new Intl.NumberFormat('pt-PT', {
		style: 'currency',
		currency: 'EUR',
		notation: compact ? 'compact' : 'standard',
		minimumFractionDigits: showCents ? 2 : 0,
		maximumFractionDigits: showCents ? 2 : 0,
	}).format(value);
};

export const formatNumber = (
	value: number,
	compact = false,
	showDecimals = true,
) => {
	return new Intl.NumberFormat('pt-PT', {
		style: 'decimal',
		notation: compact ? 'compact' : 'standard',
		minimumFractionDigits: showDecimals ? 2 : 0,
		maximumFractionDigits: showDecimals ? 2 : 0,
	}).format(value);
};

export const getInitials = (name: string): string => {
	return name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase())
		.join('');
};

export function formatBytes(
	bytes: number,
	opts: {
		decimals?: number;
		sizeType?: 'accurate' | 'normal';
	} = {},
) {
	const { decimals = 0, sizeType = 'normal' } = opts;

	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
		sizeType === 'accurate'
			? accurateSizes[i] ?? 'Bytest'
			: sizes[i] ?? 'Bytes'
	}`;
}

export function getBaseUrl() {
	if (env.NODE_ENV === 'development') {
		return 'http://localhost:3000';
	} else {
		return `https://${env.NEXTAUTH_URL}`;
	}
}

export const ensureArray = <T>(value: T | T[]): T[] =>
	Array.isArray(value) ? value : [value];
