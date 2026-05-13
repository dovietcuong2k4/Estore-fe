# Frontend Agent Guide

Scan date: 2026-05-06
Project path: `C:\cuong\Estore-fe`

This file is a compact scan of the frontend project for coding agents. Use it before making changes so the agent understands the structure, runtime, conventions, routing, and backend integration points.

## Stack

- Angular 21.2.x
- Angular CLI project name: `ecommerce`
- TypeScript 5.9 with strict compiler and strict template checks
- Standalone components and lazy route loading
- SCSS component styles
- Tailwind CSS 3.4
- RxJS 7.8
- Unit test builder through Angular/Vitest setup
- Package manager: npm 10.9.4

## Run And Verify

```powershell
cd C:\cuong\Estore-fe
npm install
npm start
```

`angular.json` configures `ng serve` on port `3000`, so the app runs at `http://localhost:3000`.

Backend API base is configured in `src/environments/environment.ts`:

```ts
apiUrl: 'http://localhost:9091'
```

Common verification commands:

```powershell
npm run build
npm test
```

## Project Structure

```text
Estore-fe/
  angular.json
  package.json
  package-lock.json
  tailwind.config.js
  tsconfig.json
  tsconfig.app.json
  tsconfig.spec.json
  README.md
  mock-data.js
  import-data.js
  import-image.js
  import-imageBrand.js
  public/
    favicon.ico
  template/
    DESIGN.md
    code.html
    screen.png
  src/
    index.html
    main.ts
    styles.scss
    environments/
      environment.ts
    app/
      app.config.ts
      app.html
      app.routes.ts
      app.scss
      app.spec.ts
      app.ts
      core/
        models/
          cart.model.ts
          chatbot.model.ts
          contact.model.ts
          order.model.ts
          product.model.ts
          profile.model.ts
          user.model.ts
          voucher.model.ts
        services/
          api.service.ts
          auth.service.ts
          cart.service.ts
          chatbot.service.ts
          mock-data.service.ts
          order.service.ts
          product-api.service.ts
          profile.service.ts
          recommendation.service.ts
          review.service.ts
          toast.service.ts
          upload.service.ts
          user-api.service.ts
          voucher.service.ts
      pages/
        admin/
          brand-mgmt/
          category-mgmt/
          dashboard/
          layout/
          order-mgmt/
          product-mgmt/
          user-mgmt/
          voucher-mgmt/
        cart/
        checkout/
        contact/
        home/
        login/
        main-layout/
        orders/
        payment-result/
        product-detail/
        products/
        profile/
        register/
        shipper/
          layout/
          orders/
        staff/
          brand-mgmt/
          category-mgmt/
          dashboard/
          layout/
          order-mgmt/
          product-mgmt/
      shared/
        components/
          assign-voucher-modal/
          brand-modal/
          category-modal/
          chatbot-widget/
          footer/
          header/
          order-actions/
          order-details-modal/
          order-table/
          product-card/
          product-modal/
          product-recommendations/
          profile-dynamic-form/
          toast/
          user-modal/
          voucher-modal/
          voucher-table/
          ui/
            base-badge.ts
            base-button.ts
            base-card.ts
            base-input.ts
            base-layout.ts
            base-modal.ts
            base-select.ts
            base-table.ts
            base-tabs.ts
            filter-bar.ts
            icon.component.ts
            revenue-chart/
```

## Routing

Routes are centralized in `src/app/app.routes.ts`.

Main customer layout:

- `/`
- `/products`
- `/products/:id`
- `/cart`
- `/checkout`
- `/payment/vnpay-return`
- `/orders`
- `/profile`
- `/login`
- `/register`
- `/contact`

Admin layout:

- `/admin/dashboard`
- `/admin/products`
- `/admin/categories`
- `/admin/brands`
- `/admin/orders`
- `/admin/users`
- `/admin/vouchers`
- `/admin/profile`

Staff layout:

- `/staff/dashboard`
- `/staff/products`
- `/staff/categories`
- `/staff/brands`
- `/staff/orders`
- `/staff/vouchers`
- `/staff/profile`

Shipper layout:

- `/shipper/orders`
- `/shipper/profile`

Wildcard route redirects to `/`.

## Angular Conventions

- Components are standalone. Add required Angular modules/components to the `imports` array.
- Most components use separate files: `.ts`, `.html`, `.scss`.
- Keep page-level code under `src/app/pages/`.
- Keep reusable UI and shared workflow components under `src/app/shared/components/`.
- Keep API/data access in `src/app/core/services/`.
- Keep shared TypeScript interfaces in `src/app/core/models/`.
- TypeScript strict mode is enabled. Avoid `any` unless matching existing code or wrapping unknown backend payloads.
- `app.config.ts` provides router and HttpClient. There is no active HTTP interceptor at scan time; auth headers are handled in `ApiService`.

## API Integration

Central API wrapper: `src/app/core/services/api.service.ts`

- Base URL: `${environment.apiUrl}/api`
- Token key: `estore_token`
- Automatically sets `Authorization: Bearer <token>` when token exists
- Sets `Content-Type: application/json` unless body is `FormData`
- Exposes `get`, `post`, `put`, `delete`, `saveToken`, `getToken`, `clearToken`

Backend response wrapper used by most services:

```ts
export interface BaseResultDTO<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  count: number | null;
}
```

When adding a backend endpoint, add or update:

- matching model in `core/models/`
- typed method in the relevant `core/services/*service.ts`
- page/component state and template
- error/loading/empty states where user-facing

## Auth And Roles

Auth service: `src/app/core/services/auth.service.ts`

- Stores backend JWT through `ApiService.saveToken`
- Stores current user in localStorage key `estore_auth`
- Uses Angular signals/computed for login and role state
- Role strings: `ROLE_ADMIN`, `ROLE_CUSTOMER`, `ROLE_SHIPPER`, `ROLE_STAFF`

Role helpers:

- `isLoggedIn`
- `isAdmin`
- `isStaff`
- `isShipper`
- `isCustomer`
- `hasRole(role: string)`

There are no route guards at scan time. Layout/components should check auth/role state before exposing protected workflows.

## Main Services

- `api.service.ts`: central HTTP wrapper
- `auth.service.ts`: login/register/logout/current user state
- `product-api.service.ts`: products, keyword search, AI search, categories, brands
- `recommendation.service.ts`: `GET /products/{id}/recommendations`
- `review.service.ts`: product reviews
- `cart.service.ts`: cart workflows
- `order.service.ts`: checkout and order workflows
- `voucher.service.ts`: voucher workflows
- `user-api.service.ts`: admin user management
- `profile.service.ts`: profile metadata/update
- `upload.service.ts`: upload API/FormData
- `chatbot.service.ts`: chatbot message endpoint
- `toast.service.ts`: app toast state
- `mock-data.service.ts`: local fallback/static catalog data used by some mappers

## Product Integration Notes

Product model: `src/app/core/models/product.model.ts`

Important product fields currently mirrored from backend:

- `id`, `name`, `price`
- `cpu`, `ram`, `screen`, `operatingSystem`, `batteryCapacity`, `design`, `warrantyInfo`, `description`
- `soldQuantity`, `stockQuantity`
- `categoryId`, `categoryName`, `brandId`, `brandName`
- `image`, `images`
- `rating`, `reviewCount`
- `semanticScore`

Product API service:

- `getProducts(keyword, page, size)` -> `GET /api/products`
- `searchProducts(options)` -> AI search by default, keyword fallback
- `getProductById(id)` -> `GET /api/products/detail/{id}`
- `createProduct(data)` -> `POST /api/products/create`
- `updateProduct(id, data)` -> `PUT /api/products/update/{id}`
- `deleteProduct(id)` -> `DELETE /api/products/delete/{id}`
- `getReviewAiSummary(id)` -> `GET /api/products/{id}/review-summary`

AI search options:

```ts
interface ProductSearchOptions {
  query: string;
  mode?: 'ai' | 'keyword';
  categoryId?: number | null;
  brandId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  inStockOnly?: boolean;
  page?: number;
  size?: number;
}
```

Recommendation response is not wrapped in `BaseResultDTO`:

```ts
interface ProductRecommendationResponse {
  recommendations: RecommendedProduct[];
  aiEnabled: boolean;
  message: string;
}
```

## Styling And UI

Global styles: `src/styles.scss`

- Tailwind base/components/utilities are enabled.
- App uses a dark design system with CSS variables prefixed `--kv-*`.
- Shared classes include `kv-surface`, `kv-panel`, `kv-card`, `kv-table`, `kv-primary-btn`, `kv-secondary-btn`.
- Existing UI uses Material Symbols via `.material-symbols-outlined`.
- Tailwind tokens are extended in `tailwind.config.js`.

When changing UI:

- Match existing component/page style instead of adding a separate design language.
- Prefer shared components in `shared/components/ui/` where they already fit.
- Keep responsive states explicit in SCSS.
- Check text overflow in buttons, table cells, modal footers, and cards.
- Do not add dependencies for basic UI without a clear project need.

## Backend Contract

Backend project path: `C:\cuong\e-store`

Important matching files on backend:

- `dto/BaseResultDTO.java`
- `dto/response/ProductResponse.java`
- `dto/request/ProductAiSearchRequest.java`
- `controller/api/ProductController.java`
- `security/SecurityConfig.java`

For cross-stack changes, update backend DTOs and frontend models in the same task. Most frontend services expect backend `data` from `BaseResultDTO<T>`, except recommendations.

## Agent Coding Checklist

- Run `git status --short` first; this project may have active uncommitted work.
- Do not touch `node_modules/`, `dist/`, or `.angular/`.
- Keep model interfaces aligned with backend DTOs.
- Keep components standalone and import their dependencies explicitly.
- Prefer `ApiService` over direct `HttpClient` calls in feature services.
- Add typed service methods before wiring UI.
- Run `npm run build` after TypeScript/template changes when feasible.
- Never revert unrelated user changes.
