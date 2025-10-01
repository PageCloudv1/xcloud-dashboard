# 🧩 Shared Components Guide

## Overview

This guide documents all shared components that can be used across xCloud Dashboard and xCloud Portal. These components are designed to be reusable, type-safe, and framework-agnostic.

## Design Principles

1. **Consistency**: Shared visual language across applications
2. **Type Safety**: Full TypeScript support with exported types
3. **Accessibility**: ARIA labels and semantic HTML
4. **Performance**: Lightweight with minimal dependencies
5. **Customizable**: Props for variants, sizes, and styling

## Component Library

### Button

A versatile button component with multiple variants and sizes.

#### Usage

```tsx
import { Button } from '@/shared/components';

// Basic usage
<Button onClick={handleClick}>Click Me</Button>

// With variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outlined Action</Button>

// With sizes
<Button size="small">Small Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="large">Large Button</Button>

// Disabled state
<Button disabled>Disabled Button</Button>

// As submit button
<Button type="submit">Submit Form</Button>
```

#### Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

#### Variants

- **primary**: Gradient background, white text (main actions)
- **secondary**: Gray background, dark text (secondary actions)
- **outline**: Transparent background with border (tertiary actions)

#### Accessibility

- Supports `aria-label` for screen readers
- Keyboard navigation friendly
- Disabled state properly announced

## Creating New Shared Components

### 1. Component Structure

```
src/shared/components/
├── ComponentName/
│   ├── ComponentName.tsx      # Component logic
│   ├── ComponentName.css      # Component styles
│   ├── ComponentName.test.tsx # Component tests (optional)
│   └── index.ts               # Re-exports
└── index.ts                   # Main exports
```

### 2. Component Template

```tsx
/**
 * Component description
 */
import React from 'react';
import './ComponentName.css';

export interface ComponentNameProps {
  // Define props here
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructure props
}) => {
  return (
    <div className="xcloud-component-name">
      {/* Component content */}
    </div>
  );
};
```

### 3. Style Guidelines

```css
/* Use xcloud- prefix for all classes */
.xcloud-component-name {
  /* Base styles */
}

/* Use BEM naming convention */
.xcloud-component-name__element {
  /* Element styles */
}

.xcloud-component-name--modifier {
  /* Modifier styles */
}
```

### 4. Export Component

Add to `src/shared/components/index.ts`:

```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Best Practices

### DO ✅

- Use TypeScript for type safety
- Add JSDoc comments for documentation
- Use semantic HTML elements
- Include ARIA attributes for accessibility
- Make components controlled when state is involved
- Use CSS variables for theming
- Keep components focused and single-purpose

### DON'T ❌

- Don't use external dependencies unnecessarily
- Don't hardcode values that should be props
- Don't ignore accessibility
- Don't create overly complex components
- Don't use inline styles (use CSS classes)
- Don't break backward compatibility

## Testing Shared Components

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled prop', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

## Theming

### CSS Variables

Define theme variables in your app's global CSS:

```css
:root {
  /* Colors */
  --xcloud-primary: #667eea;
  --xcloud-primary-dark: #5568d3;
  --xcloud-secondary: #f3f4f6;
  --xcloud-text: #374151;
  
  /* Spacing */
  --xcloud-spacing-sm: 0.5rem;
  --xcloud-spacing-md: 1rem;
  --xcloud-spacing-lg: 1.5rem;
  
  /* Border radius */
  --xcloud-radius-sm: 4px;
  --xcloud-radius-md: 8px;
  --xcloud-radius-lg: 12px;
}
```

### Using Theme Variables

```css
.xcloud-button--primary {
  background: var(--xcloud-primary);
  border-radius: var(--xcloud-radius-md);
  padding: var(--xcloud-spacing-md);
}
```

## Migration to Separate Package (Future)

When the component library grows, consider extracting to a separate package:

```bash
# Create separate package
mkdir packages/xcloud-components
cd packages/xcloud-components
pnpm init

# Publish to npm
pnpm publish
```

Then import in both applications:

```typescript
import { Button } from '@xcloud/components';
```

## Roadmap

### Planned Components

- [ ] Input - Text input with validation
- [ ] Select - Dropdown selection
- [ ] Modal - Dialog overlay
- [ ] Card - Content container
- [ ] Badge - Status indicator
- [ ] Avatar - User profile image
- [ ] Navigation - Header/sidebar navigation
- [ ] Table - Data table with sorting
- [ ] Form - Form wrapper with validation
- [ ] Toast - Notification messages

### Enhancement Ideas

- Dark mode support
- Animation library integration
- Responsive design utilities
- Icon library integration
- Form validation library
- Storybook documentation

---

**Last Updated**: January 2025  
**Maintained by**: xCloud Team
