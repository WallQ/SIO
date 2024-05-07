import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app';
import { getServerAuthSession } from '@/server/auth';
import { LogIn, LogOut } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import OuterWrapper from '@/components/outer-wrapper';

const Navbar: React.FunctionComponent = async () => {
	const session = await getServerAuthSession();

	return (
		<header className='absolute z-10 w-full'>
			<OuterWrapper>
				<div className='flex flex-row items-center justify-between'>
					<Link href={APP_ROUTES.HOME}>
						<Icons.logo className='size-4 stroke-primary hover:stroke-muted-foreground' />
					</Link>
					<nav>
						<ul className='flex gap-4'>
							<li>
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
							</li>
						</ul>
					</nav>
				</div>
			</OuterWrapper>
		</header>
	);
};

export default Navbar;
