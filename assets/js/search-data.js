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
        },{id: "news-new-preprint-phyt2v-llm-guided-iterative-self-refinement-for-physics-grounded-text-to-video-generation",
          title: 'New preprint: PhyT2V: LLM-Guided Iterative Self-Refinement for Physics-Grounded Text-to-Video Generation',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-cvpr-25-poster-phyt2v-llm-guided-iterative-self-refinement-for-physics-grounded-text-to-video-generation",
          title: 'Paper accepted to CVPR’25 poster: PhyT2V: LLM-Guided Iterative Self-Refinement for Physics-Grounded Text-to-Video Generation...',
          description: "",
          section: "News",},{id: "news-new-preprint-progait-a-multi-purpose-video-dataset-and-benchmark-for-transfemoral-prosthesis-users",
          title: 'New preprint: ProGait: A Multi-Purpose Video Dataset and Benchmark for Transfemoral Prosthesis Users...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-iccv-25-highlight-poster-progait-a-multi-purpose-video-dataset-and-benchmark-for-transfemoral-prosthesis-users",
          title: 'Paper accepted to ICCV’25 highlight poster: ProGait: A Multi-Purpose Video Dataset and Benchmark...',
          description: "",
          section: "News",},{id: "news-new-preprint-mmbert-scaled-mixture-of-experts-multimodal-bert-for-robust-chinese-hate-speech-detection-under-cloaking-perturbations",
          title: 'New preprint: MMBERT: Scaled Mixture-of-Experts Multimodal BERT for Robust Chinese Hate Speech Detection...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-aaai-26-poster-mmbert-scaled-mixture-of-experts-multimodal-bert-for-robust-chinese-hate-speech-detection-under-cloaking-perturbations",
          title: 'Paper accepted to AAAI’26 poster: MMBERT: Scaled Mixture-of-Experts Multimodal BERT for Robust Chinese...',
          description: "",
          section: "News",},{id: "news-new-preprint-spatial-reasoning-in-multimodal-large-language-models-a-survey-of-tasks-benchmarks-and-methods",
          title: 'New preprint: Spatial Reasoning in Multimodal Large Language Models: A Survey of Tasks,...',
          description: "",
          section: "News",},{id: "news-new-preprint-infinibench-infinite-benchmarking-for-visual-spatial-reasoning-with-customizable-scene-complexity",
          title: 'New preprint: InfiniBench: Infinite Benchmarking for Visual Spatial Reasoning with Customizable Scene Complexity...',
          description: "",
          section: "News",},{id: "news-new-preprint-mosaicthinker-on-device-visual-spatial-reasoning-for-embodied-ai-via-iterative-construction-of-space-representation",
          title: 'New preprint: MosaicThinker: On-Device Visual Spatial Reasoning for Embodied AI via Iterative Construction...',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-cvpr-26-oral-poster-infinibench-infinite-benchmarking-for-visual-spatial-reasoning-with-customizable-scene-complexity",
          title: 'Paper accepted to CVPR’26 oral poster: InfiniBench: Infinite Benchmarking for Visual Spatial Reasoning...',
          description: "",
          section: "News",},{id: "news-new-preprint-can-agents-price-a-reaction-evaluating-llms-on-chemical-cost-reasoning",
          title: 'New preprint: Can Agents Price a Reaction? Evaluating LLMs on Chemical Cost Reasoning...',
          description: "",
          section: "News",},{id: "news-new-preprint-clore-content-level-optimization-for-reasoning-efficiency",
          title: 'New preprint: CLORE: Content-Level Optimization for Reasoning Efficiency',
          description: "",
          section: "News",},{id: "news-paper-accepted-to-eccv-26-reasoning-path-and-latent-state-analysis-for-multi-view-visual-spatial-reasoning-a-cognitive-science-perspective",
          title: 'Paper accepted to ECCV’26: Reasoning Path and Latent State Analysis for Multi-view Visual...',
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
