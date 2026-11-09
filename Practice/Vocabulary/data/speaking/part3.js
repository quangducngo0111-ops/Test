/* IELTS Speaking Part 3 | 10 discussion topics | 120 original items. */
(function(){
const skill="speaking-part-3";
const incoming=[
  {
    "id": "sp3-01-001",
    "word": "equal access to education",
    "meaning": "tiếp cận giáo dục bình đẳng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Governments should promote equal access to education.",
    "collocation": "ensure equal access to education",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-002",
    "word": "critical thinking",
    "meaning": "tư duy phản biện",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Schools should help pupils develop critical thinking.",
    "collocation": "develop critical thinking",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-003",
    "word": "lifelong learning",
    "meaning": "học tập suốt đời",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Lifelong learning is important in a changing economy.",
    "collocation": "promote lifelong learning",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-004",
    "word": "learning outcomes",
    "meaning": "kết quả học tập",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Teaching quality affects learning outcomes.",
    "collocation": "improve learning outcomes",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-005",
    "word": "practical skills",
    "meaning": "kỹ năng thực tế",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Students need practical skills as well as theory.",
    "collocation": "teach practical skills",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-006",
    "word": "rote learning",
    "meaning": "học thuộc lòng máy móc",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Rote learning alone may not develop creativity.",
    "collocation": "rely on rote learning",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-007",
    "word": "educational inequality",
    "meaning": "bất bình đẳng giáo dục",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Digital access can reduce educational inequality.",
    "collocation": "address educational inequality",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-008",
    "word": "curriculum",
    "meaning": "chương trình học",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "The school curriculum should reflect modern needs.",
    "collocation": "update the curriculum",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-009",
    "word": "teacher guidance",
    "meaning": "sự hướng dẫn của giáo viên",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Teacher guidance remains important for young learners.",
    "collocation": "provide teacher guidance",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-010",
    "word": "digital literacy",
    "meaning": "năng lực số",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Digital literacy is becoming an essential skill.",
    "collocation": "develop digital literacy",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-011",
    "word": "independent learning",
    "meaning": "học tập tự chủ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Online courses can encourage independent learning.",
    "collocation": "support independent learning",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-01-012",
    "word": "assessment methods",
    "meaning": "phương pháp đánh giá",
    "skills": [
      "speaking-part-3"
    ],
    "set": "01",
    "topics": [
      "education-learning"
    ],
    "example": "Schools should use varied assessment methods.",
    "collocation": "improve assessment methods",
    "category": "Education & Learning"
  },
  {
    "id": "sp3-02-001",
    "word": "technological advancement",
    "meaning": "tiến bộ công nghệ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Technological advancement has changed daily life.",
    "collocation": "rapid technological advancement",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-002",
    "word": "digital divide",
    "meaning": "khoảng cách số",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "The digital divide affects rural communities.",
    "collocation": "bridge the digital divide",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-003",
    "word": "data privacy",
    "meaning": "quyền riêng tư dữ liệu",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "People are increasingly concerned about data privacy.",
    "collocation": "protect data privacy",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-004",
    "word": "automation",
    "meaning": "tự động hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Automation may change the demand for certain jobs.",
    "collocation": "increased automation",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-005",
    "word": "online interaction",
    "meaning": "tương tác trực tuyến",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Online interaction cannot replace every face-to-face conversation.",
    "collocation": "online interaction",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-006",
    "word": "social isolation",
    "meaning": "sự cô lập xã hội",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Too much screen time can contribute to social isolation.",
    "collocation": "reduce social isolation",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-007",
    "word": "access to information",
    "meaning": "khả năng tiếp cận thông tin",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "The internet improves access to information.",
    "collocation": "improve access to information",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-008",
    "word": "artificial intelligence",
    "meaning": "trí tuệ nhân tạo",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Artificial intelligence can support routine tasks.",
    "collocation": "use artificial intelligence",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-009",
    "word": "digital addiction",
    "meaning": "nghiện công nghệ số",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Digital addiction is a growing concern for some families.",
    "collocation": "prevent digital addiction",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-010",
    "word": "adapt to change",
    "meaning": "thích nghi với thay đổi",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Workers need to adapt to technological change.",
    "collocation": "adapt to change",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-011",
    "word": "online security",
    "meaning": "an ninh trực tuyến",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Better online security protects personal accounts.",
    "collocation": "improve online security",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-02-012",
    "word": "human connection",
    "meaning": "kết nối giữa con người",
    "skills": [
      "speaking-part-3"
    ],
    "set": "02",
    "topics": [
      "technology-society"
    ],
    "example": "Technology should strengthen human connection.",
    "collocation": "maintain human connection",
    "category": "Technology & Society"
  },
  {
    "id": "sp3-03-001",
    "word": "carbon footprint",
    "meaning": "dấu chân carbon",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Using public transport can reduce our carbon footprint.",
    "collocation": "reduce a carbon footprint",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-002",
    "word": "renewable energy",
    "meaning": "năng lượng tái tạo",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Renewable energy can lower dependence on fossil fuels.",
    "collocation": "invest in renewable energy",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-003",
    "word": "single-use plastic",
    "meaning": "nhựa dùng một lần",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Many cities are reducing single-use plastic.",
    "collocation": "reduce single-use plastic",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-004",
    "word": "waste management",
    "meaning": "quản lý chất thải",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Effective waste management keeps cities cleaner.",
    "collocation": "improve waste management",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-005",
    "word": "environmental awareness",
    "meaning": "nhận thức về môi trường",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Schools can raise environmental awareness.",
    "collocation": "raise environmental awareness",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-006",
    "word": "sustainable lifestyle",
    "meaning": "lối sống bền vững",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Small habits can support a sustainable lifestyle.",
    "collocation": "adopt a sustainable lifestyle",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-007",
    "word": "public transport",
    "meaning": "giao thông công cộng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Better public transport can reduce car use.",
    "collocation": "invest in public transport",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-008",
    "word": "energy efficiency",
    "meaning": "hiệu suất năng lượng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Energy efficiency can lower household bills.",
    "collocation": "improve energy efficiency",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-009",
    "word": "biodiversity",
    "meaning": "đa dạng sinh học",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Habitat destruction threatens biodiversity.",
    "collocation": "protect biodiversity",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-010",
    "word": "conservation efforts",
    "meaning": "nỗ lực bảo tồn",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Conservation efforts require long-term funding.",
    "collocation": "support conservation efforts",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-011",
    "word": "government regulation",
    "meaning": "quy định của chính phủ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "Government regulation can limit industrial pollution.",
    "collocation": "introduce government regulation",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-03-012",
    "word": "long-term impact",
    "meaning": "tác động dài hạn",
    "skills": [
      "speaking-part-3"
    ],
    "set": "03",
    "topics": [
      "environment-sustainability"
    ],
    "example": "We should consider the long-term impact of consumption.",
    "collocation": "consider the long-term impact",
    "category": "Environment & Sustainability"
  },
  {
    "id": "sp3-04-001",
    "word": "work-life balance",
    "meaning": "cân bằng công việc và cuộc sống",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Flexible hours can improve work-life balance.",
    "collocation": "maintain work-life balance",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-002",
    "word": "job security",
    "meaning": "sự ổn định công việc",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Many workers value job security.",
    "collocation": "provide job security",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-003",
    "word": "remote working",
    "meaning": "làm việc từ xa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Remote working can reduce commuting time.",
    "collocation": "offer remote working",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-004",
    "word": "career development",
    "meaning": "phát triển sự nghiệp",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Companies should support career development.",
    "collocation": "support career development",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-005",
    "word": "labour market",
    "meaning": "thị trường lao động",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Technology is reshaping the labour market.",
    "collocation": "changing labour market",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-006",
    "word": "skills gap",
    "meaning": "khoảng cách thiếu hụt kỹ năng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Training programmes can address the skills gap.",
    "collocation": "address the skills gap",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-007",
    "word": "employee well-being",
    "meaning": "sức khỏe, phúc lợi người lao động",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Employers should prioritise employee well-being.",
    "collocation": "improve employee well-being",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-008",
    "word": "productivity",
    "meaning": "năng suất",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Better tools can improve productivity.",
    "collocation": "increase productivity",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-009",
    "word": "income inequality",
    "meaning": "bất bình đẳng thu nhập",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Income inequality can affect social mobility.",
    "collocation": "reduce income inequality",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-010",
    "word": "professional training",
    "meaning": "đào tạo chuyên môn",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Professional training helps workers stay competitive.",
    "collocation": "provide professional training",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-011",
    "word": "flexible working hours",
    "meaning": "giờ làm việc linh hoạt",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Flexible working hours can benefit parents.",
    "collocation": "introduce flexible working hours",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-04-012",
    "word": "career prospects",
    "meaning": "triển vọng nghề nghiệp",
    "skills": [
      "speaking-part-3"
    ],
    "set": "04",
    "topics": [
      "work-employment"
    ],
    "example": "Graduates seek jobs with good career prospects.",
    "collocation": "improve career prospects",
    "category": "Work & Employment"
  },
  {
    "id": "sp3-05-001",
    "word": "urbanisation",
    "meaning": "đô thị hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Rapid urbanisation puts pressure on public services.",
    "collocation": "rapid urbanisation",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-002",
    "word": "traffic congestion",
    "meaning": "ùn tắc giao thông",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Traffic congestion wastes time and fuel.",
    "collocation": "reduce traffic congestion",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-003",
    "word": "public infrastructure",
    "meaning": "cơ sở hạ tầng công cộng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Cities need reliable public infrastructure.",
    "collocation": "invest in public infrastructure",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-004",
    "word": "affordable housing",
    "meaning": "nhà ở giá phải chăng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Affordable housing is a challenge in large cities.",
    "collocation": "provide affordable housing",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-005",
    "word": "urban planning",
    "meaning": "quy hoạch đô thị",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Good urban planning can improve quality of life.",
    "collocation": "effective urban planning",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-006",
    "word": "population density",
    "meaning": "mật độ dân số",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "High population density can strain local facilities.",
    "collocation": "high population density",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-007",
    "word": "pedestrian-friendly",
    "meaning": "thân thiện với người đi bộ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Cities should create more pedestrian-friendly streets.",
    "collocation": "pedestrian-friendly streets",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-008",
    "word": "green spaces",
    "meaning": "không gian xanh",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Green spaces make urban life healthier.",
    "collocation": "protect green spaces",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-009",
    "word": "public services",
    "meaning": "dịch vụ công",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Public services must keep pace with population growth.",
    "collocation": "improve public services",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-010",
    "word": "air pollution",
    "meaning": "ô nhiễm không khí",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Traffic is a major source of urban air pollution.",
    "collocation": "reduce air pollution",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-011",
    "word": "transport network",
    "meaning": "mạng lưới giao thông",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "An efficient transport network helps commuters.",
    "collocation": "improve a transport network",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-05-012",
    "word": "quality of life",
    "meaning": "chất lượng cuộc sống",
    "skills": [
      "speaking-part-3"
    ],
    "set": "05",
    "topics": [
      "cities-transport"
    ],
    "example": "Better city design improves quality of life.",
    "collocation": "improve quality of life",
    "category": "Cities & Transport"
  },
  {
    "id": "sp3-06-001",
    "word": "consumer behaviour",
    "meaning": "hành vi tiêu dùng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Advertising can influence consumer behaviour.",
    "collocation": "influence consumer behaviour",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-002",
    "word": "target audience",
    "meaning": "khách hàng, đối tượng mục tiêu",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Advertisers tailor messages to a target audience.",
    "collocation": "reach a target audience",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-003",
    "word": "brand awareness",
    "meaning": "mức độ nhận biết thương hiệu",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Social media campaigns can raise brand awareness.",
    "collocation": "increase brand awareness",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-004",
    "word": "misleading claims",
    "meaning": "tuyên bố gây hiểu nhầm",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Regulators should challenge misleading claims.",
    "collocation": "make misleading claims",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-005",
    "word": "social media influence",
    "meaning": "ảnh hưởng của mạng xã hội",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Social media influence is strong among teenagers.",
    "collocation": "social media influence",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-006",
    "word": "impulse buying",
    "meaning": "mua sắm bốc đồng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Targeted ads may encourage impulse buying.",
    "collocation": "encourage impulse buying",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-007",
    "word": "media literacy",
    "meaning": "năng lực hiểu và đánh giá truyền thông",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Media literacy helps people recognise unreliable information.",
    "collocation": "develop media literacy",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-008",
    "word": "sponsored content",
    "meaning": "nội dung tài trợ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Sponsored content should be clearly labelled.",
    "collocation": "label sponsored content",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-009",
    "word": "personalised advertising",
    "meaning": "quảng cáo cá nhân hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Personalised advertising raises privacy concerns.",
    "collocation": "use personalised advertising",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-010",
    "word": "public opinion",
    "meaning": "dư luận",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Media coverage can shape public opinion.",
    "collocation": "shape public opinion",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-011",
    "word": "trustworthy source",
    "meaning": "nguồn đáng tin cậy",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Readers should check whether a source is trustworthy.",
    "collocation": "a trustworthy source",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-06-012",
    "word": "commercial pressure",
    "meaning": "áp lực thương mại",
    "skills": [
      "speaking-part-3"
    ],
    "set": "06",
    "topics": [
      "media-advertising"
    ],
    "example": "Commercial pressure may affect media priorities.",
    "collocation": "face commercial pressure",
    "category": "Media & Advertising"
  },
  {
    "id": "sp3-07-001",
    "word": "cultural heritage",
    "meaning": "di sản văn hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Museums help preserve cultural heritage.",
    "collocation": "preserve cultural heritage",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-002",
    "word": "sense of identity",
    "meaning": "ý thức về bản sắc",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Local traditions give people a sense of identity.",
    "collocation": "a sense of identity",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-003",
    "word": "pass down traditions",
    "meaning": "truyền lại truyền thống",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Families pass down traditions to younger generations.",
    "collocation": "pass down traditions",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-004",
    "word": "intergenerational gap",
    "meaning": "khoảng cách thế hệ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "The intergenerational gap can affect cultural attitudes.",
    "collocation": "bridge the intergenerational gap",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-005",
    "word": "cultural diversity",
    "meaning": "đa dạng văn hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Travel can increase appreciation of cultural diversity.",
    "collocation": "celebrate cultural diversity",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-006",
    "word": "traditional craftsmanship",
    "meaning": "nghề thủ công truyền thống",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Traditional craftsmanship needs skilled apprentices.",
    "collocation": "preserve traditional craftsmanship",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-007",
    "word": "modern influences",
    "meaning": "ảnh hưởng hiện đại",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Modern influences can change cultural practices.",
    "collocation": "modern influences",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-008",
    "word": "community festival",
    "meaning": "lễ hội cộng đồng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Community festivals bring residents together.",
    "collocation": "organise community festivals",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-009",
    "word": "historical significance",
    "meaning": "ý nghĩa lịch sử",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Old buildings may have historical significance.",
    "collocation": "historical significance",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-010",
    "word": "cultural exchange",
    "meaning": "giao lưu văn hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "International events promote cultural exchange.",
    "collocation": "promote cultural exchange",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-011",
    "word": "local customs",
    "meaning": "phong tục địa phương",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Visitors should respect local customs.",
    "collocation": "respect local customs",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-07-012",
    "word": "authentic experience",
    "meaning": "trải nghiệm chân thực",
    "skills": [
      "speaking-part-3"
    ],
    "set": "07",
    "topics": [
      "culture-traditions"
    ],
    "example": "Tourists often look for an authentic experience.",
    "collocation": "an authentic cultural experience",
    "category": "Culture & Traditions"
  },
  {
    "id": "sp3-08-001",
    "word": "preventive healthcare",
    "meaning": "chăm sóc sức khỏe dự phòng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Preventive healthcare can reduce long-term costs.",
    "collocation": "invest in preventive healthcare",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-002",
    "word": "balanced diet",
    "meaning": "chế độ ăn cân bằng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "A balanced diet supports long-term health.",
    "collocation": "maintain a balanced diet",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-003",
    "word": "sedentary lifestyle",
    "meaning": "lối sống ít vận động",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "A sedentary lifestyle can harm physical health.",
    "collocation": "a sedentary lifestyle",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-004",
    "word": "mental well-being",
    "meaning": "sức khỏe tinh thần",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Social support can improve mental well-being.",
    "collocation": "support mental well-being",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-005",
    "word": "public health campaign",
    "meaning": "chiến dịch sức khỏe cộng đồng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Public health campaigns can raise awareness.",
    "collocation": "launch a public health campaign",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-006",
    "word": "regular exercise",
    "meaning": "tập thể dục đều đặn",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Regular exercise can improve sleep.",
    "collocation": "do regular exercise",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-007",
    "word": "healthy habits",
    "meaning": "thói quen lành mạnh",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Children should develop healthy habits early.",
    "collocation": "develop healthy habits",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-008",
    "word": "healthcare access",
    "meaning": "khả năng tiếp cận y tế",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Rural residents may have limited healthcare access.",
    "collocation": "improve healthcare access",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-009",
    "word": "stress management",
    "meaning": "quản lý căng thẳng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Stress management should be taught in schools.",
    "collocation": "stress management techniques",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-010",
    "word": "health education",
    "meaning": "giáo dục sức khỏe",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Health education can help people make informed choices.",
    "collocation": "provide health education",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-011",
    "word": "life expectancy",
    "meaning": "tuổi thọ trung bình",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Better healthcare has increased life expectancy.",
    "collocation": "increase life expectancy",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-08-012",
    "word": "personal responsibility",
    "meaning": "trách nhiệm cá nhân",
    "skills": [
      "speaking-part-3"
    ],
    "set": "08",
    "topics": [
      "health-lifestyles"
    ],
    "example": "Personal responsibility matters, but so do public services.",
    "collocation": "take personal responsibility",
    "category": "Health & Lifestyles"
  },
  {
    "id": "sp3-09-001",
    "word": "social support",
    "meaning": "sự hỗ trợ xã hội",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Strong social support can improve mental health.",
    "collocation": "provide social support",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-002",
    "word": "community involvement",
    "meaning": "sự tham gia của cộng đồng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Community involvement strengthens local ties.",
    "collocation": "encourage community involvement",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-003",
    "word": "generation gap",
    "meaning": "khoảng cách thế hệ",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "The generation gap can lead to misunderstandings.",
    "collocation": "bridge the generation gap",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-004",
    "word": "shared responsibility",
    "meaning": "trách nhiệm chung",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Caring for elderly relatives is often a shared responsibility.",
    "collocation": "share responsibility",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-005",
    "word": "family bonds",
    "meaning": "mối gắn kết gia đình",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Regular conversations can strengthen family bonds.",
    "collocation": "strengthen family bonds",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-006",
    "word": "social cohesion",
    "meaning": "sự gắn kết xã hội",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Community activities can improve social cohesion.",
    "collocation": "promote social cohesion",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-007",
    "word": "voluntary work",
    "meaning": "công việc tình nguyện",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Voluntary work brings people together.",
    "collocation": "do voluntary work",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-008",
    "word": "mutual respect",
    "meaning": "sự tôn trọng lẫn nhau",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Mutual respect helps families resolve conflict.",
    "collocation": "show mutual respect",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-009",
    "word": "elderly care",
    "meaning": "chăm sóc người cao tuổi",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Elderly care is an increasing priority.",
    "collocation": "provide elderly care",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-010",
    "word": "work commitments",
    "meaning": "trách nhiệm, lịch trình công việc",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Work commitments can limit family time.",
    "collocation": "balance work commitments",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-011",
    "word": "sense of belonging",
    "meaning": "cảm giác thuộc về",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Local clubs can create a sense of belonging.",
    "collocation": "foster a sense of belonging",
    "category": "Family & Community"
  },
  {
    "id": "sp3-09-012",
    "word": "strong relationships",
    "meaning": "mối quan hệ bền chặt",
    "skills": [
      "speaking-part-3"
    ],
    "set": "09",
    "topics": [
      "family-community"
    ],
    "example": "Trust helps people build strong relationships.",
    "collocation": "build strong relationships",
    "category": "Family & Community"
  },
  {
    "id": "sp3-10-001",
    "word": "local economy",
    "meaning": "kinh tế địa phương",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Tourism can bring income to the local economy.",
    "collocation": "support the local economy",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-002",
    "word": "seasonal employment",
    "meaning": "việc làm theo mùa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Tourism often creates seasonal employment.",
    "collocation": "create seasonal employment",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-003",
    "word": "overtourism",
    "meaning": "du lịch quá tải",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Overtourism can damage historic city centres.",
    "collocation": "problems caused by overtourism",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-004",
    "word": "cultural exchange",
    "meaning": "giao lưu văn hóa",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "International tourism encourages cultural exchange.",
    "collocation": "promote cultural exchange",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-005",
    "word": "tourist attraction",
    "meaning": "điểm thu hút khách du lịch",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "The old town is a popular tourist attraction.",
    "collocation": "a major tourist attraction",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-006",
    "word": "sustainable tourism",
    "meaning": "du lịch bền vững",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Sustainable tourism aims to protect local resources.",
    "collocation": "promote sustainable tourism",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-007",
    "word": "local residents",
    "meaning": "người dân địa phương",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Tourism planning should consider local residents.",
    "collocation": "benefit local residents",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-008",
    "word": "environmental pressure",
    "meaning": "áp lực lên môi trường",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Popular destinations face growing environmental pressure.",
    "collocation": "reduce environmental pressure",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-009",
    "word": "visitor numbers",
    "meaning": "lượng khách tham quan",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Authorities may need to manage visitor numbers.",
    "collocation": "manage visitor numbers",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-010",
    "word": "hospitality industry",
    "meaning": "ngành dịch vụ lưu trú, nhà hàng",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "The hospitality industry provides many jobs.",
    "collocation": "work in the hospitality industry",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-011",
    "word": "travel restrictions",
    "meaning": "hạn chế đi lại",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Travel restrictions can affect tourism businesses.",
    "collocation": "introduce travel restrictions",
    "category": "Tourism & Travel"
  },
  {
    "id": "sp3-10-012",
    "word": "responsible travel",
    "meaning": "du lịch có trách nhiệm",
    "skills": [
      "speaking-part-3"
    ],
    "set": "10",
    "topics": [
      "tourism-travel"
    ],
    "example": "Responsible travel includes respecting local customs.",
    "collocation": "encourage responsible travel",
    "category": "Tourism & Travel"
  }
];
window.VOCABULARY_DATA=(Array.isArray(window.VOCABULARY_DATA)?window.VOCABULARY_DATA:[]).filter(x=>!(Array.isArray(x.skills)&&x.skills.includes(skill)&&Object.keys({"10":{"label":"Bộ 10 · Tourism & Travel","titles":["What are the benefits and drawbacks of international tourism?"]},"01":{"label":"Bộ 01 · Education & Learning","titles":["Should schools focus more on practical skills?"]},"02":{"label":"Bộ 02 · Technology & Society","titles":["Has technology improved the way people communicate?"]},"03":{"label":"Bộ 03 · Environment & Sustainability","titles":["What can individuals do to protect the environment?"]},"04":{"label":"Bộ 04 · Work & Employment","titles":["How might workplaces change in the future?"]},"05":{"label":"Bộ 05 · Cities & Transport","titles":["What are the biggest problems facing modern cities?"]},"06":{"label":"Bộ 06 · Media & Advertising","titles":["How does advertising influence people's choices?"]},"07":{"label":"Bộ 07 · Culture & Traditions","titles":["Should traditional customs be preserved?"]},"08":{"label":"Bộ 08 · Health & Lifestyles","titles":["Who should be responsible for promoting healthy lifestyles?"]},"09":{"label":"Bộ 09 · Family & Community","titles":["How have family relationships changed over time?"]}}).includes(String(x.set).padStart(2,"0"))));
window.VOCABULARY_DATA.push(...incoming);
window.VOCABULARY_SET_INFO ||= {};
window.VOCABULARY_SET_INFO[skill]={...(window.VOCABULARY_SET_INFO[skill]||{}),...{
  "10": {
    "label": "Bộ 10 · Tourism & Travel",
    "titles": [
      "What are the benefits and drawbacks of international tourism?"
    ]
  },
  "01": {
    "label": "Bộ 01 · Education & Learning",
    "titles": [
      "Should schools focus more on practical skills?"
    ]
  },
  "02": {
    "label": "Bộ 02 · Technology & Society",
    "titles": [
      "Has technology improved the way people communicate?"
    ]
  },
  "03": {
    "label": "Bộ 03 · Environment & Sustainability",
    "titles": [
      "What can individuals do to protect the environment?"
    ]
  },
  "04": {
    "label": "Bộ 04 · Work & Employment",
    "titles": [
      "How might workplaces change in the future?"
    ]
  },
  "05": {
    "label": "Bộ 05 · Cities & Transport",
    "titles": [
      "What are the biggest problems facing modern cities?"
    ]
  },
  "06": {
    "label": "Bộ 06 · Media & Advertising",
    "titles": [
      "How does advertising influence people's choices?"
    ]
  },
  "07": {
    "label": "Bộ 07 · Culture & Traditions",
    "titles": [
      "Should traditional customs be preserved?"
    ]
  },
  "08": {
    "label": "Bộ 08 · Health & Lifestyles",
    "titles": [
      "Who should be responsible for promoting healthy lifestyles?"
    ]
  },
  "09": {
    "label": "Bộ 09 · Family & Community",
    "titles": [
      "How have family relationships changed over time?"
    ]
  }
}};
})();
