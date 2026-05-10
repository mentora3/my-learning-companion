# Mentora - منتورا

## 🇸🇦 القسم العربي

### اسم المشروع (Project Title)
نظام مرشد ذكي يكتشف التعثر مبكرًا ويوجه الطالب أكاديمياً ومهنياً نحو الجاهزية لسوق العمل.

### الوصف (Description)
نظام Mentora هو منصة إرشادية تعتمد على تقنيات الذكاء الاصطناعي. ترتبط المنصة بأنظمة الجامعة وتقوم بتحليل بيانات الطلاب وأدائهم الدراسي بشكل مستمر، ويكتشف التعثر مبكرًا ويقدم خطة تعليمية للطالب لمعالجة التعثر وخبرة عملية مخصصة تساعده على النجاح والاستعداد لسوق العمل بما يتوافق مع رؤية 2030.

### المقدمة (Introduction)
في ظل الاعتماد على النماذج التعليمية التقليدية التي لا تراعي الفروقات الفردية بين الطلاب، يبرز هذا النظام كحل مبتكر. فهو يقدم مسارات تعليمية وتوجيهات عملية مخصصة لكل طالب، مما يساعده على تحقيق النجاح الأكاديمي وبناء المهارات اللازمة ليكون جاهزاً لسوق العمل، تماشياً مع أهداف رؤية المملكة 2030.

### بيان المشكلة (Problem Statement)
تم بناء هذا المشروع لحل مجموعة من التحديات في البيئة الجامعية:
* ارتفاع معدلات التعثر الأكاديمي وتأخر الطلاب في التخرج.
* غياب أنظمة التدخل المبكر، حيث يتم اكتشاف التعثر غالباً بعد رسوب الطالب.
* وجود خطط دراسية موحدة لا تأخذ بعين الاعتبار القدرات المختلفة للطلاب.
* الفجوة الواضحة بين المهارات التي يكتسبها الخريج وبين الاحتياجات الفعلية لسوق العمل، مما يرفع من فرص التعطل عن العمل.

### أهمية المشروع (Project Significance)
يقدم النظام حلولاً استباقية وذكية من خلال:
* توظيف الذكاء الاصطناعي لتحليل البيانات وتوقع التعثر قبل وقوعه.
* توفير خطط علاجية فورية ومخصصة تتناسب مع مستوى كل طالب وتلبي احتياجاته.
* ربط المخرجات الأكاديمية بالمتطلبات المهنية لضمان تخريج كفاءات جاهزة لسوق العمل.

### الجانب التقني (Technical Part)

#### اللغة المستخدمة:
**TypeScript**: تم الاعتماد على TypeScript لضمان أمان الأنواع (Type Safety) وتقليل الأخطاء البرمجية، خاصة مع استخدام تقنيات التوجيه المتقدمة.

#### أهم التقنيات المستخدمة:
* **إطار العمل الأساسي:** **TanStack Start** (إطار عمل شامل لـ React) مدعوم بـ **React 19**.
* **التوجيه (Routing):** **TanStack Router** لإدارة صفحات التطبيق بشكل آمن وسريع.
* **إدارة الحالة وجلب البيانات:** **TanStack Query** للتعامل مع العمليات الخلفية (Server-state) بكفاءة.
* **أداة البناء (Build Tool):** **Vite** لتوفير بيئة تطوير سريعة جداً وبناء مُحسّن للإنتاج.
* **مدير الحزم وبيئة التشغيل:** **Bun** لسرعته الفائقة في إدارة الاعتماديات وتشغيل المشروع.
* **التنسيق (Styling):** **Tailwind CSS 4** لبناء واجهات عصرية ومتجاوبة.
* **مكتبة واجهة المستخدم:** **shadcn/ui** و **Radix UI** لبناء مكونات قابلة للتخصيص، بالإضافة إلى **Lucide React** للأيقونات.
* **بيئة النشر والاستضافة:** **Cloudflare Workers/Pages** لضمان أداء عالٍ وسرعة استجابة.
* **التحقق وإدارة النماذج:** **Zod** للتحقق من صحة البيانات، و **React Hook Form** لإدارة النماذج بسلاسة.
* **الرسوم البيانية:** **Recharts** لعرض تحليلات وبيانات أداء الطالب بشكل مرئي.

#### طريقة تشغيل المشروع محلياً (How to Run):

لإعداد وتشغيل المشروع على جهازك، اتبع الخطوات التالية:

1. **استنساخ المستودع (Clone):**
   ```bash
   git clone https://github.com/mentora3/my-learning-companion.git
   ```

2. **تثبيت مدير الحزم Bun (لمستخدمي Windows):**
   افتح موجه الأوامر (PowerShell) كمسؤول ونفذ الأوامر التالية:
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   [System.Environment]::SetEnvironmentVariable("Path", [System.Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
   ```

3. **تثبيت الاعتماديات (Install Dependencies):**
   ```bash
   bun install
   ```

4. **تشغيل خادم التطوير (Start Dev Server):**
   ```bash
   bun run dev
   ```

5. **بناء المشروع للإنتاج (Build for Production):**
   ```bash
   bun run build
   ```
**ملاحظة: سيتم ربط الموقع مستقبلًا بقاعدة بيانات الجامعة بهدف تحليل بيانات الطلاب بشكل ذكي** 
---

## 🇬🇧 English Section

### Project Title
A smart mentoring system that detects academic stumbling early and guides the student academically and professionally towards readiness for the labor market.

### Description
Mentora is an AI-powered educational platform integrated with university systems. It continuously analyzes students' academic data and performance to provide personalized guidance, It will detect academic difficulties early and provide students with personalized educational plans to address those challenges, along with tailored practical experiences that help them succeed and prepare for the job market in alignment with Vision 2030.

### Introduction
With traditional educational models failing to accommodate individual student differences, Mentora emerges as an innovative solution. It offers customized learning paths and practical guidance to help students achieve academic success and acquire the skills needed for the job market, aligning with the goals of Saudi Vision 2030.

### Problem Statement
This project was developed to resolve several challenges in the university ecosystem:
* High rates of academic failure and delayed graduation.
* The absence of early intervention mechanisms, as difficulties are often identified only after a student has failed.
* Standardized study plans that do not cater to varying student capabilities.
* A significant gap between graduates' skills and the actual requirements of the labor market, increasing the risk of unemployment.

### Project Significance
The system provides proactive and intelligent solutions by:
* Utilizing AI to analyze data and predict academic issues before they occur.
* Delivering immediate, customized remedial plans tailored to each student's level and needs.
* Aligning academic outcomes with professional requirements to ensure graduates are job-ready.

### Technical Part

#### Language Used
**TypeScript**: The project is strictly typed using TypeScript to ensure robust type safety and minimize runtime errors, particularly beneficial when paired with modern routing solutions.

#### Most Important Technologies
* **Core Framework**: **TanStack Start** (A full-stack React framework) powered by **React 19**.
* **Routing**: **TanStack Router** for type-safe, declarative routing.
* **Data Fetching & State Management**: **TanStack Query** (React Query) for efficient server-state management.
* **Build Tool**: **Vite** for rapid local development and highly optimized production builds.
* **Package Manager & Runtime**: **Bun** for blazing-fast dependency installation and script execution.
* **Styling**: **Tailwind CSS 4** for responsive, utility-first styling.
* **UI Library**: **shadcn/ui** (built on Radix UI) for accessible, customizable components, alongside **Lucide React** for icons.
* **Deployment Target**: **Cloudflare Workers/Pages** for high performance and edge delivery.
* **Validation & Forms**: **Zod** for strict schema validation and **React Hook Form** for seamless form handling.
* **Data Visualization**: **Recharts** to visually represent student analytics and performance metrics.

#### How to Run the Project
Follow these steps to set up and run the project on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mentora3/my-learning-companion.git
   ```

2. **Install Bun (For Windows Users)**:
   Open PowerShell as Administrator and execute:
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   [System.Environment]::SetEnvironmentVariable("Path", [System.Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.bun\bin", "User")
   ```

3. **Install dependencies**:
   ```bash
   bun install
   ```

4. **Start the development server**:
   ```bash
   bun run dev
   ```

5. **Build for production**:
   ```bash
   bun run build
   ```
   **Note: in the future the website will be integrated with the university database to intelligently analyze students data**
