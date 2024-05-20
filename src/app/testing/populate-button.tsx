'use client';

import { api } from '@/trpc/react';

import { Button } from '@/components/ui/button';

const PopulateButton: React.FunctionComponent = (): React.ReactNode => {
	const populateDatabase = api.dev.populate.useMutation({
		onSuccess: () => {
			console.log('Database Populated');
		},
	});

	return (
		<Button onClick={() => populateDatabase.mutate({ text: 'Test 1' })}>
			Populate Testing Data
		</Button>
	);
};

export default PopulateButton;
