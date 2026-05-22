import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically redirect the user to the login page
  redirect('/login');
}