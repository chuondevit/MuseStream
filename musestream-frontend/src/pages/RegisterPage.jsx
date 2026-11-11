import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/ui/AuthLayout';
import FormField from '../components/ui/FormField';
import GradientButton from '../components/ui/GradientButton';
import * as authApi from '../api/auth';
import { getErrorMessage, getFieldErrors } from '../api/client';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEVELS = [
  { label: 'Too short', color: 'bg-danger' },
  { label: 'Weak', color: 'bg-danger' },
  { label: 'Fair', color: 'bg-yellow-400' },
  { label: 'Good', color: 'bg-success' },
  { label: 'Strong', color: 'bg-success' },
];

function strength(pw) {
  if (pw.length < 8) return 0;
  let s = 1;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}

export default function RegisterPage() {
  usePageTitle('Create account');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const level = useMemo(() => strength(form.password), [form.password]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    const u = form.username.trim();
    if (u.length < 3 || u.length > 80) e.username = 'Username must be 3–80 characters';
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 8 || form.password.length > 72) e.password = 'Password must be 8–72 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await authApi.register({ username: form.username.trim(), email: form.email.trim(), password: form.password });
      const user = signIn(res);
      navigate(user.onboardingCompleted ? '/home' : '/onboarding', { replace: true });
    } catch (err) {
      const fe = getFieldErrors(err);
      if (err.response?.status === 409) setErrors({ email: 'Email is already registered' });
      else if (Object.keys(fe).length) setErrors(fe);
      else toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. It takes less than a minute."
      footer={<>Already have an account? <Link to="/login" className="text-primary-400 font-semibold hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormField label="Username" name="username" autoComplete="username" value={form.username} onChange={set('username')} error={errors.username} />
        <FormField label="Email" type="email" name="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <FormField label="Password" type="password" name="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password}>
          {form.password && (
            <div className="mt-2 flex items-center gap-2" aria-live="polite">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= level ? LEVELS[level].color : 'bg-white/10'}`} />)}
              </div>
              <span className="text-xs text-ink-muted w-16 text-right">{LEVELS[level].label}</span>
            </div>
          )}
        </FormField>
        <FormField label="Confirm password" type="password" name="confirm" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <GradientButton type="submit" loading={loading} className="w-full">Create account</GradientButton>
      </form>
    </AuthLayout>
  );
}
