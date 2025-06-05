import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
import HomepageSetting from "pages/HomepageSetting"
import Setting from "pages/Setting"
import Category from "pages/Category"
import BlogCategory from "pages/BlogCategory"
import Post from "pages/Post"
import Brand from "pages/Brand"
import Testimonial from "pages/Testimonial"
import Project from "pages/Project"
import User from "pages/User"
import SetPage from "pages/Category/SetPage"
import Create from "pages/Post/Action/Create"
import Update from "pages/Post/Action/Update"
import CreatePage from "pages/Page/Action/Create"
import UpdatePage from "pages/Page/Action/Update"
import Page from "pages/Page"
import Footer from "pages/Setting/Footer"
import Faq from "pages/Faq"
import FaqCategory from "pages/FaqCategory"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  // //profile
  { path: "/profile", component: UserProfile },

  { path: "/categories", component: Category },
  { path: "/categories/:id", component: Category },
  { path: "/category-page/:id", component: SetPage },

  { path: "/brands", component: Brand },

  { path: "/blogs", component: Post },
  { path: "/blogs/create", component: Create },
  { path: "/blogs/:id/edit", component: Update },
  { path: "/blog-categories", component: BlogCategory },

  { path: "/faqs", component: Faq },
  { path: "/faq-categories", component: FaqCategory },

  { path: "/homepage-setting", component: HomepageSetting },
  { path: "/settings", component: Setting },

  { path: "/testimonials", component: Testimonial },
  { path: "/projects", component: Project },

  { path: "/pages", component: Page },
  { path: "/pages/create", component: CreatePage },
  { path: "/pages/:id/edit", component: UpdatePage },

  { path: "/users", component: User },

  { path: "/settings/footer", component: Footer },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { authProtectedRoutes, publicRoutes }
