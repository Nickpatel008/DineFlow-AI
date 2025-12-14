import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Shield,
  Store,
  Users,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Settings,
  BarChart3,
  CreditCard,
  Receipt,
  QrCode,
  ShoppingCart,
  Menu as MenuIcon,
  FileText,
  UserPlus,
  Eye,
  Scan,
  DollarSign,
  Key,
  Activity,
  Gift,
  Ticket,
  Link2,
  Target,
  GitBranch,
  Route,
  Network,
  Lock,
  Layers,
} from 'lucide-react';

interface WorkflowType {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface WorkflowData {
  id: string;
  name: string;
  icon: any;
  color: string;
  workflowTypes: {
    [key: string]: {
      nodes: Node[];
      edges: Edge[];
      description: string;
    };
  };
}

const WorkflowVisualizationPage = () => {
  const [activeRole, setActiveRole] = useState<string>('super-admin');
  const [activeWorkflowType, setActiveWorkflowType] = useState<string>('user-flow');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Workflow Type Definitions
  const workflowTypes: WorkflowType[] = [
    { id: 'user-flow', name: 'User Flow', icon: Route, description: 'Step-by-step actions a user performs' },
    { id: 'task-flow', name: 'Task Flow', icon: Target, description: 'Focused flow for completing one task' },
    { id: 'process-flow', name: 'Process Flow', icon: GitBranch, description: 'Technical backend-oriented sequence' },
    { id: 'customer-journey', name: 'Customer Journey', icon: Network, description: 'High-level journey from entry to goal' },
    { id: 'rbac', name: 'RBAC / Permission Matrix', icon: Lock, description: 'Role-based access control and permissions' },
    { id: 'feature-implementation', name: 'Feature Implementation', icon: Layers, description: 'Step-by-step feature breakdown' },
  ];

  // Helper function to create node style
  const createNodeStyle = (color: string, bgColor: string) => ({
    background: bgColor,
    border: `2px solid ${color}`,
    borderRadius: '12px',
    padding: '10px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#1f2937',
    minWidth: 180,
    textAlign: 'center' as const,
  });

  // Super Admin Workflows
  const superAdminWorkflows = useMemo(() => {
    const purple = '#8b5cf6';
    const purpleBg = '#ede9fe';
    const nodeStyle = createNodeStyle(purple, '#f3f4f6');

    // User Flow
    const userFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Login as Super Admin' }, style: { ...nodeStyle, background: purpleBg, borderColor: purple } },
      { id: 'dashboard', position: { x: 400, y: 150 }, data: { label: 'View Dashboard\nOverview' }, style: nodeStyle },
      { id: 'restaurants', position: { x: 100, y: 280 }, data: { label: 'Manage Restaurants\nCreate/Edit/Delete' }, style: nodeStyle },
      { id: 'owners', position: { x: 300, y: 280 }, data: { label: 'Manage Owners\nAccount Management' }, style: nodeStyle },
      { id: 'analytics', position: { x: 500, y: 280 }, data: { label: 'View Analytics\nStatistics & Reports' }, style: nodeStyle },
      { id: 'pricing', position: { x: 700, y: 280 }, data: { label: 'Manage Pricing\nCreate Plans' }, style: nodeStyle },
      { id: 'subscriptions', position: { x: 200, y: 420 }, data: { label: 'Manage Subscriptions\nTrack & Update' }, style: nodeStyle },
      { id: 'settings', position: { x: 400, y: 420 }, data: { label: 'Configure Settings\nPlatform Config' }, style: nodeStyle },
      { id: 'logout', position: { x: 600, y: 420 }, data: { label: 'Logout' }, style: nodeStyle },
    ];

    const userFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'dashboard', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'dashboard', target: 'restaurants', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'dashboard', target: 'owners', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'dashboard', target: 'analytics', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'dashboard', target: 'pricing', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'pricing', target: 'subscriptions', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'restaurants', target: 'subscriptions', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'analytics', target: 'settings', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'settings', target: 'logout', type: 'smoothstep', animated: true },
    ];

    // Task Flow - Create Restaurant
    const taskFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Start: Create Restaurant' }, style: { ...nodeStyle, background: purpleBg, borderColor: purple } },
      { id: 'fill-details', position: { x: 400, y: 150 }, data: { label: 'Fill Restaurant Details\nName, Address, Contact' }, style: nodeStyle },
      { id: 'upload-images', position: { x: 200, y: 280 }, data: { label: 'Upload Images\nLogo & Photos' }, style: nodeStyle },
      { id: 'assign-owner', position: { x: 400, y: 280 }, data: { label: 'Assign/Create Owner\nLink Owner Account' }, style: nodeStyle },
      { id: 'set-plan', position: { x: 600, y: 280 }, data: { label: 'Select Pricing Plan\nChoose Subscription' }, style: nodeStyle },
      { id: 'activate', position: { x: 400, y: 410 }, data: { label: 'Activate Restaurant\nEnable Access' }, style: nodeStyle },
      { id: 'complete', position: { x: 400, y: 510 }, data: { label: 'Task Complete' }, style: nodeStyle },
    ];

    const taskFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'fill-details', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'fill-details', target: 'upload-images', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'fill-details', target: 'assign-owner', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'fill-details', target: 'set-plan', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'upload-images', target: 'activate', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'assign-owner', target: 'activate', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'set-plan', target: 'activate', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'activate', target: 'complete', type: 'smoothstep', animated: true },
    ];

    // Process Flow - Subscription Management
    const processFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Subscription Request' }, style: { ...nodeStyle, background: purpleBg, borderColor: purple } },
      { id: 'validate', position: { x: 400, y: 150 }, data: { label: 'Validate Request\nCheck Data' }, style: nodeStyle },
      { id: 'check-plan', position: { x: 200, y: 280 }, data: { label: 'Check Plan Availability\nVerify Pricing' }, style: nodeStyle },
      { id: 'create-sub', position: { x: 400, y: 280 }, data: { label: 'Create Subscription\nDB Transaction' }, style: nodeStyle },
      { id: 'process-payment', position: { x: 600, y: 280 }, data: { label: 'Process Payment\nPayment Gateway' }, style: nodeStyle },
      { id: 'send-notification', position: { x: 300, y: 410 }, data: { label: 'Send Notification\nEmail/SMS' }, style: nodeStyle },
      { id: 'update-status', position: { x: 500, y: 410 }, data: { label: 'Update Status\nActivate Account' }, style: nodeStyle },
      { id: 'complete', position: { x: 400, y: 530 }, data: { label: 'Process Complete' }, style: nodeStyle },
    ];

    const processFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'validate', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'validate', target: 'check-plan', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'check-plan', target: 'create-sub', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'create-sub', target: 'process-payment', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'process-payment', target: 'send-notification', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'process-payment', target: 'update-status', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'send-notification', target: 'complete', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'update-status', target: 'complete', type: 'smoothstep', animated: true },
    ];

    // Customer Journey
    const customerJourneyNodes: Node[] = [
      { id: 'awareness', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Awareness\nRestaurant Discovers Platform' }, style: { ...nodeStyle, background: purpleBg, borderColor: purple } },
      { id: 'interest', position: { x: 300, y: 50 }, data: { label: 'Interest\nReviews Features & Pricing' }, style: nodeStyle },
      { id: 'decision', position: { x: 500, y: 50 }, data: { label: 'Decision\nSelects Plan & Signs Up' }, style: nodeStyle },
      { id: 'onboarding', position: { x: 200, y: 200 }, data: { label: 'Onboarding\nSetup Restaurant Profile' }, style: nodeStyle },
      { id: 'activation', position: { x: 400, y: 200 }, data: { label: 'Activation\nGoes Live' }, style: nodeStyle },
      { id: 'usage', position: { x: 600, y: 200 }, data: { label: 'Usage\nDaily Operations' }, style: nodeStyle },
      { id: 'growth', position: { x: 300, y: 350 }, data: { label: 'Growth\nExpands Features' }, style: nodeStyle },
      { id: 'advocacy', position: { x: 500, y: 350 }, data: { label: 'Advocacy\nRefers Others' }, style: nodeStyle },
    ];

    const customerJourneyEdges: Edge[] = [
      { id: 'e1', source: 'awareness', target: 'interest', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'interest', target: 'decision', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'decision', target: 'onboarding', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'onboarding', target: 'activation', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'activation', target: 'usage', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'usage', target: 'growth', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'growth', target: 'advocacy', type: 'smoothstep', animated: true },
    ];

    // RBAC / Permission Matrix
    const rbacNodes: Node[] = [
      { id: 'role', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Super Admin Role' }, style: { ...nodeStyle, background: purpleBg, borderColor: purple } },
      { id: 'full-access', position: { x: 400, y: 150 }, data: { label: 'Full Platform Access\nAll Modules' }, style: nodeStyle },
      { id: 'restaurant-mgmt', position: { x: 100, y: 300 }, data: { label: 'Restaurant Management\nCRUD Operations' }, style: nodeStyle },
      { id: 'owner-mgmt', position: { x: 300, y: 300 }, data: { label: 'Owner Management\nFull Control' }, style: nodeStyle },
      { id: 'analytics-access', position: { x: 500, y: 300 }, data: { label: 'Analytics Access\nView All Data' }, style: nodeStyle },
      { id: 'billing-access', position: { x: 700, y: 300 }, data: { label: 'Billing Access\nManage Plans' }, style: nodeStyle },
      { id: 'system-config', position: { x: 200, y: 450 }, data: { label: 'System Configuration\nPlatform Settings' }, style: nodeStyle },
      { id: 'api-access', position: { x: 400, y: 450 }, data: { label: 'API Management\nKey Management' }, style: nodeStyle },
      { id: 'audit-access', position: { x: 600, y: 450 }, data: { label: 'Audit Logs\nView All Activities' }, style: nodeStyle },
    ];

    const rbacEdges: Edge[] = [
      { id: 'e1', source: 'role', target: 'full-access', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'full-access', target: 'restaurant-mgmt', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'full-access', target: 'owner-mgmt', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'full-access', target: 'analytics-access', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'full-access', target: 'billing-access', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'full-access', target: 'system-config', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'full-access', target: 'api-access', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'full-access', target: 'audit-access', type: 'smoothstep', animated: true },
    ];

    // Feature Implementation
    const featureImplNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Feature: Restaurant Management' }, style: { ...nodeStyle, background: purpleBg, borderColor: purple } },
      { id: 'design', position: { x: 400, y: 150 }, data: { label: 'Design Phase\nUI/UX Design' }, style: nodeStyle },
      { id: 'backend', position: { x: 200, y: 280 }, data: { label: 'Backend Development\nAPI Endpoints' }, style: nodeStyle },
      { id: 'frontend', position: { x: 400, y: 280 }, data: { label: 'Frontend Development\nReact Components' }, style: nodeStyle },
      { id: 'database', position: { x: 600, y: 280 }, data: { label: 'Database Schema\nPrisma Models' }, style: nodeStyle },
      { id: 'integration', position: { x: 300, y: 410 }, data: { label: 'Integration\nConnect Components' }, style: nodeStyle },
      { id: 'testing', position: { x: 500, y: 410 }, data: { label: 'Testing\nUnit & Integration' }, style: nodeStyle },
      { id: 'deploy', position: { x: 400, y: 530 }, data: { label: 'Deployment\nProduction Release' }, style: nodeStyle },
    ];

    const featureImplEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'design', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'design', target: 'backend', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'design', target: 'frontend', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'design', target: 'database', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'backend', target: 'integration', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'frontend', target: 'integration', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'database', target: 'integration', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'integration', target: 'testing', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'testing', target: 'deploy', type: 'smoothstep', animated: true },
    ];

    return {
      'user-flow': { nodes: userFlowNodes, edges: userFlowEdges, description: 'Complete user journey from login to logout' },
      'task-flow': { nodes: taskFlowNodes, edges: taskFlowEdges, description: 'Step-by-step process to create a new restaurant' },
      'process-flow': { nodes: processFlowNodes, edges: processFlowEdges, description: 'Backend process for subscription management' },
      'customer-journey': { nodes: customerJourneyNodes, edges: customerJourneyEdges, description: 'Restaurant journey from discovery to advocacy' },
      'rbac': { nodes: rbacNodes, edges: rbacEdges, description: 'Role-based access control and permission matrix' },
      'feature-implementation': { nodes: featureImplNodes, edges: featureImplEdges, description: 'Development workflow for feature implementation' },
    };
  }, []);

  // Restaurant Owner Workflows
  const ownerWorkflows = useMemo(() => {
    const orange = '#f59e0b';
    const orangeBg = '#fef3c7';
    const nodeStyle = createNodeStyle(orange, '#fef3c7');

    // User Flow
    const userFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Login as Owner' }, style: { ...nodeStyle, background: orangeBg, borderColor: orange } },
      { id: 'dashboard', position: { x: 400, y: 150 }, data: { label: 'View Dashboard\nPerformance Overview' }, style: nodeStyle },
      { id: 'tables', position: { x: 100, y: 280 }, data: { label: 'Manage Tables\nCreate & QR Codes' }, style: nodeStyle },
      { id: 'menu', position: { x: 300, y: 280 }, data: { label: 'Manage Menu\nItems & Categories' }, style: nodeStyle },
      { id: 'orders', position: { x: 500, y: 280 }, data: { label: 'View Orders\nProcess & Update' }, style: nodeStyle },
      { id: 'bills', position: { x: 700, y: 280 }, data: { label: 'Generate Bills\nCreate Invoices' }, style: nodeStyle },
      { id: 'analytics', position: { x: 200, y: 420 }, data: { label: 'View Analytics\nRestaurant Stats' }, style: nodeStyle },
      { id: 'settings', position: { x: 400, y: 420 }, data: { label: 'Restaurant Settings\nConfigure Details' }, style: nodeStyle },
      { id: 'billing', position: { x: 600, y: 420 }, data: { label: 'Billing Config\nTax & Invoice' }, style: nodeStyle },
    ];

    const userFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'dashboard', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'dashboard', target: 'tables', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'dashboard', target: 'menu', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'tables', target: 'orders', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'menu', target: 'orders', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'orders', target: 'bills', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'orders', target: 'analytics', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'dashboard', target: 'settings', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'bills', target: 'billing', type: 'smoothstep', animated: true },
    ];

    // Task Flow - Process Order
    const taskFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'New Order Received' }, style: { ...nodeStyle, background: orangeBg, borderColor: orange } },
      { id: 'view-order', position: { x: 400, y: 150 }, data: { label: 'View Order Details\nItems & Customer' }, style: nodeStyle },
      { id: 'confirm-order', position: { x: 200, y: 280 }, data: { label: 'Confirm Order\nAccept Order' }, style: nodeStyle },
      { id: 'send-kitchen', position: { x: 400, y: 280 }, data: { label: 'Send to Kitchen\nUpdate Status' }, style: nodeStyle },
      { id: 'track-status', position: { x: 600, y: 280 }, data: { label: 'Track Status\nMonitor Progress' }, style: nodeStyle },
      { id: 'order-ready', position: { x: 300, y: 410 }, data: { label: 'Order Ready\nNotify Customer' }, style: nodeStyle },
      { id: 'generate-bill', position: { x: 500, y: 410 }, data: { label: 'Generate Bill\nCreate Invoice' }, style: nodeStyle },
      { id: 'complete', position: { x: 400, y: 530 }, data: { label: 'Order Complete' }, style: nodeStyle },
    ];

    const taskFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'view-order', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'view-order', target: 'confirm-order', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'confirm-order', target: 'send-kitchen', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'send-kitchen', target: 'track-status', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'track-status', target: 'order-ready', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'order-ready', target: 'generate-bill', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'generate-bill', target: 'complete', type: 'smoothstep', animated: true },
    ];

    // Process Flow - Order Processing
    const processFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Order Created' }, style: { ...nodeStyle, background: orangeBg, borderColor: orange } },
      { id: 'validate', position: { x: 400, y: 150 }, data: { label: 'Validate Order\nCheck Items' }, style: nodeStyle },
      { id: 'check-stock', position: { x: 200, y: 280 }, data: { label: 'Check Inventory\nVerify Availability' }, style: nodeStyle },
      { id: 'calculate', position: { x: 400, y: 280 }, data: { label: 'Calculate Total\nApply Discounts' }, style: nodeStyle },
      { id: 'save-db', position: { x: 600, y: 280 }, data: { label: 'Save to Database\nCreate Record' }, style: nodeStyle },
      { id: 'notify', position: { x: 300, y: 410 }, data: { label: 'Send Notifications\nEmail/SMS' }, style: nodeStyle },
      { id: 'update-status', position: { x: 500, y: 410 }, data: { label: 'Update Status\nPENDING → CONFIRMED' }, style: nodeStyle },
      { id: 'complete', position: { x: 400, y: 530 }, data: { label: 'Process Complete' }, style: nodeStyle },
    ];

    const processFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'validate', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'validate', target: 'check-stock', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'check-stock', target: 'calculate', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'calculate', target: 'save-db', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'save-db', target: 'notify', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'save-db', target: 'update-status', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'notify', target: 'complete', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'update-status', target: 'complete', type: 'smoothstep', animated: true },
    ];

    // Customer Journey
    const customerJourneyNodes: Node[] = [
      { id: 'signup', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Sign Up\nCreate Account' }, style: { ...nodeStyle, background: orangeBg, borderColor: orange } },
      { id: 'setup', position: { x: 300, y: 50 }, data: { label: 'Initial Setup\nConfigure Restaurant' }, style: nodeStyle },
      { id: 'add-menu', position: { x: 500, y: 50 }, data: { label: 'Add Menu Items\nCreate Menu' }, style: nodeStyle },
      { id: 'create-tables', position: { x: 200, y: 200 }, data: { label: 'Create Tables\nGenerate QR Codes' }, style: nodeStyle },
      { id: 'go-live', position: { x: 400, y: 200 }, data: { label: 'Go Live\nStart Operations' }, style: nodeStyle },
      { id: 'receive-orders', position: { x: 600, y: 200 }, data: { label: 'Receive Orders\nProcess Daily' }, style: nodeStyle },
      { id: 'analyze', position: { x: 300, y: 350 }, data: { label: 'Analyze Performance\nView Analytics' }, style: nodeStyle },
      { id: 'optimize', position: { x: 500, y: 350 }, data: { label: 'Optimize Operations\nImprove Efficiency' }, style: nodeStyle },
    ];

    const customerJourneyEdges: Edge[] = [
      { id: 'e1', source: 'signup', target: 'setup', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'setup', target: 'add-menu', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'add-menu', target: 'create-tables', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'create-tables', target: 'go-live', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'go-live', target: 'receive-orders', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'receive-orders', target: 'analyze', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'analyze', target: 'optimize', type: 'smoothstep', animated: true },
    ];

    // RBAC
    const rbacNodes: Node[] = [
      { id: 'role', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Restaurant Owner Role' }, style: { ...nodeStyle, background: orangeBg, borderColor: orange } },
      { id: 'restaurant-access', position: { x: 400, y: 150 }, data: { label: 'Restaurant Access\nOwn Restaurant Only' }, style: nodeStyle },
      { id: 'menu-mgmt', position: { x: 100, y: 300 }, data: { label: 'Menu Management\nFull CRUD' }, style: nodeStyle },
      { id: 'table-mgmt', position: { x: 300, y: 300 }, data: { label: 'Table Management\nCreate & Manage' }, style: nodeStyle },
      { id: 'order-mgmt', position: { x: 500, y: 300 }, data: { label: 'Order Management\nView & Update' }, style: nodeStyle },
      { id: 'bill-mgmt', position: { x: 700, y: 300 }, data: { label: 'Bill Management\nGenerate Invoices' }, style: nodeStyle },
      { id: 'analytics-view', position: { x: 200, y: 450 }, data: { label: 'Analytics View\nOwn Data Only' }, style: nodeStyle },
      { id: 'settings-edit', position: { x: 400, y: 450 }, data: { label: 'Settings Edit\nOwn Restaurant' }, style: nodeStyle },
      { id: 'billing-config', position: { x: 600, y: 450 }, data: { label: 'Billing Config\nTax & Invoice' }, style: nodeStyle },
    ];

    const rbacEdges: Edge[] = [
      { id: 'e1', source: 'role', target: 'restaurant-access', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'restaurant-access', target: 'menu-mgmt', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'restaurant-access', target: 'table-mgmt', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'restaurant-access', target: 'order-mgmt', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'restaurant-access', target: 'bill-mgmt', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'restaurant-access', target: 'analytics-view', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'restaurant-access', target: 'settings-edit', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'restaurant-access', target: 'billing-config', type: 'smoothstep', animated: true },
    ];

    // Feature Implementation
    const featureImplNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Feature: Order Management' }, style: { ...nodeStyle, background: orangeBg, borderColor: orange } },
      { id: 'design', position: { x: 400, y: 150 }, data: { label: 'Design UI\nOrder List & Details' }, style: nodeStyle },
      { id: 'api', position: { x: 200, y: 280 }, data: { label: 'Create API\nEndpoints' }, style: nodeStyle },
      { id: 'components', position: { x: 400, y: 280 }, data: { label: 'Build Components\nReact UI' }, style: nodeStyle },
      { id: 'status-flow', position: { x: 600, y: 280 }, data: { label: 'Status Flow\nState Management' }, style: nodeStyle },
      { id: 'real-time', position: { x: 300, y: 410 }, data: { label: 'Real-time Updates\nWebSocket' }, style: nodeStyle },
      { id: 'notifications', position: { x: 500, y: 410 }, data: { label: 'Notifications\nEmail/SMS' }, style: nodeStyle },
      { id: 'deploy', position: { x: 400, y: 530 }, data: { label: 'Deploy Feature' }, style: nodeStyle },
    ];

    const featureImplEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'design', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'design', target: 'api', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'design', target: 'components', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'design', target: 'status-flow', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'api', target: 'real-time', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'components', target: 'real-time', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'status-flow', target: 'notifications', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'real-time', target: 'deploy', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'notifications', target: 'deploy', type: 'smoothstep', animated: true },
    ];

    return {
      'user-flow': { nodes: userFlowNodes, edges: userFlowEdges, description: 'Complete owner workflow from login to daily operations' },
      'task-flow': { nodes: taskFlowNodes, edges: taskFlowEdges, description: 'Step-by-step process to handle a new order' },
      'process-flow': { nodes: processFlowNodes, edges: processFlowEdges, description: 'Backend process for order creation and processing' },
      'customer-journey': { nodes: customerJourneyNodes, edges: customerJourneyEdges, description: 'Owner journey from signup to optimization' },
      'rbac': { nodes: rbacNodes, edges: rbacEdges, description: 'Owner role permissions and access control' },
      'feature-implementation': { nodes: featureImplNodes, edges: featureImplEdges, description: 'Development workflow for order management feature' },
    };
  }, []);

  // Customer Workflows
  const customerWorkflows = useMemo(() => {
    const blue = '#3b82f6';
    const blueBg = '#dbeafe';
    const nodeStyle = createNodeStyle(blue, '#dbeafe');

    // User Flow
    const userFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Arrive at Restaurant' }, style: { ...nodeStyle, background: blueBg, borderColor: blue } },
      { id: 'scan-qr', position: { x: 400, y: 150 }, data: { label: 'Scan QR Code\nOn Table' }, style: nodeStyle },
      { id: 'view-menu', position: { x: 400, y: 250 }, data: { label: 'View Menu\nBrowse Items' }, style: nodeStyle },
      { id: 'add-cart', position: { x: 200, y: 350 }, data: { label: 'Add to Cart\nSelect Items' }, style: nodeStyle },
      { id: 'review', position: { x: 400, y: 350 }, data: { label: 'Review Cart\nCheck Items' }, style: nodeStyle },
      { id: 'place-order', position: { x: 600, y: 350 }, data: { label: 'Place Order\nConfirm' }, style: nodeStyle },
      { id: 'confirmation', position: { x: 400, y: 450 }, data: { label: 'Order Confirmation\nView Receipt' }, style: nodeStyle },
      { id: 'wait', position: { x: 200, y: 550 }, data: { label: 'Wait for Food\nOrder Processing' }, style: nodeStyle },
      { id: 'receive', position: { x: 400, y: 550 }, data: { label: 'Receive Order\nFood Served' }, style: nodeStyle },
      { id: 'pay', position: { x: 600, y: 550 }, data: { label: 'Pay Bill\nComplete Payment' }, style: nodeStyle },
    ];

    const userFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'scan-qr', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'scan-qr', target: 'view-menu', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'view-menu', target: 'add-cart', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'add-cart', target: 'review', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'review', target: 'place-order', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'place-order', target: 'confirmation', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'confirmation', target: 'wait', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'wait', target: 'receive', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'receive', target: 'pay', type: 'smoothstep', animated: true },
    ];

    // Task Flow - Place Order
    const taskFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Task: Place Order' }, style: { ...nodeStyle, background: blueBg, borderColor: blue } },
      { id: 'browse', position: { x: 400, y: 150 }, data: { label: 'Browse Menu\nSelect Items' }, style: nodeStyle },
      { id: 'add-item', position: { x: 200, y: 280 }, data: { label: 'Add Item\nTo Cart' }, style: nodeStyle },
      { id: 'modify', position: { x: 400, y: 280 }, data: { label: 'Modify Cart\nAdd/Remove Items' }, style: nodeStyle },
      { id: 'checkout', position: { x: 600, y: 280 }, data: { label: 'Proceed to Checkout\nReview Order' }, style: nodeStyle },
      { id: 'confirm', position: { x: 300, y: 410 }, data: { label: 'Confirm Order\nFinal Check' }, style: nodeStyle },
      { id: 'submit', position: { x: 500, y: 410 }, data: { label: 'Submit Order\nPlace Order' }, style: nodeStyle },
      { id: 'complete', position: { x: 400, y: 530 }, data: { label: 'Task Complete' }, style: nodeStyle },
    ];

    const taskFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'browse', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'browse', target: 'add-item', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'add-item', target: 'modify', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'modify', target: 'checkout', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'checkout', target: 'confirm', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'confirm', target: 'submit', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'submit', target: 'complete', type: 'smoothstep', animated: true },
    ];

    // Process Flow - Order Submission
    const processFlowNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Order Submission' }, style: { ...nodeStyle, background: blueBg, borderColor: blue } },
      { id: 'validate', position: { x: 400, y: 150 }, data: { label: 'Validate Order\nCheck Items' }, style: nodeStyle },
      { id: 'calculate', position: { x: 200, y: 280 }, data: { label: 'Calculate Total\nApply Discounts' }, style: nodeStyle },
      { id: 'create-order', position: { x: 400, y: 280 }, data: { label: 'Create Order\nAPI Call' }, style: nodeStyle },
      { id: 'save-db', position: { x: 600, y: 280 }, data: { label: 'Save to Database\nStore Order' }, style: nodeStyle },
      { id: 'notify', position: { x: 300, y: 410 }, data: { label: 'Notify Restaurant\nSend Alert' }, style: nodeStyle },
      { id: 'confirm', position: { x: 500, y: 410 }, data: { label: 'Send Confirmation\nTo Customer' }, style: nodeStyle },
      { id: 'complete', position: { x: 400, y: 530 }, data: { label: 'Process Complete' }, style: nodeStyle },
    ];

    const processFlowEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'validate', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'validate', target: 'calculate', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'calculate', target: 'create-order', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'create-order', target: 'save-db', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'save-db', target: 'notify', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'save-db', target: 'confirm', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'notify', target: 'complete', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'confirm', target: 'complete', type: 'smoothstep', animated: true },
    ];

    // Customer Journey
    const customerJourneyNodes: Node[] = [
      { id: 'discover', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Discover\nEnter Restaurant' }, style: { ...nodeStyle, background: blueBg, borderColor: blue } },
      { id: 'scan', position: { x: 300, y: 50 }, data: { label: 'Scan QR\nAccess Menu' }, style: nodeStyle },
      { id: 'explore', position: { x: 500, y: 50 }, data: { label: 'Explore Menu\nBrowse Options' }, style: nodeStyle },
      { id: 'select', position: { x: 200, y: 200 }, data: { label: 'Select Items\nAdd to Cart' }, style: nodeStyle },
      { id: 'order', position: { x: 400, y: 200 }, data: { label: 'Place Order\nConfirm Purchase' }, style: nodeStyle },
      { id: 'wait', position: { x: 600, y: 200 }, data: { label: 'Wait\nFood Preparation' }, style: nodeStyle },
      { id: 'enjoy', position: { x: 300, y: 350 }, data: { label: 'Enjoy Meal\nReceive Food' }, style: nodeStyle },
      { id: 'pay', position: { x: 500, y: 350 }, data: { label: 'Pay & Leave\nComplete Experience' }, style: nodeStyle },
    ];

    const customerJourneyEdges: Edge[] = [
      { id: 'e1', source: 'discover', target: 'scan', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'scan', target: 'explore', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'explore', target: 'select', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'select', target: 'order', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'order', target: 'wait', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'wait', target: 'enjoy', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'enjoy', target: 'pay', type: 'smoothstep', animated: true },
    ];

    // RBAC
    const rbacNodes: Node[] = [
      { id: 'role', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Customer Role\n(No Login Required)' }, style: { ...nodeStyle, background: blueBg, borderColor: blue } },
      { id: 'public-access', position: { x: 400, y: 150 }, data: { label: 'Public Access\nView Menu Only' }, style: nodeStyle },
      { id: 'view-menu', position: { x: 200, y: 300 }, data: { label: 'View Menu\nBrowse Items' }, style: nodeStyle },
      { id: 'add-cart', position: { x: 400, y: 300 }, data: { label: 'Add to Cart\nSelect Items' }, style: nodeStyle },
      { id: 'place-order', position: { x: 600, y: 300 }, data: { label: 'Place Order\nSubmit Order' }, style: nodeStyle },
      { id: 'view-confirmation', position: { x: 300, y: 450 }, data: { label: 'View Confirmation\nSee Receipt' }, style: nodeStyle },
      { id: 'no-edit', position: { x: 500, y: 450 }, data: { label: 'No Edit Access\nCannot Modify Orders' }, style: nodeStyle },
    ];

    const rbacEdges: Edge[] = [
      { id: 'e1', source: 'role', target: 'public-access', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'public-access', target: 'view-menu', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'view-menu', target: 'add-cart', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'add-cart', target: 'place-order', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'place-order', target: 'view-confirmation', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'public-access', target: 'no-edit', type: 'smoothstep', animated: true },
    ];

    // Feature Implementation
    const featureImplNodes: Node[] = [
      { id: 'start', type: 'input', position: { x: 400, y: 50 }, data: { label: 'Feature: QR Menu' }, style: { ...nodeStyle, background: blueBg, borderColor: blue } },
      { id: 'design', position: { x: 400, y: 150 }, data: { label: 'Design UI\nMenu Display' }, style: nodeStyle },
      { id: 'qr-gen', position: { x: 200, y: 280 }, data: { label: 'QR Generation\nTable Codes' }, style: nodeStyle },
      { id: 'menu-api', position: { x: 400, y: 280 }, data: { label: 'Menu API\nFetch Items' }, style: nodeStyle },
      { id: 'cart', position: { x: 600, y: 280 }, data: { label: 'Shopping Cart\nState Management' }, style: nodeStyle },
      { id: 'order-api', position: { x: 300, y: 410 }, data: { label: 'Order API\nSubmit Order' }, style: nodeStyle },
      { id: 'responsive', position: { x: 500, y: 410 }, data: { label: 'Responsive Design\nMobile First' }, style: nodeStyle },
      { id: 'deploy', position: { x: 400, y: 530 }, data: { label: 'Deploy Feature' }, style: nodeStyle },
    ];

    const featureImplEdges: Edge[] = [
      { id: 'e1', source: 'start', target: 'design', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'design', target: 'qr-gen', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'design', target: 'menu-api', type: 'smoothstep', animated: true },
      { id: 'e4', source: 'design', target: 'cart', type: 'smoothstep', animated: true },
      { id: 'e5', source: 'qr-gen', target: 'order-api', type: 'smoothstep', animated: true },
      { id: 'e6', source: 'menu-api', target: 'order-api', type: 'smoothstep', animated: true },
      { id: 'e7', source: 'cart', target: 'responsive', type: 'smoothstep', animated: true },
      { id: 'e8', source: 'order-api', target: 'deploy', type: 'smoothstep', animated: true },
      { id: 'e9', source: 'responsive', target: 'deploy', type: 'smoothstep', animated: true },
    ];

    return {
      'user-flow': { nodes: userFlowNodes, edges: userFlowEdges, description: 'Complete customer journey from arrival to payment' },
      'task-flow': { nodes: taskFlowNodes, edges: taskFlowEdges, description: 'Step-by-step process to place an order' },
      'process-flow': { nodes: processFlowNodes, edges: processFlowEdges, description: 'Backend process for order submission' },
      'customer-journey': { nodes: customerJourneyNodes, edges: customerJourneyEdges, description: 'Customer experience journey from discovery to completion' },
      'rbac': { nodes: rbacNodes, edges: rbacEdges, description: 'Customer role permissions (public access, no login)' },
      'feature-implementation': { nodes: featureImplNodes, edges: featureImplEdges, description: 'Development workflow for QR menu feature' },
    };
  }, []);

  const roles: WorkflowData[] = useMemo(() => [
    { id: 'super-admin', name: 'Super Admin', icon: Shield, color: 'purple', workflowTypes: superAdminWorkflows },
    { id: 'restaurant-owner', name: 'Restaurant Owner', icon: Store, color: 'orange', workflowTypes: ownerWorkflows },
    { id: 'customer', name: 'Customer', icon: Users, color: 'blue', workflowTypes: customerWorkflows },
  ], [superAdminWorkflows, ownerWorkflows, customerWorkflows]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleRoleChange = useCallback((roleId: string) => {
    setActiveRole(roleId);
    setActiveWorkflowType('user-flow'); // Reset to default workflow type
  }, []);

  const handleWorkflowTypeChange = useCallback((typeId: string) => {
    setActiveWorkflowType(typeId);
  }, []);

  // Update nodes and edges when role or workflow type changes
  useEffect(() => {
    const role = roles.find((r) => r.id === activeRole);
    if (role && role.workflowTypes[activeWorkflowType]) {
      const workflow = role.workflowTypes[activeWorkflowType];
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
    }
  }, [activeRole, activeWorkflowType, roles, setNodes, setEdges]);

  const activeRoleData = roles.find((r) => r.id === activeRole) || roles[0];
  const activeWorkflowData = activeRoleData.workflowTypes[activeWorkflowType];
  const ActiveRoleIcon = activeRoleData.icon;
  const activeWorkflowTypeData = workflowTypes.find((wt) => wt.id === activeWorkflowType);

  return (
    <div className="py-6 pr-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Workflow Visualization
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Interactive flowcharts showing role-based workflows, processes, and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <motion.button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>{role.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Workflow Type Selection Tabs */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {workflowTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeWorkflowType === type.id;
            return (
              <motion.button
                key={type.id}
                onClick={() => handleWorkflowTypeChange(type.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={type.description}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>{type.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Workflow Info Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeRole}-${activeWorkflowType}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${
              activeRole === 'super-admin' ? 'bg-purple-100 dark:bg-purple-900/20' :
              activeRole === 'restaurant-owner' ? 'bg-orange-100 dark:bg-orange-900/20' :
              'bg-blue-100 dark:bg-blue-900/20'
            } rounded-lg flex items-center justify-center`}>
              <ActiveRoleIcon className={`w-6 h-6 ${
                activeRole === 'super-admin' ? 'text-purple-600 dark:text-purple-400' :
                activeRole === 'restaurant-owner' ? 'text-orange-600 dark:text-orange-400' :
                'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {activeRoleData.name} - {activeWorkflowTypeData?.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {activeWorkflowData?.description || 'Workflow visualization'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Steps</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {activeWorkflowData?.nodes.length || 0}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flowchart Canvas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ height: 'calc(100vh - 380px)', minHeight: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          attributionPosition="bottom-left"
          style={{ background: '#f9fafb' }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          }}
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls 
            showInteractive={false}
            style={{
              button: {
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                color: '#374151',
                width: '32px',
                height: '32px',
              }
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'input') return '#8b5cf6';
              return '#6b7280';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
            }}
            pannable
            zoomable
          />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">Start Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-400"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">Process Node</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Flow Direction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-100"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">Animated Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualizationPage;
