import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import DashboardLayout from './layout/DashboardLayout';
import AuthGuard, { ProGuard } from './AuthGuard';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CampaignsPage from '../pages/dashboard/CampaignsPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import UpgradePage from '../pages/dashboard/UpgradePage';
import GiveawayCreatePage from '../pages/giveaway/GiveawayCreatePage';
import PricingPage from '../pages/PricingPage';
import ExamplesPage from '../pages/ExamplesPage';
import NotFoundPage from '../pages/NotFoundPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Route>

        {/* Protected routes with dashboard layout */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/campaigns" element={<CampaignsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/upgrade" element={<UpgradePage />} />
          </Route>
        </Route>

        {/* Pro routes (require pro subscription) */}
        <Route element={<ProGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/giveaway/create" element={<GiveawayCreatePage />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;