import { useAuth } from '../hooks/auth/useAuth'
import { Navigate } from 'react-router-dom'
import Header from '@/components/appComp/Header';
import DataForm from '@/components/appComp/DataForm';

export default function User() {
  const { signed, user } = useAuth();

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  if (user?.admin) {
    return <Navigate to="/admin" replace />;
  }

  return (
<div
          className="flex flex-col items-center justify-center w-full"
          style={{ backgroundImage: "url('bg_blue_home.png')" }}
        >
          <Header />
          <DataForm />
          </div>
  )
}


