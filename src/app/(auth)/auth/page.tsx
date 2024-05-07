import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/routes/app';

export default function Auth() {
	redirect(APP_ROUTES.AUTH.SIGN_IN);
}
