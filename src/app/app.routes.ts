import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Trang chủ - E-Store'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent),
    title: 'Sản phẩm - E-Store'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailComponent),
    title: 'Chi tiết sản phẩm - E-Store'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent),
    title: 'Giỏ hàng - E-Store'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
    title: 'Đặt hàng - E-Store'
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),
    title: 'Đơn hàng - E-Store'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    title: 'Đăng nhập - E-Store'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent),
    title: 'Đăng ký - E-Store'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent),
    title: 'Liên hệ - E-Store'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.DashboardComponent), title: 'Dashboard - Admin' },
      { path: 'products', loadComponent: () => import('./pages/admin/product-mgmt/product-mgmt').then(m => m.ProductMgmtComponent), title: 'Quản lý Sản phẩm - Admin' },
      { path: 'orders', loadComponent: () => import('./pages/admin/order-mgmt/order-mgmt').then(m => m.OrderMgmtComponent), title: 'Quản lý Đơn hàng - Admin' },
      { path: 'users', loadComponent: () => import('./pages/admin/user-mgmt/user-mgmt').then(m => m.UserMgmtComponent), title: 'Quản lý Người dùng - Admin' }
    ]
  },
  {
    path: 'staff',
    loadComponent: () => import('./pages/staff/layout/staff-layout').then(m => m.StaffLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/staff/dashboard/staff-dashboard').then(m => m.StaffDashboardComponent), title: 'Dashboard - Nhân viên' },
      { path: 'products', loadComponent: () => import('./pages/staff/product-mgmt/staff-product-mgmt').then(m => m.StaffProductMgmtComponent), title: 'Quản lý Sản phẩm - Nhân viên' },
      { path: 'orders', loadComponent: () => import('./pages/staff/order-mgmt/staff-order-mgmt').then(m => m.StaffOrderMgmtComponent), title: 'Quản lý Đơn hàng - Nhân viên' }
    ]
  },
  {
    path: 'shipper',
    loadComponent: () => import('./pages/shipper/layout/shipper-layout').then(m => m.ShipperLayoutComponent),
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', loadComponent: () => import('./pages/shipper/orders/shipper-orders').then(m => m.ShipperOrdersComponent), title: 'Quản lý Giao hàng - Shipper' }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
