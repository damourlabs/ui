import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import {
  createFieldHandler,
  createFieldTypeMapping,
  type FieldHandler,
  type FieldHandlerContext
} from '../utils/form'

// Mock crypto.randomUUID for testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-456')
  }
})

describe('Field Handlers', () => {
  const createMockField = () => ({
    as: 'input' as string,
    description: '',
    opts: {
      label: 'Test Field',
      validateOnValueUpdate: true,
      validateOnMount: false,
    },
    name: 'testField',
    label: 'Test Field',
    subfields: [] as any[],
    displayField: 'id',
    rules: z.string(),
    inputType: 'text',
  })

  const createMockContext = (overrides: Partial<FieldHandlerContext> = {}): FieldHandlerContext => ({
    key: 'testField',
    options: {
      resourceFields: [],
      fieldsToIgnore: [],
    },
    initialValues: {},
    metadata: {
      isNullable: false,
      isOptional: false,
      hasDefault: false,
      isLazy: false,
      hasEffects: false,
    },
    ...overrides,
  })

  describe('String Field Handler', () => {
    it('should handle basic string fields', () => {
      const handler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        field.inputType = 'text'
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.string()

      handler(schema, field, context)

      expect(field.inputType).toBe('text')
    })

    it('should handle email strings', () => {
      const handler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        if (fieldSchema.isEmail) {
          field.inputType = 'email'
        }
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.string().email()

      handler(schema, field, context)

      expect(field.inputType).toBe('email')
    })

    it('should handle URL strings', () => {
      const handler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        if (fieldSchema.isURL) {
          field.inputType = 'url'
          field.as = 'url-input'
        }
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.string().url()

      handler(schema, field, context)

      expect(field.inputType).toBe('url')
      expect(field.as).toBe('url-input')
    })

    it('should handle UUID strings with resource detection', () => {
      const handler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        if (fieldSchema.isUUID) {
          field.inputType = 'uuid'

          // Simulate resource field detection
          const resourceKey = context.key.replace(/Id$/, '')
          const resourceField = context.options.resourceFields?.find(r => r.field === resourceKey)

          if (resourceField) {
            field.as = 'resource-finder'
            field.resourceStore = resourceField.store
          }
        }
      })

      const field = createMockField()
      const context = createMockContext({
        key: 'userId',
        options: {
          resourceFields: [
            { field: 'user', store: 'users', displayField: 'email' }
          ]
        }
      })
      const schema = z.string().uuid()

      handler(schema, field, context)

      expect(field.inputType).toBe('uuid')
      expect(field.as).toBe('resource-finder')
      expect((field as any).resourceStore).toBe('users')
    })

    it('should handle conditional field types based on field name', () => {
      const handler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        if (context.key.toLowerCase().includes('password')) {
          field.inputType = 'password'
        } else if (context.key.toLowerCase().includes('description')) {
          field.as = 'textarea'
        }
      })

      // Test password field
      const passwordField = createMockField()
      const passwordContext = createMockContext({ key: 'userPassword' })
      handler(z.string(), passwordField, passwordContext)
      expect(passwordField.inputType).toBe('password')

      // Test description field
      const descField = createMockField()
      const descContext = createMockContext({ key: 'jobDescription' })
      handler(z.string(), descField, descContext)
      expect(descField.as).toBe('textarea')
    })
  })

  describe('Number Field Handler', () => {
    it('should handle basic number fields', () => {
      const handler = createFieldHandler<z.ZodNumber>((fieldSchema, field, context) => {
        field.as = 'number'
        field.inputType = 'number'
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.number()

      handler(schema, field, context)

      expect(field.as).toBe('number')
      expect(field.inputType).toBe('number')
    })

    it('should handle number range constraints', () => {
      const handler = createFieldHandler<z.ZodNumber>((fieldSchema, field, context) => {
        field.as = 'number'
        field.inputType = 'number'

        // Check if it's a percentage (0-100 range)
        if (context.key.toLowerCase().includes('percent') ||
          context.key.toLowerCase().includes('rate')) {
          field.as = 'slider'
          field.inputType = 'range'
            ; (field as any).min = 0
            ; (field as any).max = 100
        }
      })

      const field = createMockField()
      const context = createMockContext({ key: 'completionPercent' })
      const schema = z.number().min(0).max(100)

      handler(schema, field, context)

      expect(field.as).toBe('slider')
      expect(field.inputType).toBe('range')
      expect((field as any).min).toBe(0)
      expect((field as any).max).toBe(100)
    })
  })

  describe('Boolean Field Handler', () => {
    it('should handle basic boolean fields', () => {
      const handler = createFieldHandler<z.ZodBoolean>((fieldSchema, field, context) => {
        field.as = 'checkbox'
        field.inputType = 'checkbox'
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.boolean()

      handler(schema, field, context)

      expect(field.as).toBe('checkbox')
      expect(field.inputType).toBe('checkbox')
    })

    it('should handle toggle switch variant', () => {
      const handler = createFieldHandler<z.ZodBoolean>((fieldSchema, field, context) => {
        if (context.key.toLowerCase().includes('enable') ||
          context.key.toLowerCase().includes('active')) {
          field.as = 'toggle-switch'
          field.inputType = 'switch'
        } else {
          field.as = 'checkbox'
          field.inputType = 'checkbox'
        }
      })

      // Test toggle switch
      const toggleField = createMockField()
      const toggleContext = createMockContext({ key: 'isEnabled' })
      handler(z.boolean(), toggleField, toggleContext)
      expect(toggleField.as).toBe('toggle-switch')
      expect(toggleField.inputType).toBe('switch')

      // Test regular checkbox
      const checkboxField = createMockField()
      const checkboxContext = createMockContext({ key: 'hasAgreed' })
      handler(z.boolean(), checkboxField, checkboxContext)
      expect(checkboxField.as).toBe('checkbox')
      expect(checkboxField.inputType).toBe('checkbox')
    })
  })

  describe('Array Field Handler', () => {
    it('should handle basic array fields', () => {
      const handler = createFieldHandler<z.ZodArray<any>>((fieldSchema, field, context) => {
        field.as = 'array'

        // Mock nested schema processing
        field.subfields = []
        field.emptyValue = undefined
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.array(z.string())

      handler(schema, field, context)

      expect(field.as).toBe('array')
      expect(field.subfields).toEqual([])
    })

    it('should handle array label singularization', () => {
      const handler = createFieldHandler<z.ZodArray<any>>((fieldSchema, field, context) => {
        field.as = 'array'

        // Singularize label for arrays
        if (field.opts.label.endsWith('s')) {
          field.opts.label = field.opts.label.slice(0, -1)
        }
      })

      const field = createMockField()
      field.opts.label = 'Users'
      const context = createMockContext()
      const schema = z.array(z.string())

      handler(schema, field, context)

      expect(field.opts.label).toBe('User')
    })
  })

  describe('Enum Field Handler', () => {
    it('should handle enum fields', () => {
      const handler = createFieldHandler<z.ZodEnum<any>>((fieldSchema, field, context) => {
        field.as = 'select'

          // Mock select options creation
          ; (field as any).selectOptions = Object.entries(fieldSchema.enum).map(([key, value]) => ({
            tag: 'select-option',
            label: key,
            value: value.toString(),
          }))
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.enum(['active', 'inactive', 'pending'])

      handler(schema, field, context)

      expect(field.as).toBe('select')
      expect((field as any).selectOptions).toHaveLength(3)
      expect((field as any).selectOptions[0]).toMatchObject({
        tag: 'select-option',
        label: 'active',
        value: 'active'
      })
    })

    it('should handle multi-select enums', () => {
      const handler = createFieldHandler<z.ZodEnum<any>>((fieldSchema, field, context) => {
        if (context.key.toLowerCase().includes('multi') ||
          context.key.toLowerCase().includes('tags')) {
          field.as = 'multi-select'
        } else {
          field.as = 'select'
        }
      })

      const field = createMockField()
      const context = createMockContext({ key: 'multiSelectTags' })
      const schema = z.enum(['tag1', 'tag2', 'tag3'])

      handler(schema, field, context)

      expect(field.as).toBe('multi-select')
    })
  })

  describe('Date Field Handler', () => {
    it('should handle date fields', () => {
      const handler = createFieldHandler<z.ZodDate>((fieldSchema, field, context) => {
        field.as = 'date'
        field.inputType = 'date'
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.date()

      handler(schema, field, context)

      expect(field.as).toBe('date')
      expect(field.inputType).toBe('date')
    })

    it('should handle datetime fields', () => {
      const handler = createFieldHandler<z.ZodDate>((fieldSchema, field, context) => {
        if (context.key.toLowerCase().includes('time') ||
          context.key.toLowerCase().includes('at')) {
          field.as = 'datetime'
          field.inputType = 'datetime-local'
        } else {
          field.as = 'date'
          field.inputType = 'date'
        }
      })

      const field = createMockField()
      const context = createMockContext({ key: 'createdAt' })
      const schema = z.date()

      handler(schema, field, context)

      expect(field.as).toBe('datetime')
      expect(field.inputType).toBe('datetime-local')
    })
  })

  describe('Complex Handler Composition', () => {
    it('should compose multiple handlers', () => {
      const baseHandler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        field.inputType = 'text'
      })

      const enhancedHandler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        // Apply base behavior
        baseHandler(fieldSchema, field, context)

        // Add enhancement
        if (fieldSchema.isEmail) {
          field.inputType = 'email'
            ; (field as any).validation = 'email'
        }
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.string().email()

      enhancedHandler(schema, field, context)

      expect(field.inputType).toBe('email')
      expect((field as any).validation).toBe('email')
    })

    it('should handle context-dependent behavior', () => {
      const contextAwareHandler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        // Different behavior based on context
        if (context.metadata.isOptional) {
          ; (field as any).required = false
        }

        if (context.metadata.hasDefault) {
          ; (field as any).placeholder = `Default: ${context.metadata.defaultValue}`
        }

        if (context.options.resourceFields?.length) {
          ; (field as any).hasResourceContext = true
        }
      })

      const field = createMockField()
      const context = createMockContext({
        metadata: {
          isNullable: false,
          isOptional: true,
          hasDefault: true,
          defaultValue: 'test-default',
          isLazy: false,
          hasEffects: false,
        },
        options: {
          resourceFields: [{ field: 'user', store: 'users' }]
        }
      })
      const schema = z.string()

      contextAwareHandler(schema, field, context)

      expect((field as any).required).toBe(false)
      expect((field as any).placeholder).toBe('Default: test-default')
      expect((field as any).hasResourceContext).toBe(true)
    })
  })

  describe('Error Handling in Handlers', () => {
    it('should handle handler errors gracefully', () => {
      const errorHandler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        // This handler throws an error
        throw new Error('Handler error')
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.string()

      // The error should be thrown (in real implementation, you might want to catch and handle)
      expect(() => errorHandler(schema, field, context)).toThrow('Handler error')
    })

    it('should handle invalid field modifications', () => {
      const invalidHandler = createFieldHandler<z.ZodString>((fieldSchema, field, context) => {
        // Try to set invalid field properties
        ; (field as any).invalidProperty = 'should not break'
        field.as = 'non-existent-type'
      })

      const field = createMockField()
      const context = createMockContext()
      const schema = z.string()

      // Should not throw, just set the properties
      expect(() => invalidHandler(schema, field, context)).not.toThrow()
      expect((field as any).invalidProperty).toBe('should not break')
      expect(field.as).toBe('non-existent-type')
    })
  })
})
