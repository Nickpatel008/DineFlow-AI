import { Routes, Route } from 'react-router-dom';
import OwnerLayout from '../../components/layouts/OwnerLayout';
import DashboardHome from './DashboardHome';
import TablesPage from './TablesPage';
import MenuPage from './MenuPage';
import OrdersPage from './OrdersPage';
import BillsPage from './BillsPage';
import BillingConfigurationPage from './BillingConfigurationPage';
import LoyaltyEnginePage from './LoyaltyEnginePage';
import CouponEnginePage from './CouponEnginePage';
import ProfilePage from './ProfilePage';

const OwnerDashboard = () => {
  return (
    <OwnerLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/billing-configuration" element={<BillingConfigurationPage />} />
        <Route path="/loyalty" element={<LoyaltyEnginePage />} />
        <Route path="/coupons" element={<CouponEnginePage />} />
        <Route path="/settings" element={<ProfilePage />} />
      </Routes>
    </OwnerLayout>
  );
};

export default OwnerDashboard;






