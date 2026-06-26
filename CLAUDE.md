# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

A full-stack page builder on Laravel 13 + Inertia.js v3 + React 19. Admins drag-and-drop React section templates onto a canvas, edit their content inline, configure SEO, and publish pages at custom slugs. The same section components render identically in the builder preview and on public pages. Fortify provides authentication (login, register, email verification, password reset, 2FA/TOTP). Roles: `admin` (full access) and `editor` (can create/edit pages, cannot publish or manage menus/layout).

## Commands

```bash
# Development
composer run dev          # Start Laravel + queue worker + Vite concurrently

# Build
npm run build             # Production asset build (user runs this — never run npm commands yourself)
npm run build:ssr         # Build with SSR

# Tests
php artisan test --compact                        # Run all tests
php artisan test --compact --filter=TestName      # Run a single test

# Code quality (run before finalising changes)
vendor/bin/pint --dirty --format agent            # Fix PHP style
npm run lint                                      # Fix JS/TS lint issues
npm run format                                    # Fix JS/TS formatting
npm run types:check                               # TypeScript type check

# CI check (runs all of the above)
composer run ci:check
```

> **Important**: Never run `npm` commands yourself — always ask the user to run them.

## Architecture

### Routes

- `routes/web.php` — dashboard, homepage (`/` → `PublicPageController::home`), catch-all public page (`{slug}`)
- `routes/admin.php` — all `/admin/*` routes, guarded by `auth + verified + role:admin,editor`
- `routes/settings.php` — profile / security
- The catch-all uses `where('slug', '[a-z0-9\-]+')` so it never shadows `/admin`, `/settings`, etc.

### Backend (`app/`)

- **`app/Http/Controllers/Admin/`** — `PageController`, `MediaController`, `MenuController`, `MenuItemController`, `GlobalLayoutController`
- **`app/Http/Controllers/PublicPageController`** — `home()` finds the published page with slug `/` or `home` (or first published); `show($slug)` serves any published page
- **`app/Http/Controllers/ContactController`** — handles `POST /contact/submit`; validates then calls `ZohoCrmService::createLead()`. Phone arrives as `+91 <digits>`, split before sending to Zoho. Country is hardcoded to `'India'`.
- **`app/Http/Controllers/AccessRequestController`** — handles `POST /access-request/submit`; validates then calls `ZohoCrmService::createSubscriber()`. Phone arrives as `<code> <digits>`, split before sending.
- **`app/Services/ZohoCrmService`** — OAuth token cached for ~55 min. `createLead()` posts to `/crm/v3/Leads`. `createSubscriber()` posts to `/crm/v3/HR_Library_Subscribers` (custom module). Zoho's `Phone` field in the subscriber module has a **12-character maximum** — always send digits only, never the combined `+91 8197099618` string.
- **`app/Http/Middleware/EnsureUserHasRole.php`** — `role:admin,editor` alias; registered in `bootstrap/app.php`
- **`app/Http/Middleware/HandleInertiaRequests.php`** — shares `auth.user`, `app.name`, `sidebarOpen`, and **`menus`** (all menus keyed by location, loaded with `Inertia::always()` so they refresh on partial reloads)
- **`app/Models/`**: `Page` (has `sections()`, `scopePublished()`), `PageSection` (props cast to array), `LayoutSection` (global header/footer sections), `Media` (appended `url` attr rewrites http→https when request is secure), `Menu` + `MenuItem` (nested with children)
- **Section sync**: `PageController` deletes all sections then bulk-inserts on every save — no diffing
- **`MediaController`** returns JSON (not Inertia) — consumed by the media picker modal
- **`MenuItemController`** returns JSON — consumed by the menu editor SPA

### Frontend (`resources/js/`)

**Layout resolution** (`app.tsx`): `welcome`, `site/page`, `admin/pages/create`, `admin/pages/edit`, `admin/layout/edit` → `null` (full-screen); `auth/*` → `AuthLayout`; `settings/*` → `[AppLayout, SettingsLayout]`; everything else → `AppLayout`.

**Section Registry** (`resources/js/sections/`):
- `index.ts` auto-discovers all `.tsx` files via `import.meta.glob` — every section file must export `meta` (SectionMeta), `schema` (SectionSchema), and a default React component
- `sectionRegistry[name]` maps section type → registration; used by the builder canvas, properties panel, and public page renderer
- `getDefaultProps(sectionType)` seeds new sections with schema defaults
- Adding a new section = drop a new `.tsx` into `resources/js/sections/` — no registration step needed

**Sections available**: `nav-header`, `hero`, `featured-cards`, `alternate-cards`, `features`, `cta`, `newsletter`, `site-footer`, `trusted-partners`, `quote-stats`, `services-grid`, `service-package`, `testimonials`, `section-intro`, `audience-split`, `content-grid`, `featured-work`, `testimonial-cta`, `faq`, `contact-banner`, `get-in-touch`, `contact-form`, `access-request`

**Dark mode**: removed. `use-appearance.tsx` still exists but `initializeTheme()` is not called. The `dark` class is never applied. All `dark:` Tailwind classes throughout UI components are inert. Do not re-introduce dark mode.

**Brand theme**:
- `--color-brand: #142345` — primary dark navy; use `text-brand`, `bg-brand`, `border-brand`
- `--color-accent-brand: #547ed1` — accent blue; use `text-accent-brand`, `bg-accent-brand`
- Fonts: `Libre Baskerville` (variable, headings via `h1–h6` base style), `DM Sans` (variable, body). Body base `font-weight: 400`
- Font files live in `resources/fonts/` and are referenced via `@font-face` in `resources/css/app.css`

**Section anatomy notes**:
- `alternate-cards` — 4-column checkerboard desktop grid; mobile = horizontal snap carousel with dot indicators. Two schema arrays: `images` + `items` interleaved into 8 slots. Heading split: `headingLine1` + `headingLine2` (backward compat: falls back to `heading`)
- `trusted-partners` — left 30% heading, right 70% logo grid (3 rows × 4); logos array with image + alt
- `quote-stats` — large `&ldquo;` as `absolute` behind quote text (no layout space), tilted image with `accent-brand` accent shape, achievement text + 3 stats
- `services-grid` — heading with `accent-brand` circle accent, dark `bg-black` cards; featured card has title + description + button + 3 stacked images (centre image offset up); two smaller cards each have title + description + button + single image side-by-side
- `service-package` — number + label, two-line heading with absolute decorative circle, description, primary pill CTA + secondary download link, image right
- `section-intro` — number, two-line heading, description, 3-column icon grid; icons editable via Lucide name text field
- `audience-split` — left 3/5 with number + heading + circle + description + 4-col icon grid (Lucide names editable), right 2/5 image
- `content-grid` — left 2/5 text + CTA, right 2×2 white card grid; all icons editable via `DynamicIcon` (Lucide name string)
- `featured-work` — left 30% label/heading/CTA, right 3 portrait cards with title + category
- `testimonial-cta` — two-column: left = testimonial slider with `&ldquo;` as `absolute` background, right = CTA with circle accent + image
- `faq` — left 2/5 label/heading/description, right 3/5 accordion (one open at a time, `+`/`−` icons)
- `contact-banner` / `get-in-touch` — dark `bg-brand` card with concentric white rings on right side (hardcoded pixel sizes, no CSS variables), glassmorphic pill buttons with metallic arrow badge
- `contact-form` — split-column layout (left: channel cards, right: message form). Phone hardcoded to `+91` (no dropdown); country hardcoded to `India`. Submits to `POST /contact/submit` → Zoho Leads.
- `access-request` — multi-field subscription form with full country code dropdown, auto-fills Country from selected code (editable), LinkedIn URL, designation text, city. Submits to `POST /access-request/submit` → Zoho HR_Library_Subscribers. Consent maps to `Email_Opt_Out` (inverted).
- Right properties panel in builder pages (create/edit/layout) is collapsible via a `panelOpen` toggle button on the panel's left edge

**Dynamic icon pattern** (used in `section-intro`, `audience-split`, `content-grid`):
```tsx
import * as LucideIcons from 'lucide-react';
function DynamicIcon({ name, className }: { name?: string; className?: string }) {
    const Icon = (LucideIcons as Record<string, unknown>)[name ?? ''] as React.ComponentType<{ className?: string }> | undefined;
    if (!Icon) return <span className={className}>{name}</span>;
    return <Icon className={className} />;
}
```
Schema field: `{ type: 'text', label: 'Icon (Lucide name e.g. FileText)', default: 'FileText' }`

**Decorative circle behind text** pattern (consistent across sections):
```tsx
<span className="relative inline-block">
    <span className="absolute rounded-full bg-accent-brand"
        style={{ top: '-10px', bottom: '-10px', left: '-8px', right: '-8px', zIndex: 0 }} />
    <span className="relative" style={{ zIndex: 1 }}>{word}</span>
</span>
```

**`&ldquo;` decorative quote** — always render as `absolute` so it takes no layout space:
```tsx
<span className="pointer-events-none absolute -left-4 -top-6 select-none text-8xl font-black leading-none text-accent-brand/30" style={{ zIndex: 0 }}>&ldquo;</span>
```

**Section browser** (`section-browser.tsx`) — renders live scaled thumbnails of each section at `RENDER_WIDTH=1200px`, scaled to `220px` using `position: absolute` inside a fixed-height container. The inner div must be `position: absolute` (not in flow) to prevent layout blowout.

**Draft preview**: `GET /draft/{slug}` (auth-protected) serves any page regardless of status via `PublicPageController::preview()`.

**Builder components** (`resources/js/components/builder/`):
- `builder-canvas.tsx` — `DndContext id="builder-canvas"` + `SortableContext` for reordering; handles cross-panel drop for inserting new sections
- `sortable-item.tsx` — drag handle, selection ring, remove button
- `properties-panel.tsx` — reads `sectionRegistry[section_type].schema` and renders `FieldEditor` per field
- `field-editor.tsx` — dispatches by `FieldDef.type`: text/url/number → Input, textarea → Textarea, richtext → TiptapEditor, image → thumbnail + "Choose Image" → `onOpenMediaPicker`, boolean → Checkbox, array → repeatable sub-list
- `builder-top-bar.tsx`, `page-settings-sheet.tsx` — title editing, SEO fields, publish/unpublish

**Media picker pattern**: `onOpenMediaPicker: (onSelect: (url: string) => void) => void` — each field passes its own `onChange` as the callback so nested array fields update correctly. `useState` setter for the callback must be wrapped: `setMediaPickerCallback(() => onSelect)`.

**`useBuilder` hook** (`resources/js/hooks/use-builder.ts`): centralises all builder state — sections[], selectedId, mediaPickerOpen, mediaPickerCallback, region (header/body/footer), `buildPayload()`.

**Menu builder** (`resources/js/components/menu-builder/`):
- `menu-item-tree.tsx` — dnd-kit sortable with `DndContext id="menu-item-tree"`; calls `/admin/menus/{id}/items/reorder` on drag end
- `menu-item-form.tsx` — opens in a Dialog; custom `PageCombobox` with search for the page selector

**Public page renderer** (`resources/js/pages/site/page.tsx`): iterates `sections`, looks up `sectionRegistry[section_type]`, renders `<Component {...section.props} />`. Layout is `null`.

**Global layout** (`resources/js/pages/admin/layout/edit.tsx`): separate header/footer region tabs; saves to `LayoutSection` table via `POST /admin/layout`.

**`menus` shared prop**: available on every page as `usePage().props.menus` keyed by location (`desktop_nav`, `mobile_nav`, `footer`). The `nav-header` section reads `menus.desktop_nav` from this.

### Database

**Driver**: PostgreSQL (AWS RDS — `database-1.cteaa8oiijpl.eu-north-1.rds.amazonaws.com`, database `pagebuilder`). Local `.env` uses `DB_CONNECTION=pgsql`. On local machine, connection goes via SSH tunnel through EC2 (`51.21.85.185`) since RDS is in a private VPC.

> **Sequence reset**: If data is migrated from SQLite, PostgreSQL auto-increment sequences will be out of sync. Run this on the server to fix all tables at once:
> ```bash
> php artisan tinker --execute 'foreach(DB::select("SELECT tablename FROM pg_tables WHERE schemaname = '"'"'public'"'"'") as $table) { $t = $table->tablename; $has_int_id = DB::select("SELECT 1 FROM information_schema.columns WHERE table_name = '"'"'{$t}'"'"' AND column_name = '"'"'id'"'"' AND data_type IN ('"'"'integer'"'"', '"'"'bigint'"'"')"); if($has_int_id) { DB::statement("SELECT setval('"'"'{$t}_id_seq'"'"', COALESCE((SELECT MAX(id) FROM \"{$t}\"), 1))"); } }'
> ```

- **`pages`** — title, slug (unique; `/` is valid for homepage), meta_*, status (draft/published), custom_header, custom_footer, created_by/updated_by FK
- **`page_sections`** — page_id, section_type, sort_order, props (JSON)
- **`layout_sections`** — region (header/footer), section_type, sort_order, props (JSON) — global site header/footer
- **`media`** — filename, path, disk, mime_type, size, alt, uploaded_by
- **`menus`** / **`menu_items`** — menus keyed by location; menu_items support parent_id for one level of nesting
- **`users`** — includes `role` (admin/editor) and 2FA columns

**Shared phone utility** (`resources/js/lib/phone-countries.ts`):
- `COUNTRY_CODES: { name, code }[]` — 190 countries with dial codes
- `COUNTRIES: string[]` — country names derived from above
- `PHONE_RULES: Record<string, [min, max]>` — digit range per dial code for client-side validation
- `validatePhone(code, digits): string | null` — returns error string or null

**Phone field split pattern** (used in both `ContactController` and `AccessRequestController`): phone is stored and submitted as `"+91 8197099618"` (combined string, validated `max:30`). Before sending to Zoho, split with `explode(' ', $phone, 2)` and send only the digit portion to the `Phone` / `Mobile` field.

### TypeScript Types

- `resources/js/types/builder.ts` — `FieldDef`, `SectionSchema`, `SectionMeta`, `SectionRegistration`, `SectionInstance`, `Page`, `PageSection`, `MediaItem`
- `resources/js/types/menu.ts` — `MenuItem`, `Menu`
- `resources/js/types/index.ts` — `User` (includes `role: 'admin' | 'editor'`)

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA_REACT) - v3
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.
- To check environment variables, read the `.env` file directly.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== herd rules ===

# Laravel Herd

- The application is served by Laravel Herd at `https?://[kebab-case-project-dir].test`. Use the `get-absolute-url` tool to generate valid URLs. Never run commands to serve the site. It is always available.
- Use the `herd` CLI to manage services, PHP versions, and sites (e.g. `herd sites`, `herd services:start <service>`, `herd php:list`). Run `herd list` to discover all available commands.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
