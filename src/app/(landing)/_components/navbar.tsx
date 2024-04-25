import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app';
import { getServerAuthSession } from '@/server/auth';
import { LogIn, LogOut } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const Navbar: React.FunctionComponent = async () => {
	const session = await getServerAuthSession();

	return (
		<header className='absolute z-10 w-full'>
			<div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6'>
				<div className='flex flex-row items-center justify-between'>
					<Link href={APP_ROUTES.HOME}>
						<Icons.logo className='size-4 stroke-primary hover:stroke-muted-foreground' />
					</Link>
					<nav className='flex gap-4'>
						{session ? (
							<Link
								href={APP_ROUTES.AUTH.SIGN_OUT}
								className={buttonVariants({
									variant: 'ghost',
									size: 'icon',
								})}>
								<LogOut className='size-4' />
							</Link>
						) : (
							<Link
								href={APP_ROUTES.AUTH.SIGN_IN}
								className={buttonVariants({
									variant: 'ghost',
									size: 'icon',
								})}>
								<LogIn className='size-4' />
							</Link>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
