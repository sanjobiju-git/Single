/**
 * ==============================================================================
 * MEMORY & MEDIA CONFIGURATION
 * ==============================================================================
 * Everything you see on the page is configured right here!
 *
 * HOW TO ADD YOUR OWN FILES:
 * 1. Photos: Put your photo files inside the `public/images/` folder
 *    and set url: "/images/your-photo.jpg" (or use any web URL).
 * 2. Videos: Put your video files inside `public/videos/`
 *    and set url: "/videos/your-video.mp4" (or use any direct video URL).
 * 3. Songs: Put your audio file inside `public/audio/`
 *    and update `audio.src` below to "/audio/your-song.mp3".
 * 4. Text Blocks: Add items with type: "letter", "quote", or "milestone".
 * ==============================================================================
 */

export const memoryConfig = {
  // Website metadata & header hero section
  site: {
    browserTitle: "Our Sweet Memories ✨",
    taglineBadge: "Our Journey Together",
    mainTitle: "Moments We Cherish Forever",
    subtitle: "A digital sanctuary filled with the laughter, adventures, quiet mornings, and warm memories we've shared along the way.",
    anniversaryDate: "Since October 14, 2021",
    coupleNames: "Emma & Julian",
    heroHeartIcon: "💙",
  },

  // Floating Hearts on Left and Right Screen Margins
  floatingHearts: {
    enabled: true,
    // Shapes/emojis floating upwards
    symbols: ["❤️", "💖", "💙", "🤍", "✨", "💕", "🌸"],
    leftCount: 8,
    rightCount: 8,
  },

  // Dynamic GhostFibers Background Animation (React Bits)
  ghostFibers: {
    enabled: true,
    glowColor: "#0ea5e9", // Soothing Sky Blue
    secondaryColor: "#38bdf8", // Light Azure / Sky Highlight
    lineColor: "#0284c7", // Rich Deep Sky Fold Accent
    layers: 3,
    twist: 1.2,
    threads: 72,
    fiberStyle: "dots",
    depthOfField: 0.85,
    hoverEffect: "focus",
    intro: true,
    mouseInteraction: true,
    pulseOnClick: true,
    lightMode: true,
    speed: 0.4,
    brightness: 1.0,
  },

  // Filter Categories available on top of the gallery
  filters: [
    { id: "all", label: "All Memories" },
    { id: "photo", label: "📸 Photos" },
    { id: "video", label: "🎬 Videos" },
    { id: "letter", label: "💌 Love Notes" },
    { id: "milestone", label: "⭐ Milestones" },
  ],

  // Masonry Grid Media Assets & Text Blocks
  // Items will seamlessly arrange in an aesthetic, responsive masonry grid
  memories: [
    {
      id: "mem-1",
      type: "photo",
      title: "Golden Hour by the Coast",
      caption: "That breezy afternoon where we forgot about time and simply watched the waves paint the shore.",
      date: "September 18, 2023",
      location: "Big Sur, California",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-[3/4]",
      tag: "photo",
      initialLikes: 24,
    },
    {
      id: "mem-2",
      type: "letter",
      title: "A Little Note Just Because",
      content: "You make ordinary Tuesday mornings feel like poetry. Thank you for always bringing coffee, laughing at silly jokes, and being my favorite human.",
      author: "With all my love, always",
      date: "A quiet Sunday",
      colorTheme: "rose", // "rose" | "sky" | "lavender" | "peach"
      tag: "letter",
      initialLikes: 42,
    },
    {
      id: "mem-3",
      type: "photo",
      title: "First Rainy Cafe Date",
      caption: "Sharing a warm hazelnut latte while listening to the raindrops tap gently against the glass window.",
      date: "November 4, 2022",
      location: "Old Town Corner Bakery",
      url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-[4/3]",
      tag: "photo",
      initialLikes: 19,
    },
    {
      id: "mem-4",
      type: "milestone",
      title: "Our First Road Trip Together",
      subtitle: "800 miles, endless playlist loops, and wrong turns that turned into our favorite vistas.",
      date: "June 12, 2022",
      icon: "🚗",
      details: ["Sang our hearts out to throwback tunes", "Stopped for homemade peach pie", "Watched the stars on the car hood"],
      tag: "milestone",
      initialLikes: 37,
    },
    {
      id: "mem-5",
      type: "video",
      title: "Sunset Waves & Gentle Winds",
      caption: "A short clip of the tide receding as the sun dipped behind the horizon.",
      date: "July 28, 2023",
      location: "Malibu Beach",
      // Sample scenic video; user can replace with local: "/videos/vacation.mp4"
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-video",
      tag: "video",
      initialLikes: 58,
    },
    {
      id: "mem-6",
      type: "quote",
      quote: "Whatever our souls are made of, his and mine are the same.",
      author: "Emily Brontë",
      date: "Chapter of Us",
      colorTheme: "sky",
      tag: "letter",
      initialLikes: 31,
    },
    {
      id: "mem-7",
      type: "photo",
      title: "Stargazing on the Hilltop",
      caption: "Wrapped in two thick blankets, pointing out constellations and whispering our biggest dreams.",
      date: "August 15, 2023",
      location: "Lookout Ridge",
      url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-[3/4]",
      tag: "photo",
      initialLikes: 45,
    },
    {
      id: "mem-8",
      type: "photo",
      title: "The Surprise Flower Bouquet",
      caption: "Fresh wild daisies and eucalyptus picked on an impromptu stroll just to bring a smile.",
      date: "May 3, 2024",
      location: "Spring Meadows",
      url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-square",
      tag: "photo",
      initialLikes: 63,
    },
    {
      id: "mem-9",
      type: "milestone",
      title: "Moving In Together",
      subtitle: "Surrounded by cardboard boxes, takeaway pizza on the floor, and the happiest feeling in the world.",
      date: "January 8, 2024",
      icon: "🏡",
      details: ["Assembled the bookshelf together (with 3 screws leftover)", "Our first key on the same keychain", "A warm hearth of our own"],
      tag: "milestone",
      initialLikes: 89,
    },
    {
      id: "mem-10",
      type: "photo",
      title: "Autumn Leaves & Warm Wool Sweaters",
      caption: "Walking through golden maple canopies, kicking leaves, and holding hands in chilly breeze.",
      date: "October 22, 2024",
      location: "Central Park Walk",
      url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-[4/5]",
      tag: "photo",
      initialLikes: 29,
    },
    {
      id: "mem-11",
      type: "letter",
      title: "Things I Love About You",
      content: "The way you crinkle your nose when you smile, your endless patience, how you sing along even when you forget the lyrics, and the genuine kindness you show to everyone around you.",
      author: "Forever your biggest fan",
      date: "Always & Forever",
      colorTheme: "lavender",
      tag: "letter",
      initialLikes: 74,
    },
    {
      id: "mem-12",
      type: "photo",
      title: "Celebration Dinner",
      caption: "Candlelight, delicious pasta, clinking glasses, and a night full of warm conversation.",
      date: "December 31, 2024",
      location: "Trattoria Bella",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
      aspectRatio: "aspect-[16/10]",
      tag: "photo",
      initialLikes: 35,
    },
  ],

  // Footer section
  footer: {
    message: "Built with love & cherished memories",
    subtext: "Here's to a million more chapters, adventures, and laughs together.",
    heartCountPrompt: "Tap the floating hearts anytime for extra love!",
  }
};

