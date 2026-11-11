import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/ui/AuthLayout';
import FormField from '../components/ui/FormField';
import GradientButton from '../components/ui/GradientButton';
import * as authApi from '../api/auth';
import { getErrorMessage, getFieldErrors } from '../api/client';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  usePageTitle('Log in');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const errs = {};
    if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Enter your password';
    setErrors(errs);
    setFormError('');
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await authApi.login({ email: form.email.trim(), password: form.password });
      const user = signIn(res);
      const from = location.state?.from;
      navigate(user.onboardingCompleted ? from || '/home' : '/onboarding', { replace: true });
    } catch (err) {
      if (err.response?.status === 401) setFormError('Invalid email or password');
      else if (Object.keys(getFieldErrors(err)).length) setErrors(getFieldErrors(err));
      else toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your music journey."
      footer={<>New to MuseStream? <Link to="/register" className="text-primary-400 font-semibold hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {formError && <div role="alert" className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">{formError}</div>}
        <FormField label="Email" type="email" name="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField label="Password" type="password" name="password" autoComplete="current-password" value={form.password} onChange={set('password')} error={errors.password} />
        <GradientButton type="submit" loading={loading} className="w-full">Log in</GradientButton>
      </form>
    </AuthLayout>
  );
}
