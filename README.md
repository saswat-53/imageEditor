# Canvas Editor

A powerful and interactive canvas editor built with React, Redux, and Konva. Create, manipulate, and save visual compositions with rectangles and images on an HTML5 canvas.

## Features

### Core Functionality
- **Add Shapes**: Create colored rectangles with random vibrant colors
- **Image Support**:
  - Add sample images from built-in library
  - Upload custom images (max 5MB, validated)
- **Interactive Manipulation**:
  - Drag elements around the canvas
  - Transform with handles (resize, rotate)
  - Boundary constraints to keep elements within canvas
- **Property Editing**: Live sidebar to adjust element properties (position, size, rotation, colors)

### Advanced Features
- **Undo/Redo**: Full history management for all actions
- **Persistence**: Save and load your work to/from localStorage
- **Selection System**: Click to select elements, click empty space to deselect
- **Delete**: Remove selected elements with a single click
- **Clear Storage**: Reset the entire application state

## Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Konva** - Canvas rendering and manipulation
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react_canvas
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
react_canvas/
├── src/
│   ├── components/
│   │   ├── CanvasArea.jsx      # Main canvas rendering
│   │   ├── Controls.jsx        # Top toolbar with actions
│   │   ├── Sidebar.jsx         # Property editor panel
│   │   └── ShapeElement.jsx    # Rectangle & Image components
│   ├── redux/
│   │   ├── store.js            # Redux store configuration
│   │   └── canvasSlice.js      # Canvas state & actions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── package.json
└── vite.config.js
```

## Usage

### Adding Elements
- Click "Add Rectangle" to create a new colored rectangle
- Click "Add Sample Image" to add a random sample image
- Click "Upload Image" to add your own image (PNG, JPG, etc.)

### Manipulating Elements
- **Select**: Click any element to select it
- **Move**: Drag selected elements around the canvas
- **Resize**: Drag the corner/edge handles of selected elements
- **Rotate**: Use the rotation handle or adjust in the sidebar
- **Delete**: Select an element and click the "Delete" button

### Editing Properties
When an element is selected, use the sidebar to adjust:
- X/Y Position
- Width/Height
- Rotation angle
- Fill color (rectangles only)

### Saving Your Work
- Click "Save" to store your canvas to localStorage
- Click "Load" to restore your last saved state
- Click "Clear Storage" to reset everything (with confirmation)

### History
- Click "↶" to undo the last action
- Click "↷" to redo an undone action

## Canvas Specifications

- Canvas Size: 1200 x 650 pixels
- Element boundary constraints enabled
- Auto-generated IDs for all elements
- Random vibrant colors for new rectangles

## Browser Support

Modern browsers with HTML5 Canvas support:
- Chrome/Edge (recommended)
- Firefox
- Safari
