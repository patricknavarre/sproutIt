import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GardenPlanner from "./pages/GardenPlanner";
import PestAndDiseaseGuide from "./pages/PestAndDiseaseGuide";
import RecipeSuggestions from "./pages/RecipeSuggestions";
import SeedDatabase from "./pages/SeedDatabase";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";

// Trigger Vercel deployment - v1.0.0
// Create a layout component that includes the Navbar
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/garden/:id",
    element: (
      <Layout>
        <GardenPlanner />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/pest-disease-guide",
    element: (
      <Layout>
        <PestAndDiseaseGuide />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/recipe-suggestions",
    element: (
      <Layout>
        <RecipeSuggestions />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
  {
    path: "/seed-database",
    element: (
      <Layout>
        <SeedDatabase />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
