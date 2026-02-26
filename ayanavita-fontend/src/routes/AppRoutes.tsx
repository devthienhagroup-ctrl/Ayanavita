import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { RequireAuth } from "../components/RequireAuth";
import { RequireRole } from "../auth/RequireRole";


import { RegisterPage } from "../pages/RegisterPage";
import { CoursesPage } from "../pages/CoursesPage";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { LessonPage } from "../pages/LessonPage";
import { MyCoursesPage } from "../pages/MyCoursesPage";
import { MyOrdersPage } from "../pages/MyOrdersPage";
import { LessonDetailPage } from "../pages/LessonDetailPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import AdminSpaPage from "../pages/admin/AdminSpaPage";
import LoginPage from "../pages/LoginPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/lessons/:id" element={<LessonDetailPage />} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/courses" replace />} />

      {/* Protected */}
      <Route
        path="/courses"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN", "USER"]}>
              <CoursesPage />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN", "USER"]}>
              <CourseDetailPage />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/lessons/:id"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN", "USER"]}>
              <LessonPage />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/me/courses"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN", "USER"]}>
              <MyCoursesPage />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/me/orders"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN", "USER"]}>
              <MyOrdersPage />
            </RequireRole>
          </RequireAuth>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/orders"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN"]}>
              <AdminOrdersPage />
            </RequireRole>
          </RequireAuth>
        }
      />

      <Route
        path="/admin/spa"
        element={
          <RequireAuth>
            <RequireRole roles={["ADMIN", "STAFF"]}>
              <AdminSpaPage />
            </RequireRole>
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
    </Routes>
  );
}
