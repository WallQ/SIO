import { Loader2 } from 'lucide-react';

const Loading: React.FunctionComponent = (): React.ReactNode => {
	return <Loader2 className='h-16 w-16 animate-spin text-primary' />;
};

export default Loading;
