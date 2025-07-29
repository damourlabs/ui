# @damourlabs/ui

A comprehensive Vue 3 + Nuxt 3 UI component library with advanced form generation capabilities, built with TypeScript, TailwindCSS, and modern web technologies.

## ✨ Features

- 🎨 **Modern UI Components** - Built with shadcn/ui and TailwindCSS
- 🔧 **Dynamic Form Generation** - Automatic form creation from Zod schemas
- 📊 **Chart Components** - Data visualization with vue-charts
- 🌙 **Dark Mode Support** - Built-in theme switching
- 🧩 **Modular Architecture** - Import only what you need
- 🔒 **Type Safety** - Full TypeScript support
- 🎯 **Form Validation** - Advanced validation with vee-validate and Zod
- 🔗 **Resource Management** - Smart resource field handling and linking
- 📱 **Responsive Design** - Mobile-first approach
- ♿ **Accessibility** - ARIA compliant components

## 🚀 Quick Start

### Installation

Add the layer to your Nuxt project:

```bash
npm install @damourlabs/ui
# or
pnpm add @damourlabs/ui
# or
yarn add @damourlabs/ui
```

### Setup

Add the layer to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@damourlabs/ui'],
  // your config
})
```

That's it! The layer will automatically configure:
- TailwindCSS with custom theme
- Component auto-imports with `Ui` prefix
- Dark mode support
- Form validation setup
- Chart components

## 📚 Core Components

### 🎯 Dynamic Form System

The crown jewel of this library is the dynamic form generation system that automatically creates forms from Zod schemas.

#### Basic Usage

```vue
<template>
  <div>
    <UiDynamicForm 
      :schema="formSchema" 
      :submit-fn="handleSubmit"
      :sections="true"
    />
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { createDynamicForm } from '@damourlabs/ui/utils/form'

// Define your schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  isActive: z.boolean().default(true),
  role: z.enum(['admin', 'user', 'moderator']),
  profile: z.object({
    bio: z.string().optional(),
    website: z.string().url().optional(),
  })
})

// Generate the form
const formSchema = createDynamicForm(userSchema)

const handleSubmit = (values: any) => {
  console.log('Form submitted:', values)
}
</script>
```

#### Advanced Form Configuration

```ts
import { createDynamicForm, type CreateDynamicFormOptions } from '@damourlabs/ui/utils/form'

const options: CreateDynamicFormOptions = {
  // Configure resource fields for foreign key relationships
  resourceFields: [
    { 
      field: 'user', 
      store: 'users', 
      displayField: 'email',
      searchFields: ['name', 'email']
    },
    { 
      field: 'project', 
      store: 'projects', 
      displayField: 'name' 
    }
  ],
  
  // Fields to exclude from form generation
  fieldsToIgnore: ['id', 'createdAt', 'updatedAt'],
  
  // Custom field type mappings
  fieldTypeMapping: {
    [z.ZodFirstPartyTypeKind.ZodString]: {
      as: 'textarea',
      inputType: 'text',
      handler: (fieldSchema, field, context) => {
        if (context.key === 'description') {
          field.as = 'textarea'
        }
      }
    }
  }
}

const formSchema = createDynamicForm(userSchema, options)
```

### 🎨 UI Components

All components are built with accessibility and customization in mind:

#### Buttons

```vue
<template>
  <UiButton variant="default">Default Button</UiButton>
  <UiButton variant="destructive">Delete</UiButton>
  <UiButton variant="outline">Outlined</UiButton>
  <UiButton variant="ghost">Ghost</UiButton>
  <UiButton variant="success">Success</UiButton>
</template>
```

#### Cards

```vue
<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle>Card Title</UiCardTitle>
      <UiCardDescription>Card description</UiCardDescription>
    </UiCardHeader>
    <UiCardContent>
      <!-- Your content -->
    </UiCardContent>
    <UiCardFooter>
      <!-- Footer actions -->
    </UiCardFooter>
  </UiCard>
</template>
```

#### Data Tables

```vue
<template>
  <UiDataTable 
    :data="tableData" 
    :columns="columns"
    :pagination="true"
    :sorting="true"
    :filtering="true"
  />
</template>
```

### 📊 Chart Components

Built-in chart components for data visualization:

```vue
<template>
  <UiBarChart 
    :data="chartData"
    :categories="['sales', 'revenue']"
    :index="'month'"
    :colors="['#3b82f6', '#ef4444']"
  />
  
  <UiLineChart 
    :data="timeSeriesData"
    :categories="['users', 'sessions']"
    :index="'date'"
  />
</template>
```

## 🔧 Form Field Types

The dynamic form system supports all Zod schema types with intelligent field mapping:

### String Fields

```ts
const schema = z.object({
  name: z.string(),                    // → text input
  email: z.string().email(),           // → email input
  website: z.string().url(),           // → url input
  birthday: z.string().date(),         // → date picker
  userId: z.string().uuid(),           // → resource finder (if configured)
  description: z.string(),             // → textarea (with custom mapping)
})
```

### Number Fields

```ts
const schema = z.object({
  age: z.number(),                     // → number input with steppers
  price: z.number().min(0),            // → number input with validation
  rating: z.number().min(1).max(5),    // → range slider (with custom mapping)
})
```

### Boolean Fields

```ts
const schema = z.object({
  isActive: z.boolean(),               // → checkbox
  agreeToTerms: z.boolean(),           // → checkbox with label
})
```

### Enum Fields

```ts
const schema = z.object({
  status: z.enum(['active', 'inactive', 'pending']), // → select dropdown
  priority: z.enum(['low', 'medium', 'high']),       // → select dropdown
})
```

### Date Fields

```ts
const schema = z.object({
  createdAt: z.date(),                 // → date input
  scheduledFor: z.date(),              // → calendar date picker
})
```

### Array Fields

```ts
const schema = z.object({
  tags: z.array(z.string()),           // → dynamic array of text inputs
  members: z.array(z.object({          // → dynamic array of nested forms
    name: z.string(),
    role: z.enum(['admin', 'user'])
  })),
  userIds: z.array(z.string().uuid()), // → resource finder (multi-select)
})
```

### Nested Objects

```ts
const schema = z.object({
  address: z.object({                  // → collapsible nested form section
    street: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  preferences: z.record(z.string()),   // → dynamic key-value pairs
})
```

## 🔗 Resource Field Management

The library includes a powerful resource field system for handling relationships and foreign keys:

### Basic Resource Configuration

```ts
const options: CreateDynamicFormOptions = {
  resourceFields: [
    {
      field: 'user',           // Field name (without 'Id' suffix)
      store: 'usersStore',     // Pinia store for data fetching
      displayField: 'email',   // Field to display in the UI
      searchFields: ['name', 'email'] // Fields to search in
    }
  ]
}

// This will automatically convert:
// userId: z.string().uuid() → Resource finder component
```

### Resource Finder Component

```vue
<template>
  <UiResourceFinder
    v-model="selectedUserId"
    :resource-store="usersStore"
    :display-field="'email'"
    :search-fields="['name', 'email']"
    :allow-clear="true"
    placeholder="Search for a user..."
  />
</template>
```

### Creating Custom Resource Fields

```ts
import { createResourceFinderField } from '@damourlabs/ui/utils/form'

const userField = createResourceFinderField(
  'userId',
  'User',
  'users',
  {
    description: 'Select the user for this record',
    displayField: 'email',
    subTextField: 'name',
    searchFields: ['name', 'email', 'username'],
    rules: z.string().uuid().optional()
  }
)
```

## 🎨 Theming and Customization

### TailwindCSS Configuration

The library uses TailwindCSS v4 with a custom configuration. You can extend the theme in your project:

```js
// tailwind.config.js
import { damourTheme } from '@damourlabs/ui/tailwind.config'

export default {
  extends: [damourTheme],
  theme: {
    extend: {
      colors: {
        // Your custom colors
      }
    }
  }
}
```

### Dark Mode

Dark mode is automatically configured and can be toggled:

```vue
<template>
  <UiDarkModeToggleSwitch />
</template>
```

### Component Customization

All components accept custom classes and can be styled:

```vue
<template>
  <UiButton 
    class="bg-gradient-to-r from-purple-500 to-pink-500"
    variant="outline"
  >
    Custom Styled Button
  </UiButton>
</template>
```

## 📱 Layout Components

### Navigation

```vue
<template>
  <UiNavMain>
    <UiNavTopLevel>
      <UiNavLinks :links="navigationLinks" />
      <UiNavUser :user="currentUser" />
    </UiNavTopLevel>
    
    <UiNavSideBar>
      <UiNavQuickSettings />
    </UiNavSideBar>
  </UiNavMain>
</template>
```

### Hero Section

```vue
<template>
  <UiHero :actions="heroActions">
    <template #title>
      Welcome to Our Platform
    </template>
    <template #description>
      Build amazing applications with our comprehensive UI library
    </template>
  </UiHero>
</template>
```

## 🧪 Form Validation

### Built-in Validation

```ts
const schema = z.object({
  email: z.string()
    .email('Please enter a valid email')
    .min(1, 'Email is required'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  
  age: z.number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Please enter a valid age')
})
```

### Custom Validation Rules

```ts
import { createFieldHandler } from '@damourlabs/ui/utils/form'

const customEmailHandler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
  if (context.key.includes('email')) {
    field.inputType = 'email'
    field.rules = z.string().email().refine(async (email) => {
      // Custom async validation
      const exists = await checkEmailExists(email)
      return !exists
    }, 'Email already exists')
  }
})
```

## 📊 Advanced Examples

### Complete User Management Form

```vue
<template>
  <div class="container mx-auto p-6">
    <UiDynamicForm 
      :schema="userFormSchema" 
      :submit-fn="handleUserSubmit"
      :sections="true"
    />
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { createDynamicForm } from '@damourlabs/ui/utils/form'

const userSchema = z.object({
  // Basic Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  
  // Account Settings
  role: z.enum(['admin', 'user', 'moderator']).default('user'),
  isActive: z.boolean().default(true),
  departmentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  
  // Profile Information
  profile: z.object({
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    website: z.string().url('Invalid website URL').optional(),
    avatar: z.string().url().optional(),
    socialLinks: z.array(z.object({
      platform: z.enum(['twitter', 'linkedin', 'github']),
      url: z.string().url()
    })).optional()
  }),
  
  // Preferences
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.enum(['en', 'es', 'fr']).default('en')
  }),
  
  // Permissions
  permissions: z.array(z.enum(['read', 'write', 'delete', 'admin'])).default(['read']),
  
  // Projects
  projects: z.array(z.object({
    projectId: z.string().uuid(),
    role: z.enum(['owner', 'collaborator', 'viewer']),
    joinedAt: z.date().default(() => new Date())
  })).optional()
})

const userFormSchema = createDynamicForm(userSchema, {
  resourceFields: [
    { 
      field: 'department', 
      store: 'departments', 
      displayField: 'name',
      searchFields: ['name', 'code']
    },
    { 
      field: 'manager', 
      store: 'users', 
      displayField: 'email',
      searchFields: ['firstName', 'lastName', 'email']
    },
    { 
      field: 'project', 
      store: 'projects', 
      displayField: 'name',
      searchFields: ['name', 'description']
    }
  ],
  fieldsToIgnore: ['id', 'createdAt', 'updatedAt']
})

const handleUserSubmit = async (values: any) => {
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: values
    })
    // Handle success
  } catch (error) {
    // Handle error
  }
}
</script>
```

### E-commerce Product Form

```ts
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  categoryId: z.string().uuid(),
  
  // Product variants
  variants: z.array(z.object({
    name: z.string(),
    sku: z.string(),
    price: z.number().min(0),
    inventory: z.number().min(0).int(),
    attributes: z.record(z.string())
  })),
  
  // SEO
  seo: z.object({
    title: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
    description: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
    keywords: z.array(z.string()).optional()
  }),
  
  // Media
  images: z.array(z.string().url()),
  
  // Shipping
  shipping: z.object({
    weight: z.number().min(0),
    dimensions: z.object({
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0)
    }),
    freeShipping: z.boolean().default(false)
  })
})

const productFormSchema = createDynamicForm(productSchema, {
  resourceFields: [
    { field: 'category', store: 'categories', displayField: 'name' }
  ]
})
```

## 🔧 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/damourlabs/ui.git
cd ui

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Building

```bash
# Build for production
pnpm build

# Generate static files
pnpm generate
```

## 📄 API Reference

### Form Generation Functions

#### `createDynamicForm(schema, options?)`

Generates a dynamic form from a Zod schema.

**Parameters:**
- `schema: z.ZodObject` - The Zod schema to generate the form from
- `options?: CreateDynamicFormOptions` - Configuration options

**Returns:** `FormSchema<RuleExpression<unknown>>`

#### `createResourceFinderField(name, label, storeKey, options?)`

Creates a resource finder field configuration.

**Parameters:**
- `name: string` - Field name
- `label: string` - Field label
- `storeKey: string` - Pinia store key for data fetching
- `options?: object` - Additional configuration

#### `createFieldHandler<T>(handler)`

Creates a custom field handler for specific field types.

**Parameters:**
- `handler: FieldHandler<T>` - The handler function

#### `createFieldTypeMapping(mapping)`

Creates custom field type mappings.

**Parameters:**
- `mapping: Partial<FieldTypeMapping>` - The mapping configuration

### Component Props

See individual component documentation for detailed prop specifications.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component foundation
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Zod](https://zod.dev/) for schema validation
- [vee-validate](https://vee-validate.logaretm.com/) for form validation
- [Vue 3](https://vuejs.org/) and [Nuxt 3](https://nuxt.com/) for the framework

---

Made with ❤️ by [DamourLabs](https://github.com/damourlabs)

## Production

Build the application for production:

```bash
pnpm build
```

Or statically generate it with:

```bash
pnpm generate
```

Locally preview production build:

```bash
pnpm preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
