/* ============================================
   WRITING TASK 1 · MAPS
   13 BÀI LUYỆN VIẾT
============================================ */

(function () {
  "use strict";

  /*
    Mỗi bài gồm:
    - mã bài
    - số thứ tự
    - đường dẫn ảnh
    - tiêu đề
    - dạng sơ đồ
    - đề bài
    - yêu cầu luyện viết
    - các thông tin để nhận xét tự động
    - cụm từ gợi ý
  */

  const rows = [

    [
      "city-harbour",
      1,
      "./images/image1.png",
      "City & Harbour",
      "Bố cục đô thị",
      "The map shows the location of several facilities in a town. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      "Describe at least five facilities, using compass directions and position phrases. Aim for around 150 words.",
      [
        ["The port is in the southern part of the city.",["port"],["south","southern"]],
        ["The river runs along the eastern side of the city.",["river"],["east","eastern"]],
        ["The residential area is in the north-western section.",["residential"],["north-west","north west","northern","north"]],
        ["The school is in the northern part of town.",["school"],["north","northern"]],
        ["The hospital lies west of the shopping centre.",["hospital","shopping"],["west","western"]],
        ["The park is near the river, east of the school.",["park","river"],["east","eastern","near","beside"]]
      ],
      [
        "in the north of",
        "in the south of",
        "to the east of",
        "be located",
        "along"
      ]
    ],

    [
      "forest-district",
      2,
      "./images/image3.png",
      "Forest District",
      "Vị trí theo góc",
      "The map illustrates the location of a forest and several public facilities in a city. Summarise the main spatial features and relationships.",
      "Describe the forest, residential area, school, hospital, park, library and river, without inventing changes over time.",
      [
        ["The forest occupies the north-eastern corner.",["forest"],["north-east","northeast","north eastern"]],
        ["The residential area is in the north-western section.",["residential"],["north-west","northwest"]],
        ["The school stands between the residential area and the forest.",["school"],["between","north","northern"]],
        ["The park is located east of the hospital.",["park"],["east","eastern"]],
        ["The river runs along the southern edge.",["river"],["south","southern"]],
        ["The library occupies the south-eastern district.",["library"],["south-east","southeast","south"]]
      ],
      [
        "in the north-eastern corner of",
        "occupy",
        "to the east of",
        "in the southern part of"
      ]
    ],

    [
      "arts-centre",
      3,
      "./images/image5.png",
      "Arts Centre",
      "Quan hệ vị trí",
      "The plan shows an arts centre and its surrounding facilities. Describe the layout and how the facilities are positioned relative to each other.",
      "Use at least four expressions of relative location, such as beside, north of, adjacent to and on the eastern side.",
      [
        ["The arts centre is in the central part of the plan.",["arts centre"],["centre","center","middle","central"]],
        ["Two galleries are on the eastern side of the arts centre.",["galler"],["east","eastern","right"]],
        ["The library lies to the north-west of the arts centre.",["library"],["north-west","northwest"]],
        ["The museum is west or south-west of the arts centre.",["museum"],["west","western"]],
        ["The café is in the northern part of the complex.",["cafe","café"],["north","northern"]],
        ["The car park is to the south of the arts centre.",["car park","parking"],["south","southern"]]
      ],
      [
        "on the eastern side of",
        "adjacent to",
        "to the north-west of",
        "in the centre of"
      ]
    ],

    [
      "library-plan",
      4,
      "./images/image6.png",
      "Library Floor Plan",
      "Sơ đồ bên trong",
      "The floor plan presents the arrangement of different areas inside a library. Summarise the main layout, including the location of the central desk and rooms.",
      "Organise the description from the centre outward, using precise expressions rather than listing every label.",
      [
        ["The information desk is in the centre of the building.",["information desk"],["centre","center","central","middle"]],
        ["The reading area is to the north-west of the desk.",["reading"],["north-west","northwest","upper left"]],
        ["The computer area is in the north-eastern section.",["computer"],["north-east","northeast","upper right"]],
        ["The study rooms are on the western side.",["study room"],["west","western","left"]],
        ["The meeting room is on the eastern side.",["meeting room"],["east","eastern","right"]],
        ["The book sections are to the south of the desk.",["book section","fiction","non-fiction"],["south","southern","bottom"]]
      ],
      [
        "in the centre of",
        "to the north-east of",
        "opposite",
        "be positioned"
      ]
    ],

    [
      "botanical-gardens",
      5,
      "./images/image8.png",
      "Botanical Gardens",
      "Đối diện & cạnh nhau",
      "The plan shows a public garden with several recreational facilities. Describe the layout, focusing on the position of the rose garden and glasshouse.",
      "Compare the positions of the gardens, fountain, pond, playground, café and entrance.",
      [
        ["The rose garden stands opposite the glasshouse.",["rose garden","glasshouse"],["opposite","across"]],
        ["The fountain occupies the centre of the garden.",["fountain"],["centre","center","middle","central"]],
        ["The pond is in the north-eastern area.",["pond"],["north-east","northeast","north"]],
        ["The playground occupies the north-western area.",["playground"],["north-west","northwest","north"]],
        ["The café is in the south-eastern area.",["cafe","café"],["south-east","southeast","south"]],
        ["The main entrance is at the southern end.",["entrance"],["south","southern","bottom"]]
      ],
      [
        "opposite",
        "across from",
        "adjacent to",
        "in the centre of"
      ]
    ],

    [
      "theatre",
      6,
      "./images/image10.png",
      "Theatre Seating Plan",
      "Bao quanh",
      "The plan depicts the seating arrangement and facilities in a theatre. Describe the layout, highlighting the position of the stage and surrounding seating.",
      "Mention the stage, seating areas, lobby and surrounding rooms using suitable map vocabulary.",
      [
        ["The stage occupies the centre of the theatre.",["stage"],["centre","center","middle","central"]],
        ["The stage is surrounded by the seating areas.",["stage","seating"],["surround","around","encircle"]],
        ["The lobby is in the northern part of the theatre.",["lobby"],["north","northern","top"]],
        ["The cloakroom lies to the north-east.",["cloakroom"],["north-east","northeast","north"]],
        ["The washrooms lie to the north-west.",["washroom"],["north-west","northwest","north"]],
        ["Exits are located at the southern end.",["exit"],["south","southern","bottom"]]
      ],
      [
        "surrounded by",
        "in the centre of",
        "be located",
        "at the southern end of"
      ]
    ],

    [
      "main-road",
      7,
      "./images/image11.png",
      "Main Road Shops",
      "Dọc theo",
      "The map shows a town with shops along a main road and several public buildings. Summarise the arrangement of the town.",
      "Include the row of shops, main road and the contrasting areas north and south of it.",
      [
        ["Several shops stand along the main road.",["shop"],["along","alongside","road"]],
        ["A school is to the north-west of the shops.",["school"],["north-west","northwest","north"]],
        ["The park is on the northern side of the road.",["park"],["north","northern"]],
        ["The hospital lies to the north-east.",["hospital"],["north-east","northeast","north"]],
        ["The library is on the southern side of the road.",["library"],["south","southern"]],
        ["A parking lot and post office lie south of the road.",["parking","post office"],["south","southern"]]
      ],
      [
        "along",
        "on the northern side of",
        "on the southern side of",
        "be situated"
      ]
    ],

    [
      "public-campus",
      8,
      "./images/image12.png",
      "Public Campus",
      "Các công trình trong khu",
      "The plan depicts a campus with public facilities and a garden. Summarise the layout of the site, selecting the most important spatial relationships.",
      "Describe the facilities across the north, west, east and south of the site and explain what occupies the centre.",
      [
        ["The library, main building and café are positioned along the northern end.",["library","main building","cafe","café"],["north","northern","top"]],
        ["The garden and fountain occupy the centre of the site.",["garden","fountain"],["centre","center","middle","central"]],
        ["The sports centre and tennis courts occupy the western section.",["sports","tennis"],["west","western","left"]],
        ["The exhibition hall and playground are on the eastern side.",["exhibition","playground"],["east","eastern","right"]],
        ["A car park lies at the southern end.",["car park","parking"],["south","southern","bottom"]]
      ],
      [
        "at the northern end of",
        "in the centre of",
        "on the eastern side of",
        "at the southern end of"
      ]
    ],

    [
      "river-village",
      9,
      "./images/image13.png",
      "River Village",
      "Sông chạy qua làng",
      "The map illustrates a village divided by a river and crossed by a main road. Summarise how the public buildings, shops and open spaces are arranged.",
      "Explain how the river and main road shape the village, then describe key facilities in each district.",
      [
        ["The river runs through the village from north to south.",["river"],["through","north","south","divide"]],
        ["The main road runs across the village.",["main road","road"],["across","through","east","west"]],
        ["Shops are located along the main road.",["shop"],["along","alongside","road"]],
        ["The residential area is in the north-west.",["residential"],["north-west","northwest"]],
        ["The hospital is in the north-east.",["hospital"],["north-east","northeast"]],
        ["The library is south of the main road.",["library"],["south","southern"]],
        ["The post office is to the south-east.",["post office"],["south-east","southeast","south"]]
      ],
      [
        "run through",
        "run across",
        "divide ... into ...",
        "along",
        "to the south of"
      ]
    ],

    [
      "university-city",
      10,
      "./images/image2.png",
      "University City",
      "Vị trí công trình",
      "The map shows a university and several facilities in a riverside city. Summarise the main spatial features.",
      "Describe the university, residential area, park, shopping centre, stadium, port and river.",
      [
        ["The university is in the north-eastern corner of the city.",["university"],["north-east","northeast"]],
        ["The residential area is in the north-west.",["residential"],["north-west","northwest"]],
        ["The park lies to the south-east of the city centre.",["park"],["south-east","southeast","east"]],
        ["The port occupies the southernmost area.",["port"],["south","southern"]],
        ["The river is on the eastern side of the city.",["river"],["east","eastern"]]
      ],
      [
        "in the north-eastern corner of",
        "to the south-east of",
        "on the eastern side of"
      ]
    ],

    [
      "market-roundabout",
      11,
      "./images/image4.png",
      "Market & Roundabout",
      "Vị trí tương đối",
      "The plan illustrates a city centred on a roundabout, with a market and a number of amenities. Describe the position of the amenities in relation to the city centre.",
      "Explain where the market, school, hospital, park, stadium and river are situated.",
      [
        ["The city centre or roundabout is in the middle of the map.",["roundabout","city centre"],["middle","centre","center","central"]],
        ["The market is west of the city centre.",["market"],["west","western"]],
        ["The school lies north of the roundabout.",["school"],["north","northern"]],
        ["The hospital is east of the roundabout.",["hospital"],["east","eastern"]],
        ["The stadium occupies the south-eastern district.",["stadium"],["south-east","southeast","south"]],
        ["The river runs along the eastern edge.",["river"],["east","eastern"]]
      ],
      [
        "to the west of",
        "in the centre of",
        "on the eastern side of"
      ]
    ],

    [
      "station-district",
      12,
      "./images/image7.png",
      "Station District",
      "Giữa & liền kề",
      "The map shows a town with a station, university, city centre and several other public facilities. Summarise the town layout.",
      "Focus on the station’s position relative to the university and city centre.",
      [
        ["The station lies between the university and city centre.",["station"],["between","midway"]],
        ["The university is to the west of the station.",["university"],["west","western"]],
        ["The city centre is east of the station.",["city centre"],["east","eastern"]],
        ["The hospital is in the western part of the middle row.",["hospital"],["west","western"]],
        ["The park is in the centre of the middle row.",["park"],["centre","center","middle"]],
        ["The river borders the southern edge.",["river"],["south","southern"]]
      ],
      [
        "between",
        "midway between",
        "to the east of",
        "be situated"
      ]
    ],

    [
      "museum-gardens",
      13,
      "./images/image9.png",
      "Museum Gardens",
      "Đối diện & tiếp giáp",
      "The map presents the facilities of a cultural and recreational park. Summarise the arrangement around the central fountain.",
      "Include the position of the museum, playground, library, garden, café and gallery.",
      [
        ["The fountain is at the centre of the park.",["fountain"],["centre","center","middle","central"]],
        ["The playground occupies the north-western section.",["playground"],["north-west","northwest"]],
        ["The museum is in the north-eastern section.",["museum"],["north-east","northeast"]],
        ["The gallery and café are adjacent on the eastern side.",["gallery","cafe","café"],["adjacent","next to","east","eastern"]],
        ["The car park is at the south-western corner.",["car park","parking"],["south-west","southwest"]],
        ["The rest area is in the south-eastern corner.",["rest area"],["south-east","southeast"]]
      ],
      [
        "adjacent to",
        "opposite",
        "in the north-eastern corner of",
        "in the centre of"
      ]
    ]

  ];

  /*
    Chuyển dữ liệu ở trên sang cấu trúc
    mà trang maps/index.html sử dụng.
  */

  window.MAPS_WRITING_TASKS = rows.map(
    ([
      id,
      number,
      image,
      title,
      type,
      prompt,
      instruction,
      factRows,
      suggestions
    ]) => ({

      id,
      number,
      image,
      title,
      type,
      prompt,
      instruction,

      facts: factRows.map(
        ([
          label,
          keywords,
          places
        ]) => ({
          label,
          keywords,
          places
        })
      ),

      suggestions

    })
  );

})();
