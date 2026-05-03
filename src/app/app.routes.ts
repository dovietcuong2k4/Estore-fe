import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePageComponent),
        title: 'Thông tin cá nhân - E-Store'
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
    ]
  },

  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.DashboardComponent), title: 'Bảng điều khiển - Quản trị' },
      { path: 'products', loadComponent: () => import('./pages/admin/product-mgmt/product-mgmt').then(m => m.ProductMgmtComponent), title: 'Quản lý sản phẩm - Quản trị' },
      { path: 'categories', loadComponent: () => import('./pages/admin/category-mgmt/category-mgmt').then(m => m.CategoryMgmtComponent), title: 'Quản lý danh mục - Quản trị' },
      { path: 'brands', loadComponent: () => import('./pages/admin/brand-mgmt/brand-mgmt').then(m => m.BrandMgmtComponent), title: 'Quản lý hãng - Quản trị' },
      { path: 'orders', loadComponent: () => import('./pages/admin/order-mgmt/order-mgmt').then(m => m.OrderMgmtComponent), title: 'Quản lý đơn hàng - Quản trị' },
      { path: 'users', loadComponent: () => import('./pages/admin/user-mgmt/user-mgmt').then(m => m.UserMgmtComponent), title: 'Quản lý người dùng - Quản trị' },
      { path: 'vouchers', loadComponent: () => import('./pages/admin/voucher-mgmt/voucher-mgmt').then(m => m.VoucherMgmtComponent), title: 'Quản lý voucher - Quản trị' },
      { path: 'contacts', loadComponent: () => import('./pages/admin/contact-mgmt/contact-mgmt').then(m => m.ContactMgmtComponent), title: 'Quản lý phản hồi - Quản trị' },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePageComponent), title: 'Thông tin cá nhân - Quản trị' }
    ]
  },
  {
    path: 'staff',
    loadComponent: () => import('./pages/staff/layout/staff-layout').then(m => m.StaffLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/staff/dashboard/staff-dashboard').then(m => m.StaffDashboardComponent), title: 'Bảng điều khiển - Nhân viên' },
      { path: 'products', loadComponent: () => import('./pages/staff/product-mgmt/staff-product-mgmt').then(m => m.StaffProductMgmtComponent), title: 'Quản lý sản phẩm - Nhân viên' },
      { path: 'categories', loadComponent: () => import('./pages/staff/category-mgmt/staff-category-mgmt').then(m => m.StaffCategoryMgmtComponent), title: 'Danh mục - Nhân viên' },
      { path: 'brands', loadComponent: () => import('./pages/staff/brand-mgmt/staff-brand-mgmt').then(m => m.StaffBrandMgmtComponent), title: 'Hãng sản xuất - Nhân viên' },
      { path: 'orders', loadComponent: () => import('./pages/staff/order-mgmt/staff-order-mgmt').then(m => m.StaffOrderMgmtComponent), title: 'Quản lý đơn hàng - Nhân viên' },
      { path: 'vouchers', loadComponent: () => import('./pages/admin/voucher-mgmt/voucher-mgmt').then(m => m.VoucherMgmtComponent), title: 'Quản lý voucher - Nhân viên' },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePageComponent), title: 'Thông tin cá nhân - Nhân viên' }
    ]
  },
  {
    path: 'shipper',
    loadComponent: () => import('./pages/shipper/layout/shipper-layout').then(m => m.ShipperLayoutComponent),
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', loadComponent: () => import('./pages/shipper/orders/shipper-orders').then(m => m.ShipperOrdersComponent), title: 'Quản lý giao hàng - Nhân viên giao hàng' },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePageComponent), title: 'Thông tin cá nhân - Nhân viên giao hàng' }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
