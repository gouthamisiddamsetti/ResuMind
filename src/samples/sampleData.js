/**
 * ResuMind - Curated Sample Data
 * Pre-loaded realistic resumes and job descriptions for instant 1-click testing.
 */

const SAMPLE_RESUMES = {
  seniorFullStack: {
    id: 'senior-fullstack',
    title: 'Alex Rivera - Senior Full Stack Engineer',
    text: `ALEX RIVERA
San Francisco, CA | (555) 382-9102 | alex.rivera@email.com
linkedin.com/in/alexrivera-dev | github.com/alexrivera-code

SUMMARY
Results-oriented Senior Full Stack Engineer with 7+ years of experience architecting high-concurrency web platforms, microservices, and modern frontend applications. Proven history of slashing API latency by 45% and leading cross-functional teams to ship mission-critical cloud infrastructure.

SKILLS
- Languages: TypeScript, JavaScript, Python, SQL, Go, HTML5, CSS3
- Frameworks: React, Next.js, Node.js, Express, NestJS, Tailwind CSS
- Cloud & DevOps: AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD, Terraform, GitHub Actions
- Databases: PostgreSQL, Redis, MongoDB, Elasticsearch
- Architecture: Microservices, REST APIs, GraphQL, System Design, Event-Driven Architecture, Unit Testing

EXPERIENCE
Apex Cloud Technologies | San Francisco, CA
Senior Full Stack Engineer | March 2022 - Present
- Architected and deployed a multi-tenant microservices platform using Node.js, TypeScript, and AWS Lambda, serving 450k+ daily active users with 99.99% uptime.
- Spearheaded the complete migration of legacy frontend to Next.js and React, accelerating page load speeds by 52% and increasing user conversion rates by 18%.
- Optimized complex PostgreSQL and Redis caching queries, slashing 95th-percentile API response latency from 340ms to 48ms.
- Mentored a distributed team of 8 junior and mid-level software engineers, driving code review standards and establishing automated CI/CD pipelines via GitHub Actions.

Starlight Digital Solutions | Austin, TX
Full Stack Software Developer | July 2019 - February 2022
- Engineered high-throughput payment checkout workflows using React, Node.js, and Stripe API, processing over $12M in annual gross transaction volume.
- Implemented robust event-driven message queuing with Redis and RabbitMQ, eliminating asynchronous order processing failures by 98%.
- Developed comprehensive automated end-to-end and unit testing suites with Jest and Playwright, achieving 91% code coverage.
- Collaborated cross-functionally with product managers, UX designers, and QA engineers to deliver 14 consecutive sprint releases on schedule.

EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science | 2015 - 2019
Honors: Dean's Honor List, Magna Cum Laude

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (2024)
- Certified Kubernetes Application Developer (CKAD)`
  },

  mlEngineer: {
    id: 'ml-engineer',
    title: 'Jordan Chen - Machine Learning & AI Engineer',
    text: `JORDAN CHEN
Seattle, WA | (555) 721-4490 | jordan.chen.ai@email.com
linkedin.com/in/jordanchen-ai | github.com/jordanchen-ml

SUMMARY
AI & Machine Learning Engineer with 5+ years of specialized experience training and deploying large language models, retrieval-augmented generation (RAG) pipelines, and computer vision systems. Spearheaded real-time inference optimization reducing GPU inference costs by 38%.

SKILLS
- Languages: Python, C++, SQL, Bash
- Frameworks: PyTorch, TensorFlow, Hugging Face, LangChain, FastAPI, Ray
- Cloud & MLOps: AWS, Docker, Kubernetes, MLflow, Weights & Biases, Triton Inference Server
- Databases: PostgreSQL, Milvus, Pinecone, Redis
- Core Competencies: LLM Fine-tuning, RAG, Deep Learning, Transformer Architectures, CI/CD

EXPERIENCE
CognitiveScale Labs | Seattle, WA
Senior Machine Learning Engineer | January 2023 - Present
- Spearheaded the design and deployment of enterprise RAG search engines using LangChain, Hugging Face, and Pinecone, indexing over 10M internal enterprise documents.
- Fine-tuned open-source Transformer LLMs with LoRA and PEFT on PyTorch, improving factual precision by 24% and reducing hallucinations.
- Engineered high-performance inference serving pipelines with Triton Inference Server and FastAPI, achieving sub-100ms response times under 2,000 queries per second.
- Reduced cloud GPU infrastructure spending by $72,000 annually through dynamic batching and 8-bit model quantization.

NeuralVibe Systems | San Jose, CA
Machine Learning Engineer | June 2020 - December 2022
- Developed computer vision classification models using PyTorch and Docker, deployed to 15,000 edge IoT devices with 96.4% accuracy.
- Automated data collection and synthetic augmentation pipelines, scaling model training data sets from 50k to 1.2M annotated samples.
- Authored automated model evaluation workflows with MLflow and GitHub Actions to continuously detect data drift.

EDUCATION
University of Washington
Master of Science in Artificial Intelligence & Computer Science | 2018 - 2020
Bachelor of Science in Mathematics & Statistics | 2014 - 2018`
  },

  juniorDev: {
    id: 'junior-dev',
    title: 'Taylor Morgan - Junior Developer (Needs Optimization)',
    text: `Taylor Morgan
Email: taylor.morgan@email.com | Phone: 555-019-2831

OBJECTIVE
Passionate junior developer looking for an entry-level position to learn new skills and grow my programming career.

SKILLS
HTML, CSS, JavaScript, React, Git

EXPERIENCE
Freelance / Web Projects
Junior Web Developer | 2023 - 2024
- Worked on websites for small businesses using HTML, CSS, and JavaScript.
- Helped client redesign their store homepage.
- Assisted with bug fixes and added basic React components.
- Responsible for fixing CSS styles and making mobile responsive views.
- Tried out different hosting platforms like Netlify.

EDUCATION
State College
Associate Degree in Information Technology | 2021 - 2023`
  }
};

const SAMPLE_JOB_DESCRIPTIONS = {
  seniorFullStackJob: {
    id: 'senior-fullstack-job',
    title: 'Senior Full Stack Engineer - Fintech / Cloud Platform',
    company: 'Stripe / Fintech Unicorn',
    text: `About the Role:
We are looking for a Senior Full Stack Engineer to lead the architecture and development of our global financial payment infrastructure. You will own high-concurrency microservices, design modern user-facing applications, and scale mission-critical backend systems.

Responsibilities:
- Architect and develop scalable web applications and microservices using TypeScript, Node.js, and React.
- Collaborate cross-functionally with product managers, UX designers, and infrastructure teams.
- Design high-performance database schemas with PostgreSQL and caching strategies using Redis.
- Deploy, monitor, and scale distributed cloud services on AWS using Docker, Kubernetes, and Terraform.
- Champion engineering best practices, conduct code reviews, and mentor engineers.
- Maintain rigorous 99.99% uptime, latency targets, and automated CI/CD testing pipelines.

Requirements:
- 5+ years of full-stack software development experience.
- Deep expertise in TypeScript, JavaScript, React, Node.js, and Next.js.
- Strong knowledge of relational databases (PostgreSQL), REST APIs, and GraphQL.
- Hands-on cloud experience with AWS, Docker, Kubernetes, and CI/CD pipelines.
- Proven track record of delivering measurable performance improvements and optimizing system latency.
- Excellent communication and cross-functional leadership skills.`
  },

  mlEngineerJob: {
    id: 'ml-engineer-job',
    title: 'AI / Machine Learning Engineer - LLMs & RAG',
    company: 'Anthropic / Frontier AI Lab',
    text: `About the Role:
We are seeking an AI & Machine Learning Engineer to build state-of-the-art LLM applications, enterprise RAG workflows, and real-time model inference architectures.

Responsibilities:
- Develop and deploy production machine learning pipelines using Python, PyTorch, and Hugging Face.
- Architect scalable RAG (Retrieval-Augmented Generation) systems with vector databases like Pinecone or Milvus.
- Optimize deep learning inference performance using Triton, FastAPI, quantization, and batching.
- Implement automated MLOps pipelines with MLflow, Docker, Kubernetes, and AWS.
- Conduct rigorous evaluation to prevent hallucinations and ensure enterprise AI safety.

Requirements:
- 3+ years of production experience in Machine Learning and Python.
- Strong expertise with PyTorch, Transformer models, and LLM fine-tuning techniques.
- Familiarity with vector databases, embeddings, and LangChain.
- Experience with cloud-native MLOps (AWS, Docker, Kubernetes, Triton).`
  }
};

module.exports = {
  SAMPLE_RESUMES,
  SAMPLE_JOB_DESCRIPTIONS
};
