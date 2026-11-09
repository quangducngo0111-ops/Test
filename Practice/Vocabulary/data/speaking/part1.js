/* IELTS Speaking Part 1 | 10 topics | 120 original items. */
(function(){
const skill="speaking-part-1";
const incoming=[
  {
    "id": "sp1-01-001",
    "word": "hometown",
    "meaning": "quê hương, nơi mình lớn lên",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "I grew up in a small coastal hometown.",
    "collocation": "my hometown",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-002",
    "word": "residential area",
    "meaning": "khu dân cư",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "I live in a quiet residential area.",
    "collocation": "a quiet residential area",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-003",
    "word": "convenient location",
    "meaning": "vị trí thuận tiện",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "My neighbourhood has a convenient location near the station.",
    "collocation": "a convenient location",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-004",
    "word": "within walking distance",
    "meaning": "trong khoảng cách đi bộ",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "There is a supermarket within walking distance of my home.",
    "collocation": "within walking distance of",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-005",
    "word": "local amenities",
    "meaning": "tiện ích địa phương",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "The area has useful local amenities, such as parks and clinics.",
    "collocation": "access to local amenities",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-006",
    "word": "peaceful atmosphere",
    "meaning": "không khí yên bình",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "I enjoy the peaceful atmosphere in my hometown.",
    "collocation": "a peaceful atmosphere",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-007",
    "word": "rush hour",
    "meaning": "giờ cao điểm",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "The roads are crowded during rush hour.",
    "collocation": "during rush hour",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-008",
    "word": "close-knit community",
    "meaning": "cộng đồng gắn bó",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "My neighbours form a close-knit community.",
    "collocation": "a close-knit community",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-009",
    "word": "green space",
    "meaning": "không gian xanh",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "Our neighbourhood needs more green space.",
    "collocation": "more green space",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-010",
    "word": "lively neighbourhood",
    "meaning": "khu phố nhộn nhịp",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "I enjoy living in a lively neighbourhood.",
    "collocation": "a lively neighbourhood",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-011",
    "word": "local market",
    "meaning": "chợ địa phương",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "I often buy fresh food at the local market.",
    "collocation": "visit a local market",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-01-012",
    "word": "move away",
    "meaning": "chuyển đi nơi khác",
    "skills": [
      "speaking-part-1"
    ],
    "set": "01",
    "topics": [
      "hometown-neighbourhood"
    ],
    "example": "I might move away for university in the future.",
    "collocation": "move away from home",
    "category": "Hometown & Neighbourhood"
  },
  {
    "id": "sp1-02-001",
    "word": "apartment building",
    "meaning": "tòa nhà chung cư",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "My family lives in an apartment building.",
    "collocation": "a modern apartment building",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-002",
    "word": "spacious",
    "meaning": "rộng rãi",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "Our living room is fairly spacious.",
    "collocation": "a spacious room",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-003",
    "word": "cosy",
    "meaning": "ấm cúng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "My bedroom is small but cosy.",
    "collocation": "a cosy bedroom",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-004",
    "word": "natural light",
    "meaning": "ánh sáng tự nhiên",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "The large windows let in plenty of natural light.",
    "collocation": "plenty of natural light",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-005",
    "word": "living space",
    "meaning": "không gian sinh hoạt",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "We have enough living space for the whole family.",
    "collocation": "comfortable living space",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-006",
    "word": "shared bedroom",
    "meaning": "phòng ngủ chung",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "I used to share a bedroom with my brother.",
    "collocation": "share a bedroom",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-007",
    "word": "household chores",
    "meaning": "việc nhà",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "I help my parents with household chores.",
    "collocation": "do household chores",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-008",
    "word": "tidy up",
    "meaning": "dọn dẹp gọn gàng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "I tidy up my desk before studying.",
    "collocation": "tidy up the room",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-009",
    "word": "furniture",
    "meaning": "đồ nội thất",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "Most of the furniture is made of wood.",
    "collocation": "wooden furniture",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-010",
    "word": "balcony",
    "meaning": "ban công",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "I grow a few plants on the balcony.",
    "collocation": "a small balcony",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-011",
    "word": "feel at home",
    "meaning": "cảm thấy như ở nhà",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "I feel at home as soon as I walk through the door.",
    "collocation": "make someone feel at home",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-02-012",
    "word": "renovate",
    "meaning": "cải tạo, sửa sang",
    "skills": [
      "speaking-part-1"
    ],
    "set": "02",
    "topics": [
      "home-accommodation"
    ],
    "example": "My parents want to renovate the kitchen.",
    "collocation": "renovate a house",
    "category": "Home & Accommodation"
  },
  {
    "id": "sp1-03-001",
    "word": "major in",
    "meaning": "học chuyên ngành",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I plan to major in economics.",
    "collocation": "major in economics",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-002",
    "word": "coursework",
    "meaning": "bài tập và công việc của khóa học",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I usually finish my coursework at weekends.",
    "collocation": "complete coursework",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-003",
    "word": "meet deadlines",
    "meaning": "hoàn thành đúng hạn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I make a schedule to meet deadlines.",
    "collocation": "meet a deadline",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-004",
    "word": "study schedule",
    "meaning": "thời gian biểu học tập",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "A study schedule helps me stay organised.",
    "collocation": "follow a study schedule",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-005",
    "word": "take notes",
    "meaning": "ghi chép",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I take notes during lectures.",
    "collocation": "take detailed notes",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-006",
    "word": "hands-on experience",
    "meaning": "kinh nghiệm thực hành",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "My internship gave me hands-on experience.",
    "collocation": "gain hands-on experience",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-007",
    "word": "part-time job",
    "meaning": "công việc bán thời gian",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I have a part-time job at a café.",
    "collocation": "do a part-time job",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-008",
    "word": "workload",
    "meaning": "khối lượng công việc",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "My workload gets heavier before exams.",
    "collocation": "a heavy workload",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-009",
    "word": "teamwork",
    "meaning": "làm việc nhóm",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "Group projects improve my teamwork skills.",
    "collocation": "develop teamwork skills",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-010",
    "word": "career path",
    "meaning": "định hướng nghề nghiệp",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I am still exploring my career path.",
    "collocation": "choose a career path",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-011",
    "word": "productive",
    "meaning": "làm việc, học tập hiệu quả",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I feel most productive in the morning.",
    "collocation": "feel productive",
    "category": "Study & Work"
  },
  {
    "id": "sp1-03-012",
    "word": "practical skills",
    "meaning": "kỹ năng thực tế",
    "skills": [
      "speaking-part-1"
    ],
    "set": "03",
    "topics": [
      "study-work"
    ],
    "example": "I want to learn practical skills at university.",
    "collocation": "develop practical skills",
    "category": "Study & Work"
  },
  {
    "id": "sp1-04-001",
    "word": "daily routine",
    "meaning": "thói quen hằng ngày",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "My daily routine starts with a short walk.",
    "collocation": "follow a daily routine",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-002",
    "word": "early riser",
    "meaning": "người dậy sớm",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I am an early riser on weekdays.",
    "collocation": "be an early riser",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-003",
    "word": "night owl",
    "meaning": "người thức khuya",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "My sister is a night owl.",
    "collocation": "be a night owl",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-004",
    "word": "get ready",
    "meaning": "chuẩn bị sẵn sàng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I need half an hour to get ready for school.",
    "collocation": "get ready for school",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-005",
    "word": "make time for",
    "meaning": "dành thời gian cho",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I try to make time for exercise.",
    "collocation": "make time for hobbies",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-006",
    "word": "put off",
    "meaning": "trì hoãn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I sometimes put off difficult tasks.",
    "collocation": "put off doing homework",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-007",
    "word": "stay organised",
    "meaning": "sắp xếp có tổ chức",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "A calendar helps me stay organised.",
    "collocation": "stay organised",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-008",
    "word": "time-consuming",
    "meaning": "tốn thời gian",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "Commuting can be time-consuming.",
    "collocation": "a time-consuming task",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-009",
    "word": "take a break",
    "meaning": "nghỉ giải lao",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I take a break after an hour of studying.",
    "collocation": "take a short break",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-010",
    "word": "unwind",
    "meaning": "thư giãn sau căng thẳng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I listen to music to unwind after class.",
    "collocation": "unwind after work",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-011",
    "word": "stick to a schedule",
    "meaning": "tuân thủ lịch trình",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I try to stick to a schedule on weekdays.",
    "collocation": "stick to a schedule",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-04-012",
    "word": "spare time",
    "meaning": "thời gian rảnh",
    "skills": [
      "speaking-part-1"
    ],
    "set": "04",
    "topics": [
      "daily-routine-time"
    ],
    "example": "I read novels in my spare time.",
    "collocation": "in my spare time",
    "category": "Daily Routine & Time"
  },
  {
    "id": "sp1-05-001",
    "word": "be keen on",
    "meaning": "rất thích, hứng thú với",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I am keen on photography.",
    "collocation": "be keen on photography",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-002",
    "word": "take up a hobby",
    "meaning": "bắt đầu một sở thích",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I took up painting last year.",
    "collocation": "take up a new hobby",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-003",
    "word": "creative outlet",
    "meaning": "cách thể hiện sự sáng tạo",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "Drawing is a creative outlet for me.",
    "collocation": "a creative outlet",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-004",
    "word": "recharge my batteries",
    "meaning": "nạp lại năng lượng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "A weekend in the countryside helps me recharge my batteries.",
    "collocation": "recharge my batteries",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-005",
    "word": "get absorbed in",
    "meaning": "mải mê, say sưa với",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I get absorbed in a good book.",
    "collocation": "get absorbed in a book",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-006",
    "word": "outdoor activities",
    "meaning": "hoạt động ngoài trời",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I enjoy outdoor activities such as cycling.",
    "collocation": "enjoy outdoor activities",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-007",
    "word": "keep fit",
    "meaning": "giữ dáng, giữ sức khỏe",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I go swimming to keep fit.",
    "collocation": "keep fit",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-008",
    "word": "socialise",
    "meaning": "giao lưu, gặp gỡ",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I like to socialise with friends at weekends.",
    "collocation": "socialise with friends",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-009",
    "word": "relieve stress",
    "meaning": "giảm căng thẳng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "Playing the guitar helps me relieve stress.",
    "collocation": "relieve stress",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-010",
    "word": "pick up a skill",
    "meaning": "học được một kỹ năng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I picked up basic cooking skills online.",
    "collocation": "pick up a new skill",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-011",
    "word": "lose track of time",
    "meaning": "quên mất thời gian",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "I lose track of time when I paint.",
    "collocation": "lose track of time",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-05-012",
    "word": "sense of achievement",
    "meaning": "cảm giác đạt được thành tựu",
    "skills": [
      "speaking-part-1"
    ],
    "set": "05",
    "topics": [
      "hobbies-free-time"
    ],
    "example": "Finishing a puzzle gives me a sense of achievement.",
    "collocation": "a sense of achievement",
    "category": "Hobbies & Free Time"
  },
  {
    "id": "sp1-06-001",
    "word": "home-cooked meal",
    "meaning": "bữa ăn nấu tại nhà",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I prefer a home-cooked meal to takeaway food.",
    "collocation": "a home-cooked meal",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-002",
    "word": "signature dish",
    "meaning": "món ăn đặc trưng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "Pho is one of the signature dishes of Vietnamese cuisine.",
    "collocation": "a signature dish",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-003",
    "word": "fresh ingredients",
    "meaning": "nguyên liệu tươi",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I try to cook with fresh ingredients.",
    "collocation": "use fresh ingredients",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-004",
    "word": "balanced diet",
    "meaning": "chế độ ăn cân bằng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I try to maintain a balanced diet.",
    "collocation": "maintain a balanced diet",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-005",
    "word": "picky eater",
    "meaning": "người kén ăn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I was a picky eater as a child.",
    "collocation": "be a picky eater",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-006",
    "word": "comfort food",
    "meaning": "món ăn đem lại cảm giác dễ chịu",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "Noodle soup is my favourite comfort food.",
    "collocation": "favourite comfort food",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-007",
    "word": "eat out",
    "meaning": "ăn ở nhà hàng, quán ăn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "My family eats out once a week.",
    "collocation": "eat out at weekends",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-008",
    "word": "prepare a meal",
    "meaning": "chuẩn bị một bữa ăn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I prepare a simple meal after school.",
    "collocation": "prepare a meal",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-009",
    "word": "seasoning",
    "meaning": "gia vị",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "My mother uses very little seasoning.",
    "collocation": "add seasoning",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-010",
    "word": "have a sweet tooth",
    "meaning": "thích đồ ngọt",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I have a sweet tooth, especially for chocolate.",
    "collocation": "have a sweet tooth",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-011",
    "word": "local speciality",
    "meaning": "đặc sản địa phương",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "Bun cha is a popular local speciality in Hanoi.",
    "collocation": "a local speciality",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-06-012",
    "word": "grab a quick bite",
    "meaning": "ăn nhanh một chút",
    "skills": [
      "speaking-part-1"
    ],
    "set": "06",
    "topics": [
      "food-cooking"
    ],
    "example": "I often grab a quick bite before class.",
    "collocation": "grab a quick bite",
    "category": "Food & Cooking"
  },
  {
    "id": "sp1-07-001",
    "word": "shop around",
    "meaning": "tham khảo nhiều nơi trước khi mua",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I usually shop around before buying electronics.",
    "collocation": "shop around for a bargain",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-002",
    "word": "good value for money",
    "meaning": "đáng tiền",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "This jacket is good value for money.",
    "collocation": "good value for money",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-003",
    "word": "fit perfectly",
    "meaning": "vừa vặn hoàn hảo",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "These shoes fit perfectly.",
    "collocation": "fit perfectly",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-004",
    "word": "casual outfit",
    "meaning": "trang phục thường ngày",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I usually wear a casual outfit to class.",
    "collocation": "a casual outfit",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-005",
    "word": "dress up",
    "meaning": "ăn mặc đẹp, trang trọng hơn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I dress up for family celebrations.",
    "collocation": "dress up for an event",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-006",
    "word": "try on",
    "meaning": "mặc thử",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I always try on shoes before buying them.",
    "collocation": "try on clothes",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-007",
    "word": "impulse purchase",
    "meaning": "món đồ mua bốc đồng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I try to avoid impulse purchases.",
    "collocation": "make an impulse purchase",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-008",
    "word": "compare prices",
    "meaning": "so sánh giá",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I compare prices on different websites.",
    "collocation": "compare prices",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-009",
    "word": "return an item",
    "meaning": "trả lại món hàng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I returned an item because it was damaged.",
    "collocation": "return an item",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-010",
    "word": "second-hand",
    "meaning": "đồ đã qua sử dụng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I sometimes buy second-hand books.",
    "collocation": "second-hand clothes",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-011",
    "word": "personal style",
    "meaning": "phong cách cá nhân",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I prefer simple clothes that suit my personal style.",
    "collocation": "develop a personal style",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-07-012",
    "word": "on sale",
    "meaning": "đang giảm giá",
    "skills": [
      "speaking-part-1"
    ],
    "set": "07",
    "topics": [
      "shopping-clothes"
    ],
    "example": "I bought this shirt when it was on sale.",
    "collocation": "be on sale",
    "category": "Shopping & Clothes"
  },
  {
    "id": "sp1-08-001",
    "word": "commute to school",
    "meaning": "đi lại hằng ngày đến trường",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "I commute to school by bus.",
    "collocation": "commute to school",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-002",
    "word": "public transport",
    "meaning": "giao thông công cộng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "I use public transport almost every day.",
    "collocation": "reliable public transport",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-003",
    "word": "traffic congestion",
    "meaning": "ùn tắc giao thông",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "Traffic congestion is common during rush hour.",
    "collocation": "heavy traffic congestion",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-004",
    "word": "catch a bus",
    "meaning": "bắt xe buýt",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "I catch a bus near my house.",
    "collocation": "catch a bus",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-005",
    "word": "get stuck in traffic",
    "meaning": "bị kẹt xe",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "I sometimes get stuck in traffic after school.",
    "collocation": "get stuck in traffic",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-006",
    "word": "affordable fare",
    "meaning": "giá vé phải chăng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "The metro has an affordable fare.",
    "collocation": "affordable fare",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-007",
    "word": "walking distance",
    "meaning": "khoảng cách có thể đi bộ",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "The station is within walking distance.",
    "collocation": "within walking distance",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-008",
    "word": "cycle to work",
    "meaning": "đạp xe đi làm",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "My father sometimes cycles to work.",
    "collocation": "cycle to work",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-009",
    "word": "eco-friendly transport",
    "meaning": "phương tiện thân thiện môi trường",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "Cycling is a form of eco-friendly transport.",
    "collocation": "eco-friendly transport",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-010",
    "word": "convenient route",
    "meaning": "tuyến đường thuận tiện",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "This is the most convenient route to my campus.",
    "collocation": "a convenient route",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-011",
    "word": "traffic jam",
    "meaning": "tắc đường",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "I left early to avoid a traffic jam.",
    "collocation": "avoid traffic jams",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-08-012",
    "word": "travel time",
    "meaning": "thời gian di chuyển",
    "skills": [
      "speaking-part-1"
    ],
    "set": "08",
    "topics": [
      "transport-commuting"
    ],
    "example": "The new bridge has reduced my travel time.",
    "collocation": "reduce travel time",
    "category": "Transport & Commuting"
  },
  {
    "id": "sp1-09-001",
    "word": "user-friendly",
    "meaning": "dễ sử dụng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I prefer apps with a user-friendly design.",
    "collocation": "a user-friendly app",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-002",
    "word": "stay connected",
    "meaning": "giữ liên lạc",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "Messaging apps help me stay connected with friends.",
    "collocation": "stay connected with",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-003",
    "word": "screen time",
    "meaning": "thời gian nhìn màn hình",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I try to reduce my screen time at night.",
    "collocation": "reduce screen time",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-004",
    "word": "scroll through",
    "meaning": "lướt qua nội dung",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I sometimes scroll through social media before bed.",
    "collocation": "scroll through social media",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-005",
    "word": "video call",
    "meaning": "cuộc gọi video",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I often make video calls to my grandparents.",
    "collocation": "make a video call",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-006",
    "word": "handy",
    "meaning": "tiện dụng",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "My phone is handy for checking bus times.",
    "collocation": "come in handy",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-007",
    "word": "digital distraction",
    "meaning": "sự xao nhãng từ thiết bị số",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "Notifications can become a digital distraction.",
    "collocation": "avoid digital distractions",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-008",
    "word": "battery life",
    "meaning": "thời lượng pin",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "Battery life matters when I choose a phone.",
    "collocation": "long battery life",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-009",
    "word": "take a screenshot",
    "meaning": "chụp ảnh màn hình",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I take a screenshot of useful information.",
    "collocation": "take a screenshot",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-010",
    "word": "look something up",
    "meaning": "tra cứu thông tin",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I look up unfamiliar words on my phone.",
    "collocation": "look something up online",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-011",
    "word": "rely on technology",
    "meaning": "phụ thuộc vào công nghệ",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I rely on technology for my studies.",
    "collocation": "rely on technology",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-09-012",
    "word": "turn off notifications",
    "meaning": "tắt thông báo",
    "skills": [
      "speaking-part-1"
    ],
    "set": "09",
    "topics": [
      "technology-phones"
    ],
    "example": "I turn off notifications when I revise.",
    "collocation": "turn off notifications",
    "category": "Technology & Phones"
  },
  {
    "id": "sp1-10-001",
    "word": "get along with",
    "meaning": "hòa hợp với",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "I get along with my older sister.",
    "collocation": "get along with someone",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-002",
    "word": "keep in touch",
    "meaning": "giữ liên lạc",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "We keep in touch after graduating.",
    "collocation": "keep in touch with",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-003",
    "word": "have a lot in common",
    "meaning": "có nhiều điểm chung",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "My best friend and I have a lot in common.",
    "collocation": "have a lot in common",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-004",
    "word": "supportive",
    "meaning": "biết ủng hộ, động viên",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "My parents are very supportive.",
    "collocation": "a supportive friend",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-005",
    "word": "quality time",
    "meaning": "thời gian ý nghĩa bên nhau",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "We spend quality time together on Sundays.",
    "collocation": "spend quality time",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-006",
    "word": "close friend",
    "meaning": "bạn thân",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "I have known my close friend since primary school.",
    "collocation": "a close friend",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-007",
    "word": "family gathering",
    "meaning": "buổi sum họp gia đình",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "We have a family gathering at Tet.",
    "collocation": "a family gathering",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-008",
    "word": "share interests",
    "meaning": "có chung sở thích",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "My cousin and I share similar interests.",
    "collocation": "share interests",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-009",
    "word": "look up to",
    "meaning": "ngưỡng mộ, noi theo",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "I look up to my older brother.",
    "collocation": "look up to someone",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-010",
    "word": "reliable",
    "meaning": "đáng tin cậy",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "She is reliable when I need help.",
    "collocation": "a reliable friend",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-011",
    "word": "cheer someone up",
    "meaning": "làm ai vui hơn",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "My friends cheer me up when I feel down.",
    "collocation": "cheer someone up",
    "category": "Friends & Family"
  },
  {
    "id": "sp1-10-012",
    "word": "stay close",
    "meaning": "duy trì sự thân thiết",
    "skills": [
      "speaking-part-1"
    ],
    "set": "10",
    "topics": [
      "friends-family"
    ],
    "example": "We have stayed close for years.",
    "collocation": "stay close to someone",
    "category": "Friends & Family"
  }
];
window.VOCABULARY_DATA=(Array.isArray(window.VOCABULARY_DATA)?window.VOCABULARY_DATA:[]).filter(x=>!(Array.isArray(x.skills)&&x.skills.includes(skill)&&Object.keys({"10":{"label":"Bộ 10 · Friends & Family","titles":["What do you enjoy doing with your friends?"]},"01":{"label":"Bộ 01 · Hometown & Neighbourhood","titles":["What do you like most about your hometown?"]},"02":{"label":"Bộ 02 · Home & Accommodation","titles":["What is your favourite room at home?"]},"03":{"label":"Bộ 03 · Study & Work","titles":["What subject do you enjoy studying?"]},"04":{"label":"Bộ 04 · Daily Routine & Time","titles":["Do you prefer mornings or evenings?"]},"05":{"label":"Bộ 05 · Hobbies & Free Time","titles":["What do you usually do in your free time?"]},"06":{"label":"Bộ 06 · Food & Cooking","titles":["Do you enjoy cooking at home?"]},"07":{"label":"Bộ 07 · Shopping & Clothes","titles":["Do you prefer shopping online or in stores?"]},"08":{"label":"Bộ 08 · Transport & Commuting","titles":["How do you usually travel around your city?"]},"09":{"label":"Bộ 09 · Technology & Phones","titles":["What do you usually use your phone for?"]}}).includes(String(x.set).padStart(2,"0"))));
window.VOCABULARY_DATA.push(...incoming);
window.VOCABULARY_SET_INFO ||= {};
window.VOCABULARY_SET_INFO[skill]={...(window.VOCABULARY_SET_INFO[skill]||{}),...{
  "10": {
    "label": "Bộ 10 · Friends & Family",
    "titles": [
      "What do you enjoy doing with your friends?"
    ]
  },
  "01": {
    "label": "Bộ 01 · Hometown & Neighbourhood",
    "titles": [
      "What do you like most about your hometown?"
    ]
  },
  "02": {
    "label": "Bộ 02 · Home & Accommodation",
    "titles": [
      "What is your favourite room at home?"
    ]
  },
  "03": {
    "label": "Bộ 03 · Study & Work",
    "titles": [
      "What subject do you enjoy studying?"
    ]
  },
  "04": {
    "label": "Bộ 04 · Daily Routine & Time",
    "titles": [
      "Do you prefer mornings or evenings?"
    ]
  },
  "05": {
    "label": "Bộ 05 · Hobbies & Free Time",
    "titles": [
      "What do you usually do in your free time?"
    ]
  },
  "06": {
    "label": "Bộ 06 · Food & Cooking",
    "titles": [
      "Do you enjoy cooking at home?"
    ]
  },
  "07": {
    "label": "Bộ 07 · Shopping & Clothes",
    "titles": [
      "Do you prefer shopping online or in stores?"
    ]
  },
  "08": {
    "label": "Bộ 08 · Transport & Commuting",
    "titles": [
      "How do you usually travel around your city?"
    ]
  },
  "09": {
    "label": "Bộ 09 · Technology & Phones",
    "titles": [
      "What do you usually use your phone for?"
    ]
  }
}};
})();
