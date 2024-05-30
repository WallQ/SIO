import { api } from '@/trpc/server';

import PopulateButton from './populate-button';

const Testing: React.FunctionComponent = async () => {
	const [data] = await Promise.all([api.upload.testing()]);

	return (
		<div>
			<h1>Testing</h1>
			<PopulateButton />
			{data && (
				<div>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default Testing;
