# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
UtilPlex is an Angular 19.2.x developer utilities web application providing code formatting, data conversion, encoding, and time zone tools. The app uses modern Angular features including standalone components, signals, and SSR.

## Development Commands
- `npm start` - Start development server
- `npm run build` - Production build
- `npm run build:ci` - CI production build  
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run serve:ssr:utilplex` - Serve SSR build

## Architecture Overview

### Service Provider Pattern
The application uses abstract base classes with concrete implementations:

**Formatters**: `FormatViewService` (abstract) → `SqlFormatProvider`, `JsonFormatProvider`, etc.  
**Converters**: `ConverterServiceBase` (abstract) → `JsonToYamlConverter`

### Routing System
Routes are centrally managed in `src/app/_services/route.service.ts` with:
- Dynamic route generation from categories
- Lazy-loaded components via dynamic imports
- Signal-based title management
- SEO optimization built-in

### Component Architecture
- **Generic Views**: `FormatViewComponent` and `ConvertViewComponent` work with any service implementation
- **Standalone Components**: Modern Angular standalone architecture throughout
- **Signal-Based State**: Input/output code and error states managed via Angular signals

### Key Directories
- `src/app/_services/` - Global services
- `src/app/formatters/` - Code formatting tools
- `src/app/converters/` - Data conversion tools  
- `src/app/encoders/` - Encoding/decoding tools
- `src/app/monaco/` - Monaco editor configuration
- `src/styles/` - SCSS styling system with CSS variables

## Adding New Utilities

### For Formatters:
1. Create concrete service implementing `FormatViewService`
2. Add route definition in `route.service.ts`
3. Component uses generic `FormatViewComponent`

### For Converters:
1. Create concrete service extending `ConverterServiceBase`
2. Add route definition in `route.service.ts`  
3. Component uses generic `ConvertViewComponent`

## Monaco Editor Integration
- Custom Dracula theme in `monaco-global-config.ts`
- Language-specific configurations
- Copy/paste functionality built-in
- Read-only output editors

## Code Style
- Use `inject()` function for dependency injection
- Prefer signals over observables for component state
- Follow existing naming patterns: `f-json` (formatter), `c-json-yaml` (converter)
- Abstract base classes for extensibility
- Use Angular control flow syntax (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`)
- Use `@for` syntax: `@for (item of items; track item.id) { ... }` instead of `*ngFor="let item of items; trackBy: trackByFn"`
- Use signal-based inputs/outputs: `myInput = input()` and `myOutput = output()` instead of `@Input()` and `@Output()` decorators