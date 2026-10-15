import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import BackButton from "./components/BackButton";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import Resume from "./pages/user/Resume";
import JobSearch from "./pages/user/JobSearch";
import JobDetails from "./pages/user/JobDetails";
import ApplyJob from "./pages/user/ApplyJob";
import MyApplications from "./pages/user/MyApplications";
import ApplicationDetails from "./pages/user/ApplicationDetails";
import SavedJobs from "./pages/user/SavedJobs";
import UserNotifications from "./pages/user/Notifications";
import UserInterviews from "./pages/user/Interviews";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import PostJob from "./pages/recruiter/PostJob";
import ManageJobs from "./pages/recruiter/ManageJobs";
import EditJob from "./pages/recruiter/EditJob";
import Applicants from "./pages/recruiter/Applicants";
import ApplicantDetails from "./pages/recruiter/ApplicantDetails";
import RecruiterNotifications from "./pages/recruiter/Notifications";

import InterviewQuestions from "./pages/interview/InterviewQuestions";
import QuestionDetails from "./pages/interview/QuestionDetails";
import InterviewCategories from "./pages/interview/InterviewCategories";

import Compiler from "./pages/compiler/Compiler";
import CodingQuestions from "./pages/compiler/CodingQuestions";
import CodingQuestionDetails from "./pages/compiler/CodingQuestionDetails";
import SubmissionHistory from "./pages/compiler/SubmissionHistory";

import PracticeTests from "./pages/tests/PracticeTests";
import TakeTest from "./pages/tests/TakeTest";
import TestResult from "./pages/tests/TestResult";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageRecruiters from "./pages/admin/ManageRecruiters";
import ManageCompanies from "./pages/admin/ManageCompanies";
import AdminManageJobs from "./pages/admin/ManageJobs";
import ManageApplications from "./pages/admin/ManageApplications";
import ManageInterviewQuestions from "./pages/admin/ManageInterviewQuestions";
import ManageCompilerQuestions from "./pages/admin/ManageCompilerQuestions";
import ManageTests from "./pages/admin/ManageTests";
import Categories from "./pages/admin/Categories";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <>
      <BackButton />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/user/dashboard" element={<ProtectedRoute roles={["jobseeker"]}><UserDashboard  /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute roles={["jobseeker"]}><Profile  /></ProtectedRoute>} />
      <Route path="/user/profile/edit" element={<ProtectedRoute roles={["jobseeker"]}><EditProfile  /></ProtectedRoute>} />
      <Route path="/user/resume" element={<ProtectedRoute roles={["jobseeker"]}><Resume  /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute roles={["jobseeker"]}><JobSearch /></ProtectedRoute>} />
      <Route path="/jobs/:jobId" element={<ProtectedRoute roles={["jobseeker"]}><JobDetails /></ProtectedRoute>} />
      <Route path="/jobs/:jobId/apply" element={<ProtectedRoute roles={["jobseeker"]}><ApplyJob  /></ProtectedRoute>} />
      <Route path="/user/applications" element={<ProtectedRoute roles={["jobseeker"]}><MyApplications  /></ProtectedRoute>} />
      <Route path="/user/applications/:applicationId" element={<ProtectedRoute roles={["jobseeker"]}><ApplicationDetails  /></ProtectedRoute>} />
      <Route path="/user/saved-jobs" element={<ProtectedRoute roles={["jobseeker"]}><SavedJobs /></ProtectedRoute>} />
      <Route path="/user/notifications" element={<ProtectedRoute roles={["jobseeker"]}><UserNotifications  /></ProtectedRoute>} />
      <Route path="/user/interviews" element={<ProtectedRoute roles={["jobseeker"]}><UserInterviews /></ProtectedRoute>} />

      <Route path="/recruiter/dashboard" element={<ProtectedRoute roles={["recruiter"]}><RecruiterDashboard  /></ProtectedRoute>} />
      <Route path="/recruiter/company" element={<ProtectedRoute roles={["recruiter"]}><CompanyProfile  /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/post" element={<ProtectedRoute roles={["recruiter"]}><PostJob  /></ProtectedRoute>} />
      <Route path="/recruiter/jobs" element={<ProtectedRoute roles={["recruiter"]}><ManageJobs  /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/:jobId/edit" element={<ProtectedRoute roles={["recruiter"]}><EditJob  /></ProtectedRoute>} />
      <Route path="/recruiter/applicants" element={<ProtectedRoute roles={["recruiter"]}><Applicants  /></ProtectedRoute>} />
      <Route path="/recruiter/applicants/:applicantId" element={<ProtectedRoute roles={["recruiter"]}><ApplicantDetails  /></ProtectedRoute>} />
      <Route path="/recruiter/notifications" element={<ProtectedRoute roles={["recruiter"]}><RecruiterNotifications  /></ProtectedRoute>} />

      <Route path="/interview" element={<ProtectedRoute roles={["jobseeker"]}><InterviewCategories /></ProtectedRoute>} />
      <Route path="/interview/questions" element={<ProtectedRoute roles={["jobseeker"]}><InterviewQuestions /></ProtectedRoute>} />
      <Route path="/interview/questions/:questionId" element={<ProtectedRoute roles={["jobseeker"]}><QuestionDetails /></ProtectedRoute>} />

      <Route path="/compiler" element={<ProtectedRoute roles={["jobseeker"]}><Compiler /></ProtectedRoute>} />
      <Route path="/compiler/questions" element={<ProtectedRoute roles={["jobseeker"]}><CodingQuestions /></ProtectedRoute>} />
      <Route path="/compiler/questions/:questionId" element={<ProtectedRoute roles={["jobseeker"]}><CodingQuestionDetails /></ProtectedRoute>} />
      <Route path="/compiler/submissions" element={<ProtectedRoute roles={["jobseeker"]}><SubmissionHistory /></ProtectedRoute>} />

      <Route path="/tests" element={<ProtectedRoute roles={["jobseeker"]}><PracticeTests /></ProtectedRoute>} />
      <Route path="/tests/:testId" element={<ProtectedRoute roles={["jobseeker"]}><TakeTest /></ProtectedRoute>} />
      <Route path="/tests/:testId/result" element={<ProtectedRoute roles={["jobseeker"]}><TestResult /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/recruiters" element={<ProtectedRoute roles={["admin"]}><ManageRecruiters /></ProtectedRoute>} />
      <Route path="/admin/companies" element={<ProtectedRoute roles={["admin"]}><ManageCompanies /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute roles={["admin"]}><AdminManageJobs /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute roles={["admin"]}><ManageApplications /></ProtectedRoute>} />
      <Route path="/admin/interview-questions" element={<ProtectedRoute roles={["admin"]}><ManageInterviewQuestions /></ProtectedRoute>} />
      <Route path="/admin/compiler-questions" element={<ProtectedRoute roles={["admin"]}><ManageCompilerQuestions /></ProtectedRoute>} />
      <Route path="/admin/tests" element={<ProtectedRoute roles={["admin"]}><ManageTests /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute roles={["admin"]}><Categories /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute roles={["admin"]}><Settings /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
