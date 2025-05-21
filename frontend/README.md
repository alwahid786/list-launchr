# ListLaunchr Frontend

This is the frontend for ListLaunchr, a platform for creating and managing giveaway campaigns.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management

## Styling Guidelines

### CSS Architecture

The project uses a combination of Tailwind CSS for utility-based styling and custom CSS for component-specific styles:

1. **Global Styles**: `index.css` contains global styles, Tailwind directives, animations, and utility classes
2. **Component-Specific Styles**: Separate CSS files for complex components (e.g., `DashboardLayout.css`)
3. **Inline Tailwind Classes**: Most components use Tailwind utility classes directly in JSX

### Button Styling

We use different button styles based on their purpose:

1. **Primary Buttons**: Blue gradient background with white text
   ```jsx
   <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-[8px] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
     Button Text
   </button>
   ```

2. **Action Buttons**: Green gradient for confirmation actions
   ```jsx
   <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[8px] hover:shadow-lg">
     Action Text
   </button>
   ```

3. **Dashboard Buttons**: Use the dashboard-btn class within dashboard layouts
   ```jsx
   <button className="dashboard-btn text-gray-500 hover:text-primary">
     Dashboard Button
   </button>
   ```

4. **Default Buttons**: When no custom styling is needed, use btn-default class
   ```jsx
   <button className="btn-default">
     Default Button
   </button>
   ```

### Layout Structure

1. **MainLayout**: Used for public-facing pages
2. **DashboardLayout**: Used for authenticated user dashboard

### Best Practices

1. **Button Styling**: 
   - Always use explicit Tailwind classes on buttons rather than relying on global button styles
   - Use consistent gap and padding values within button groups
   - Include proper disabled states with the `disabled` attribute and `disabled:` Tailwind variants

2. **Custom Components**:
   - Create dedicated UI components in the `/components/ui` directory for reusable elements
   - Use the `className` prop to allow customization from parent components

3. **Dashboard-Specific Styling**:
   - All dashboard-specific styling should be in `DashboardLayout.css`
   - Use the `.dashboard-container` parent class for scoping styles

4. **Consistency**:
   - Use the defined color palette in `tailwind.config.js` (primary, accent, neutral, etc.)
   - Maintain consistent spacing, border-radius, and transition effects

## Project Structure

- `src/components`: Reusable UI components
- `src/contexts`: React contexts for state management
- `src/hooks`: Custom React hooks
- `src/pages`: Page components
- `src/utils`: Utility functions
- `src/api`: API service layer