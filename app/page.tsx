import { getEmails } from './actions';
import Dashboard from './components/Dashboard';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const emails = await getEmails();
  return <Dashboard initialEmails={emails as any} user={session.user} />;
}
