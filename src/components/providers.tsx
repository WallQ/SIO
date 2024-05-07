import { TRPCReactProvider } from '@/trpc/react';

import { SessionProvider } from './session-provider';
import ThemeProvider from './theme-provider';
import { Toaster } from './ui/toaster';

type ProvidersProps = {
	children: React.ReactNode;
};

const Providers: React.FunctionComponent<ProvidersProps> = ({
	children,
}): React.ReactNode => {
	return (
		<TRPCReactProvider>
			<SessionProvider>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					disableTransitionOnChange>
					{children}
					<Toaster />
				</ThemeProvider>
			</SessionProvider>
		</TRPCReactProvider>
	);
};

export default Providers;
