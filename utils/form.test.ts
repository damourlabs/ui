import { describe, it, expect, beforeEach, vi } from 'vitest'
import { z } from 'zod'
import {
  createDynamicForm,
  createFieldHandler,
  createFieldTypeMapping,
  extendFieldTypeMapping,
  formatFieldLabel,
  calculateEmptyValue,
  configureResourceField,
  processNestedSchema,
  unwrapSchemaWithMetadata,
  DEFAULT_FIELD_TYPE_MAPPING_EXPORT,
  type CreateDynamicFormOptions,
  type FieldHandler,
  type FieldTypeMapping,
  type ResourceFieldIndicator
} from '../utils/form'

describe('Dynamic Form Generator', () => {
  // Set up the crypto mock for this test suite
  const mockRandomUUID = vi.fn(() => 'test-uuid-123')

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the mock for each test
    mockRandomUUID.mockReturnValue('test-uuid-123')
    // Override the global mock for this test suite
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: mockRandomUUID
      },
      configurable: true
    })
  })

  describe('Helper Functions', () => {
    describe('formatFieldLabel', () => {
      it('should format camelCase to Title Case', () => {
        expect(formatFieldLabel('firstName')).toBe('First Name')
        expect(formatFieldLabel('emailAddress')).toBe('Email Address')
        expect(formatFieldLabel('isActive')).toBe('Is Active')
      })

      it('should handle single words', () => {
        expect(formatFieldLabel('name')).toBe('Name')
        expect(formatFieldLabel('age')).toBe('Age')
      })

      it('should handle already formatted strings', () => {
        expect(formatFieldLabel('First Name')).toBe('First Name')
      })
    })

    describe('calculateEmptyValue', () => {
      it('should calculate empty values for nested objects', () => {
        const schema = z.object({
          name: z.string().default('John'),
          age: z.number(),
          isActive: z.boolean().default(true)
        })

        const result = calculateEmptyValue(schema)

        expect(result).toEqual({
          name: 'John',
          age: undefined,
          isActive: true
        })
      })

      it('should handle objects without defaults', () => {
        const schema = z.object({
          title: z.string(),
          count: z.number()
        })

        const result = calculateEmptyValue(schema)

        expect(result).toEqual({
          title: undefined,
          count: undefined
        })
      })
    })

    describe('configureResourceField', () => {
      it('should configure resource field when match found', () => {
        const field = {
          as: 'input',
          name: 'userId',
          resourceStore: '',
          displayField: 'id'
        } as any

        const resourceFields: ResourceFieldIndicator[] = [
          { field: 'user', store: 'users', displayField: 'email' }
        ]

        const initialValues = {}

        const result = configureResourceField('userId', field, resourceFields, initialValues)

        expect(result).toBe(true)
        expect(field.as).toBe('resource-finder')
        expect(field.resourceStore).toBe('users')
        expect(field.displayField).toBe('email')
      })

      it('should generate UUID when no resource match found', () => {
        const field = {
          as: 'input',
          name: 'unknownId'
        } as any

        const resourceFields: ResourceFieldIndicator[] = []
        const initialValues = {}

        const result = configureResourceField('unknownId', field, resourceFields, initialValues)

        expect(result).toBe(false)
        expect(initialValues).toEqual({ unknownId: 'test-uuid-123' })
      })

      it('should handle custom resource key patterns', () => {
        const field = {
          as: 'input',
          name: 'projects'
        } as any

        const resourceFields: ResourceFieldIndicator[] = [
          { field: 'project', store: 'projects-store' }
        ]

        const initialValues = {}

        const result = configureResourceField('projects', field, resourceFields, initialValues, /s$/)

        expect(result).toBe(true)
        expect(field.resourceStore).toBe('projects-store')
      })
    })

    describe('unwrapSchemaWithMetadata', () => {
      it('should unwrap simple schema', () => {
        const schema = z.string()
        const result = unwrapSchemaWithMetadata(schema)

        expect(result.coreSchema).toBe(schema)
        expect(result.metadata).toEqual({
          isNullable: false,
          isOptional: false,
          hasDefault: false,
          isLazy: false,
          hasEffects: false
        })
      })

      it('should unwrap optional schema', () => {
        const schema = z.string().optional()
        const result = unwrapSchemaWithMetadata(schema)

        expect(result.coreSchema).toBeInstanceOf(z.ZodString)
        expect(result.metadata.isOptional).toBe(true)
      })

      it('should unwrap nullable schema', () => {
        const schema = z.string().nullable()
        const result = unwrapSchemaWithMetadata(schema)

        expect(result.coreSchema).toBeInstanceOf(z.ZodString)
        expect(result.metadata.isNullable).toBe(true)
      })

      it('should unwrap default schema', () => {
        const schema = z.string().default('test')
        const result = unwrapSchemaWithMetadata(schema)

        expect(result.coreSchema).toBeInstanceOf(z.ZodString)
        expect(result.metadata.hasDefault).toBe(true)
        expect(result.metadata.defaultValue).toBe('test')
      })

      it('should unwrap complex nested wrappers', () => {
        const schema = z.string().default('test').optional().nullable()
        const result = unwrapSchemaWithMetadata(schema)

        expect(result.coreSchema).toBeInstanceOf(z.ZodString)
        expect(result.metadata).toEqual({
          isNullable: true,
          isOptional: true,
          hasDefault: true,
          defaultValue: 'test',
          isLazy: false,
          hasEffects: false
        })
      })
    })
  })

  describe('Field Type Mapping', () => {
    describe('createFieldTypeMapping', () => {
      it('should create custom field type mapping', () => {
        const mapping = createFieldTypeMapping({
          [z.ZodFirstPartyTypeKind.ZodString]: {
            as: 'textarea',
            inputType: 'text'
          }
        })

        expect(mapping[z.ZodFirstPartyTypeKind.ZodString]).toEqual({
          as: 'textarea',
          inputType: 'text'
        })
      })
    })

    describe('extendFieldTypeMapping', () => {
      it('should extend existing mapping', () => {
        const base = {
          [z.ZodFirstPartyTypeKind.ZodString]: { as: 'input' }
        }

        const extension = {
          [z.ZodFirstPartyTypeKind.ZodNumber]: { as: 'slider' }
        }

        const result = extendFieldTypeMapping(base, extension)

        expect(result).toEqual({
          [z.ZodFirstPartyTypeKind.ZodString]: { as: 'input' },
          [z.ZodFirstPartyTypeKind.ZodNumber]: { as: 'slider' }
        })
      })

      it('should override base mapping with extension', () => {
        const base = {
          [z.ZodFirstPartyTypeKind.ZodString]: { as: 'input' }
        }

        const extension = {
          [z.ZodFirstPartyTypeKind.ZodString]: { as: 'textarea' }
        }

        const result = extendFieldTypeMapping(base, extension)

        expect(result[z.ZodFirstPartyTypeKind.ZodString]).toEqual({ as: 'textarea' })
      })
    })
  })

  describe('Custom Field Handlers', () => {
    it('should create custom field handler', () => {
      const handler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        field.as = 'custom-input'
        field.customProperty = 'test-value'
      })

      expect(typeof handler).toBe('function')
    })

    it('should apply custom field handler in form generation', () => {
      const customHandler: FieldHandler<z.ZodString> = (fieldSchema, field, context) => {
        if (context.key === 'description') {
          field.as = 'textarea'
        }
      }

      const customMapping = createFieldTypeMapping({
        [z.ZodFirstPartyTypeKind.ZodString]: {
          handler: customHandler
        }
      })

      const schema = z.object({
        name: z.string(),
        description: z.string()
      })

      const form = createDynamicForm(schema, {
        fieldTypeMapping: customMapping
      })

      const nameField = form.sections.find(f => f.name === 'name')
      const descriptionField = form.sections.find(f => f.name === 'description')

      expect(nameField?.as).toBe('input') // Should use default from handler
      expect(descriptionField?.as).toBe('textarea') // Should use custom logic
    })
  })

  describe('Basic Form Generation', () => {
    it('should generate form for simple schema', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        isActive: z.boolean()
      })

      const form = createDynamicForm(schema)

      expect(form.sections).toHaveLength(3)
      expect(form.sections[0]).toMatchObject({
        name: 'name',
        label: 'Name',
        as: 'input',
        inputType: 'text'
      })
      expect(form.sections[1]).toMatchObject({
        name: 'age',
        as: 'number',
        inputType: 'number'
      })
      expect(form.sections[2]).toMatchObject({
        name: 'isActive',
        as: 'checkbox',
        inputType: 'checkbox'
      })
    })

    it('should handle string variants', () => {
      const schema = z.object({
        email: z.string().email(),
        website: z.string().url(),
        birthday: z.string().date(),
        userId: z.string().uuid()
      })

      const form = createDynamicForm(schema)

      expect(form.sections.find(f => f.name === 'email')?.inputType).toBe('email')
      expect(form.sections.find(f => f.name === 'website')?.inputType).toBe('url')
      expect(form.sections.find(f => f.name === 'birthday')?.as).toBe('calendar-date')
      expect(form.sections.find(f => f.name === 'userId')?.inputType).toBe('uuid')
    })

    it('should handle enums', () => {
      const schema = z.object({
        status: z.enum(['active', 'inactive', 'pending'])
      })

      const form = createDynamicForm(schema)
      const statusField = form.sections.find(f => f.name === 'status')

      expect(statusField?.as).toBe('select')
      expect(statusField?.selectOptions).toHaveLength(3)
      expect(statusField?.selectOptions?.[0]).toMatchObject({
        tag: 'select-option',
        label: 'active',
        value: 'active'
      })
    })

    it('should handle dates', () => {
      const schema = z.object({
        createdAt: z.date()
      })

      const form = createDynamicForm(schema)
      const dateField = form.sections.find(f => f.name === 'createdAt')

      expect(dateField?.as).toBe('date')
      expect(dateField?.inputType).toBe('date')
    })
  })

  describe('Nested Objects and Arrays', () => {
    it('should handle nested objects', () => {
      const schema = z.object({
        name: z.string(),
        profile: z.object({
          bio: z.string(),
          website: z.string().url().optional()
        })
      })

      const form = createDynamicForm(schema)

      expect(form.sections).toHaveLength(2)

      const profileField = form.sections.find(f => f.name === 'profile')
      expect(profileField?.as).toBe('object')
      expect(profileField?.subfields).toHaveLength(2)
      expect(profileField?.subfields?.[0]).toMatchObject({
        name: 'bio',
        as: 'input',
        inputType: 'text'
      })

      expect(form.initialValues.profile).toEqual({
        bio: undefined,
        website: undefined
      })
    })

    it('should handle arrays of objects', () => {
      const schema = z.object({
        tags: z.array(z.string()),
        members: z.array(z.object({
          name: z.string(),
          role: z.enum(['admin', 'user'])
        }))
      })

      const form = createDynamicForm(schema)

      const tagsField = form.sections.find(f => f.name === 'tags')
      expect(tagsField?.as).toBe('array')
      expect(tagsField?.subfields).toHaveLength(0) // Non-object array elements
      expect(tagsField?.emptyValue).toBeUndefined()

      const membersField = form.sections.find(f => f.name === 'members')
      expect(membersField?.as).toBe('array')
      expect(membersField?.subfields).toHaveLength(2)
      expect(membersField?.emptyValue).toEqual({
        name: undefined,
        role: undefined
      })
    })

    it('should handle records', () => {
      const schema = z.object({
        metadata: z.record(z.string(), z.object({
          value: z.string(),
          type: z.enum(['string', 'number'])
        }))
      })

      const form = createDynamicForm(schema)

      const metadataField = form.sections.find(f => f.name === 'metadata')
      expect(metadataField?.as).toBe('record')
      expect(metadataField?.subfields).toHaveLength(2)
      expect(metadataField?.emptyValue).toEqual({
        value: undefined,
        type: undefined
      })
    })
  })

  describe('Resource Fields', () => {
    it('should configure resource fields for UUID strings', () => {
      const schema = z.object({
        userId: z.string().uuid(),
        projectId: z.string().uuid(),
        unknownId: z.string().uuid()
      })

      const options: CreateDynamicFormOptions = {
        resourceFields: [
          { field: 'user', store: 'users', displayField: 'email' },
          { field: 'project', store: 'projects' }
        ]
      }

      const form = createDynamicForm(schema, options)

      const userField = form.sections.find(f => f.name === 'userId')
      expect(userField?.as).toBe('resource-finder')
      expect(userField?.resourceStore).toBe('users')
      expect(userField?.displayField).toBe('email')

      const projectField = form.sections.find(f => f.name === 'projectId')
      expect(projectField?.as).toBe('resource-finder')
      expect(projectField?.resourceStore).toBe('projects')
      expect(projectField?.displayField).toBe('id') // default

      const unknownField = form.sections.find(f => f.name === 'unknownId')
      expect(unknownField?.as).toBe('input')
      expect(form.initialValues.unknownId).toBe('test-uuid-123')
    })

    it('should configure resource fields for arrays', () => {
      const schema = z.object({
        users: z.array(z.string().uuid()),
        projects: z.array(z.string().uuid())
      })

      const options: CreateDynamicFormOptions = {
        resourceFields: [
          { field: 'user', store: 'users-collection' }
        ]
      }

      const form = createDynamicForm(schema, options)

      const usersField = form.sections.find(f => f.name === 'users')
      expect(usersField?.as).toBe('resource-finder')
      expect(usersField?.resourceStore).toBe('users-collection')
      expect(usersField?.opts.label).toBe('User') // singular form

      const projectsField = form.sections.find(f => f.name === 'projects')
      expect(projectsField?.as).toBe('array')
      expect(form.initialValues.projects).toBe('test-uuid-123')
    })
  })

  describe('Field Filtering and Initial Values', () => {
    it('should ignore specified fields', () => {
      const schema = z.object({
        id: z.string().uuid(),
        name: z.string(),
        password: z.string(),
        email: z.string().email()
      })

      const options: CreateDynamicFormOptions = {
        fieldsToIgnore: ['password', 'id']
      }

      const form = createDynamicForm(schema, options)

      expect(form.sections).toHaveLength(2)
      expect(form.sections.find(f => f.name === 'password')).toBeUndefined()
      expect(form.sections.find(f => f.name === 'id')).toBeUndefined()
      expect(form.sections.find(f => f.name === 'name')).toBeDefined()
      expect(form.sections.find(f => f.name === 'email')).toBeDefined()

      // Should not have initial values for ignored fields
      expect(form.initialValues.password).toBeUndefined()
      expect(form.initialValues.id).toBeUndefined()
    })

    it('should handle default values', () => {
      const schema = z.object({
        name: z.string().default('John Doe'),
        age: z.number().default(25),
        isActive: z.boolean().default(true),
        optional: z.string().optional(),
        nullable: z.string().nullable()
      })

      const form = createDynamicForm(schema)

      expect(form.initialValues).toEqual({
        name: 'John Doe',
        age: 25,
        isActive: true,
        optional: undefined,
        nullable: undefined
      })
    })

    it('should handle special ID fields', () => {
      const schema = z.object({
        id: z.string(),
        uuid: z.string(),
        name: z.string()
      })

      const form = createDynamicForm(schema)

      expect(form.initialValues.id).toBe('test-uuid-123')
      expect(form.initialValues.uuid).toBe('test-uuid-123')
      expect(form.initialValues.name).toBeUndefined()
    })

    it('should warn about conflicting wrapper types', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

      const schema = z.object({
        conflicted: z.string().default('test').nullable()
      })

      const form = createDynamicForm(schema)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('conflicting wrapper types')
      )
      expect(form.initialValues.conflicted).toBe(null)

      consoleSpy.mockRestore()
    })
  })

  describe('Custom Field Type Mappings', () => {
    it('should use custom field type mappings', () => {
      const customMapping = createFieldTypeMapping({
        [z.ZodFirstPartyTypeKind.ZodString]: {
          as: 'textarea',
          inputType: 'text'
        },
        [z.ZodFirstPartyTypeKind.ZodNumber]: {
          as: 'slider',
          inputType: 'range'
        }
      })

      const schema = z.object({
        description: z.string(),
        priority: z.number()
      })

      const form = createDynamicForm(schema, {
        fieldTypeMapping: customMapping
      })

      const descField = form.sections.find(f => f.name === 'description')
      expect(descField?.as).toBe('textarea')
      expect(descField?.inputType).toBe('text')

      const priorityField = form.sections.find(f => f.name === 'priority')
      expect(priorityField?.as).toBe('slider')
      expect(priorityField?.inputType).toBe('range')
    })

    it('should combine custom mapping with default handlers', () => {
      const customMapping = createFieldTypeMapping({
        [z.ZodFirstPartyTypeKind.ZodBoolean]: {
          as: 'toggle',
          inputType: 'switch'
        }
      })

      const schema = z.object({
        name: z.string(), // Should use default handler
        isEnabled: z.boolean() // Should use custom mapping
      })

      const form = createDynamicForm(schema, {
        fieldTypeMapping: customMapping
      })

      const nameField = form.sections.find(f => f.name === 'name')
      expect(nameField?.as).toBe('input') // default
      expect(nameField?.inputType).toBe('text') // default

      const toggleField = form.sections.find(f => f.name === 'isEnabled')
      expect(toggleField?.as).toBe('toggle') // custom
      expect(toggleField?.inputType).toBe('switch') // custom
    })
  })

  describe('Error Handling', () => {
    it('should handle missing field schemas gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

      // Create a schema with an undefined field (simulated)
      const schema = z.object({
        name: z.string()
      })

        // Manually corrupt the schema shape for testing
        ; (schema.shape as any).corruptedField = undefined

      const form = createDynamicForm(schema)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('has no schema defined')
      )
      expect(form.sections.find(f => f.name === 'corruptedField')).toBeUndefined()

      consoleSpy.mockRestore()
    })

    it('should handle unknown field types gracefully', () => {
      const schema = z.object({
        name: z.string(),
        unknownType: z.any() // ZodAny is not in our default mapping
      })

      const form = createDynamicForm(schema)

      const unknownField = form.sections.find(f => f.name === 'unknownType')
      expect(unknownField?.as).toBe('input') // Should fall back to default
      expect(unknownField?.inputType).toBe('text') // Should fall back to default
    })
  })

  describe('Integration Tests', () => {
    it('should handle complex real-world schema', () => {
      const userSchema = z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        age: z.number().min(0).max(120),
        isActive: z.boolean().default(true),
        role: z.enum(['admin', 'user', 'moderator']),
        profile: z.object({
          bio: z.string().optional(),
          website: z.string().url().optional(),
          avatar: z.string().url().optional()
        }),
        preferences: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
        projects: z.array(z.object({
          projectId: z.string().uuid(),
          role: z.enum(['owner', 'collaborator', 'viewer']),
          joinedAt: z.date()
        })),
        createdAt: z.date(),
        updatedAt: z.date()
      })

      const options: CreateDynamicFormOptions = {
        resourceFields: [
          { field: 'project', store: 'projects', displayField: 'name' }
        ],
        fieldsToIgnore: ['id', 'createdAt', 'updatedAt']
      }

      const form = createDynamicForm(userSchema, options)

      // Debug: check what fields are actually generated
      const fieldNames = form.sections.map(f => f.name)

      // Should have correct number of fields (excluding ignored ones)
      // Expected fields: email, firstName, lastName, age, isActive, role, profile, preferences, projects
      // Ignored fields: id, createdAt, updatedAt
      expect(fieldNames).toEqual(['email', 'firstName', 'lastName', 'age', 'isActive', 'role', 'profile', 'preferences', 'projects'])
      expect(form.sections).toHaveLength(9)

      // Check specific field configurations
      const emailField = form.sections.find(f => f.name === 'email')
      expect(emailField?.inputType).toBe('email')

      const roleField = form.sections.find(f => f.name === 'role')
      expect(roleField?.as).toBe('select')
      expect(roleField?.selectOptions).toHaveLength(3)

      const profileField = form.sections.find(f => f.name === 'profile')
      expect(profileField?.as).toBe('object')
      expect(profileField?.subfields).toHaveLength(3)

      const projectsField = form.sections.find(f => f.name === 'projects')
      expect(projectsField?.as).toBe('array')
      expect(projectsField?.subfields).toHaveLength(3)

      // Check that resource field is configured in nested array
      const projectRoleField = projectsField?.subfields?.find(f => f.name === 'projectId')
      expect(projectRoleField?.as).toBe('resource-finder')
      expect(projectRoleField?.resourceStore).toBe('projects')

      // Check initial values
      expect(form.initialValues.isActive).toBe(true)
      expect(form.initialValues.id).toBeUndefined() // ignored
      expect(form.initialValues.profile).toEqual({
        bio: undefined,
        website: undefined,
        avatar: undefined
      })
    })
  })
})
