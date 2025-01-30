import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AppDashboard from "../agentadmindomain/dashboard/AppDashboard.vue";
import AppEntities from "../agentadmindomain/entities/AppEntities.vue";
import AppAgents from "../agentadmindomain/agents/AppAgents.vue";
import AppGateway from "../agentadmindomain/gateway/AppGateway.vue";
import Finances from "@/agentadmindomain/finances/Finances.vue";
import Services from "@/agentadmindomain/services/AppServices.vue";
import ServicesDetails from "@/agentadmindomain/servicesdetails/ServicesDetails.vue";
import Accounts from "@/agentadmindomain/accounts/Accounts.vue";
import Branches from "../agentadmindomain/branches/AppBranches.vue";
import DataAnalytics from "@/agentadmindomain/analytics/DataAnalytics.vue";
import Settings from "@/agentadmindomain/settings/Settings.vue";
import { routes as authRoutes } from "@/agentadmindomain/auth/routes";
import { useAuth } from "@/agentadmindomain/auth/composables";
import moment from "moment";
import DashboardTab from "@/agentadmindomain/dashboard/DashboardTab.vue";


// Import the branch manager domain components
import BranchManagerLayout from "@/layouts/BranchManagerLayout.vue";
import BranchManagerAppServices from "@/branchmanagerdomain/services/AppServices.vue";
import BranchManagerAppEntities from "@/branchmanagerdomain/entities/AppEntities.vue";
import BranchManagerAppAgents from "@/branchmanagerdomain/agents/AppAgents.vue";
// import BranchManagerBranches from "@/branchmanagerdomain/tills/Tills.vue";
import BranchManagerSettings from "@/branchmanagerdomain/settings/Settings.vue";
// import BranchManagerLedger from "@/branchmanagerdomain/ledger/Ledger.vue";
import BranchManagerServicesDetails from "@/branchmanagerdomain/servicesdetails/ServicesDetails.vue";
import BranchManagerAppGateway from "@/branchmanagerdomain/gateway/AppGateway.vue";
import BranchManagerAppFinances from "@/branchmanagerdomain/finances/Finances.vue";
import BranchManagerTills from "@/branchmanagerdomain/tills/Tills.vue";
import BranchManagerAccounts from "@/branchmanagerdomain/accounts/Accounts.vue";
import BranchManagerDataAnalytics from "@/branchmanagerdomain/analytics/DataAnalytics.vue";
import BranchManagerDashboardTab from "@/branchmanagerdomain/dashboard/DashboardTab.vue"
// import BranchManagerSubmissions from "@/branchmanagerdomain/submissions/Submissions.vue";
// import BranchManagerAppServicesDetails from "@/branchmanagerdomain/apiservices/views/ServiceDetails.vue";


// Import the agent domain components
import FormComposer from "@/tilloperatordomain/composer/FormComposer.vue";
import FormPreview from "@/tilloperatordomain/composer/FormPreview.vue";
import ComposerLayout from "@/layouts/ComposerLayout.vue";
import AgentLayout from "@/layouts/AgentLayout.vue";
import AgentAppServices from "@/tilloperatordomain/services/AppServices.vue";
import AgentAppServicesDetails from "@/tilloperatordomain/apiservices/views/ServiceDetails.vue";
import AgentAppEntities from "@/tilloperatordomain/entities/AppEntities.vue";
import AgentAppAgents from "@/tilloperatordomain/agents/AppAgents.vue";
import AgentBranches from "@/tilloperatordomain/branches/AppBranches.vue";
import AgentSettings from "@/tilloperatordomain/settings/Settings.vue";
import AgentLedger from "@/tilloperatordomain/ledger/Ledger.vue";
import AgentSubmissions from "@/tilloperatordomain/submissions/Submissions.vue";
import AgentServicesDetails from "@/tilloperatordomain/servicesdetails/ServicesDetails.vue";
import AgentAppGateway from "@/tilloperatordomain/gateway/AppGateway.vue";
import AgentAppFinances from "@/tilloperatordomain/finances/AppFinances.vue";
// import ApiServices from "@/tilloperatordomain/apiservices/Services.vue";
import ApiServices from "@/tilloperatordomain/apiservices/Services2.vue";
import ApiSubmissions from "@/tilloperatordomain/apisubmissions/ServiceApplications.vue";


// Merge appRoutes and appRoutes2
const mergedRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: "app-home" },
  },
  {
    path: "/agent-admin",
    name: "app-home",
    component: MainLayout,
    // meta: { requiresAuth: false },
    meta: { requiresAuth: false },
    redirect: "/agent-admin/dashboard",
    children: [
      // { name: "app-dashboard", path: "/agent-admin/dashboard", component: AppDashboard },
      { name: "app-dashboard", path: "/agent-admin/dashboard", component: DashboardTab },
      { name: "app-entities", path: "/agent-admin/entities", component: AppEntities },
      { name: "app-agents", path: "/agent-admin/agents", component: AppAgents },
      { name: "app-services", path: "/agent-admin/services", component: Services },
      { name: "app-branches", path: "/agent-admin/branches", component: Branches },
      { name: "app-accounts", path: "/agent-admin/accounts", component: Accounts },
      { name: "app-configurations", path: "/agent-admin/configurations", component: Settings },
      { name: "app-reports", path: "/agent-admin/data-analytics", component: DataAnalytics },
      { name: "app-services-details", path: "/agent-admin/services-details", component: ServicesDetails },
      { name: "app-billing", path: "/agent-admin/billing", component: Finances },
      { name: "app-gateway", path: "/agent-admin/gateway", component: AppGateway },
    ],
  },
  {
    path: "/branch-manager",
    name: "branch-manager-home",
    component: BranchManagerLayout,
    meta: { requiresAuth: false },
    // redirect: "/agent/services",
    redirect: "/branch-manager/dashboard",
    children: [
      { name: "branch-manager-app-dashboard", path: "/branch-manager/dashboard", component: BranchManagerDashboardTab },
      { name: "branch-manager-app-services", path: "/branch-manager/app-services", component: BranchManagerAppServices },
      { name: "branch-manager-app-entities", path: "/branch-manager/entities", component:BranchManagerAppEntities },
      { name: "branch-manager-app-agents", path: "/branch-manager/agents", component:BranchManagerAppAgents },
      { name: "branch-manager-app-branches", path: "/branch-manager/branches", component:BranchManagerTills },
      { name: "branch-manager-app-configurations", path: "/branch-manager/configurations", component:BranchManagerSettings },
      // { name: "branchmanager-app-ledger", path: "/branchmanagerdomain/ledger", component:BranchManagerLedger },
      { name: "branch-manager-app-services-details", path: "/branch-manager/services-details", component:BranchManagerServicesDetails },
      { name: "branch-manager-app-finances", path: "/branch-manager/finances", component:BranchManagerAppFinances },
      { name: "branch-manager-app-gateway", path: "/branch-manager/gateway", component:BranchManagerAppGateway },
      { name: "branch-manager-app-tills", path: "/branch-manager/tills", component:BranchManagerTills },
//       branch-manager-app-reports
// branch-manager-app-accounts
       { name: "branch-manager-app-reports", path: "/branch-manager/data-analytics", component: BranchManagerDataAnalytics },
       { name: "branch-manager-app-accounts", path: "/branch-manager/accounts", component: BranchManagerAccounts },
      // { name: "branchmanager-app-submissions", path: "/branchmanagerdomain/submissions", component:BranchManagerSubmissions },
      // { name: "branchmanager-api-app-submissions", path: "/branchmanagerdomain/api-submissions", component: ApiSubmissions },
      // { name: "api-services", path: "/branchmanagerdomain/api-services", component: ApiServices },
      // { name: "api-service-details", path: "/service/:id", component:BranchManagerAppServicesDetails },
    ],
  },
  {
    path: "/till-operator",
    name: "app-home2",
    component: AgentLayout,
    meta: { requiresAuth: false },
    // redirect: "/agent/services",
    redirect: "/till-operator/api-services",
    children: [
      { name: "agent-app-services", path: "/till-operator/services", component: AgentAppServices },
      { name: "agent-app-entities", path: "/till-operator/entities", component: AgentAppEntities },
      { name: "agent-app-agents", path: "/till-operator/agents", component: AgentAppAgents },
      { name: "agent-app-branches", path: "/till-operator/branches", component: AgentBranches },
      { name: "agent-app-configurations", path: "/till-operator/configurations", component: AgentSettings },
      { name: "agent-app-ledger", path: "/till-operator/ledger", component: AgentLedger },
      { name: "agent-app-services-details", path: "/till-operator/services-details", component: AgentServicesDetails },
      { name: "agent-app-finances", path: "/till-operator/finances", component: AgentAppFinances },
      { name: "agent-app-gateway", path: "/till-operator/gateway", component: AgentAppGateway },
      { name: "agent-app-submissions", path: "/till-operator/submissions", component: AgentSubmissions },
      { name: "agent-api-app-submissions", path: "/till-operator/api-submissions", component: ApiSubmissions },
      { name: "api-services", path: "/till-operator/api-services", component: ApiServices },
      { name: "api-service-details", path: "/service/:id", component: AgentAppServicesDetails },
    ],
  },
  {
    name: "service-details",
    path: "/service/:id",
    component: AgentAppServices,
  },
  {
    name: "provider-details",
    path: "/provider/:id",
    component: AgentAppEntities,
  },
  {
    name: "form-composer",
    path: "/composer",
    component: ComposerLayout,
    meta: { requiresAuth: false },
    children: [
      {
        name: "form-builder",
        path: "/composer/service/:id/specification",
        component: FormComposer
      },
      {
        name: "form-previewer",
        path: "/composer/service/preview/:id/specification",
        component: FormPreview
      },
    ]
  },
  ...authRoutes, // Include your auth routes
];

// Create a single router instance with the merged routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: mergedRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

// Global route guard
router.beforeEach((to, from, next) => {
  const { credentials, refreshToken } = useAuth();

  if (to.meta.requiresAuth) {
    if (!credentials.value || !refreshToken.value || refreshToken.value.exp < moment().unix()) {
      next({ name: "app-account-sign-in" });
    } else {
      next();
    }
  } else if (to.name === "app-account-sign-in" && credentials.value && refreshToken.value) {
    next({ name: "app-home" });
  } else {
    next();
  }
});

export default router;
