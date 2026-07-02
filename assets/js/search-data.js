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
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "publications by categories in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-talks",
          title: "talks",
          description: "talks and posters in reverse chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/talks.html";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Find my CV here - click the pdf icon to the right!",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-on-attending-machine-learning-summer-school",
        
          title: "On Attending Machine Learning Summer School",
        
        description: "In the last 2 weeks, I attended Machine Learning Summer School (MLSS), hosted by Columbia University&#39;s Center for Financial Engineering and sponsored by Bloomberg. Having just finished the second year of my PhD, this was a fantastic opportunity for me to learn about the broader scope of modern machine learning and meet other PhD students in the field. In this blog post, I&#39;ll share some of my key learnings and experiences!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/mlss/";
          
        },
      },{id: "post-what-i-learned-from-my-first-poster-competition",
        
          title: "What I Learned From My First Poster Competition",
        
        description: "I recently participated in my university&#39;s College of Engineering Annual Poster Competition, and won 1st place for my department (Department of Computer Science and Engineering)!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/first-poster-comp/";
          
        },
      },{id: "post-on-the-power-of-positive-thinking",
        
          title: "On the Power of Positive Thinking",
        
        description: "A few days ago, I was pondering whether the (metaphorical) glass is half-empty, or full.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/positive-thinking/";
          
        },
      },{id: "post-exploring-old-town-alexandria",
        
          title: "Exploring Old Town Alexandria",
        
        description: "I recently made a vlog about my day out in Old Town, Alexandria, Virginia.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/exploring-old-town-alexandria/";
          
        },
      },{id: "post-i-watched-the-april-2024-solar-eclipse",
        
          title: "I Watched The April 2024 Solar Eclipse!",
        
        description: "On Monday 8th April, 2024, I witnessed an incredible thing - a total solar eclipse.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/apr2024-solar-eclipse/";
          
        },
      },{id: "post-tableau-conference-2023-my-experience",
        
          title: "Tableau Conference 2023 - My Experience",
        
        description: "As a data scientist, I use Tableau a lot to make interactive dashboards for my business stakeholders to consume key insights.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/tableau-conference-2023/";
          
        },
      },{id: "post-spacecom-expo-2024-my-experience",
        
          title: "SpaceCom Expo 2024 - My Experience",
        
        description: "Last week, I attended the SpaceCom Expo and Conference in Orlando, Florida. In this article, I talk about the conference, my experiences, and some other fun things I did in Florida!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/spacecom-conference-2024/";
          
        },
      },{id: "post-my-experience-attending-present-your-science-workshop",
        
          title: "My Experience Attending ‘Present Your Science’ Workshop",
        
        description: "I recently had the pleasure of attending a ‘Present Your Science’ workshop hosted by Melissa Marshall. Marshall is a prolific speaker who has given a TED talk, and now runs her own business, Present Your Science, to disseminate her teachings and best practices on giving scientific presentations. In this post, I will share some of my key takeaways on giving successful presentations to diverse audiences.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/present-your-science/";
          
        },
      },{id: "post-an-analysis-of-the-stack-exchange-network-through-an-interactive-rshiny-web-app",
        
          title: "An Analysis of the Stack Exchange Network, Through an Interactive RShiny Web App...",
        
        description: "Stack Overflow is one of the most well-known websites for coders. It is a community-driven forum for asking and answering questions about coding, programming, software engineering, etc. The Stack Overflow website is just one community out of many, all of which are hosted by the Stack Exchange network.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/rshiny-stackexchange-analysis/";
          
        },
      },{id: "post-wonders-of-the-night-sky-this-month-april",
        
          title: "Wonders of the Night Sky This Month - April",
        
        description: "Hello readers! It has been a difficult past month for most of the world, with the Covid-19 pandemic growing. Most of us are in isolation, or as is the case in New Zealand, a mandatory lockdown, to prevent further spread of the virus and to protect ourselves and others. Hopefully, you are all keeping safe!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/night-sky-apr2020/";
          
        },
      },{id: "post-wonders-of-the-night-sky-this-month-january",
        
          title: "Wonders of the Night Sky This Month - January",
        
        description: "Happy New Year 2020! As we enter the new year, we do so with our eyes up to the sky. This decade brings with it more exciting advances in the field of astronomy to look forward to.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/night-sky-jan2020/";
          
        },
      },{id: "post-how-far-we-39-ve-come",
        
          title: "How Far We&#39;ve Come",
        
        description: "In this article written for Day Seven of World Space Week 2019, I write a short piece about how far we have come from the first days of lunar exploration.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/how-far-weve-come/";
          
        },
      },{id: "post-moons-of-other-planets",
        
          title: "Moons of Other Planets",
        
        description: "In this article written for Day Six of World Space Week 2019, I write a short piece about the moons of other planets.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/moons-of-other-planets/";
          
        },
      },{id: "post-back-to-the-moon",
        
          title: "Back To The Moon",
        
        description: "In this article written for Day Five of World Space Week 2019, I write a short piece about us going back to the Moon on manned missions.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/back-to-the-moon/";
          
        },
      },{id: "post-chandrayaan",
        
          title: "Chandrayaan",
        
        description: "In this article written for Day Four of World Space Week 2019, I write a short piece about the Chandrayan missions.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/chandrayaan/";
          
        },
      },{id: "post-moon-landings",
        
          title: "Moon Landings",
        
        description: "In this article written for Day Three of World Space Week 2019, I write a short piece about the Apollo Moon landings. This year marks the 50th anniversary of the first manned moon landing back in July 1969.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/moon-landings/";
          
        },
      },{id: "post-tonight-in-the-sky-sat-5th-oct",
        
          title: "Tonight In The Sky - Sat 5th Oct",
        
        description: "In this article written for Day Two of World Space Week 2019, I write a short piece about what you can observe tonight in the sky, as not only is it World Space Week Day Two, but it is also International Observe the Moon Day.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/nightsky-today/";
          
        },
      },{id: "post-features-of-the-moon",
        
          title: "Features of the Moon",
        
        description: "In this article written for Day One of World Space Week 2019, I write a short piece about the features of the moon, as this year’s theme for World Space Week is ‘Lunar Theme’.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/moon-features/";
          
        },
      },{id: "post-a-discussion-on-scientific-research-by-nobel-laureates",
        
          title: "A Discussion on Scientific Research by Nobel Laureates",
        
        description: "Today I attended a fascinating event called “Failure, Persistence and Joy; Finding the Right Balance for Research Success”, hosted by the Nobel Prize Inspiration Initiative in Kingston, Ontario.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/nobel-laureates/";
          
        },
      },{id: "post-wonders-of-the-winter-sky-this-month-july",
        
          title: "Wonders of the Winter Sky This Month - July",
        
        description: "As we move on from the Winter Solstice in the Southern Hemisphere, we say farewell to some constellations and welcome others. Read on to find out what celestial objects you can observe this month in New Zealand!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/night-sky-jul2019/";
          
        },
      },{id: "post-wonders-of-the-winter-sky-this-month-may",
        
          title: "Wonders of the Winter Sky This Month - May",
        
        description: "As we approach winter in the Southern Hemisphere, we say farewell to some constellations and welcome others. Read on to find out what celestial objects you can observe this month in New Zealand!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/night-sky-may2019/";
          
        },
      },{id: "post-yuri-gagarin-and-his-space-legacy",
        
          title: "Yuri Gagarin and his Space Legacy",
        
        description: "This article has been written in honour of Yuri’s Night, celebrated worldwide every year on the 12th of April. Read on to learn more!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/yuri-gagarin/";
          
        },
      },{id: "post-ngc-4755-the-jewel-box-cluster",
        
          title: "NGC 4755, The Jewel Box Cluster",
        
        description: "NGC 4755, or the Jewel Box Cluster, is an open cluster of stars visible only in the southern hemisphere in the constellation Crux, ‘The Southern Cross’. It is a beauty to observe and many are fascinated by its striking resemblance to its name.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/ngc4755-jewelbox/";
          
        },
      },{id: "post-karen-pollard-and-the-music-of-the-stars",
        
          title: "Karen Pollard and the Music of the Stars",
        
        description: "This is the second article in my series of ‘Women in Astronomy’ article series, in honour of the International Astronomical Union’s Women and Girls in Astronomy month (February).",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/karen-pollard/";
          
        },
      },{id: "post-m42-the-orion-nebula",
        
          title: "M42, The Orion Nebula",
        
        description: "The Orion Nebula, or M42, or NGC 1976, is one of the most prominent nebulae, visible to both the northern and southern hemispheres in the easily-recognised constellation, Orion. It is stunning, and truly a delight to gaze at, whether through binoculars, telescopes, or even images on the internet.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/m42-orion-nebula/";
          
        },
      },{id: "post-beatrice-tinsley-a-very-luminous-star",
        
          title: "Beatrice Tinsley, A Very Luminous Star",
        
        description: "This is the first article in my series of ‘Women in Astronomy’ article series, in honour of the International Astronomical Union’s Women and Girls in Astronomy month (February).",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/beatrice-tinsley/";
          
        },
      },{id: "post-comet-46p-wirtanen",
        
          title: "Comet 46P/Wirtanen",
        
        description: "Recently this comet, also known as the ‘Christmas Comet’, paid another visit for Earthlings to glimpse this very bright object in the northern skies.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/comet46p/";
          
        },
      },{id: "post-the-journey-begins",
        
          title: "The Journey Begins",
        
        description: "Thanks for joining me! I am a university student studying astrophysics. Astronomy and physics are something I’ve always been so passionate about. I want to share my love of the cosmos with you. I write articles about various topics in science which fascinate me. I hope you like it!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2019/the-journey-begins/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-i-passed-my-phd-qualifying-exam-sparkles-smile",
          title: 'I passed my PhD Qualifying Exam!!! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "news-i-won-my-department-s-prize-in-the-uconn-college-of-engineering-poster-competition",
          title: 'I won my Department’s prize in the UConn College of Engineering poster competition!...',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-honored-to-recieve-predoctoral-honorable-mention-from-uconn-dept-of-comp-sci-and-synchrony-fellowship-for-fall-2025",
          title: 'Honored to recieve Predoctoral Honorable Mention from UConn Dept. of Comp. Sci, and...',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_3/";
            },},{id: "news-featured-in-uconn-enhance-career-readiness-blog",
          title: 'Featured in UConn Enhance Career Readiness blog!',
          description: "",
          section: "News",},{id: "news-selected-to-attend-machine-learning-summer-school-hosted-by-center-for-financial-engineering-columbia-university-see-blogpost",
          title: 'Selected to attend Machine Learning Summer School, hosted by Center for Financial Engineering...',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%74%68%65%61%77%65%73%6F%6D%65%63%6F%73%6D%6F%73@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/awesomecosmos", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/aayushi-verma", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0003-2396-4569", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=jlowXNIAAAAJ", "_blank");
        },
      },{
        id: 'social-bluesky',
        title: 'Bluesky',
        section: 'Socials',
        handler: () => {
          window.open("https://bsky.app/profile/awesomecosmos1.bsky.social", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/awesomecosmos1", "_blank");
        },
      },{
        id: 'social-youtube',
        title: 'YouTube',
        section: 'Socials',
        handler: () => {
          window.open("https://youtube.com/@awesomecosmos", "_blank");
        },
      },{
        id: 'social-instagram',
        title: 'Instagram',
        section: 'Socials',
        handler: () => {
          window.open("https://instagram.com/awesomecosmos", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Socials',
        handler: () => {
          window.open("https://medium.com/@aayushi_verma", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
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
