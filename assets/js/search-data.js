// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Here are my research related github repositories",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Get my official CV by clicking the PDF icon",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-new-perprint-phyt2v-llm-guided-iterative-self-refinement-for-physics-grounded-text-to-video-generation",
          title: 'New perprint: PhyT2V: LLM-Guided Iterative Self-Refinement for Physics-Grounded Text-to-Video Generation',
          description: "",
          section: "News",},{id: "news-paper-accpeted-to-cvpr-25-poster-phyt2v-llm-guided-iterative-self-refinement-for-physics-grounded-text-to-video-generation",
          title: 'Paper accpeted to CVPR’25 poster: PhyT2V: LLM-Guided Iterative Self-Refinement for Physics-Grounded Text-to-Video Generation...',
          description: "",
          section: "News",},{id: "news-new-perprint-progait-a-multi-purpose-video-dataset-and-benchmark-for-transfemoral-prosthesis-users",
          title: 'New perprint: ProGait: A Multi-Purpose Video Dataset and Benchmark for Transfemoral Prosthesis Users...',
          description: "",
          section: "News",},{id: "news-paper-accpeted-to-iccv-25-highlight-poster-progait-a-multi-purpose-video-dataset-and-benchmark-for-transfemoral-prosthesis-users",
          title: 'Paper accpeted to ICCV’25 highlight poster: ProGait: A Multi-Purpose Video Dataset and Benchmark...',
          description: "",
          section: "News",},{id: "news-new-perprint-mmbert-scaled-mixture-of-experts-multimodal-bert-for-robust-chinese-hate-speech-detection-under-cloaking-perturbations",
          title: 'New perprint: MMBERT: Scaled Mixture-of-Experts Multimodal BERT for Robust Chinese Hate Speech Detection...',
          description: "",
          section: "News",},{id: "news-paper-accpeted-to-aaai-26-poster-mmbert-scaled-mixture-of-experts-multimodal-bert-for-robust-chinese-hate-speech-detection-under-cloaking-perturbations",
          title: 'Paper accpeted to AAAI’26 poster: MMBERT: Scaled Mixture-of-Experts Multimodal BERT for Robust Chinese...',
          description: "",
          section: "News",},{id: "news-new-perprint-infinibench-infinite-benchmarking-for-visual-spatial-reasoning-with-customizable-scene-complexity",
          title: 'New perprint: InfiniBench: Infinite Benchmarking for Visual Spatial Reasoning with Customizable Scene Complexity...',
          description: "",
          section: "News",},{id: "news-paper-accpeted-to-cvpr-26-oral-poster-infinibench-infinite-benchmarking-for-visual-spatial-reasoning-with-customizable-scene-complexity",
          title: 'Paper accpeted to CVPR’26 oral poster: InfiniBench: Infinite Benchmarking for Visual Spatial Reasoning...',
          description: "",
          section: "News",},{id: "news-started-as-a-first-year-phd-student-in-data-science-at-the-university-of-north-carolina-at-chapel-hill-after-moving-on-from-the-ece-phd-program-at-the-university-of-pittsburgh-new-focus-agentic-and-self-evolving-ai-particularly-for-healthcare",
          title: 'Started as a first-year PhD student in Data Science at the University of...',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%71%69%79%61%6F%78%75%65@%75%6E%63.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/xue-qi-yao", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/Qiyao Xue", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0000-4443-0756", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=yNPzzOAAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
