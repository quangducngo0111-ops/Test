/* =========================================================
   VOCABULARY DATABASE

   THÊM TỪ MỚI:
   Chỉ cần copy 1 object và sửa nội dung.

   BẮT BUỘC:
   - word
   - meaning
   - skills
   - topics

   TÙY CHỌN:
   - example
   - collocation
========================================================= */

const VOCABULARY_DATA = [

  /* =======================================================
     EDUCATION
  ======================================================= */

  {
    word:"curriculum",
    meaning:"chương trình học",

    skills:[
      "reading",
      "listening",
      "writing-task-2"
    ],

    topics:[
      "education"
    ],

    example:
      "The school introduced a new curriculum.",

    collocation:
      "school curriculum"
  },


  {
    word:"compulsory",
    meaning:"bắt buộc",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "education"
    ],

    example:
      "Education is compulsory for children.",

    collocation:
      "compulsory education"
  },


  {
    word:"tuition",
    meaning:"học phí",

    skills:[
      "reading",
      "listening",
      "speaking-part-3"
    ],

    topics:[
      "education",
      "money"
    ],

    example:
      "University tuition can be expensive.",

    collocation:
      "tuition fees"
  },


  {
    word:"scholarship",
    meaning:"học bổng",

    skills:[
      "reading",
      "listening",
      "speaking-part-1",
      "speaking-part-2"
    ],

    topics:[
      "education"
    ],

    example:
      "She received a scholarship to study abroad.",

    collocation:
      "win a scholarship"
  },


  {
    word:"literacy",
    meaning:"khả năng đọc và viết",

    skills:[
      "reading",
      "writing-task-2"
    ],

    topics:[
      "education"
    ],

    example:
      "Literacy rates have improved significantly.",

    collocation:
      "literacy rate"
  },


  {
    word:"assessment",
    meaning:"sự đánh giá",

    skills:[
      "reading",
      "listening",
      "writing-task-2"
    ],

    topics:[
      "education"
    ],

    example:
      "Continuous assessment can reduce exam pressure.",

    collocation:
      "continuous assessment"
  },


  /* =======================================================
     ENVIRONMENT
  ======================================================= */

  {
    word:"biodiversity",
    meaning:"đa dạng sinh học",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "environment"
    ],

    example:
      "The forest contains remarkable biodiversity.",

    collocation:
      "protect biodiversity"
  },


  {
    word:"deforestation",
    meaning:"nạn phá rừng",

    skills:[
      "reading",
      "listening",
      "writing-task-2"
    ],

    topics:[
      "environment"
    ],

    example:
      "Deforestation contributes to climate change.",

    collocation:
      "reduce deforestation"
  },


  {
    word:"renewable",
    meaning:"có thể tái tạo",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "environment",
      "technology"
    ],

    example:
      "Many countries are investing in renewable energy.",

    collocation:
      "renewable energy"
  },


  {
    word:"emission",
    meaning:"khí thải; sự phát thải",

    skills:[
      "reading",
      "listening",
      "writing-task-1",
      "writing-task-2"
    ],

    topics:[
      "environment",
      "transport"
    ],

    example:
      "Carbon emissions fell during the period.",

    collocation:
      "carbon emissions"
  },


  {
    word:"conservation",
    meaning:"sự bảo tồn",

    skills:[
      "reading",
      "listening",
      "speaking-part-3"
    ],

    topics:[
      "environment"
    ],

    example:
      "Wildlife conservation requires international cooperation.",

    collocation:
      "wildlife conservation"
  },


  /* =======================================================
     TECHNOLOGY
  ======================================================= */

  {
    word:"automation",
    meaning:"sự tự động hóa",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "technology",
      "work"
    ],

    example:
      "Automation has transformed many industries.",

    collocation:
      "industrial automation"
  },


  {
    word:"innovation",
    meaning:"sự đổi mới",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "technology",
      "business"
    ],

    example:
      "Innovation can improve productivity.",

    collocation:
      "technological innovation"
  },


  {
    word:"device",
    meaning:"thiết bị",

    skills:[
      "listening",
      "speaking-part-1",
      "speaking-part-2"
    ],

    topics:[
      "technology"
    ],

    example:
      "I use this device every day.",

    collocation:
      "electronic device"
  },


  {
    word:"accessible",
    meaning:"dễ tiếp cận",

    skills:[
      "reading",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "technology",
      "education"
    ],

    example:
      "Online courses make education more accessible.",

    collocation:
      "easily accessible"
  },


  /* =======================================================
     HEALTH
  ======================================================= */

  {
    word:"sedentary",
    meaning:"ít vận động",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "health",
      "lifestyle"
    ],

    example:
      "A sedentary lifestyle can cause health problems.",

    collocation:
      "sedentary lifestyle"
  },


  {
    word:"nutritious",
    meaning:"bổ dưỡng",

    skills:[
      "listening",
      "speaking-part-1",
      "speaking-part-2"
    ],

    topics:[
      "health",
      "food"
    ],

    example:
      "I try to eat nutritious meals.",

    collocation:
      "nutritious food"
  },


  {
    word:"well-being",
    meaning:"sức khỏe và trạng thái hạnh phúc",

    skills:[
      "reading",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "health",
      "lifestyle"
    ],

    example:
      "Exercise improves mental well-being.",

    collocation:
      "mental well-being"
  },


  {
    word:"detrimental",
    meaning:"có hại",

    skills:[
      "reading",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "health",
      "environment"
    ],

    example:
      "Excessive screen time can be detrimental to health.",

    collocation:
      "detrimental effect"
  },


  /* =======================================================
     WORK
  ======================================================= */

  {
    word:"occupation",
    meaning:"nghề nghiệp",

    skills:[
      "listening",
      "speaking-part-1"
    ],

    topics:[
      "work"
    ],

    example:
      "What is your current occupation?",

    collocation:
      "current occupation"
  },


  {
    word:"flexible",
    meaning:"linh hoạt",

    skills:[
      "listening",
      "speaking-part-1",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "work"
    ],

    example:
      "Flexible working hours are becoming more common.",

    collocation:
      "flexible working hours"
  },


  {
    word:"productivity",
    meaning:"năng suất",

    skills:[
      "reading",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "work",
      "business"
    ],

    example:
      "Technology can increase productivity.",

    collocation:
      "improve productivity"
  },


  /* =======================================================
     SPEAKING
  ======================================================= */

  {
    word:"close-knit",
    meaning:"gắn bó, thân thiết",

    skills:[
      "speaking-part-1",
      "speaking-part-2"
    ],

    topics:[
      "family",
      "relationships"
    ],

    example:
      "I come from a close-knit family.",

    collocation:
      "close-knit family"
  },


  {
    word:"memorable",
    meaning:"đáng nhớ",

    skills:[
      "speaking-part-1",
      "speaking-part-2"
    ],

    topics:[
      "travel",
      "experience"
    ],

    example:
      "It was one of the most memorable trips of my life.",

    collocation:
      "memorable experience"
  },


  {
    word:"picturesque",
    meaning:"đẹp như tranh",

    skills:[
      "speaking-part-2"
    ],

    topics:[
      "travel",
      "places"
    ],

    example:
      "The village is extremely picturesque.",

    collocation:
      "picturesque village"
  },


  {
    word:"convenient",
    meaning:"thuận tiện",

    skills:[
      "listening",
      "speaking-part-1",
      "speaking-part-2"
    ],

    topics:[
      "transport",
      "cities"
    ],

    example:
      "Public transport is convenient in my city.",

    collocation:
      "highly convenient"
  },


  /* =======================================================
     WRITING TASK 1
  ======================================================= */

  {
    word:"fluctuate",
    meaning:"dao động",

    skills:[
      "writing-task-1"
    ],

    topics:[
      "data"
    ],

    example:
      "The figure fluctuated throughout the period.",

    collocation:
      "fluctuate considerably"
  },


  {
    word:"plummet",
    meaning:"giảm mạnh",

    skills:[
      "writing-task-1"
    ],

    topics:[
      "data"
    ],

    example:
      "Sales plummeted in the final quarter.",

    collocation:
      "plummet dramatically"
  },


  {
    word:"surge",
    meaning:"tăng vọt",

    skills:[
      "writing-task-1"
    ],

    topics:[
      "data"
    ],

    example:
      "The number surged to 50,000.",

    collocation:
      "surge sharply"
  },


  {
    word:"remain stable",
    meaning:"giữ ổn định",

    skills:[
      "writing-task-1"
    ],

    topics:[
      "data"
    ],

    example:
      "The figure remained stable at around 30%.",

    collocation:
      "remain relatively stable"
  },


  {
    word:"account for",
    meaning:"chiếm, cấu thành",

    skills:[
      "writing-task-1",
      "writing-task-2"
    ],

    topics:[
      "data"
    ],

    example:
      "Women accounted for 55% of the total.",

    collocation:
      "account for approximately"
  },


  /* =======================================================
     CITIES / TRANSPORT
  ======================================================= */

  {
    word:"congestion",
    meaning:"sự ùn tắc",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "transport",
      "cities"
    ],

    example:
      "Traffic congestion is a serious urban problem.",

    collocation:
      "traffic congestion"
  },


  {
    word:"infrastructure",
    meaning:"cơ sở hạ tầng",

    skills:[
      "reading",
      "listening",
      "speaking-part-3",
      "writing-task-2"
    ],

    topics:[
      "cities",
      "transport"
    ],

    example:
      "The city needs better transport infrastructure.",

    collocation:
      "public infrastructure"
  }

];
