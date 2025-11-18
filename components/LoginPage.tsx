
import React, { useState } from 'react';
import { User } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import Input from './common/Input';
import Logo from './common/Logo';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@velux.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: 'Alex Johnson',
        email: email,
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Logo className="justify-center text-4xl" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Welcome to VeluXpress
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Sign in to your account
            </p>
        </div>
        
        <Card className="p-8 shadow-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <Input
                            id="password-input"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Button type="submit" isLoading={isLoading} className="w-full justify-center py-3">
                        Sign in
                    </Button>
                </div>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;