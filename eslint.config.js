import withNuxt from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    'vue/first-attribute-linebreak': ['error', {
      'singleline': 'ignore',
      'multiline': 'below'
    }],
    'vue/html-indent': ['error', 2, {
      'attribute': 1,
      'baseIndent': 1,
      'closeBracket': 0,
      'alignAttributesVertically': true,
      'ignores': []
    }],
    'vue/max-attributes-per-line': ['error', {
      'singleline': { 'max': 1 },
      'multiline': { 'max': 1 }
    }]
  }
)
