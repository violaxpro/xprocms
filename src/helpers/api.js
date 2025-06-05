import { del, get, post, postFormData, put } from "./api_helper";

const api = {
  login(data) {
    return post('/login', data);
  },
  dashboard(data) {
    return get('/dashboard', data);
  },
  dashboardContact(data) {
    return get('/dashboard/contact', data);
  },
  dashboardVisitor(data) {
    return get('/dashboard/visitor', data);
  },
  settings(data) {
    return get('/settings', data);
  },
  updateSettings(data) {
    return postFormData('/settings', data);
  },
  categories(data) {
    return data.params?.id ? get(`/categories/${data.params.id}`, data) : get('/categories', data);
  },
  createCategory(data) {
    return postFormData('/categories', data);
  },
  updateCategory(id, data) {
    return postFormData(`/categories/${id}`, data);
  },
  deleteCategory(id, data) {
    return del(`/categories/${id}`, data);
  },
  categorySelect(data) {
    return get(`/category-select`, data);
  },
  categoryPage(id) {
    return get(`/category-pages/${id}`);
  },
  setCategoryPage(data) {
    return post('/category-pages', data);
  },
  blogCategories(data) {
    return data.params?.id ? get(`/blog-categories/${data.params.id}`, data) : get('/blog-categories', data);
  },
  createBlogCategory(data) {
    return post('/blog-categories', data);
  },
  updateBlogCategory(id, data) {
    return put(`/blog-categories/${id}`, data);
  },
  deleteBlogCategory(id, data) {
    return del(`/blog-categories/${id}`, data);
  },
  blog(data) {
    return data.params?.id ? get(`/blogs/${data.params.id}`, data) : get('/blogs', data);
  },
  createBlog(data) {
    return postFormData('/blogs', data);
  },
  editBlog(id) {
    return get(`/blogs/${id}/edit`, id);
  },
  updateBlog(id, data) {
    return postFormData(`/blogs/${id}`, data);
  },
  deleteBlog(id, data) {
    return del(`/blogs/${id}`, data);
  },
  pageSelect(data) {
    return get(`/page-select`);
  },
  page(data) {
    return data.params?.id ? get(`/pages/${data.params.id}`, data) : get('/pages', data);
  },
  createPage(data) {
    return postFormData('/pages', data);
  },
  editPage(id) {
    return get(`/pages/${id}/edit`, id);
  },
  updatePage(id, data) {
    return postFormData(`/pages/${id}`, data);
  },
  deletePage(id, data) {
    return del(`/pages/${id}`, data);
  },
  brand(data) {
    return data.params?.id ? get(`/brands/${data.params.id}`, data) : get('/brands', data);
  },
  brandSelect() {
    return get(`/brand-select`);
  },
  createBrand(data) {
    return postFormData('/brands', data);
  },
  updateBrand(id, data) {
    return postFormData(`/brands/${id}`, data);
  },
  deleteBrand(id, data) {
    return del(`/brands/${id}`, data);
  },
  testimonial(data) {
    return data.params?.id ? get(`/testimonials/${data.params.id}`, data) : get('/testimonials', data);
  },
  createTestimonial(data) {
    return postFormData('/testimonials', data);
  },
  updateTestimonial(id, data) {
    return postFormData(`/testimonials/${id}`, data);
  },
  deleteTestimonial(id, data) {
    return del(`/testimonials/${id}`, data);
  },
  faq(data) {
    return data.params?.id ? get(`/faqs/${data.params.id}`, data) : get('/faqs', data);
  },
  createFaq(data) {
    return postFormData('/faqs', data);
  },
  updateFaq(id, data) {
    return postFormData(`/faqs/${id}`, data);
  },
  deleteFaq(id, data) {
    return del(`/faqs/${id}`, data);
  },
  faqCategoriesSelect() {
    return get(`/faq-categories-select`);
  },
  faqCategory(data) {
    return data.params?.id ? get(`/faq-categories/${data.params.id}`, data) : get('/faq-categories', data);
  },
  createFaqCategory(data) {
    return postFormData('/faq-categories', data);
  },
  updateFaqCategory(id, data) {
    return postFormData(`/faq-categories/${id}`, data);
  },
  deleteFaqCategory(id, data) {
    return del(`/faq-categories/${id}`, data);
  },
  project(data) {
    return data.params?.id ? get(`/projects/${data.params.id}`, data) : get('/projects', data);
  },
  createProject(data) {
    return postFormData('/projects', data);
  },
  updateProject(id, data) {
    return postFormData(`/projects/${id}`, data);
  },
  deleteProject(id, data) {
    return del(`/projects/${id}`, data);
  },
  user(data) {
    return data.params?.id ? get(`/users/${data.params.id}`, data) : get('/users', data);
  },
  createUser(data) {
    return postFormData('/users', data);
  },
  updateUser(id, data) {
    return postFormData(`/users/${id}`, data);
  },
  deleteUser(id, data) {
    return del(`/users/${id}`, data);
  },
}

export default api;