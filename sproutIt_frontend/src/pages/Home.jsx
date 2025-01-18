import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-green-600">SproutIt</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Plan, track, and grow your perfect garden. Get personalized planting
            schedules based on your zone and track your garden's progress.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-green-600 text-2xl mb-4">🌱</div>
              <h3 className="text-lg font-medium text-gray-900">
                Plan Your Garden
              </h3>
              <p className="mt-2 text-gray-500">
                Design your garden layout and get personalized planting
                recommendations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-green-600 text-2xl mb-4">🌿</div>
              <h3 className="text-lg font-medium text-gray-900">
                Track Growth
              </h3>
              <p className="mt-2 text-gray-500">
                Monitor your plants' progress and get care reminders.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-green-600 text-2xl mb-4">🌺</div>
              <h3 className="text-lg font-medium text-gray-900">
                Learn & Grow
              </h3>
              <p className="mt-2 text-gray-500">
                Access gardening tips and connect with other gardeners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
