import { Routes as ReactRouterRoutes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../../components/layouts/AppLayout';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { useAuthStore } from '../../modules/auth/Auth.store';
import { Login } from '../../modules/auth/Login/Login';
import { Dashboard } from '../../modules/dashboard/Dashboard';
import { Example } from '../../modules/example/Example';
import { ExampleForm } from '../../modules/example/ExampleForm';
import { ExampleTable } from '../../modules/example/ExampleTable';
import { ProtectedRoute } from './ProtectedRoute';

export const Routes = () => {
	const { isLoggedIn } = useAuthStore((state) => state);

	return (
		<ReactRouterRoutes>
			<Route
				path='*'
				element={<Navigate replace to={isLoggedIn ? 'app' : 'auth'} />}
			/>

			<Route path='auth' element={<AuthLayout />}>
				<Route path='login' element={<Login />} />
			</Route>

			<Route path='app' element={<ProtectedRoute element={<AppLayout />} />}>
				<Route path='' element={<Dashboard />} />
				<Route path='ex' element={<Example />} />
				<Route path='ex-form' element={<ExampleForm />} />
				<Route path='ex-table' element={<ExampleTable />} />
			</Route>
		</ReactRouterRoutes>
	);
};