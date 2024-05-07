import { redirect } from 'next/navigation';
import { env } from '@/env';
import { APP_ROUTES } from '@/routes/app';

export default function Maintenance() {
	if (env.MAINTENANCE_MODE === 'false') redirect(APP_ROUTES.HOME);
	return (
		<main>
			<h1>Maintenance</h1>
		</main>
	);
}
