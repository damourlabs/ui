# Changelog

## 0.26.0

### &nbsp;&nbsp;&nbsp;Features

- **components/nav**: Integrate DarkModeToggleSwitch into QuickSettings component &nbsp;-&nbsp; by **Christopher** [<samp>(60895)</samp>](https://github.com/damourlabs/ui/commit/60895ed)
- **utils/form**: Add unwrapSchemaWithMetadata function to enhance schema processing and metadata extraction &nbsp;-&nbsp; by **Christopher** [<samp>(f28fc)</samp>](https://github.com/damourlabs/ui/commit/f28fcda)

### &nbsp;&nbsp;&nbsp;Bug Fixes

- **utils/form**:
  - Handle optional fieldsToIgnore in _createDynamicForm function &nbsp;-&nbsp; by **Christopher** [<samp>(0619a)</samp>](https://github.com/damourlabs/ui/commit/0619a08)
  - Remove duplicate code and ensure all unwraping happens before the field definition and in correct order &nbsp;-&nbsp; by **Christopher** [<samp>(a57dd)</samp>](https://github.com/damourlabs/ui/commit/a57dd75)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/damourlabs/ui/compare/v0.25.0...0.25.1)

## 0.25.0

### &nbsp;&nbsp;&nbsp;Features

- **components/common**: Add DarkModeToggleSwitch component and integrate color mode functionality &nbsp;-&nbsp; by **Christopher** [<samp>(ade09)</samp>](https://github.com/damourlabs/ui/commit/ade0963)
- **components/nav**: Add QuickSettings component to SidebarFooter &nbsp;-&nbsp; by **Christopher** [<samp>(92a44)</samp>](https://github.com/damourlabs/ui/commit/92a442b)
- **components/table**: Add basic data table using @tanstack/vue-table &nbsp;-&nbsp; by **Christopher** [<samp>(10729)</samp>](https://github.com/damourlabs/ui/commit/107296d)
- **utils/form**: Add fields_to_ignore parameter to _createDynamicForm function &nbsp;-&nbsp; by **Christopher** [<samp>(3ba1a)</samp>](https://github.com/damourlabs/ui/commit/3ba1ae9)

### &nbsp;&nbsp;&nbsp;Bug Fixes

- **app**: Remove unused source import from tailwind.css &nbsp;-&nbsp; by **Christopher** [<samp>(d6d90)</samp>](https://github.com/damourlabs/ui/commit/d6d90d0)
- **package**: Add postinstall script to prepare Nuxt environment &nbsp;-&nbsp; by **Christopher** [<samp>(126ae)</samp>](https://github.com/damourlabs/ui/commit/126ae24)
- **ui/deps**: Remove deprecated @nuxtjs/tailwindcss dependency &nbsp;-&nbsp; by **Christopher** [<samp>(1fd0b)</samp>](https://github.com/damourlabs/ui/commit/1fd0be9)
- **utils/form**: Ensure default options are set for _createDynamicForm function &nbsp;-&nbsp; by **Christopher** [<samp>(16d64)</samp>](https://github.com/damourlabs/ui/commit/16d6483)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/damourlabs/ui/compare/v0.24.3...0.25.0)

## Latest

### 🐛 Bug Fixes

- fetch resources on component mount to ensure data is loaded for the finder &nbsp;-&nbsp; [<samp>(3f30551)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/3f30551)

### ♻️ Refactoring

- add useFooter() composable to handle footer state &nbsp;-&nbsp; [<samp>(7f0e47d)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7f0e47d)

## 0.24.2

### 🐛 Bug Fixes

- fetch resources on component mount to ensure data is loaded for the finder &nbsp;-&nbsp; [<samp>(3f30551)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/3f30551)

### ♻️ Refactoring

- add useFooter() composable to handle footer state &nbsp;-&nbsp; [<samp>(7f0e47d)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7f0e47d)

## Latest

### ✨ Features

- add error layout component with handling actions and user guidance &nbsp;-&nbsp; [<samp>(ba5a3f8)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ba5a3f8)
- initialize documentation structure with configuration files and assets &nbsp;-&nbsp; [<samp>(df7f3ab)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/df7f3ab)
- add FeatureCard and StatCard components &nbsp;-&nbsp; [<samp>(7c4ef20)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7c4ef20)
- add hasBreadcrumbs prop to NavigationSidebarProps and conditionally render header in simple layout &nbsp;-&nbsp; [<samp>(bc4da83)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/bc4da83)
- integrate Footer component with dynamic footer configuration. remove providing since composable is accessible accross the application &nbsp;-&nbsp; [<samp>(0097a1c)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/0097a1c)
- add Hero component with customizable title and actions &nbsp;-&nbsp; [<samp>(c86cd81)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/c86cd81)
- enhance dynamic form creation with resource finder support and refactor related functions &nbsp;-&nbsp; [<samp>(d6ab909)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d6ab909)
- add ResourceFinder component and integrate into DynamicFormField and DynamicFormFieldArray &nbsp;-&nbsp; [<samp>(1ef9c1c)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/1ef9c1c)
- allow form to be rendered in section or not &nbsp;-&nbsp; [<samp>(8c77e59)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/8c77e59)
- add Badge component from Shadcn/vue &nbsp;-&nbsp; [<samp>(5559836)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/5559836)
- enhance dynamic form components with collapsible sections and improved field handling using composition API with useForm,  useField and useFieldArray fix(ui/forms): reference to deprecated field names  (94b984576590426121a1a1aa53924aaf8c127325) refactor(ui/form): separate array and nested object to separate components &nbsp;-&nbsp; [<samp>(eb8c3f0)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/eb8c3f0)
- add support for boolean fields as checkboxes in dynamic form creation &nbsp;-&nbsp; [<samp>(7e24452)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7e24452)
- add support for ZodRecord schema in dynamic form creation &nbsp;-&nbsp; [<samp>(1bb074e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/1bb074e)
- remove final 's' from field label in dynamic form creation &nbsp;-&nbsp; [<samp>(0d9dae9)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/0d9dae9)
- implement DataTable component to render structured data &nbsp;-&nbsp; [<samp>(9f1553d)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/9f1553d)
- add success variant to Button component &nbsp;-&nbsp; [<samp>(719ae6a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/719ae6a)
- add Checkbox component from shadcn/vue &nbsp;-&nbsp; [<samp>(b48ebec)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b48ebec)
- add support for Date input with Calendar Input Field &nbsp;-&nbsp; [<samp>(b3f639f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b3f639f)
- enhance DynamicFormField with improved structure and support for arrays, nested objects, number and range types refactor(ui/forms): simplify DynamicForm component by moving all logic for different field renderer in DynamicFormField refactor(ui/forms): make sections just dynamic form field and deal with rendering in DynamicFormField.vue &nbsp;-&nbsp; [<samp>(0880e2e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/0880e2e)
- enable creation of form directly from zod schema with support with label, description, initial values and checks &nbsp;-&nbsp; [<samp>(2d32d61)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2d32d61)
- add NumberField, Progress, Slider, and Tabs components from shadcn/vue &nbsp;-&nbsp; [<samp>(d6fefec)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d6fefec)
- add NavLink component for enhanced navigation links &nbsp;-&nbsp; [<samp>(9ead2a0)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/9ead2a0)
- add DynamicForm and DynamicFormField components with schema support &nbsp;-&nbsp; [<samp>(30566ef)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/30566ef)
- add BarChart and LineChart components with props and templates wrapping components from nuxt-charts &nbsp;-&nbsp; [<samp>(1bb86ab)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/1bb86ab)
- add FormControl, FormDescription, FormItem, FormLabel, FormMessage components and useFormField composable feat(ui/select): implement Select components including Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, and SelectValue chore(package): update dependencies to include vee-validate and zod &nbsp;-&nbsp; [<samp>(02dc18f)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/02dc18f)
- add Card, SideBar, Links, Main, TopLevel, and User components for dashboard layout &nbsp;-&nbsp; [<samp>(485e955)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/485e955)
- implement dynamic breadcrumbs in dashboard layout &nbsp;-&nbsp; [<samp>(c0f98a7)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/c0f98a7)
- update BreadcrumbLink to use NuxtLink as default &nbsp;-&nbsp; [<samp>(ebc823a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/ebc823a)
- add Dashboard layout &nbsp;-&nbsp; [<samp>(6845395)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/6845395)
- add base shadcn components &nbsp;-&nbsp; [<samp>(7be5f18)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/7be5f18)

### 🐛 Bug Fixes

- add error handling for missing resource store in ResourceFinder &nbsp;-&nbsp; [<samp>(07560b6)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/07560b6)
- adust min-h-screen to min-h-svh &nbsp;-&nbsp; [<samp>(cd7db33)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/cd7db33)
- correct import path for NuxtLinkProps from '#app' to 'nuxt/app' &nbsp;-&nbsp; [<samp>(218e790)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/218e790)
- add type="button" in collapsible  to prevent trigerring refreshes. Fix import to ui instead of native html button &nbsp;-&nbsp; [<samp>(eb277d7)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/eb277d7)
- enhance dynamic form creation by improving label formatting and setting default display fields &nbsp;-&nbsp; [<samp>(d34b5b8)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d34b5b8)
- refactor ResourceFinder to use props for configuration and improve resource selection handling &nbsp;-&nbsp; [<samp>(f1a1c9e)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f1a1c9e)
- add type annotation for item &nbsp;-&nbsp; [<samp>(caa77fc)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/caa77fc)
- replace isLoading with loading for consistency and clarity &nbsp;-&nbsp; [<samp>(f83e248)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f83e248)
- correct conditional rendering for checkbox template &nbsp;-&nbsp; [<samp>(327a93a)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/327a93a)
- correct form element placement for submission handling &nbsp;-&nbsp; [<samp>(af158ab)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/af158ab)
- update label binding in DynamicFormField.vue &nbsp;-&nbsp; [<samp>(2e22be2)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2e22be2)
- update date type handling to use 'calendar-date' &nbsp;-&nbsp; [<samp>(73f9271)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/73f9271)
- correct self-closing tags in DynamicForm.vue &nbsp;-&nbsp; [<samp>(b23794d)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b23794d)
- use the key to identify date instead of the description &nbsp;-&nbsp; [<samp>(f05f0ed)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/f05f0ed)
- dealing with ZodEffects schema &nbsp;-&nbsp; [<samp>(2e8905b)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/2e8905b)
- rename 'children' to 'subfields' to avoid clash with native html prop &nbsp;-&nbsp; [<samp>(94b9845)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/94b9845)
- remove range logic, ranges will be found differently &nbsp;-&nbsp; [<samp>(b0caefb)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b0caefb)
- move NuxtLink to be only on the icon and not the whole sidebar item as it was create conflict with the collapsible &nbsp;-&nbsp; [<samp>(acbddac)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/acbddac)
- enhance button variant styles for better accessibility and consistency &nbsp;-&nbsp; [<samp>(5903837)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/5903837)
- remove text-justify &nbsp;-&nbsp; [<samp>(b38901b)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b38901b)
- correct import path for DashboardSidebarProps in useDashboardSidebar composable &nbsp;-&nbsp; [<samp>(602877c)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/602877c)
- correct import path for DashboardSideBar and improve type annotations in computed properties &nbsp;-&nbsp; [<samp>(4addc9d)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/4addc9d)
- shadcn setup &nbsp;-&nbsp; [<samp>(b38e8df)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/b38e8df)

### ♻️ Refactoring

- isolate DynamicFormFieldDate component for enhanced date selection &nbsp;-&nbsp; [<samp>(c0f8104)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/c0f8104)
- move util function into utils file &nbsp;-&nbsp; [<samp>(8b60cd4)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/8b60cd4)
- use NavigationSidebarItem type from Sidebar for item props &nbsp;-&nbsp; [<samp>(4ec97e8)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/4ec97e8)
- rename sidebar component and composable since its not specific to dashboard &nbsp;-&nbsp; [<samp>(5cd8eec)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/5cd8eec)

### 💄 Styling

- formatting &nbsp;-&nbsp; [<samp>(46dc082)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/46dc082)
- reorder attribute &nbsp;-&nbsp; [<samp>(8f3a380)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/8f3a380)

### 🔧 Chores

- remove duplicate class "grid" &nbsp;-&nbsp; [<samp>(d0a47d3)</samp>](https://github.com/damourChris/damourlabs-portfolio/commit/d0a47d3)
