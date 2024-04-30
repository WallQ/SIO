import { Globe } from 'lucide-react';

import { Icons } from '@/components/icons';

import OuterWrapper from '../../../../components/outer-wrapper';

const Footer: React.FunctionComponent = (): React.ReactNode => {
	return (
		<footer className='border-t'>
			<OuterWrapper>
				<div className='flex flex-col items-center justify-between gap-2 sm:flex-row'>
					<small className='text-xs text-muted-foreground'>
						Copyright &copy; {new Date().getFullYear()} SIO, All
						rights reserved.
					</small>
					<div className='flex flex-row items-center justify-between gap-4'>
						<a
							href=' https://www.facebook.com/estgpolitecnicodoporto'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Facebook'>
							<Icons.facebook className='size-4 fill-muted-foreground hover:fill-primary' />
						</a>
						<a
							href='https://www.instagram.com/estg_pporto'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Instagram'>
							<Icons.instagram className='size-4 fill-muted-foreground hover:fill-primary' />
						</a>
						<a
							href='https://www.linkedin.com/school/estg-ipp'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Linkedin'>
							<Icons.linkedin className='size-4 fill-muted-foreground hover:fill-primary' />
						</a>
						<a
							href='https://x.com/estgpporto'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Twitter'>
							<Icons.x className='size-4 fill-muted-foreground hover:fill-primary' />
						</a>
						<a
							href='https://www.youtube.com/user/estgfipp'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Youtube'>
							<Icons.youtube className='size-4 fill-muted-foreground hover:fill-primary' />
						</a>
						<a
							href='https://gitlab.estg.ipp.pt/sio-2023-2024'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Gitlab'>
							<Icons.gitlab className='size-4 fill-muted-foreground hover:fill-primary' />
						</a>
						<a
							href='https://www.estg.ipp.pt'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Globe'>
							<Globe className='size-4 text-muted-foreground hover:text-primary' />
						</a>
					</div>
				</div>
			</OuterWrapper>
		</footer>
	);
};

export default Footer;
