# UtilPlex - Developer Utilities

UtilPlex is a modern Angular 20.x web application providing essential developer utilities for code formatting, data conversion, encoding, and time zone management. Built with standalone components, signals, and server-side rendering (SSR), UtilPlex offers a comprehensive suite of tools to streamline your development workflow.

## 🌐 Live Version 
[https://www.utilplex.com](https://www.utilplex.com)

## Table of Contents

- [UtilPlex - Developer Utilities](#utilplex---developer-utilities)
  - [🌐 Live Version](#-live-version)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Code Formatters](#code-formatters)
    - [Data Converters](#data-converters)
    - [Encoders/Decoders](#encodersdecoders)
    - [Content Generators](#content-generators)
    - [Time Zone Tools](#time-zone-tools)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Development](#development)
    - [Available Commands](#available-commands)
    - [Project Structure](#project-structure)
  - [Architecture](#architecture)
    - [Key Design Patterns](#key-design-patterns)
  - [License](#license)

## Features

### Code Formatters
- **SQL Formatter** - Beautify SQL queries with proper indentation and formatting
- **JSON Formatter** - Format and minify JSON data with advanced prettification
- **CSS Formatter** - Clean and organize CSS code with professional formatting
- **JavaScript Formatter** - Beautify JavaScript code with modern syntax support

### Data Converters
- **JSON to YAML Converter** - Convert JSON data to YAML format while preserving structure

### Encoders/Decoders
- **Base64 Encoder/Decoder** - Encode and decode data in Base64 format with ASCII/UTF-8 support

### Content Generators
- **GUID Generator** - Generate UUIDs with multiple format options (standard, compact, uppercase)
- **Lorem Ipsum Generator** - Create placeholder text with customizable word, sentence, or paragraph output

### Time Zone Tools
- **Time Zone Converter** - Convert times between global time zones with daylight saving awareness

All tools feature:
- Monaco Editor integration with syntax highlighting
- Custom Dracula theme for optimal readability
- Copy/paste functionality
- Responsive design for mobile compatibility
- Comprehensive error handling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Angular CLI](https://angular.io/cli) (v19 or higher)
- npm or yarn package manager

### Installation

1. Clone the UtilPlex repository:
   ```bash
   git clone https://github.com/timothydodd/utilplex.git
   cd utilplex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Development

### Available Commands

- `npm start` - Start development server
- `npm run build` - Production build
- `npm run build:ci` - CI production build  
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run serve:ssr:utilplex` - Serve SSR build

### Project Structure

```
src/app/
├── _services/          # Global services and routing
├── formatters/         # Code formatting utilities
├── converters/         # Data conversion tools
├── encoders/           # Encoding/decoding tools
├── generators/         # Content generation utilities
├── time/              # Time zone tools
├── monaco/            # Monaco editor configuration
└── components/        # Shared UI components
```

## Architecture

UtilPlex uses a modern Angular architecture with:

- **Service Provider Pattern** - Abstract base classes with concrete implementations
- **Signal-Based State Management** - Modern reactive state management
- **Standalone Components** - No NgModule dependencies
- **Dynamic Routing** - Centralized route management with lazy loading
- **SSR Support** - Server-side rendering for optimal performance

### Key Design Patterns

- **Formatters**: `FormatViewService` (abstract) → `SqlFormatProvider`, `JsonFormatProvider`
- **Converters**: `ConverterServiceBase` (abstract) → `JsonToYamlConverter`
- **Generic Views**: Reusable components that work with any service implementation

## License

This project is licensed under the MIT License.