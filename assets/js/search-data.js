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
        },{id: "nav-cv",
          title: "cv",
          description: "Find my CV here!",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
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
          title: 'Honored to recieve: Predoctoral Honorable Mention from UConn Dept. of Comp. Sci, and...',
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
