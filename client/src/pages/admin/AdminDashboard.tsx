import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import RestaurantsPage from './RestaurantsPage';
import OwnersPage from './OwnersPage';
import DashboardHome from './DashboardHome';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';
import StatisticsPage from './StatisticsPage';
import PricingPage from './PricingPage';
import SubscriptionsPage from './SubscriptionsPage';
import OverviewPage from './OverviewPage';
import RolesFeaturesPage from './RolesFeaturesPage';
import WorkflowVisualizationPage from './WorkflowVisualizationPage';
import ActivityLogsPage from './ActivityLogsPage';
import LoyaltyEnginePage from './LoyaltyEnginePage';
import CouponEnginePage from './CouponEnginePage';
import POSIntegrationPage from './POSIntegrationPage';
import APIAccessPage from './APIAccessPage';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/roles-features" element={<RolesFeaturesPage />} />
        <Route path="/workflows" element={<WorkflowVisualizationPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/owners" element={<OwnersPage />} />
        <Route path="/analytics" element={<StatisticsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/activity-logs" element={<ActivityLogsPage />} />
        <Route path="/loyalty-engine" element={<LoyaltyEnginePage />} />
        <Route path="/coupon-engine" element={<CouponEnginePage />} />
        <Route path="/pos-integration" element={<POSIntegrationPage />} />
        <Route path="/api-access" element={<APIAccessPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;



