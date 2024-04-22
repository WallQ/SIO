import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type StatCardProps = {
	time: string;
	amount: number;
	diffrence: number;
};

const StatCard: React.FunctionComponent<StatCardProps> = ({
	time,
	amount,
	diffrence,
}): React.ReactNode => {
	return (
		<Card x-chunk='dashboard-05-chunk-2'>
			<CardHeader className='pb-2'>
				<CardDescription>This {time}</CardDescription>
				<CardTitle className='text-4xl'>${amount}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='text-xs text-muted-foreground'>
					+{diffrence}% from last month
				</div>
			</CardContent>
			<CardFooter>
				<Progress aria-label='12% increase' value={diffrence} />
			</CardFooter>
		</Card>
	);
};

export default StatCard;
