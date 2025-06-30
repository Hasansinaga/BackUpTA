import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation, useHistory } from "react-router-dom";
import { logout } from "./controllers/authController";
import "./styles/App.css";

// UI Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./layouts/AdminLayout";
import { SocketProvider } from "../socket/socket";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Blog";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Product from "./pages/Product";
import Order from "./pages/Order";

// Admin Dashboard
import Admin from "./pages/Admin/Dashboard";

// User Management
import ListUsers from "./pages/Admin/UsersManagement/ListUsers";
import CreateUsers from "./pages/Admin/UsersManagement/CreateUsers";
import EditUser from "./pages/Admin/UsersManagement/EditUsers";
import ResetPassword from "./pages/Admin/UsersManagement/ResetPassword";

// Cattle Management
import CattleDistribution from "./pages/Admin/CattleDistribution";
import ListCows from "./pages/Admin/CowManagement/ListCows";
import CreateCows from "./pages/Admin/CowManagement/CreateCows";
import EditCow from "./pages/Admin/CowManagement/EditCows";

// Highlights Management
import ListOfGallery from "./pages/Admin/HighlightsManagement/Gallery/ListOfGallery";
import ListOfBlog from "./pages/Admin/HighlightsManagement/Blog/ListOfBlog";

// Milk Production
import ListMilking from "./pages/Admin/MilkProduction/ListMilking";
import CowsMilkAnalysis from "./pages/Admin/MilkProduction/Analythics/CowsMilkAnalysis";
import MilkExpiryCheck from "./pages/Admin/MilkProduction/Analythics/MilkExpiryCheck";

// Health Management
import ListHealthChecks from "./pages/Admin/HealthCheckManagement/HealthCheck/ListHealthChecks";
import CreateHealthCheck from "./pages/Admin/HealthCheckManagement/HealthCheck/CreateHealthCheck";
import EditHealthCheck from "./pages/Admin/HealthCheckManagement/HealthCheck/EditHealthCheck";
import ListSymptoms from "./pages/Admin/HealthCheckManagement/Symptom/ListSymptoms";
import CreateSymptom from "./pages/Admin/HealthCheckManagement/Symptom/CreateSymptom";
import EditSymptom from "./pages/Admin/HealthCheckManagement/Symptom/EditSymptom";
import ListDiseaseHistory from "./pages/Admin/HealthCheckManagement/DiseaseHistory/ListDiseaseHistory";
import CreateDiseaseHistory from "./pages/Admin/HealthCheckManagement/DiseaseHistory/CreateDiseaseHistory";
import EditDiseaseHistory from "./pages/Admin/HealthCheckManagement/DiseaseHistory/EditDiseaseHistory";
import ListReproduction from "./pages/Admin/HealthCheckManagement/Reproduction/ListReproduction";
import CreateReproduction from "./pages/Admin/HealthCheckManagement/Reproduction/CreateReproduction";
import EditReproduction from "./pages/Admin/HealthCheckManagement/Reproduction/EditReproduction";
import HealthDashboard from "./pages/Admin/HealthCheckManagement/HealthDashboard/Dashboard";

// Feed Management
import ListFeedTypes from "./pages/Admin/FeedManagement/FeedType/ListFeedType";
import EditFeedTypes from "./pages/Admin/FeedManagement/FeedType/EditFeedType";
import ListNutrition from "./pages/Admin/FeedManagement/Nutrition/ListNutrition";
import ListFeed from "./pages/Admin/FeedManagement/Feed/ListFeed";
import EditFeed from "./pages/Admin/FeedManagement/Feed/EditFeed";
import ListStock from "./pages/Admin/FeedManagement/FeedStock/FeedStockList";
import ListDailyFeedSchedule from "./pages/Admin/FeedManagement/DailyFeedSchedule/ListDailyFeedSchedule";
import ListDailyFeedItem from "./pages/Admin/FeedManagement/DailyFeedItem/ListDailyFeedItem";
import DailyFeedUsage from "./pages/Admin/FeedManagement/Grafik/DailyFeedUsage";
import DailyNutrition from "./pages/Admin/FeedManagement/Grafik/DailyNutrition";

// Sales & Financial
import ProductType from "./pages/Admin/ProductType/listProductType";
import ProductStock from "./pages/Admin/Product/ListProductStock";
import ProductHistory from "./pages/Admin/ProductHistory/ListProductHistory";
import SalesOrder from "./pages/Admin/Order/ListOrder";
import SalesTransaction from "./pages/Admin/SalesTransaction/ListSalesTransaction";
import Finance from "./pages/Admin/Finance/Finance";
import FinanceRecord from "./pages/Admin/Finance/FinanceRecords";

// URL_DISPLAY_MAP for beautifying URLs
const URL_DISPLAY_MAP = {
  "/about": "/about-us",
  "/contact": "/get-in-touch",
  "/blog": "/insights",
  "/gallery": "/showcase",
  "/products": "/marketplace",
  "/orders": "/my-orders",
  "/dashboard": "/dashboard",
  "/list-users": "/dashboard/user-management",
  "/add-users": "/dashboard/create-user",
  "/edit-user": "/dashboard/edit-user",
  "/reset-password": "/dashboard/reset-credentials",
  "/cattle-distribution": "/dashboard/livestock-distribution",
  "/list-cows": "/dashboard/cattle-inventory",
  "/add-cow": "/dashboard/register-cattle",
  "/edit-cow": "/dashboard/update-cattle",
  "/list-of-gallery": "/dashboard/media-gallery",
  "/list-of-blog": "/dashboard/content-management",
  "/list-milking": "/dashboard/milk-production",
  "/cows-milk-analytics": "/dashboard/milk-analytics",
  "/milk-expiry-check": "/dashboard/quality-control",
  "/list-health-checks": "/dashboard/health-monitoring",
  "/add-health-check": "/dashboard/record-health",
  "/edit-health-check": "/dashboard/update-health",
  "/list-symptoms": "/dashboard/symptom-tracker",
  "/add-symptom": "/dashboard/log-symptom",
  "/edit-symptom": "/dashboard/modify-symptom",
  "/list-disease-history": "/dashboard/medical-records",
  "/add-disease-history": "/dashboard/add-medical-record",
  "/edit-disease-history": "/dashboard/update-medical-record",
  "/list-reproduction": "/dashboard/breeding-management",
  "/add-reproduction": "/dashboard/record-breeding",
  "/edit-reproduction": "/dashboard/update-breeding",
  "/health-dashboard": "/dashboard/wellness-overview",
  "/list-feedType": "/dashboard/feed-catalog",
  "/edit-feedType": "/dashboard/modify-feed-type",
  "/list-nutrition": "/dashboard/nutrition-guide",
  "/list-feed": "/dashboard/feed-inventory",
  "/edit-feed": "/dashboard/update-feed",
  "/list-stock": "/dashboard/stock-management",
  "/list-schedule": "/dashboard/feeding-schedule",
  "/list-feedItem": "/dashboard/feed-items",
  "/daily-feed-usage": "/dashboard/consumption-analytics",
  "/daily-nutrition": "/dashboard/nutrition-tracking",
  "/product-type": "/dashboard/product-categories",
  "/product": "/dashboard/inventory-hub",
  "/product-history": "/dashboard/sales-history",
  "/sales": "/dashboard/order-management",
  "/finance": "/dashboard/financial-overview",
  "/finance-record": "/dashboard/transaction-logs",
};

// Role-based route mapping
const ROLE_ROUTE_MAP = {
  1: "admin",
  2: "supervisor",
  3: "farmer",
};

// Role-based feature access control
const ROLE_PERMISSIONS = {
  1: {
    userManagement: true,
    cattleManagement: true,
    highlightsManagement: true,
    milkProduction: true,
    healthManagement: true,
    feedManagement: true,
    salesFinancial: true,
  },
  2: {
    userManagement: false,
    cattleManagement: true,
    highlightsManagement: true,
    milkProduction: true,
    healthManagement: true,
    feedManagement: true,
    salesFinancial: true,
  },
  3: {
    userManagement: false,
    cattleManagement: false,
    highlightsManagement: false,
    milkProduction: true,
    healthManagement: true,
    feedManagement: true,
    salesFinancial: false,
  },
};

// Updated VALID_ROUTES to include mapped paths
const VALID_ROUTES = [
  "/",
  "/about",
  "/get-in-touch",
  "/insights",
  "/showcase",
  "/marketplace",
  "/my-orders",
  "/admin",
  "/admin/*",
  "/supervisor",
  "/supervisor/*",
  "/farmer",
  "/farmer/*",
  ...Object.keys(URL_DISPLAY_MAP),
  ...Object.values(URL_DISPLAY_MAP).map((path) => `/admin${path}`),
  ...Object.values(URL_DISPLAY_MAP).map((path) => `/supervisor${path}`),
  ...Object.values(URL_DISPLAY_MAP).map((path) => `/farmer${path}`),
];

// Utility Functions
const createReverseUrlMap = (urlMap) => {
  const reverseMap = {};
  Object.entries(urlMap).forEach(([key, value]) => {
    reverseMap[value] = key;
  });
  return reverseMap;
};

const REVERSE_URL_DISPLAY_MAP = createReverseUrlMap(URL_DISPLAY_MAP);

// Global state untuk user data
let globalCurrentUser = null;
const userInitializedRef = { current: false };

// Function to get normalized user data
const getNormalizedUserData = () => {
  if (globalCurrentUser) {
    return globalCurrentUser;
  }

  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData.user_id && !userData.id) {
      return null;
    }

    const normalizedUser = {
      ...userData,
      user_id: userData.user_id || userData.id,
    };

    globalCurrentUser = normalizedUser;
    return normalizedUser;
  } catch (error) {
    console.error("Error getting normalized user data:", error);
    return null;
  }
};

// Function to get user role from normalized data
const getUserRole = () => {
  const userData = getNormalizedUserData();
  return userData?.role_id || null;
};

// Function to get role prefix based on role_id
const getRolePrefix = (roleId) => {
  return ROLE_ROUTE_MAP[roleId] || "";
};

// Function to check if user has permission for a feature
const hasPermission = (feature) => {
  const userRole = getUserRole();
  if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
  return ROLE_PERMISSIONS[userRole][feature];
};

// Updated getDisplayUrl function
const getDisplayUrl = (currentPath) => {
  const userRole = getUserRole();
  const rolePrefix = getRolePrefix(userRole);

  // Handle role-based dashboard routes
  if (rolePrefix && currentPath.startsWith(`/${rolePrefix}/`)) {
    const pathWithoutRole = currentPath.replace(`/${rolePrefix}`, "");
    if (URL_DISPLAY_MAP[pathWithoutRole]) {
      return `/${rolePrefix}${URL_DISPLAY_MAP[pathWithoutRole]}`;
    }
    return currentPath;
  }

  // Handle public routes
  if (URL_DISPLAY_MAP[currentPath]) {
    return URL_DISPLAY_MAP[currentPath];
  }

  return currentPath;
};

// Updated route validation
const isValidRoute = (path) => {
  const userRole = getUserRole();
  const rolePrefix = getRolePrefix(userRole);

  // Normalisasi path untuk menangani URL yang dipetakan
  let normalizedPath = path;
  if (REVERSE_URL_DISPLAY_MAP[path]) {
    normalizedPath = REVERSE_URL_DISPLAY_MAP[path];
  } else if (rolePrefix && path.startsWith(`/${rolePrefix}/dashboard`)) {
    const pathWithoutRole = path.replace(`/${rolePrefix}`, "");
    normalizedPath = REVERSE_URL_DISPLAY_MAP[pathWithoutRole] || pathWithoutRole;
  }

  // Validasi peran
  if (path.startsWith("/admin") && rolePrefix !== "admin") return false;
  if (path.startsWith("/supervisor") && rolePrefix !== "supervisor") return false;
  if (path.startsWith("/farmer") && rolePrefix !== "farmer") return false;

  // Periksa rute yang valid
  if (VALID_ROUTES.includes(normalizedPath)) return true;

  // Periksa rute berbasis peran
  if (rolePrefix && normalizedPath.startsWith(`/${rolePrefix}/`)) {
    const basePath = normalizedPath.replace(`/${rolePrefix}`, "");
    return VALID_ROUTES.includes(basePath) || Object.keys(URL_DISPLAY_MAP).includes(basePath);
  }

  // Periksa rute dinamis
  return VALID_ROUTES.some((route) => {
    if (route.includes(":") || route.includes("*")) {
      const routeParts = route.split("/");
      const pathParts = normalizedPath.split("/");

      return routeParts.every((part, index) => {
        if (part === "*") return true;
        if (part.startsWith(":")) return true;
        return part === pathParts[index];
      });
    }
    return false;
  });
};

// Authentication Service
const authService = {
  isAuthenticated: () => {
    try {
      const userData = getNormalizedUserData();
      return !!(userData?.token && userData?.user_id);
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  },

  getUserData: () => {
    return getNormalizedUserData();
  },

  clearUserData: () => {
    localStorage.removeItem("user");
    globalCurrentUser = null;
    userInitializedRef.current = false;
  },
};

// Invalid URL Handler Component
const InvalidUrlHandler = () => {
  return <Redirect to="/" />;
};

// User Initializer Component
const UserInitializer = ({ children }) => {
  const initializedRef = useRef(false);
  const [userReady, setUserReady] = useState(false);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!initializedRef.current) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userData.user_id && !userData.id) {
        console.log("No user data found - redirecting to login");
        history.replace("/");
        setUserReady(true); // Pastikan userReady true agar halaman login dirender
        return;
      }

      const normalizedUser = {
        ...userData,
        user_id: userData.user_id || userData.id,
      };

      const currentPath = location.pathname.toLowerCase();
      const userRole = normalizedUser.role_id;

      // Validasi rute berdasarkan peran
      if (currentPath.includes("/admin") && userRole !== 1) {
        console.log("Unauthorized access to admin routes - redirecting to login");
        history.replace("/");
        setUserReady(true); // Pastikan userReady true
        return;
      }
      if (currentPath.includes("/supervisor") && userRole !== 2) {
        console.log("Unauthorized access to supervisor routes - redirecting to login");
        history.replace("/");
        setUserReady(true); // Pastikan userReady true
        return;
      }
      if (currentPath.includes("/farmer") && userRole !== 3) {
        console.log("Unauthorized access to farmer routes - redirecting to login");
        history.replace("/");
        setUserReady(true); // Pastikan userReady true
        return;
      }

      globalCurrentUser = normalizedUser;
      initializedRef.current = true;
      setUserReady(true); // Set userReady true setelah validasi selesai
    }
  }, [history, location.pathname]);

  useEffect(() => {
    if (userReady && globalCurrentUser) {
      const normalizedPath = REVERSE_URL_DISPLAY_MAP[location.pathname] || location.pathname;
      const displayUrl = getDisplayUrl(normalizedPath);
      if (displayUrl !== location.pathname && displayUrl !== window.location.pathname) {
        window.history.replaceState(null, "", displayUrl);
      }
    }
  }, [userReady, location.pathname]);

  // Tampilkan fallback UI jika userReady masih false
  if (!userReady) {
    return <div>Loading...</div>;
  }

  return children;
};

// URL Display Handler Component
const URLDisplayHandler = () => {
  const location = useLocation();
  const history = useHistory();

  useLayoutEffect(() => {
    if (!globalCurrentUser) return;

    const currentPath = location.pathname;
    if (!isValidRoute(currentPath)) {
      console.log("Invalid route detected:", currentPath);
      history.replace("/");
      return;
    }

    const normalizedPath = REVERSE_URL_DISPLAY_MAP[currentPath] || currentPath;
    const displayUrl = getDisplayUrl(normalizedPath);
    if (displayUrl !== currentPath && displayUrl !== window.location.pathname) {
      console.log("Updating URL from", currentPath, "to", displayUrl);
      window.history.replaceState(null, "", displayUrl);
    }
  }, [location.pathname, history]);

  useEffect(() => {
    const handlePopState = () => {
      const currentDisplayUrl = window.location.pathname;
      let actualPath = REVERSE_URL_DISPLAY_MAP[currentDisplayUrl];

      if (!actualPath && globalCurrentUser) {
        const userRole = getUserRole();
        const rolePrefix = getRolePrefix(userRole);
        if (rolePrefix && currentDisplayUrl.startsWith(`/${rolePrefix}/dashboard`)) {
          const urlWithoutRolePrefix = currentDisplayUrl.replace(`/${rolePrefix}`, "");
          actualPath = REVERSE_URL_DISPLAY_MAP[urlWithoutRolePrefix] || urlWithoutRolePrefix;
        }
      }

      if (actualPath && actualPath !== location.pathname) {
        console.log("Popstate: Navigating to", actualPath);
        history.replace(actualPath);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [history, location.pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, roles = [], ...rest }) => {
  const isAuthenticated = authService.isAuthenticated();

  const hasRequiredRole = (userRoles, requiredRoles) => {
    if (!requiredRoles.length) return true;
    return requiredRoles.some((role) => userRoles?.includes(role));
  };

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location, message: "Please log in to access this area." },
              }}
            />
          );
        }

        const userData = authService.getUserData();
        if (roles.length && !hasRequiredRole(userData?.roles, roles)) {
          return (
            <Redirect
              to={{
                pathname: `/${getRolePrefix(userData?.role_id)}`,
                state: { message: "You don't have permission to access this page." },
              }}
            />
          );
        }

        return children;
      }}
    />
  );
};

// Public Route Component
const PublicRoute = ({ children, restricted = false, ...rest }) => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Route
      {...rest}
      render={() => {
        if (restricted && isAuthenticated) {
          const userRole = getUserRole();
          return <Redirect to={`/${getRolePrefix(userRole)}`} />;
        }
        return children;
      }}
    />
  );
};

// Role-Based Route Configuration
const RouteConfig = () => {
  const userRole = getUserRole();
  const rolePrefix = getRolePrefix(userRole);

  return (
    <Switch>
      {/* Public Routes */}
      <PublicRoute path="/" exact>
        <Header />
        <Home />
        <Footer />
      </PublicRoute>

      <PublicRoute path="/about">
        <Header />
        <About />
        <Footer />
      </PublicRoute>

      <PublicRoute path="/get-in-touch">
        <Header />
        <Contact />
        <Footer />
      </PublicRoute>

      <PublicRoute path="/insights">
        <Header />
        <Blog />
        <Footer />
      </PublicRoute>

      <PublicRoute path="/showcase">
        <Header />
        <Gallery />
        <Footer />
      </PublicRoute>

      <PublicRoute path="/marketplace">
        <Header />
        <Product />
        <Footer />
      </PublicRoute>

      <PublicRoute path="/my-orders">
        <Header />
        <Order />
        <Footer />
      </PublicRoute>

      {/* Admin Routes */}
      {userRole === 1 && (
        <>
          {/* Specific routes first */}
          <ProtectedRoute path="/admin/dashboard/user-management">
            <AdminLayout>
              <ListUsers />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-users">
            <AdminLayout>
              <ListUsers />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/create-user">
            <AdminLayout>
              <CreateUsers />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/add-users">
            <AdminLayout>
              <CreateUsers />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/edit-user/:userId">
            <AdminLayout>
              <EditUser />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-user/:userId">
            <AdminLayout>
              <EditUser />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/reset-credentials">
            <AdminLayout>
              <ResetPassword />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/reset-password">
            <AdminLayout>
              <ResetPassword />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/livestock-distribution">
            <AdminLayout>
              <CattleDistribution />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/cattle-distribution">
            <AdminLayout>
              <CattleDistribution />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/cattle-inventory">
            <AdminLayout>
              <ListCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-cows">
            <AdminLayout>
              <ListCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/register-cattle">
            <AdminLayout>
              <CreateCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/add-cow">
            <AdminLayout>
              <CreateCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/update-cattle/:cowId">
            <AdminLayout>
              <EditCow />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-cow/:cowId">
            <AdminLayout>
              <EditCow />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/media-gallery">
            <AdminLayout>
              <ListOfGallery />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-of-gallery">
            <AdminLayout>
              <ListOfGallery />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/content-management">
            <AdminLayout>
              <ListOfBlog />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-of-blog">
            <AdminLayout>
              <ListOfBlog />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/milk-production">
            <AdminLayout>
              <ListMilking />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-milking">
            <AdminLayout>
              <ListMilking />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/milk-analytics">
            <AdminLayout>
              <CowsMilkAnalysis />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/cows-milk-analytics">
            <AdminLayout>
              <CowsMilkAnalysis />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/quality-control">
            <AdminLayout>
              <MilkExpiryCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/milk-expiry-check">
            <AdminLayout>
              <MilkExpiryCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/health-monitoring">
            <AdminLayout>
              <ListHealthChecks />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-health-checks">
            <AdminLayout>
              <ListHealthChecks />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/record-health">
            <AdminLayout>
              <CreateHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/add-health-check">
            <AdminLayout>
              <CreateHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/update-health/:id">
            <AdminLayout>
              <EditHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-health-check/:id">
            <AdminLayout>
              <EditHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/symptom-tracker">
            <AdminLayout>
              <ListSymptoms />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-symptoms">
            <AdminLayout>
              <ListSymptoms />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/log-symptom">
            <AdminLayout>
              <CreateSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/add-symptom">
            <AdminLayout>
              <CreateSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/modify-symptom/:id">
            <AdminLayout>
              <EditSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-symptom/:id">
            <AdminLayout>
              <EditSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/medical-records">
            <AdminLayout>
              <ListDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-disease-history">
            <AdminLayout>
              <ListDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/add-medical-record">
            <AdminLayout>
              <CreateDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/add-disease-history">
            <AdminLayout>
              <CreateDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/update-medical-record/:id">
            <AdminLayout>
              <EditDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-disease-history/:id">
            <AdminLayout>
              <EditDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/breeding-management">
            <AdminLayout>
              <ListReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-reproduction">
            <AdminLayout>
              <ListReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/record-breeding">
            <AdminLayout>
              <CreateReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/add-reproduction">
            <AdminLayout>
              <CreateReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/update-breeding/:id">
            <AdminLayout>
              <EditReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-reproduction/:id">
            <AdminLayout>
              <EditReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/wellness-overview">
            <AdminLayout>
              <HealthDashboard />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/health-dashboard">
            <AdminLayout>
              <HealthDashboard />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/feed-catalog">
            <AdminLayout>
              <ListFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-feedType">
            <AdminLayout>
              <ListFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/modify-feed-type/:id">
            <AdminLayout>
              <EditFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-feedType/:id">
            <AdminLayout>
              <EditFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/nutrition-guide">
            <AdminLayout>
              <ListNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-nutrition">
            <AdminLayout>
              <ListNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/feed-inventory">
            <AdminLayout>
              <ListFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-feed">
            <AdminLayout>
              <ListFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/update-feed/:id">
            <AdminLayout>
              <EditFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/edit-feed/:id">
            <AdminLayout>
              <EditFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/stock-management">
            <AdminLayout>
              <ListStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-stock">
            <AdminLayout>
              <ListStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/feeding-schedule">
            <AdminLayout>
              <ListDailyFeedSchedule />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-schedule">
            <AdminLayout>
              <ListDailyFeedSchedule />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/feed-items">
            <AdminLayout>
              <ListDailyFeedItem />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/list-feedItem">
            <AdminLayout>
              <ListDailyFeedItem />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/consumption-analytics">
            <AdminLayout>
              <DailyFeedUsage />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/daily-feed-usage">
            <AdminLayout>
              <DailyFeedUsage />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/nutrition-tracking">
            <AdminLayout>
              <DailyNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/daily-nutrition">
            <AdminLayout>
              <DailyNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/product-categories">
            <AdminLayout>
              <ProductType />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/product-type">
            <AdminLayout>
              <ProductType />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/inventory-hub">
            <AdminLayout>
              <ProductStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/product">
            <AdminLayout>
              <ProductStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/sales-history">
            <AdminLayout>
              <ProductHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/product-history">
            <AdminLayout>
              <ProductHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/order-management">
            <AdminLayout>
              <SalesOrder />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/sales">
            <AdminLayout>
              <SalesOrder />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/financial-overview">
            <AdminLayout>
              <Finance />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/finance">
            <AdminLayout>
              <Finance />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/sales-transaction">
            <AdminLayout>
              <SalesTransaction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/dashboard/transaction-logs">
            <AdminLayout>
              <FinanceRecord />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin/finance-record">
            <AdminLayout>
              <FinanceRecord />
            </AdminLayout>
          </ProtectedRoute>

          {/* Dashboard base route after specific routes */}
          <ProtectedRoute path="/admin/dashboard" exact>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/admin" exact>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </ProtectedRoute>
        </>
      )}

      {/* Supervisor Routes */}
      {userRole === 2 && (
        <>
          <ProtectedRoute path="/supervisor/dashboard/livestock-distribution">
            <AdminLayout>
              <CattleDistribution />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/cattle-distribution">
            <AdminLayout>
              <CattleDistribution />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/cattle-inventory">
            <AdminLayout>
              <ListCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-cows">
            <AdminLayout>
              <ListCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/register-cattle">
            <AdminLayout>
              <CreateCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/add-cow">
            <AdminLayout>
              <CreateCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/update-cattle/:cowId">
            <AdminLayout>
              <EditCow />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-cow/:cowId">
            <AdminLayout>
              <EditCow />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/media-gallery">
            <AdminLayout>
              <ListOfGallery />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-of-gallery">
            <AdminLayout>
              <ListOfGallery />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/content-management">
            <AdminLayout>
              <ListOfBlog />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-of-blog">
            <AdminLayout>
              <ListOfBlog />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/milk-production">
            <AdminLayout>
              <ListMilking />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-milking">
            <AdminLayout>
              <ListMilking />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/milk-analytics">
            <AdminLayout>
              <CowsMilkAnalysis />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/cows-milk-analytics">
            <AdminLayout>
              <CowsMilkAnalysis />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/quality-control">
            <AdminLayout>
              <MilkExpiryCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/milk-expiry-check">
            <AdminLayout>
              <MilkExpiryCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/health-monitoring">
            <AdminLayout>
              <ListHealthChecks />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-health-checks">
            <AdminLayout>
              <ListHealthChecks />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/record-health">
            <AdminLayout>
              <CreateHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/add-health-check">
            <AdminLayout>
              <CreateHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/update-health/:id">
            <AdminLayout>
              <EditHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-health-check/:id">
            <AdminLayout>
              <EditHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/symptom-tracker">
            <AdminLayout>
              <ListSymptoms />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-symptoms">
            <AdminLayout>
              <ListSymptoms />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/log-symptom">
            <AdminLayout>
              <CreateSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/add-symptom">
            <AdminLayout>
              <CreateSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/modify-symptom/:id">
            <AdminLayout>
              <EditSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-symptom/:id">
            <AdminLayout>
              <EditSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/medical-records">
            <AdminLayout>
              <ListDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-disease-history">
            <AdminLayout>
              <ListDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/add-medical-record">
            <AdminLayout>
              <CreateDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/add-disease-history">
            <AdminLayout>
              <CreateDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/update-medical-record/:id">
            <AdminLayout>
              <EditDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-disease-history/:id">
            <AdminLayout>
              <EditDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/breeding-management">
            <AdminLayout>
              <ListReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-reproduction">
            <AdminLayout>
              <ListReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/record-breeding">
            <AdminLayout>
              <CreateReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/add-reproduction">
            <AdminLayout>
              <CreateReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/update-breeding/:id">
            <AdminLayout>
              <EditReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-reproduction/:id">
            <AdminLayout>
              <EditReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/wellness-overview">
            <AdminLayout>
              <HealthDashboard />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/health-dashboard">
            <AdminLayout>
              <HealthDashboard />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/feed-catalog">
            <AdminLayout>
              <ListFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-feedType">
            <AdminLayout>
              <ListFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/modify-feed-type/:id">
            <AdminLayout>
              <EditFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-feedType/:id">
            <AdminLayout>
              <EditFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/nutrition-guide">
            <AdminLayout>
              <ListNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-nutrition">
            <AdminLayout>
              <ListNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/feed-inventory">
            <AdminLayout>
              <ListFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-feed">
            <AdminLayout>
              <ListFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/update-feed/:id">
            <AdminLayout>
              <EditFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/edit-feed/:id">
            <AdminLayout>
              <EditFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/stock-management">
            <AdminLayout>
              <ListStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-stock">
            <AdminLayout>
              <ListStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/feeding-schedule">
            <AdminLayout>
              <ListDailyFeedSchedule />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-schedule">
            <AdminLayout>
              <ListDailyFeedSchedule />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/feed-items">
            <AdminLayout>
              <ListDailyFeedItem />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/list-feedItem">
            <AdminLayout>
              <ListDailyFeedItem />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/consumption-analytics">
            <AdminLayout>
              <DailyFeedUsage />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/daily-feed-usage">
            <AdminLayout>
              <DailyFeedUsage />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/nutrition-tracking">
            <AdminLayout>
              <DailyNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/daily-nutrition">
            <AdminLayout>
              <DailyNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/product-categories">
            <AdminLayout>
              <ProductType />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/product-type">
            <AdminLayout>
              <ProductType />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/inventory-hub">
            <AdminLayout>
              <ProductStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/product">
            <AdminLayout>
              <ProductStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/sales-history">
            <AdminLayout>
              <ProductHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/product-history">
            <AdminLayout>
              <ProductHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/order-management">
            <AdminLayout>
              <SalesOrder />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/sales">
            <AdminLayout>
              <SalesOrder />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/financial-overview">
            <AdminLayout>
              <Finance />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/finance">
            <AdminLayout>
              <Finance />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/finance-record">
            <AdminLayout>
              <FinanceRecord />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard/transaction-logs">
            <AdminLayout>
              <FinanceRecord />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor/dashboard" exact>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/supervisor" exact>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </ProtectedRoute>
        </>
      )}

      {/* Farmer Routes */}
      {userRole === 3 && (
        <>
          <ProtectedRoute path="/farmer/dashboard/cattle-inventory">
            <AdminLayout>
              <ListCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-cows">
            <AdminLayout>
              <ListCows />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/milk-production">
            <AdminLayout>
              <ListMilking />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-milking">
            <AdminLayout>
              <ListMilking />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/milk-analytics">
            <AdminLayout>
              <CowsMilkAnalysis />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/cows-milk-analytics">
            <AdminLayout>
              <CowsMilkAnalysis />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/quality-control">
            <AdminLayout>
              <MilkExpiryCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/milk-expiry-check">
            <AdminLayout>
              <MilkExpiryCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/health-monitoring">
            <AdminLayout>
              <ListHealthChecks />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-health-checks">
            <AdminLayout>
              <ListHealthChecks />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/record-health">
            <AdminLayout>
              <CreateHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/add-health-check">
            <AdminLayout>
              <CreateHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/update-health/:id">
            <AdminLayout>
              <EditHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/edit-health-check/:id">
            <AdminLayout>
              <EditHealthCheck />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/symptom-tracker">
            <AdminLayout>
              <ListSymptoms />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-symptoms">
            <AdminLayout>
              <ListSymptoms />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/log-symptom">
            <AdminLayout>
              <CreateSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/add-symptom">
            <AdminLayout>
              <CreateSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/modify-symptom/:id">
            <AdminLayout>
              <EditSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/edit-symptom/:id">
            <AdminLayout>
              <EditSymptom />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/medical-records">
            <AdminLayout>
              <ListDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-disease-history">
            <AdminLayout>
              <ListDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/add-medical-record">
            <AdminLayout>
              <CreateDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/add-disease-history">
            <AdminLayout>
              <CreateDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/update-medical-record/:id">
            <AdminLayout>
              <EditDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/edit-disease-history/:id">
            <AdminLayout>
              <EditDiseaseHistory />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/breeding-management">
            <AdminLayout>
              <ListReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-reproduction">
            <AdminLayout>
              <ListReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/record-breeding">
            <AdminLayout>
              <CreateReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/add-reproduction">
            <AdminLayout>
              <CreateReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/update-breeding/:id">
            <AdminLayout>
              <EditReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/edit-reproduction/:id">
            <AdminLayout>
              <EditReproduction />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/wellness-overview">
            <AdminLayout>
              <HealthDashboard />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/health-dashboard">
            <AdminLayout>
              <HealthDashboard />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/feed-catalog">
            <AdminLayout>
              <ListFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-feedType">
            <AdminLayout>
              <ListFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/modify-feed-type/:id">
            <AdminLayout>
              <EditFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/edit-feedType/:id">
            <AdminLayout>
              <EditFeedTypes />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/nutrition-guide">
            <AdminLayout>
              <ListNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-nutrition">
            <AdminLayout>
              <ListNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/feed-inventory">
            <AdminLayout>
              <ListFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-feed">
            <AdminLayout>
              <ListFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/update-feed/:id">
            <AdminLayout>
              <EditFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/edit-feed/:id">
            <AdminLayout>
              <EditFeed />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/stock-management">
            <AdminLayout>
              <ListStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-stock">
            <AdminLayout>
              <ListStock />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/feeding-schedule">
            <AdminLayout>
              <ListDailyFeedSchedule />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-schedule">
            <AdminLayout>
              <ListDailyFeedSchedule />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/feed-items">
            <AdminLayout>
              <ListDailyFeedItem />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/list-feedItem">
            <AdminLayout>
              <ListDailyFeedItem />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/consumption-analytics">
            <AdminLayout>
              <DailyFeedUsage />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/daily-feed-usage">
            <AdminLayout>
              <DailyFeedUsage />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard/nutrition-tracking">
            <AdminLayout>
              <DailyNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/daily-nutrition">
            <AdminLayout>
              <DailyNutrition />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer/dashboard" exact>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </ProtectedRoute>

          <ProtectedRoute path="/farmer" exact>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </ProtectedRoute>
        </>
      )}

      {/* Catch-all route for invalid URLs */}
      <Route path="*">
        <InvalidUrlHandler />
      </Route>
    </Switch>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <SocketProvider>
        <UserInitializer>
          <URLDisplayHandler />
          <div className="App">
            <RouteConfig />
          </div>
        </UserInitializer>
      </SocketProvider>
    </Router>
  );
}

export default App;
