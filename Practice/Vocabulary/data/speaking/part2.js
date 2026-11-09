/* IELTS Speaking Part 2 | 10 cue-card topics | 120 original items. */
(function(){
const skill="speaking-part-2";
const incoming=[
  {
    "id": "sp2-01-001",
    "word": "role model",
    "meaning": "hình mẫu để noi theo",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "My aunt has always been a role model for me.",
    "collocation": "a positive role model",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-002",
    "word": "down-to-earth",
    "meaning": "giản dị, thực tế",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "Despite her success, she is very down-to-earth.",
    "collocation": "a down-to-earth person",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-003",
    "word": "determined",
    "meaning": "quyết tâm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "She is determined to achieve her goals.",
    "collocation": "highly determined",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-004",
    "word": "go out of one's way",
    "meaning": "chủ động nỗ lực giúp người khác",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "She goes out of her way to help her students.",
    "collocation": "go out of one's way to help",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-005",
    "word": "set a good example",
    "meaning": "làm tấm gương tốt",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "My coach sets a good example for young athletes.",
    "collocation": "set a good example",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-006",
    "word": "work ethic",
    "meaning": "tinh thần, thái độ làm việc",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "I admire her strong work ethic.",
    "collocation": "a strong work ethic",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-007",
    "word": "perseverance",
    "meaning": "sự kiên trì",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "Her perseverance helped her overcome difficulties.",
    "collocation": "show perseverance",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-008",
    "word": "have a positive influence",
    "meaning": "có ảnh hưởng tích cực",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "My teacher has had a positive influence on me.",
    "collocation": "have a positive influence on",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-009",
    "word": "inspiring",
    "meaning": "truyền cảm hứng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "I find her life story inspiring.",
    "collocation": "an inspiring person",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-010",
    "word": "humble",
    "meaning": "khiêm tốn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "He remains humble about his achievements.",
    "collocation": "stay humble",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-011",
    "word": "give encouragement",
    "meaning": "động viên",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "She gave me encouragement before the exam.",
    "collocation": "give encouragement",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-01-012",
    "word": "look up to",
    "meaning": "ngưỡng mộ",
    "skills": [
      "speaking-part-2"
    ],
    "set": "01",
    "topics": [
      "a-person-who-inspires-you"
    ],
    "example": "I really look up to my grandfather.",
    "collocation": "look up to someone",
    "category": "A Person Who Inspires You"
  },
  {
    "id": "sp2-02-001",
    "word": "set off",
    "meaning": "khởi hành",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "We set off before sunrise.",
    "collocation": "set off early",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-002",
    "word": "scenic route",
    "meaning": "tuyến đường đẹp, có phong cảnh",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "We took a scenic route through the mountains.",
    "collocation": "take a scenic route",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-003",
    "word": "breathtaking view",
    "meaning": "khung cảnh ngoạn mục",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "The valley offered a breathtaking view.",
    "collocation": "a breathtaking view",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-004",
    "word": "local cuisine",
    "meaning": "ẩm thực địa phương",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "We tried local cuisine during the trip.",
    "collocation": "sample local cuisine",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-005",
    "word": "get lost",
    "meaning": "bị lạc đường",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "We got lost while exploring the old town.",
    "collocation": "get lost in a city",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-006",
    "word": "unexpected delay",
    "meaning": "sự chậm trễ bất ngờ",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "An unexpected delay changed our plans.",
    "collocation": "an unexpected delay",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-007",
    "word": "travel companion",
    "meaning": "người đồng hành trong chuyến đi",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "My cousin was a great travel companion.",
    "collocation": "a travel companion",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-008",
    "word": "unforgettable experience",
    "meaning": "trải nghiệm khó quên",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "The journey was an unforgettable experience.",
    "collocation": "an unforgettable experience",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-009",
    "word": "step out of my comfort zone",
    "meaning": "bước ra khỏi vùng an toàn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "Travelling alone made me step out of my comfort zone.",
    "collocation": "step out of one's comfort zone",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-010",
    "word": "take in the scenery",
    "meaning": "ngắm nhìn phong cảnh",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "We stopped to take in the scenery.",
    "collocation": "take in the scenery",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-011",
    "word": "fond memory",
    "meaning": "kỷ niệm đẹp",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "That trip remains a fond memory.",
    "collocation": "a fond memory",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-02-012",
    "word": "worth the effort",
    "meaning": "xứng đáng với công sức bỏ ra",
    "skills": [
      "speaking-part-2"
    ],
    "set": "02",
    "topics": [
      "a-memorable-journey"
    ],
    "example": "The long hike was worth the effort.",
    "collocation": "be worth the effort",
    "category": "A Memorable Journey"
  },
  {
    "id": "sp2-03-001",
    "word": "hidden gem",
    "meaning": "địa điểm đẹp nhưng ít người biết",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "The little café is a hidden gem in my city.",
    "collocation": "a hidden gem",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-002",
    "word": "peaceful surroundings",
    "meaning": "khung cảnh xung quanh yên bình",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "I love the peaceful surroundings of the lake.",
    "collocation": "peaceful surroundings",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-003",
    "word": "escape the hustle and bustle",
    "meaning": "tránh xa nhịp sống hối hả",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "I visit the park to escape the hustle and bustle.",
    "collocation": "escape the hustle and bustle",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-004",
    "word": "well-maintained",
    "meaning": "được bảo trì tốt",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "The public garden is well-maintained.",
    "collocation": "a well-maintained park",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-005",
    "word": "soak up the atmosphere",
    "meaning": "tận hưởng bầu không khí",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "I like to sit outside and soak up the atmosphere.",
    "collocation": "soak up the atmosphere",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-006",
    "word": "picturesque",
    "meaning": "đẹp như tranh",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "The village is picturesque in autumn.",
    "collocation": "a picturesque village",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-007",
    "word": "easy to get to",
    "meaning": "dễ đến, thuận tiện di chuyển",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "The museum is easy to get to by bus.",
    "collocation": "easy to get to",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-008",
    "word": "feel a sense of belonging",
    "meaning": "cảm thấy mình thuộc về nơi đó",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "I feel a sense of belonging whenever I visit.",
    "collocation": "feel a sense of belonging",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-009",
    "word": "take a stroll",
    "meaning": "đi dạo",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "I often take a stroll along the river.",
    "collocation": "take a stroll",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-010",
    "word": "local landmark",
    "meaning": "địa danh nổi bật của địa phương",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "The old bridge is a local landmark.",
    "collocation": "a local landmark",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-011",
    "word": "relaxing atmosphere",
    "meaning": "bầu không khí thư giãn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "The library has a relaxing atmosphere.",
    "collocation": "a relaxing atmosphere",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-03-012",
    "word": "keep coming back",
    "meaning": "liên tục muốn quay lại",
    "skills": [
      "speaking-part-2"
    ],
    "set": "03",
    "topics": [
      "a-place-you-enjoy-visiting"
    ],
    "example": "I keep coming back because it feels familiar.",
    "collocation": "keep coming back",
    "category": "A Place You Enjoy Visiting"
  },
  {
    "id": "sp2-04-001",
    "word": "come in handy",
    "meaning": "trở nên hữu ích khi cần",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "My tablet comes in handy when I travel.",
    "collocation": "come in handy",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-002",
    "word": "portable",
    "meaning": "dễ mang theo",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "The speaker is small and portable.",
    "collocation": "lightweight and portable",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-003",
    "word": "user-friendly",
    "meaning": "dễ sử dụng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "The device has a user-friendly interface.",
    "collocation": "a user-friendly interface",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-004",
    "word": "reliable",
    "meaning": "đáng tin cậy, hoạt động ổn định",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "My old laptop is still reliable.",
    "collocation": "a reliable device",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-005",
    "word": "long-lasting",
    "meaning": "bền, dùng được lâu",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "The battery is surprisingly long-lasting.",
    "collocation": "long-lasting battery",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-006",
    "word": "time-saving",
    "meaning": "tiết kiệm thời gian",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "This app is a time-saving tool.",
    "collocation": "a time-saving tool",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-007",
    "word": "multi-purpose",
    "meaning": "đa năng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "I use this multi-purpose device every day.",
    "collocation": "a multi-purpose device",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-008",
    "word": "practical gift",
    "meaning": "món quà thiết thực",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "My parents gave me a practical gift.",
    "collocation": "a practical gift",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-009",
    "word": "make life easier",
    "meaning": "giúp cuộc sống dễ dàng hơn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "My smartwatch makes life easier.",
    "collocation": "make life easier",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-010",
    "word": "replace an old model",
    "meaning": "thay thế mẫu cũ",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "I bought it to replace an old model.",
    "collocation": "replace an old model",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-011",
    "word": "good value for money",
    "meaning": "đáng với số tiền bỏ ra",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "The headphones are good value for money.",
    "collocation": "good value for money",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-04-012",
    "word": "use on a daily basis",
    "meaning": "sử dụng hằng ngày",
    "skills": [
      "speaking-part-2"
    ],
    "set": "04",
    "topics": [
      "a-useful-object-or-device"
    ],
    "example": "I use my e-reader on a daily basis.",
    "collocation": "use on a daily basis",
    "category": "A Useful Object or Device"
  },
  {
    "id": "sp2-05-001",
    "word": "steep learning curve",
    "meaning": "giai đoạn học ban đầu khó khăn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "Video editing had a steep learning curve for me.",
    "collocation": "a steep learning curve",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-002",
    "word": "trial and error",
    "meaning": "thử và sai để học",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I improved through trial and error.",
    "collocation": "learn by trial and error",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-003",
    "word": "pick up a skill",
    "meaning": "học được một kỹ năng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I picked up basic photography skills online.",
    "collocation": "pick up a skill",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-004",
    "word": "practice regularly",
    "meaning": "luyện tập đều đặn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I had to practice regularly to improve.",
    "collocation": "practice regularly",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-005",
    "word": "get the hang of",
    "meaning": "dần nắm được cách làm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "It took me a week to get the hang of it.",
    "collocation": "get the hang of something",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-006",
    "word": "make steady progress",
    "meaning": "tiến bộ đều đặn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I made steady progress after a month.",
    "collocation": "make steady progress",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-007",
    "word": "constructive feedback",
    "meaning": "phản hồi góp ý hữu ích",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "My teacher gave me constructive feedback.",
    "collocation": "receive constructive feedback",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-008",
    "word": "build confidence",
    "meaning": "xây dựng sự tự tin",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "Speaking in public helped me build confidence.",
    "collocation": "build confidence",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-009",
    "word": "master the basics",
    "meaning": "nắm vững kiến thức cơ bản",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I first tried to master the basics.",
    "collocation": "master the basics",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-010",
    "word": "overcome frustration",
    "meaning": "vượt qua cảm giác nản lòng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I had to overcome frustration at the start.",
    "collocation": "overcome frustration",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-011",
    "word": "sense of achievement",
    "meaning": "cảm giác thành tựu",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "Learning to swim gave me a sense of achievement.",
    "collocation": "a sense of achievement",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-05-012",
    "word": "put into practice",
    "meaning": "đưa vào thực hành",
    "skills": [
      "speaking-part-2"
    ],
    "set": "05",
    "topics": [
      "a-skill-you-learned"
    ],
    "example": "I now put the skill into practice at work.",
    "collocation": "put a skill into practice",
    "category": "A Skill You Learned"
  },
  {
    "id": "sp2-06-001",
    "word": "face a setback",
    "meaning": "gặp trở ngại",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I faced a setback halfway through the project.",
    "collocation": "face a setback",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-002",
    "word": "under pressure",
    "meaning": "chịu áp lực",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I had to perform under pressure.",
    "collocation": "work under pressure",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-003",
    "word": "stay focused",
    "meaning": "giữ tập trung",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I tried to stay focused on the main goal.",
    "collocation": "stay focused",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-004",
    "word": "come up with a solution",
    "meaning": "nghĩ ra giải pháp",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "We came up with a solution together.",
    "collocation": "come up with a solution",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-005",
    "word": "ask for advice",
    "meaning": "xin lời khuyên",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I asked my teacher for advice.",
    "collocation": "ask for advice",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-006",
    "word": "step by step",
    "meaning": "từng bước một",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I solved the problem step by step.",
    "collocation": "work step by step",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-007",
    "word": "bounce back",
    "meaning": "phục hồi sau thất bại",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I learned how to bounce back after failure.",
    "collocation": "bounce back from failure",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-008",
    "word": "determination",
    "meaning": "sự quyết tâm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "Determination helped me finish the race.",
    "collocation": "show determination",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-009",
    "word": "turning point",
    "meaning": "bước ngoặt",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "That conversation was a turning point for me.",
    "collocation": "a turning point",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-010",
    "word": "learn from mistakes",
    "meaning": "học từ sai lầm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "I learned from my mistakes.",
    "collocation": "learn from mistakes",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-011",
    "word": "rewarding",
    "meaning": "đáng công sức, đem lại sự hài lòng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "Finishing the project was rewarding.",
    "collocation": "a rewarding experience",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-06-012",
    "word": "personal growth",
    "meaning": "sự trưởng thành cá nhân",
    "skills": [
      "speaking-part-2"
    ],
    "set": "06",
    "topics": [
      "a-challenge-you-overcame"
    ],
    "example": "The challenge contributed to my personal growth.",
    "collocation": "personal growth",
    "category": "A Challenge You Overcame"
  },
  {
    "id": "sp2-07-001",
    "word": "special occasion",
    "meaning": "dịp đặc biệt",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "We decorated the house for a special occasion.",
    "collocation": "a special occasion",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-002",
    "word": "get together",
    "meaning": "tụ họp",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "My relatives got together for Tet.",
    "collocation": "get together with family",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-003",
    "word": "festive atmosphere",
    "meaning": "bầu không khí lễ hội",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "The streets had a festive atmosphere.",
    "collocation": "a festive atmosphere",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-004",
    "word": "make preparations",
    "meaning": "chuẩn bị",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "We made preparations a week in advance.",
    "collocation": "make preparations",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-005",
    "word": "family reunion",
    "meaning": "cuộc đoàn tụ gia đình",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "The holiday turned into a family reunion.",
    "collocation": "a family reunion",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-006",
    "word": "traditional custom",
    "meaning": "phong tục truyền thống",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "Giving lucky money is a traditional custom.",
    "collocation": "follow a traditional custom",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-007",
    "word": "exchange gifts",
    "meaning": "trao đổi quà",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "We exchanged gifts after dinner.",
    "collocation": "exchange gifts",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-008",
    "word": "memorable moment",
    "meaning": "khoảnh khắc đáng nhớ",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "The speech was the most memorable moment.",
    "collocation": "a memorable moment",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-009",
    "word": "mark a milestone",
    "meaning": "đánh dấu một cột mốc",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "The party marked an important milestone.",
    "collocation": "mark a milestone",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-010",
    "word": "heartfelt message",
    "meaning": "lời nhắn chân thành",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "My mother gave a heartfelt message.",
    "collocation": "a heartfelt message",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-011",
    "word": "celebrate together",
    "meaning": "ăn mừng cùng nhau",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "We celebrated together at home.",
    "collocation": "celebrate together",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-07-012",
    "word": "cherish the memory",
    "meaning": "trân trọng kỷ niệm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "07",
    "topics": [
      "a-celebration-or-special-event"
    ],
    "example": "I will always cherish the memory.",
    "collocation": "cherish the memory",
    "category": "A Celebration or Special Event"
  },
  {
    "id": "sp2-08-001",
    "word": "thoughtful gift",
    "meaning": "món quà tinh tế, chu đáo",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "It was a thoughtful gift from my best friend.",
    "collocation": "a thoughtful gift",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-002",
    "word": "sentimental value",
    "meaning": "giá trị tinh thần",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "The watch has great sentimental value.",
    "collocation": "have sentimental value",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-003",
    "word": "handmade",
    "meaning": "làm thủ công",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "She gave me a handmade birthday card.",
    "collocation": "a handmade gift",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-004",
    "word": "meaningful gesture",
    "meaning": "cử chỉ ý nghĩa",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "It was a small but meaningful gesture.",
    "collocation": "a meaningful gesture",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-005",
    "word": "take me by surprise",
    "meaning": "làm tôi bất ngờ",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "The gift took me by surprise.",
    "collocation": "take someone by surprise",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-006",
    "word": "personalised",
    "meaning": "được cá nhân hóa",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "My name was printed on the personalised notebook.",
    "collocation": "a personalised present",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-007",
    "word": "appreciate the effort",
    "meaning": "trân trọng công sức",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "I appreciated the effort she had put into it.",
    "collocation": "appreciate the effort",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-008",
    "word": "practical",
    "meaning": "thiết thực",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "The backpack was a practical present.",
    "collocation": "a practical gift",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-009",
    "word": "remind me of",
    "meaning": "gợi tôi nhớ tới",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "The photo reminds me of my childhood.",
    "collocation": "remind someone of something",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-010",
    "word": "treasure",
    "meaning": "trân trọng, giữ gìn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "I still treasure the letter she wrote.",
    "collocation": "treasure a gift",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-011",
    "word": "receive as a present",
    "meaning": "nhận làm quà",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "I received the camera as a present.",
    "collocation": "receive as a present",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-08-012",
    "word": "special to me",
    "meaning": "có ý nghĩa đặc biệt với tôi",
    "skills": [
      "speaking-part-2"
    ],
    "set": "08",
    "topics": [
      "a-gift-you-received"
    ],
    "example": "This little bracelet is special to me.",
    "collocation": "be special to someone",
    "category": "A Gift You Received"
  },
  {
    "id": "sp2-09-001",
    "word": "gripping storyline",
    "meaning": "cốt truyện hấp dẫn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The film has a gripping storyline.",
    "collocation": "a gripping storyline",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-002",
    "word": "main character",
    "meaning": "nhân vật chính",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The main character changes throughout the story.",
    "collocation": "the main character",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-003",
    "word": "plot twist",
    "meaning": "tình tiết bất ngờ",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The final plot twist surprised me.",
    "collocation": "an unexpected plot twist",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-004",
    "word": "thought-provoking",
    "meaning": "gợi suy nghĩ sâu sắc",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "I found the documentary thought-provoking.",
    "collocation": "a thought-provoking film",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-005",
    "word": "relatable",
    "meaning": "dễ đồng cảm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The characters are relatable to teenagers.",
    "collocation": "relatable characters",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-006",
    "word": "well-written",
    "meaning": "được viết tốt",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The novel is well-written and engaging.",
    "collocation": "a well-written novel",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-007",
    "word": "emotional ending",
    "meaning": "kết thúc xúc động",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The film has an emotional ending.",
    "collocation": "an emotional ending",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-008",
    "word": "based on a true story",
    "meaning": "dựa trên câu chuyện có thật",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The movie is based on a true story.",
    "collocation": "based on a true story",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-009",
    "word": "recommend to others",
    "meaning": "giới thiệu cho người khác",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "I would recommend the book to my friends.",
    "collocation": "recommend something to others",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-010",
    "word": "keep me hooked",
    "meaning": "giữ tôi bị cuốn hút",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The plot kept me hooked until the end.",
    "collocation": "keep someone hooked",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-011",
    "word": "life lesson",
    "meaning": "bài học cuộc sống",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "The story taught me a useful life lesson.",
    "collocation": "a valuable life lesson",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-09-012",
    "word": "read in one sitting",
    "meaning": "đọc một mạch",
    "skills": [
      "speaking-part-2"
    ],
    "set": "09",
    "topics": [
      "a-book-or-film-you-remember"
    ],
    "example": "I enjoyed the book so much that I read it in one sitting.",
    "collocation": "read in one sitting",
    "category": "A Book or Film You Remember"
  },
  {
    "id": "sp2-10-001",
    "word": "weigh up the options",
    "meaning": "cân nhắc các lựa chọn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I weighed up the options before choosing a course.",
    "collocation": "weigh up the options",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-002",
    "word": "pros and cons",
    "meaning": "ưu và nhược điểm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I made a list of the pros and cons.",
    "collocation": "consider the pros and cons",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-003",
    "word": "seek advice",
    "meaning": "tìm kiếm lời khuyên",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I sought advice from my parents.",
    "collocation": "seek advice from",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-004",
    "word": "make up my mind",
    "meaning": "quyết định dứt khoát",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "It took me weeks to make up my mind.",
    "collocation": "make up my mind",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-005",
    "word": "long-term goal",
    "meaning": "mục tiêu dài hạn",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I considered my long-term goals.",
    "collocation": "a long-term goal",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-006",
    "word": "take a risk",
    "meaning": "chấp nhận rủi ro",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I decided to take a risk and apply.",
    "collocation": "take a calculated risk",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-007",
    "word": "turn out well",
    "meaning": "có kết quả tốt",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "Fortunately, the decision turned out well.",
    "collocation": "turn out well",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-008",
    "word": "have second thoughts",
    "meaning": "đổi ý, phân vân lại",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I had second thoughts the night before.",
    "collocation": "have second thoughts",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-009",
    "word": "life-changing",
    "meaning": "thay đổi cuộc đời",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "It felt like a life-changing decision.",
    "collocation": "a life-changing decision",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-010",
    "word": "take responsibility",
    "meaning": "chịu trách nhiệm",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I wanted to take responsibility for my choice.",
    "collocation": "take responsibility",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-011",
    "word": "follow my instincts",
    "meaning": "làm theo trực giác",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "In the end, I followed my instincts.",
    "collocation": "follow my instincts",
    "category": "An Important Decision"
  },
  {
    "id": "sp2-10-012",
    "word": "look back on",
    "meaning": "nhìn lại, hồi tưởng",
    "skills": [
      "speaking-part-2"
    ],
    "set": "10",
    "topics": [
      "an-important-decision"
    ],
    "example": "I look back on that decision with pride.",
    "collocation": "look back on a decision",
    "category": "An Important Decision"
  }
];
window.VOCABULARY_DATA=(Array.isArray(window.VOCABULARY_DATA)?window.VOCABULARY_DATA:[]).filter(x=>!(Array.isArray(x.skills)&&x.skills.includes(skill)&&Object.keys({"10":{"label":"Bộ 10 · An Important Decision","titles":["Describe an important decision you made."]},"01":{"label":"Bộ 01 · A Person Who Inspires You","titles":["Describe a person you admire and explain why."]},"02":{"label":"Bộ 02 · A Memorable Journey","titles":["Describe a journey or trip you still remember."]},"03":{"label":"Bộ 03 · A Place You Enjoy Visiting","titles":["Describe a place you enjoy spending time in."]},"04":{"label":"Bộ 04 · A Useful Object or Device","titles":["Describe an object you use regularly and find useful."]},"05":{"label":"Bộ 05 · A Skill You Learned","titles":["Describe a skill you learned and how you learned it."]},"06":{"label":"Bộ 06 · A Challenge You Overcame","titles":["Describe a difficult challenge and how you dealt with it."]},"07":{"label":"Bộ 07 · A Celebration or Special Event","titles":["Describe a celebration that you enjoyed."]},"08":{"label":"Bộ 08 · A Gift You Received","titles":["Describe a gift that meant a lot to you."]},"09":{"label":"Bộ 09 · A Book or Film You Remember","titles":["Describe a book or film you found memorable."]}}).includes(String(x.set).padStart(2,"0"))));
window.VOCABULARY_DATA.push(...incoming);
window.VOCABULARY_SET_INFO ||= {};
window.VOCABULARY_SET_INFO[skill]={...(window.VOCABULARY_SET_INFO[skill]||{}),...{
  "10": {
    "label": "Bộ 10 · An Important Decision",
    "titles": [
      "Describe an important decision you made."
    ]
  },
  "01": {
    "label": "Bộ 01 · A Person Who Inspires You",
    "titles": [
      "Describe a person you admire and explain why."
    ]
  },
  "02": {
    "label": "Bộ 02 · A Memorable Journey",
    "titles": [
      "Describe a journey or trip you still remember."
    ]
  },
  "03": {
    "label": "Bộ 03 · A Place You Enjoy Visiting",
    "titles": [
      "Describe a place you enjoy spending time in."
    ]
  },
  "04": {
    "label": "Bộ 04 · A Useful Object or Device",
    "titles": [
      "Describe an object you use regularly and find useful."
    ]
  },
  "05": {
    "label": "Bộ 05 · A Skill You Learned",
    "titles": [
      "Describe a skill you learned and how you learned it."
    ]
  },
  "06": {
    "label": "Bộ 06 · A Challenge You Overcame",
    "titles": [
      "Describe a difficult challenge and how you dealt with it."
    ]
  },
  "07": {
    "label": "Bộ 07 · A Celebration or Special Event",
    "titles": [
      "Describe a celebration that you enjoyed."
    ]
  },
  "08": {
    "label": "Bộ 08 · A Gift You Received",
    "titles": [
      "Describe a gift that meant a lot to you."
    ]
  },
  "09": {
    "label": "Bộ 09 · A Book or Film You Remember",
    "titles": [
      "Describe a book or film you found memorable."
    ]
  }
}};
})();
