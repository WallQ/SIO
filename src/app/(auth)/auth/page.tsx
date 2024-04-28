import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/routes/app';

const Auth = () => {
	redirect(APP_ROUTES.AUTH.SIGN_IN);
};

export default Auth;
