# To-Do App – Preliminary Assignment Submission
⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
1. Clone the repository
2. `npm install` - Install dependencies
3. `npm run dev` - Start development server
4. Open `http://localhost:5173` in your browser
5. To build for production: `npm run build`

## 🔗 Deployed Web URL or APK file
 Deployed URL: [https://web-track-naver-vietnam-ai-hackatho-bay.vercel.app/](https://web-track-naver-vietnam-ai-hackatho-bay.vercel.app/)

## Figma Design Link

Visit [My Figma Design](https://www.figma.com/design/mkrUqEh8Qy09F9xkLXeJ5Z/To-Do?node-id=0-1&t=qiGPtIT7CoocgYJX-1) for this project here.

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Paste your video link here]


## 💻 Project Introduction

### a. Overview

**StudyFlow** is a procrastination-aware task management application designed specifically for Vietnamese university students. The app addresses the daily time management crisis faced by students juggling classes, group projects, part-time work, and personal life across multiple platforms.

The solution provides intelligent task prioritization, procrastination tracking, focus timer integration, and comprehensive analytics to help students better manage their time and navigate the chaos of student life.

### b. Key Features & Function Manual

**Core Features:**
- **Task Management**: Full CRUD operations for tasks with categories (Assignment & Class, Group Project, Part-time Work, Life & Personal)
- **Smart Prioritization**: Tasks sorted by priority (high/medium/low) and due dates
- **Multi-View Interface**: 
  - Task List View: Complete task management with filtering and search
  - Calendar View: Visual timeline of tasks and deadlines
  - Analytics View: Productivity insights and completion trends
- **Procrastination Tracking**: Automatic detection and scoring of delayed tasks
- **Focus Timer**: Pomodoro-style timer with task linking to track actual work time
- **Data Persistence**: Local storage with export/import functionality

**How to Use:**
1. Add tasks using the "Add Task" button with title, description, category, priority, and due date
2. Use the focus timer to track time spent on specific tasks
3. View tasks in different perspectives: List, Calendar, or Analytics
4. Monitor procrastination patterns and get improvement suggestions
5. Filter tasks by category, priority, or status for better organization

### c. Unique Features (What's special about this app?) 

**Procrastination Intelligence:**
- Automatic procrastination scoring based on postponements and delay patterns
- Smart suggestions for improvement based on user behavior
- Category-specific procrastination insights (which types of tasks you delay most)

**Student-Centric Design:**
- Pre-configured categories matching Vietnamese student life (Assignment & Class, Group Project, Part-time Work, Life & Personal)
- Focus timer integration that learns your actual work patterns vs estimates
- Analytics that show productivity trends and help identify peak performance times

**Integrated Time Tracking:**
- Links focus sessions directly to tasks for accurate time measurement
- Tracks estimated vs actual completion time to improve future planning
- Comprehensive analytics showing work patterns and completion rates

**Smart Data Visualization:**
- Three distinct views of the same data to match different planning styles
- Calendar integration showing deadline collisions and scheduling conflicts
- Real-time analytics dashboard with actionable insights

### d. Technology Stack and Implementation Methods

**Frontend Framework:**
- **React 19** - Modern component-based UI framework
- **TypeScript** - Type-safe development with strict mode enabled
- **Vite** - Fast build tool and development server

**UI & Styling:**
- **Tailwind CSS v4** - Utility-first CSS framework for responsive design
- **Radix UI** - Accessible, unstyled UI components (dialogs, tabs, forms)
- **Lucide React** - Beautiful, customizable icon library
- **Class Variance Authority** - For component variant management

**Data Management:**
- **LocalStorage API** - Client-side persistent data storage
- Custom storage layer with full CRUD operations and data validation
- JSON serialization with versioning for data integrity

**Development Tools:**
- **ESLint** - Code linting with React and TypeScript rules
- **TypeScript ESLint** - Enhanced TypeScript linting
- Path aliases (`@/`) for clean import statements

### e. Service Architecture & Database structure (when used)

**Client-Side Architecture:**
- **Single Page Application (SPA)** with component-based architecture
- **Central State Management** through `TaskManagement.tsx` component
- **Modular Storage Layer** (`storage.ts`) handling all data operations

**Data Structure (LocalStorage JSON):**
```json
{
  "version": "1.0.0",
  "data": {
    "tasks": [...],           // Task entities with full metadata
    "categories": [...],       // Task categorization system  
    "procrastinationData": [...], // Delay tracking and scoring
    "focusSessions": [...],   // Pomodoro timer sessions
    "settings": {...}         // User preferences and config
  },
  "lastModified": "ISO_DATE"
}
```

**Key Data Models:**
- **Task**: ID, title, description, category, priority, status, dates, time tracking
- **FocusSession**: Timer sessions linked to specific tasks for accurate time measurement  
- **ProcrastinationData**: Postponement tracking with automatic delay calculations
- **Analytics**: Real-time computed metrics from stored data

**No Backend Required:** All functionality implemented client-side with localStorage persistence, making deployment simple and data private.

## 🧠 Reflection

### a. If you had more time, what would you expand?

**Enhanced Intelligence Features:**
- Machine learning algorithms to predict optimal work times based on completion patterns
- Smart deadline suggestions that account for personal procrastination history
- Automated task breakdown for large projects based on estimated complexity
- Integration with calendar APIs to detect scheduling conflicts automatically

**Social & Collaboration Features:**
- Group project coordination with shared task lists and progress tracking
- Study group formation based on similar schedules and subjects
- Peer accountability features with optional progress sharing
- Mentorship matching system connecting students with similar academic challenges

**Advanced Analytics & Insights:**
- Detailed productivity heatmaps showing optimal work periods
- Stress level prediction based on task density and deadline proximity  
- Personalized study method recommendations based on completion patterns
- Integration with academic calendar to predict busy periods and suggest preparation strategies


### b. If you integrate AI APIs more for your app, what would you do?

**Intelligent Task Management:**
- **Natural Language Processing**: Allow users to create tasks using voice or natural language ("Remind me to finish the math assignment by Friday evening")
- **Smart Task Categorization**: Automatically categorize tasks based on content analysis and past patterns
- **Intelligent Prioritization**: AI-powered priority suggestions based on deadline urgency, estimated effort, and personal productivity patterns

**Personalized Learning Assistant:**
- **Study Strategy Recommendations**: Analyze completion patterns to suggest optimal study methods (visual, auditory, kinesthetic)
- **Workload Balancing**: AI analysis of task distribution to prevent burnout and suggest optimal scheduling
- **Performance Coaching**: Personalized tips and strategies based on individual productivity data and common student challenges

**Advanced Automation:**
- **Smart Notifications**: Context-aware reminders that consider current activity, location, and optimal work periods
- **Deadline Risk Assessment**: Predictive analysis of deadline collision risks with proactive suggestions
- **Academic Content Integration**: Connect with educational APIs to automatically import assignment deadlines and requirements from learning management systems


## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (Full CRUD operations on tasks)
- [x] Persistent storage (localStorage with export/import)
- [x] At least 3 different views (Task List, Calendar, Analytics)
- [x] Time/date handling (due dates, focus timer, completion tracking)
- [x] Support for 20+ items (filtering, search, efficient rendering)
- [x] All ✍️ sections are filled  
