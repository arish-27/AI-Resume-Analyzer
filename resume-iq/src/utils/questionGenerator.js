// Enhanced comprehensive resume analysis and question generation
const analyzeResumeContent = (resumeText) => {
    const text = resumeText.toLowerCase();
    const originalText = resumeText;

    console.log("🔍 COMPREHENSIVE RESUME ANALYSIS:", resumeText.substring(0, 500));

    const analysis = {
        technologies: new Set(),
        frameworks: new Set(),
        databases: new Set(),
        cloudServices: new Set(),
        tools: new Set(),
        languages: new Set(),
        roles: new Set(),
        industries: new Set(),
        skills: new Set(),
        certifications: new Set(),
        experience: [],
        projects: [],
        education: [],
        companies: [],
        achievements: [],
        methodologies: new Set()
    };

    // Comprehensive technology keywords with variations
    const techCategories = {
        programmingLanguages: [
            'javascript', 'js', 'typescript', 'ts', 'python', 'java', 'c++', 'cpp', 'c#', 'csharp',
            'php', 'ruby', 'go', 'golang', 'rust', 'kotlin', 'swift', 'scala', 'r', 'matlab',
            'perl', 'shell', 'bash', 'powershell', 'objective-c', 'dart', 'elixir', 'haskell',
            'clojure', 'f#', 'vb.net', 'visual basic', 'cobol', 'fortran', 'assembly', 'lua'
        ],

        webTechnologies: [
            'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'bootstrap', 'tailwind',
            'material-ui', 'mui', 'chakra-ui', 'bulma', 'foundation', 'semantic-ui',
            'webpack', 'vite', 'parcel', 'rollup', 'gulp', 'grunt', 'npm', 'yarn', 'pnpm'
        ],

        frontendFrameworks: [
            'react', 'reactjs', 'vue', 'vuejs', 'angular', 'angularjs', 'svelte', 'ember',
            'backbone', 'jquery', 'next.js', 'nextjs', 'nuxt', 'gatsby', 'remix',
            'react native', 'flutter', 'ionic', 'cordova', 'phonegap', 'xamarin'
        ],

        backendFrameworks: [
            'node.js', 'nodejs', 'express', 'expressjs', 'fastify', 'koa', 'nest.js', 'nestjs',
            'django', 'flask', 'fastapi', 'tornado', 'pyramid', 'spring', 'spring boot',
            'hibernate', 'struts', 'play framework', 'laravel', 'symfony', 'codeigniter',
            'ruby on rails', 'rails', 'sinatra', 'gin', 'echo', 'fiber', 'beego',
            'asp.net', 'asp.net core', '.net', '.net core', 'entity framework'
        ],

        databases: [
            'mysql', 'postgresql', 'postgres', 'sqlite', 'mongodb', 'redis', 'cassandra',
            'dynamodb', 'couchdb', 'neo4j', 'elasticsearch', 'solr', 'oracle', 'sql server',
            'mariadb', 'firestore', 'realm', 'couchbase', 'influxdb', 'timescaledb',
            'clickhouse', 'snowflake', 'bigquery', 'redshift', 'athena'
        ],

        cloudServices: [
            'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud',
            'google cloud platform', 'heroku', 'vercel', 'netlify', 'digitalocean',
            'linode', 'vultr', 'cloudflare', 'firebase', 'supabase', 'planetscale',
            'ec2', 's3', 'lambda', 'rds', 'dynamodb', 'cloudfront', 'route53',
            'elastic beanstalk', 'ecs', 'eks', 'fargate', 'api gateway', 'cloudwatch'
        ],

        devopsTools: [
            'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab ci', 'github actions',
            'circleci', 'travis ci', 'azure devops', 'terraform', 'ansible', 'puppet',
            'chef', 'vagrant', 'helm', 'istio', 'prometheus', 'grafana', 'elk stack',
            'logstash', 'kibana', 'splunk', 'datadog', 'new relic', 'sentry'
        ],

        testingTools: [
            'jest', 'mocha', 'chai', 'jasmine', 'karma', 'protractor', 'cypress',
            'selenium', 'webdriver', 'puppeteer', 'playwright', 'junit', 'testng',
            'pytest', 'unittest', 'rspec', 'minitest', 'phpunit', 'xunit',
            'postman', 'insomnia', 'swagger', 'openapi'
        ],

        versionControl: [
            'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'perforce',
            'git flow', 'github flow', 'pull request', 'merge request', 'code review'
        ],

        dataScience: [
            'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly', 'bokeh',
            'scikit-learn', 'sklearn', 'tensorflow', 'keras', 'pytorch', 'opencv',
            'nltk', 'spacy', 'gensim', 'transformers', 'hugging face', 'jupyter',
            'anaconda', 'r studio', 'tableau', 'power bi', 'qlik', 'looker'
        ],

        mobile: [
            'ios', 'android', 'swift', 'objective-c', 'kotlin', 'java', 'react native',
            'flutter', 'xamarin', 'ionic', 'cordova', 'phonegap', 'unity', 'unreal'
        ],

        methodologies: [
            'agile', 'scrum', 'kanban', 'lean', 'waterfall', 'devops', 'ci/cd',
            'continuous integration', 'continuous deployment', 'tdd', 'test driven development',
            'bdd', 'behavior driven development', 'pair programming', 'code review',
            'microservices', 'monolith', 'serverless', 'event driven', 'domain driven design'
        ]
    };

    // Extract all technology keywords - FIXED: using simple includes() instead of broken regex
    Object.entries(techCategories).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
            // Use simple includes check - more reliable and faster than regex
            if (text.includes(keyword.toLowerCase())) {
                switch (category) {
                    case 'programmingLanguages':
                        analysis.languages.add(keyword);
                        analysis.technologies.add(keyword);
                        break;
                    case 'frontendFrameworks':
                    case 'backendFrameworks':
                        analysis.frameworks.add(keyword);
                        analysis.technologies.add(keyword);
                        break;
                    case 'databases':
                        analysis.databases.add(keyword);
                        analysis.technologies.add(keyword);
                        break;
                    case 'cloudServices':
                        analysis.cloudServices.add(keyword);
                        analysis.technologies.add(keyword);
                        break;
                    case 'methodologies':
                        analysis.methodologies.add(keyword);
                        break;
                    default:
                        analysis.tools.add(keyword);
                        analysis.technologies.add(keyword);
                }
            }
        });
    });

    // Extract job roles and titles
    const roleKeywords = [
        'software engineer', 'software developer', 'full stack developer', 'full-stack developer',
        'frontend developer', 'front-end developer', 'backend developer', 'back-end developer',
        'web developer', 'mobile developer', 'ios developer', 'android developer',
        'devops engineer', 'site reliability engineer', 'sre', 'platform engineer',
        'cloud engineer', 'infrastructure engineer', 'security engineer', 'qa engineer',
        'test engineer', 'automation engineer', 'build engineer', 'release engineer',
        'data scientist', 'data analyst', 'data engineer', 'machine learning engineer',
        'ml engineer', 'ai engineer', 'research scientist', 'business analyst',
        'tech lead', 'technical lead', 'team lead', 'engineering manager',
        'senior software engineer', 'principal engineer', 'staff engineer',
        'architect', 'solution architect', 'system architect', 'cloud architect',
        'intern', 'junior', 'senior', 'lead', 'principal', 'staff', 'director'
    ];

    // FIXED: using simple includes() instead of broken regex
    roleKeywords.forEach(role => {
        if (text.includes(role.toLowerCase())) {
            analysis.roles.add(role);
        }
    });

    // Extract industries
    const industries = [
        'fintech', 'healthcare', 'edtech', 'e-commerce', 'ecommerce', 'retail',
        'banking', 'finance', 'insurance', 'real estate', 'automotive', 'gaming',
        'entertainment', 'media', 'telecommunications', 'telecom', 'logistics',
        'supply chain', 'manufacturing', 'energy', 'utilities', 'government',
        'non-profit', 'startup', 'enterprise', 'saas', 'b2b', 'b2c'
    ];

    industries.forEach(industry => {
        if (text.includes(industry.toLowerCase())) {
            analysis.industries.add(industry);
        }
    });

    // Extract certifications
    const certifications = [
        'aws certified', 'azure certified', 'google cloud certified', 'cissp', 'cism',
        'pmp', 'scrum master', 'product owner', 'safe', 'itil', 'comptia',
        'cisco certified', 'microsoft certified', 'oracle certified', 'red hat certified'
    ];

    // FIXED: using simple includes() instead of broken regex
    certifications.forEach(cert => {
        if (text.includes(cert.toLowerCase())) {
            analysis.certifications.add(cert);
        }
    });

    // Extract experience indicators
    const experiencePatterns = [
        /(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/gi,
        /(\d+)\+?\s*years?\s*(working|developing|programming)/gi,
        /experience\s*(with|in|using)/gi,
        /worked\s*(on|with|at)/gi,
        /developed/gi, /built/gi, /created/gi, /implemented/gi, /designed/gi,
        /led/gi, /managed/gi, /architected/gi, /optimized/gi, /maintained/gi
    ];

    experiencePatterns.forEach(pattern => {
        const matches = originalText.match(pattern);
        if (matches) {
            analysis.experience.push(...matches.slice(0, 5));
        }
    });

    // Extract achievements
    const achievementPatterns = [
        /(\d+)%\s*(improvement|increase|decrease|reduction)/gi,
        /(\d+)x\s*(faster|improvement|increase)/gi,
        /improved.*performance/gi,
        /optimized/gi,
        /reduced.*by/gi,
        /increased.*by/gi
    ];

    achievementPatterns.forEach(pattern => {
        const matches = originalText.match(pattern);
        if (matches) {
            analysis.achievements.push(...matches.slice(0, 3));
        }
    });

    // Extract Projects
    const projectSectionRegex = /(?:projects?|portfolio|personal projects)(?:[\s\S]*?)(?:experience|education|skills|certifications|$)/i;
    const projectSectionMatch = originalText.match(projectSectionRegex);

    if (projectSectionMatch) {
        const projectSection = projectSectionMatch[0];
        const lines = projectSection.split('\n');
        let potentialProjects = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.toLowerCase().includes('project') || trimmed.length < 3) return;

            if (trimmed.length < 50 && /^[A-Z]/.test(trimmed) && !trimmed.includes(':') && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
                potentialProjects.push(trimmed);
            }
        });

        analysis.projects.push(...potentialProjects.slice(0, 3));
    }

    // Convert Sets to Arrays
    const finalAnalysis = {
        technologies: Array.from(analysis.technologies),
        frameworks: Array.from(analysis.frameworks),
        databases: Array.from(analysis.databases),
        cloudServices: Array.from(analysis.cloudServices),
        tools: Array.from(analysis.tools),
        languages: Array.from(analysis.languages),
        roles: Array.from(analysis.roles),
        industries: Array.from(analysis.industries),
        certifications: Array.from(analysis.certifications),
        methodologies: Array.from(analysis.methodologies),
        experience: analysis.experience,
        projects: analysis.projects,
        education: analysis.education,
        companies: analysis.companies,
        achievements: analysis.achievements
    };

    console.log("📊 COMPREHENSIVE ANALYSIS RESULTS:");
    console.log("🔧 Technologies:", finalAnalysis.technologies.length);
    console.log("⚡ Frameworks:", finalAnalysis.frameworks.length);
    console.log("🗄️ Databases:", finalAnalysis.databases.length);
    console.log("☁️ Cloud Services:", finalAnalysis.cloudServices.length);
    console.log("💼 Roles:", finalAnalysis.roles.length);

    return finalAnalysis;
};

// Generate highly personalized questions
const generatePersonalizedQuestions = (analysis) => {
    const questions = [];
    const usedQuestions = new Set();

    console.log("🎯 GENERATING PERSONALIZED QUESTIONS");

    const questionTemplates = {
        specificTechnology: [
            `I see you have experience with {tech}. Can you walk me through a challenging project where you used {tech} and describe the specific problems you solved?`,
            `You mentioned {tech} in your resume. What's the most complex feature you've implemented using {tech}?`,
            `How has your experience with {tech} evolved over time? What advanced techniques do you use now?`,
            `Tell me about a time when you had to optimize performance or solve scalability issues using {tech}.`,
            `What are some best practices you follow when working with {tech} in production environments?`
        ],

        frameworkSpecific: [
            `I notice you work with {framework}. Can you describe the architecture of a complex application you built using {framework}?`,
            `What's your approach to state management and component design when working with {framework}?`,
            `How do you handle testing and debugging in {framework} applications?`,
            `What are some performance optimization techniques you've used with {framework}?`,
            `Can you compare {framework} with other similar frameworks you've used?`
        ],

        databaseExperience: [
            `You have experience with {database}. Can you describe a complex query or database design challenge you've solved?`,
            `How do you approach database optimization and performance tuning with {database}?`,
            `Tell me about your experience with data modeling and schema design using {database}.`,
            `What's your strategy for handling database migrations and version control with {database}?`,
            `How do you ensure data consistency and handle transactions in {database}?`
        ],

        cloudExperience: [
            `I see you've worked with {cloud}. Can you describe a cloud architecture you've designed or implemented?`,
            `What's your experience with {cloud} services for scalability and high availability?`,
            `How do you approach cost optimization and resource management in {cloud}?`,
            `Tell me about your experience with {cloud} security and compliance requirements.`,
            `What monitoring and logging strategies do you use with {cloud} services?`
        ],

        roleSpecific: [
            `As a {role}, what do you consider the most critical technical decisions you make daily?`,
            `What's the most challenging aspect of being a {role} in today's technology landscape?`,
            `How do you stay current with new technologies and trends relevant to your role as a {role}?`,
            `Describe your approach to mentoring and knowledge sharing as a {role}.`,
            `What methodologies and processes do you prefer when working as a {role} and why?`
        ],

        problemSolving: [
            `Describe the most complex technical problem you've solved in the last year.`,
            `Tell me about a time when you had to debug a production issue under pressure.`,
            `How do you approach learning new technologies when they're required for a project?`,
            `Describe a situation where you had to work with legacy code or systems.`,
            `What's your process for researching and evaluating new tools or technologies?`
        ],

        systemDesign: [
            `Can you walk me through the architecture of the most complex system you've designed?`,
            `How do you approach scalability and performance considerations in system design?`,
            `Tell me about a time when you had to redesign a system for better performance or maintainability.`,
            `What's your approach to API design and microservices architecture?`,
            `How do you handle data consistency and distributed system challenges?`
        ],

        projectSpecific: [
            `Could you elaborate on the "{project}" project? What was your specific role and contribution?`,
            `What were the biggest technical challenges you faced while building "{project}"?`,
            `If you could rebuild "{project}" from scratch today, what technologies or approaches would you change?`,
            `How did you handle testing and deployment for "{project}"?`
        ]
    };

    // Priority-based question generation

    // 1. Specific Technology Questions (highest priority)
    if (analysis.technologies.length > 0) {
        const topTechs = analysis.technologies.slice(0, 2);
        topTechs.forEach(tech => {
            if (questions.length < 2) {
                const template = questionTemplates.specificTechnology[Math.floor(Math.random() * questionTemplates.specificTechnology.length)];
                const question = template.replace(/{tech}/g, tech);
                if (!usedQuestions.has(question)) {
                    questions.push(question);
                    usedQuestions.add(question);
                }
            }
        });
    }

    // 1.5 Project Specific Questions (High Priority)
    if (analysis.projects.length > 0) {
        const topProjects = analysis.projects.slice(0, 2);
        topProjects.forEach(project => {
            if (questions.length < 3) {
                const template = questionTemplates.projectSpecific[Math.floor(Math.random() * questionTemplates.projectSpecific.length)];
                const question = template.replace(/{project}/g, project);
                if (!usedQuestions.has(question)) {
                    questions.push(question);
                    usedQuestions.add(question);
                }
            }
        });
    }

    // 2. Framework-specific questions
    if (analysis.frameworks.length > 0 && questions.length < 3) {
        const framework = analysis.frameworks[0];
        const template = questionTemplates.frameworkSpecific[Math.floor(Math.random() * questionTemplates.frameworkSpecific.length)];
        const question = template.replace(/{framework}/g, framework);
        if (!usedQuestions.has(question)) {
            questions.push(question);
            usedQuestions.add(question);
        }
    }

    // 3. Database experience questions
    if (analysis.databases.length > 0 && questions.length < 4) {
        const database = analysis.databases[0];
        const template = questionTemplates.databaseExperience[Math.floor(Math.random() * questionTemplates.databaseExperience.length)];
        const question = template.replace(/{database}/g, database);
        if (!usedQuestions.has(question)) {
            questions.push(question);
            usedQuestions.add(question);
        }
    }

    // 4. Cloud experience questions
    if (analysis.cloudServices.length > 0 && questions.length < 4) {
        const cloud = analysis.cloudServices[0];
        const template = questionTemplates.cloudExperience[Math.floor(Math.random() * questionTemplates.cloudExperience.length)];
        const question = template.replace(/{cloud}/g, cloud);
        if (!usedQuestions.has(question)) {
            questions.push(question);
            usedQuestions.add(question);
        }
    }

    // 5. Role-specific questions
    if (analysis.roles.length > 0 && questions.length < 5) {
        const role = analysis.roles[0];
        const template = questionTemplates.roleSpecific[Math.floor(Math.random() * questionTemplates.roleSpecific.length)];
        const question = template.replace(/{role}/g, role);
        if (!usedQuestions.has(question)) {
            questions.push(question);
            usedQuestions.add(question);
        }
    }

    // Fill remaining slots with problem-solving and system design questions
    const fallbackCategories = [
        questionTemplates.problemSolving,
        questionTemplates.systemDesign
    ];

    while (questions.length < 5) {
        const category = fallbackCategories[Math.floor(Math.random() * fallbackCategories.length)];
        const question = category[Math.floor(Math.random() * category.length)];

        if (!usedQuestions.has(question)) {
            questions.push(question);
            usedQuestions.add(question);
        }
    }

    console.log("✅ GENERATED PERSONALIZED QUESTIONS:");
    questions.forEach((q, i) => console.log(`${i + 1}. ${q.substring(0, 80)}...`));

    return questions.slice(0, 5);
};

export const generateQuestions = (resumeText) => {
    return new Promise((resolve) => {
        console.log("🚀 STARTING PERSONALIZED QUESTION GENERATION");

        setTimeout(() => {
            try {
                const analysis = analyzeResumeContent(resumeText);
                const personalizedQuestions = generatePersonalizedQuestions(analysis);

                console.log("✅ PERSONALIZED QUESTIONS GENERATED:", personalizedQuestions);
                resolve(personalizedQuestions);
            } catch (error) {
                console.error("❌ Question generation error:", error);

                // Fallback: Generate dynamic questions from analysis
                const analysis = analyzeResumeContent(resumeText);
                const fallbackQuestions = [];

                const addQ = (q) => {
                    if (!fallbackQuestions.includes(q)) fallbackQuestions.push(q);
                };

                if (analysis.roles.length > 0) {
                    addQ(`Based on your experience as a ${analysis.roles[0]}, what was your biggest technical challenge?`);
                }

                analysis.technologies.slice(0, 3).forEach(tech => {
                    addQ(`You mentioned ${tech} in your resume. Can you describe a project where you used it?`);
                });

                if (analysis.projects.length > 0) {
                    addQ(`Tell me more about the "${analysis.projects[0]}" project listed on your resume.`);
                }

                const generics = [
                    "What specific skills from your resume are you looking to improve?",
                    "Which of your listed projects are you most proud of and why?",
                    "How do you stay updated with the technologies mentioned in your CV?"
                ];

                let i = 0;
                while (fallbackQuestions.length < 5 && i < generics.length) {
                    addQ(generics[i++]);
                }

                resolve(fallbackQuestions.slice(0, 5));
            }
        }, 300);
    });
};

export const getDetectedSkills = (resumeText) => {
    const analysis = analyzeResumeContent(resumeText);

    const allSkills = [
        ...analysis.technologies,
        ...analysis.frameworks,
        ...analysis.databases,
        ...analysis.cloudServices,
        ...analysis.methodologies,
        ...analysis.roles.slice(0, 3),
        ...analysis.industries
    ];

    return [...new Set(allSkills)];
};

export const getComprehensiveAnalysis = (resumeText) => {
    return analyzeResumeContent(resumeText);
};
