import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalLoadingIndicator } from './ui';
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
import CampaignDetailPage from '../pages/dashboard/CampaignDetailPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import NotificationsPage from '../pages/dashboard/NotificationsPage';
import UpgradePage from '../pages/dashboard/UpgradePage';
import UpgradeSuccessPage from '../pages/dashboard/UpgradeSuccessPage';
import TemplatesPage from '../pages/dashboard/TemplatesPage';
import WinnerSelectionPage from '../pages/dashboard/WinnerSelectionPage';
import PerformancePage from '../pages/dashboard/analytics/PerformancePage';
import ParticipantsPage from '../pages/dashboard/analytics/ParticipantsPage';
import EmailIntegrationsPage from '../pages/dashboard/integrations/EmailIntegrationsPage';
import SocialIntegrationsPage from '../pages/dashboard/integrations/SocialIntegrationsPage';
import MediaLibraryPage from '../pages/dashboard/MediaLibraryPage';
import HelpSupportPage from '../pages/dashboard/HelpSupportPage';
import GiveawayCreatePage from '../pages/giveaway/GiveawayCreatePage';
import GiveawayEntryPage from '../pages/giveaway/GiveawayEntryPage';
import PricingPage from '../pages/PricingPage';
import ExamplesPage from '../pages/ExamplesPage';
import ShopsPage from '../pages/ShopsPage';
import LocalPage from '../pages/LocalPage';
import AuthorsPage from '../pages/AuthorsPage';
import InfluencersPage from '../pages/InfluencersPage';
import NotFoundPage from '../pages/NotFoundPage';
import AboutPage from '../pages/AboutPage';

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalLoadingIndicator />
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
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/local" element={<LocalPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/influencers" element={<InfluencersPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/giveaway/:slug" element={<GiveawayEntryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Protected routes with dashboard layout */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            {/* Core Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Campaign Management */}
            <Route path="/dashboard/campaigns" element={<CampaignsPage />} />
            <Route path="/dashboard/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/dashboard/winners" element={<WinnerSelectionPage />} />
            
            {/* Account and Settings */}
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/upgrade" element={<UpgradePage />} />
            <Route path="/dashboard/upgrade/success" element={<UpgradeSuccessPage />} />
            <Route path="/dashboard/support" element={<HelpSupportPage />} />
          </Route>
        </Route>

        {/* Pro routes (require pro subscription) */}
        <Route element={<ProGuard />}>
          <Route element={<DashboardLayout />}>
            {/* Campaign Creation and Templates */}
            <Route path="/dashboard/giveaway/create" element={<GiveawayCreatePage />} />
            <Route path="/dashboard/templates" element={<TemplatesPage />} />
            
            {/* Analytics */}
            <Route path="/dashboard/analytics/performance" element={<PerformancePage />} />
            <Route path="/dashboard/analytics/participants" element={<ParticipantsPage />} />
            
            {/* Integrations */}
            <Route path="/dashboard/integrations/email" element={<EmailIntegrationsPage />} />
            <Route path="/dashboard/integrations/social" element={<SocialIntegrationsPage />} />
            
            {/* Media Library */}
            <Route path="/dashboard/media" element={<MediaLibraryPage />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;