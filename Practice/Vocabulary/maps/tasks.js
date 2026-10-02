/* Các hình đều được lấy nguyên gốc từ Bài tập (1).docx của giáo viên.
   Các bản đồ là ảnh tĩnh: không tự tạo thông tin before/after. */
window.MAPS_WRITING_TASKS = [
  {
    id:'city-harbour', number:1, image:'./images/image1.png', title:'City & Harbour', type:'Bố cục đô thị',
    prompt:'The map shows the location of several facilities in a town. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instruction:'Describe at least five facilities, using compass directions and position phrases. Aim for around 150 words.',
    facts:[
      {label:'The port is in the southern part of the city.',keywords:['port'],places:['south','southern']},
      {label:'The river runs along the eastern side of the city.',keywords:['river'],places:['east','eastern']},
      {label:'The residential area is in the north-western section.',keywords:['residential'],places:['north-west','north west','northern','north']},
      {label:'The school is in the northern part of town.',keywords:['school'],places:['north','northern']},
      {label:'The hospital lies west of the shopping centre.',keywords:['hospital','shopping'],places:['west','western']},
      {label:'The park is near the river, east of the school.',keywords:['park','river'],places:['east','eastern','near','beside']}
    ],
    suggestions:['in the north of','in the south of','to the east of','be located','along']
  },

  {
    id:'forest-district', number:2, image:'./images/image3.png', title:'Forest District', type:'Vị trí theo góc',
    prompt:'The map illustrates the location of a forest and several public facilities in a city. Summarise the main spatial features and relationships.',
    instruction:'Describe the forest, residential area, school, hospital, park, library and river, without inventing changes over time.',
    facts:[
      {label:'The forest occupies the north-eastern corner.',keywords:['forest'],places:['north-east','northeast','north eastern']},
      {label:'The residential area is in the north-western section.',keywords:['residential'],places:['north-west','northwest']},
      {label:'The school stands between the residential area and the forest.',keywords:['school'],places:['between','north','northern']},
      {label:'The park is located east of the hospital.',keywords:['park'],places:['east','eastern']},
      {label:'The river runs along the southern edge.',keywords:['river'],places:['south','southern']},
      {label:'The library occupies the south-eastern district.',keywords:['library'],places:['south-east','southeast','south']}
    ],
    suggestions:['in the north-eastern corner of','occupy','to the east of','in the southern part of']
  },

  {
    id:'arts-centre', number:3, image:'./images/image5.png', title:'Arts Centre', type:'Quan hệ vị trí',
    prompt:'The plan shows an arts centre and its surrounding facilities. Describe the layout and how the facilities are positioned relative to each other.',
    instruction:'Use at least four expressions of relative location, such as beside, north of, adjacent to and on the eastern side.',
    facts:[
      {label:'The arts centre is in the central part of the plan.',keywords:['arts centre'],places:['centre','center','middle','central']},
      {label:'Two galleries are on the eastern side of the arts centre.',keywords:['galler'],places:['east','eastern','right']},
      {label:'The library lies to the north-west of the arts centre.',keywords:['library'],places:['north-west','northwest']},
      {label:'The museum is west or south-west of the arts centre.',keywords:['museum'],places:['west','western']},
      {label:'The café is in the northern part of the complex.',keywords:['cafe','café'],places:['north','northern']},
      {label:'The car park is to the south of the arts centre.',keywords:['car park','parking'],places:['south','southern']}
    ],
    suggestions:['on the eastern side of','adjacent to','to the north-west of','in the centre of']
  },

  {
    id:'library-plan', number:4, image:'./images/image6.png', title:'Library Floor Plan', type:'Sơ đồ bên trong',
    prompt:'The floor plan presents the arrangement of different areas inside a library. Summarise the main layout, including the location of the central desk and rooms.',
    instruction:'Organise the description from the centre outward, using precise expressions rather than listing every label.',
    facts:[
      {label:'The information desk is in the centre of the building.',keywords:['information desk'],places:['centre','center','central','middle']},
      {label:'The reading area is to the north-west of the desk.',keywords:['reading'],places:['north-west','northwest','upper left']},
      {label:'The computer area is in the north-eastern section.',keywords:['computer'],places:['north-east','northeast','upper right']},
      {label:'The study rooms are on the western side.',keywords:['study room'],places:['west','western','left']},
      {label:'The meeting room is on the eastern side.',keywords:['meeting room'],places:['east','eastern','right']},
      {label:'The book sections are to the south of the desk.',keywords:['book section','fiction','non-fiction'],places:['south','southern','bottom']}
    ],
    suggestions:['in the centre of','to the north-east of','opposite','be positioned']
  },

  {
    id:'botanical-gardens', number:5, image:'./images/image8.png', title:'Botanical Gardens', type:'Đối diện & cạnh nhau',
    prompt:'The plan shows a public garden with several recreational facilities. Describe the layout, focusing on the position of the rose garden and glasshouse.',
    instruction:'Compare the positions of the gardens, fountain, pond, playground, café and entrance.',
    facts:[
      {label:'The rose garden stands opposite the glasshouse.',keywords:['rose garden','glasshouse'],places:['opposite','across']},
      {label:'The fountain occupies the centre of the garden.',keywords:['fountain'],places:['centre','center','middle','central']},
      {label:'The pond is in the north-eastern area.',keywords:['pond'],places:['north-east','northeast','north']},
      {label:'The playground occupies the north-western area.',keywords:['playground'],places:['north-west','northwest','north']},
      {label:'The café is in the south-eastern area.',keywords:['cafe','café'],places:['south-east','southeast','south']},
      {label:'The main entrance is at the southern end.',keywords:['entrance'],places:['south','southern','bottom']}
    ],
    suggestions:['opposite','across from','adjacent to','in the centre of']
  },

  {
    id:'theatre', number:6, image:'./images/image10.png', title:'Theatre Seating Plan', type:'Bao quanh',
    prompt:'The plan depicts the seating arrangement and facilities in a theatre. Describe the layout, highlighting the position of the stage and surrounding seating.',
    instruction:'Mention the stage, seating areas, lobby and surrounding rooms using suitable map vocabulary.',
    facts:[
      {label:'The stage occupies the centre of the theatre.',keywords:['stage'],places:['centre','center','middle','central']},
      {label:'The stage is surrounded by the seating areas.',keywords:['stage','seating'],places:['surround','around','encircle']},
      {label:'The lobby is in the northern part of the theatre.',keywords:['lobby'],places:['north','northern','top']},
      {label:'The cloakroom lies to the north-east.',keywords:['cloakroom'],places:['north-east','northeast','north']},
      {label:'The washrooms lie to the north-west.',keywords:['washroom'],places:['north-west','northwest','north']},
      {label:'Exits are located at the southern end.',keywords:['exit'],places:['south','southern','bottom']}
    ],
    suggestions:['surrounded by','in the centre of','be located','at the southern end of']
  },

  {
    id:'main-road', number:7, image:'./images/image11.png', title:'Main Road Shops', type:'Dọc theo',
    prompt:'The map shows a town with shops along a main road and several public buildings. Summarise the arrangement of the town.',
    instruction:'Include the row of shops, main road and the contrasting areas north and south of it.',
    facts:[
      {label:'Several shops stand along the main road.',keywords:['shop'],places:['along','alongside','road']},
      {label:'A school is to the north-west of the shops.',keywords:['school'],places:['north-west','northwest','north']},
      {label:'The park is on the northern side of the road.',keywords:['park'],places:['north','northern']},
      {label:'The hospital lies to the north-east.',keywords:['hospital'],places:['north-east','northeast','north']},
      {label:'The library is on the southern side of the road.',keywords:['library'],places:['south','southern']},
      {label:'A parking lot and post office lie south of the road.',keywords:['parking','post office'],places:['south','southern']}
    ],
    suggestions:['along','on the northern side of','on the southern side of','be situated']
  },

  {
    id:'public-campus', number:8, image:'./images/image12.png', title:'Public Campus', type:'Các công trình trong khu',
    prompt:'The plan depicts a campus with public facilities and a garden. Summarise the layout of the site, selecting the most important spatial relationships.',
    instruction:'Describe the facilities across the north, west, east and south of the site and explain what occupies the centre.',
    facts:[
      {label:'The library, main building and café are positioned along the northern end.',keywords:['library','main building','cafe','café'],places:['north','northern','top']},
      {label:'The garden and fountain occupy the centre of the site.',keywords:['garden','fountain'],places:['centre','center','middle','central']},
      {label:'The sports centre and tennis courts occupy the western section.',keywords:['sports','tennis'],places:['west','western','left']},
      {label:'The exhibition hall and playground are on the eastern side.',keywords:['exhibition','playground'],places:['east','eastern','right']},
      {label:'A car park lies at the southern end.',keywords:['car park','parking'],places:['south','southern','bottom']}
    ],
    suggestions:['at the northern end of','in the centre of','on the eastern side of','at the southern end of']
  },

  {
    id:'river-village', number:9, image:'./images/image13.png', title:'River Village', type:'Sông chạy qua làng',
    prompt:'The map illustrates a village divided by a river and crossed by a main road. Summarise how the public buildings, shops and open spaces are arranged.',
    instruction:'Explain how the river and main road shape the village, then describe key facilities in each district.',
    facts:[
      {label:'The river runs through the village from north to south.',keywords:['river'],places:['through','north','south','divide']},
      {label:'The main road runs across the village.',keywords:['main road','road'],places:['across','through','east','west']},
      {label:'Shops are located along the main road.',keywords:['shop'],places:['along','alongside','road']},
      {label:'The residential area is in the north-west.',keywords:['residential'],places:['north-west','northwest']},
      {label:'The hospital is in the north-east.',keywords:['hospital'],places:['north-east','northeast']},
      {label:'The library is south of the main road.',keywords:['library'],places:['south','southern']},
      {label:'The post office is to the south-east.',keywords:['post office'],places:['south-east','southeast','south']}
    ],
    suggestions:['run through','run across','divide ... into ...','along','to the south of']
  },

  {
    id:'university-city', number:10, image:'./images/image2.png', title:'University City', type:'Vị trí công trình',
    prompt:'The map shows a university and several facilities in a riverside city. Summarise the main spatial features.',
    instruction:'Describe the university, residential area, park, shopping centre, stadium, port and river.',
    facts:[
      {label:'The university is in the north-eastern corner of the city.',keywords:['university'],places:['north-east','northeast']},
      {label:'The residential area is in the north-west.',keywords:['residential'],places:['north-west','northwest']},
      {label:'The park lies to the south-east of the city centre.',keywords:['park'],places:['south-east','southeast','east']},
      {label:'The port occupies the southernmost area.',keywords:['port'],places:['south','southern']},
      {label:'The river is on the eastern side of the city.',keywords:['river'],places:['east','eastern']}
    ],
    suggestions:['in the north-eastern corner of','to the south-east of','on the eastern side of']
  },

  {
    id:'market-roundabout', number:11, image:'./images/image4.png', title:'Market & Roundabout', type:'Vị trí tương đối',
    prompt:'The plan illustrates a city centred on a roundabout, with a market and a number of amenities. Describe the position of the amenities in relation to the city centre.',
    instruction:'Explain where the market, school, hospital, park, stadium and river are situated.',
    facts:[
      {label:'The city centre or roundabout is in the middle of the map.',keywords:['roundabout','city centre'],places:['middle','centre','center','central']},
      {label:'The market is west of the city centre.',keywords:['market'],places:['west','western']},
      {label:'The school lies north of the roundabout.',keywords:['school'],places:['north','northern']},
      {label:'The hospital is east of the roundabout.',keywords:['hospital'],places:['east','eastern']},
      {label:'The stadium occupies the south-eastern district.',keywords:['stadium'],places:['south-east','southeast','south']},
      {label:'The river runs along the eastern edge.',keywords:['river'],places:['east','eastern']}
    ],
    suggestions:['to the west of','in the centre of','on the eastern side of']
  },

  {
    id:'station-district', number:12, image:'./images/image7.png', title:'Station District', type:'Giữa & liền kề',
    prompt:'The map shows a town with a station, university, city centre and several other public facilities. Summarise the town layout.',
    instruction:'Focus on the station’s position relative to the university and city centre.',
    facts:[
      {label:'The station lies between the university and city centre.',keywords:['station'],places:['between','midway']},
      {label:'The university is to the west of the station.',keywords:['university'],places:['west','western']},
      {label:'The city centre is east of the station.',keywords:['city centre'],places:['east','eastern']},
      {label:'The hospital is in the western part of the middle row.',keywords:['hospital'],places:['west','western']},
      {label:'The park is in the centre of the middle row.',keywords:['park'],places:['centre','center','middle']},
      {label:'The river borders the southern edge.',keywords:['river'],places:['south','southern']}
    ],
    suggestions:['between','midway between','to the east of','be situated']
  },

  {
    id:'museum-gardens', number:13, image:'./images/image9.png', title:'Museum Gardens', type:'Đối diện & tiếp giáp',
    prompt:'The map presents the facilities of a cultural and recreational park. Summarise the arrangement around the central fountain.',
    instruction:'Include the position of the museum, playground, library, garden, café and gallery.',
    facts:[
      {label:'The fountain is at the centre of the park.',keywords:['fountain'],places:['centre','center','middle','central']},
      {label:'The playground occupies the north-western section.',keywords:['playground'],places:['north-west','northwest']},
      {label:'The museum is in the north-eastern section.',keywords:['museum'],places:['north-east','northeast']},
      {label:'The gallery and café are adjacent on the eastern side.',keywords:['gallery','cafe','café'],places:['adjacent','next to','east','eastern']},
      {label:'The car park is at the south-western corner.',keywords:['car park','parking'],places:['south-west','southwest']},
      {label:'The rest area is in the south-eastern corner.',keywords:['rest area'],places:['south-east','southeast']}
    ],
    suggestions:['adjacent to','opposite','in the north-eastern corner of','in the centre of']
  },

  {
    id:'change-site-a',
    number:14,
    image:'./images/image14.png',
    title:'Riverside Campus · 2000–2025',
    type:'Thay đổi theo thời gian',
    practiceMode:'change',
    fromYear:2000,
    toYear:2025,

    prompt:'The maps show a site in 2000 and 2025. Describe the changes using suitable change vocabulary.',
    instruction:'Write one sentence at a time, focusing on how the open space changed and how the cafeteria appeared.',

    facts:[
      {
        label:'A cafeteria was constructed on the eastern side of the site.',
        keywords:['cafeteria'],
        places:['constructed','east','eastern'],

        changePractice:{
          prompt:'Hãy miêu tả Cafeteria mới vào năm 2025, sử dụng từ “constructed”.',

          requiredGroups:[
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was constructed',
            'was constructed on the eastern side of'
          ],

          secondHint:'Dùng cấu trúc “was constructed” để diễn tả công trình mới.'
        }
      },

      {
        label:'The open space was replaced by a cafeteria.',
        keywords:['open space','cafeteria'],
        places:['replaced'],

        changePractice:{
          prompt:'Hãy miêu tả sự thay đổi từ Open space sang Cafeteria trong giai đoạn 2000–2025.',

          requiredGroups:[
            ['open space'],
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was replaced by',
            'gave way to',
            'was converted into',
            'was transformed into'
          ],

          secondHint:'Có thể dùng “was replaced by”, “gave way to”, “was converted into” hoặc “was transformed into” nếu câu phù hợp với bản đồ.'
        }
      },

      {
        label:'The former open space was replaced by a cafeteria.',
        keywords:['open space','cafeteria'],
        places:['former','replaced'],

        changePractice:{
          prompt:'Hãy miêu tả Open space trước đây, sử dụng từ “former”.',

          requiredGroups:[
            ['former'],
            ['open space'],
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was replaced by',
            'gave way to',
            'was converted into',
            'was transformed into'
          ],

          secondHint:'Sau “the former open space”, hãy diễn tả rằng khu vực này đã trở thành Cafeteria.'
        }
      },

      {
        label:'A cafeteria was added to the eastern side of the site.',
        keywords:['cafeteria'],
        places:['added','east','eastern'],

        changePractice:{
          prompt:'Hãy miêu tả việc Cafeteria được bổ sung vào năm 2025, sử dụng từ “added”.',

          requiredGroups:[
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was added',
            'was added to'
          ],

          secondHint:'Dùng cấu trúc “was added” để diễn tả công trình được bổ sung.'
        }
      },

      {
        label:'A cafeteria was introduced on the eastern side of the site.',
        keywords:['cafeteria'],
        places:['introduced','east','eastern'],

        changePractice:{
          prompt:'Hãy miêu tả Cafeteria mới, sử dụng từ “introduced”.',

          requiredGroups:[
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was introduced'
          ],

          secondHint:'Dùng cấu trúc “was introduced” để diễn tả một feature mới xuất hiện.'
        }
      }
    ],

    suggestions:[
      'be constructed',
      'be added',
      'be introduced',
      'be replaced by',
      'former'
    ]
  },

  {
    id:'change-site-b',
    number:15,
    image:'./images/image15.png',
    title:'Heritage Gardens · 2010–2020',
    type:'Thay thế công trình',
    practiceMode:'change',
    fromYear:2010,
    toYear:2020,

    prompt:'The maps compare a site in 2010 and 2020. Describe how the southern part changed.',
    instruction:'Focus on the change from the car park to the museum.',

    facts:[
      {
        label:'The former car park was replaced by a museum.',
        keywords:['car park','museum'],
        places:['former','replaced'],

        changePractice:{
          prompt:'Hãy miêu tả sự thay đổi của Car park, sử dụng từ “former”.',

          requiredGroups:[
            ['former'],
            ['car park','carpark'],
            ['museum']
          ],

          acceptedPhrases:[
            'was replaced by',
            'gave way to',
            'was converted into',
            'was transformed into'
          ],

          secondHint:'Car park không còn tồn tại vào năm 2020 và Museum xuất hiện tại vị trí đó.'
        }
      },

      {
        label:'A museum was built in the southern part of the site.',
        keywords:['museum'],
        places:['built','south','southern'],

        changePractice:{
          prompt:'Hãy miêu tả Museum mới vào năm 2020, sử dụng từ “built”.',

          requiredGroups:[
            ['museum']
          ],

          acceptedPhrases:[
            'was built',
            'was built in the southern part of'
          ],

          secondHint:'Dùng cấu trúc “was built” để diễn tả Museum mới.'
        }
      },

      {
        label:'The previous car-park area was transformed into a museum.',
        keywords:['car park','museum'],
        places:['previous','transformed'],

        changePractice:{
          prompt:'Hãy miêu tả khu vực Car park trước đó, sử dụng từ “previous”.',

          requiredGroups:[
            ['previous'],
            ['car park','car-park'],
            ['museum']
          ],

          acceptedPhrases:[
            'was transformed into',
            'was converted into',
            'was replaced by',
            'gave way to'
          ],

          secondHint:'Khu vực Car park trước đó trở thành Museum; có thể dùng một cấu trúc thay đổi phù hợp.'
        }
      },

      {
        label:'The car-park area was converted into a museum.',
        keywords:['car park','museum'],
        places:['converted'],

        changePractice:{
          prompt:'Hãy miêu tả sự chuyển đổi từ Car park thành Museum, sử dụng từ “converted”.',

          requiredGroups:[
            ['car park','car-park'],
            ['museum']
          ],

          acceptedPhrases:[
            'was converted into'
          ],

          secondHint:'Dùng cấu trúc “was converted into”.'
        }
      }
    ],

    suggestions:[
      'former',
      'be built',
      'previous',
      'be transformed into',
      'be converted into'
    ]
  },

  {
    id:'change-site-c',
    number:16,
    image:'./images/image16.png',
    title:'Greenfield Grounds · 2010–2020',
    type:'Thay thế công trình',
    practiceMode:'change',
    fromYear:2010,
    toYear:2020,

    prompt:'The maps compare a site in 2010 and 2020. Describe the change on the western side of the garden.',
    instruction:'Focus on the sports court and the library.',

    facts:[
      {
        label:'The former sports court was replaced by a library.',
        keywords:['sports court','library'],
        places:['former','replaced'],

        changePractice:{
          prompt:'Hãy miêu tả sự thay đổi từ Sports court sang Library, sử dụng từ “former”.',

          requiredGroups:[
            ['former'],
            ['sports court'],
            ['library']
          ],

          acceptedPhrases:[
            'was replaced by',
            'gave way to',
            'was converted into',
            'was transformed into'
          ],

          secondHint:'Sports court trước đây đã trở thành Library; có thể dùng một cấu trúc thay đổi phù hợp.'
        }
      },

      {
        label:'A library was constructed on the western side of the garden.',
        keywords:['library','garden'],
        places:['constructed','west','western'],

        changePractice:{
          prompt:'Hãy miêu tả Library mới vào năm 2020, sử dụng từ “constructed”.',

          requiredGroups:[
            ['library']
          ],

          acceptedPhrases:[
            'was constructed',
            'was built'
          ],

          secondHint:'Dùng cấu trúc “was constructed” hoặc “was built” để diễn tả Library mới.'
        }
      },

      {
        label:'The sports-court area was transformed into a library.',
        keywords:['sports court','library'],
        places:['transformed'],

        changePractice:{
          prompt:'Hãy miêu tả sự chuyển đổi của Sports court, sử dụng từ “transformed”.',

          requiredGroups:[
            ['sports court','sports-court'],
            ['library']
          ],

          acceptedPhrases:[
            'was transformed into'
          ],

          secondHint:'Dùng cấu trúc “was transformed into”.'
        }
      },

      {
        label:'The original sports court was removed to make way for a library.',
        keywords:['sports court','library'],
        places:['original','removed'],

        changePractice:{
          prompt:'Hãy miêu tả Sports court ban đầu, sử dụng từ “original”.',

          requiredGroups:[
            ['original'],
            ['sports court'],
            ['library']
          ],

          acceptedPhrases:[
            'was removed to make way for',
            'was removed',
            'gave way to',
            'was replaced by',
            'was converted into',
            'was transformed into'
          ],

          secondHint:'Sports court ban đầu không còn vào năm 2020 và Library xuất hiện tại vị trí đó.'
        }
      }
    ],

    suggestions:[
      'former',
      'be constructed',
      'be transformed into',
      'original',
      'be removed'
    ]
  },

  {
    id:'change-site-d',
    number:17,
    image:'./images/image17.png',
    title:'Meadowview Park · 2010–2020',
    type:'Di dời công trình',
    practiceMode:'change',
    fromYear:2010,
    toYear:2020,

    prompt:'The maps show that the cafeteria changed position between 2010 and 2020.',
    instruction:'Describe the relocation from the western side of the garden to the eastern side.',

    facts:[
      {
        label:'The previous cafeteria was relocated to the eastern side of the garden.',
        keywords:['cafeteria','garden'],
        places:['previous','relocated','east','eastern'],

        changePractice:{
          prompt:'Hãy miêu tả việc Cafeteria trước đó được di dời, sử dụng từ “previous” và “relocated”.',

          requiredGroups:[
            ['previous'],
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was relocated',
            'was relocated to',
            'was relocated to the eastern side of'
          ],

          secondHint:'Dùng “the previous cafeteria” và cấu trúc “was relocated”.'
        }
      },

      {
        label:'The cafeteria was moved from the western side to the eastern side of the garden.',
        keywords:['cafeteria','garden'],
        places:['moved','west','western','east','eastern'],

        changePractice:{
          prompt:'Hãy miêu tả việc Cafeteria được di dời, sử dụng từ “moved”.',

          requiredGroups:[
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was moved',
            'was moved to',
            'was moved from',
            'was moved from the western side to the eastern side of'
          ],

          secondHint:'Dùng cấu trúc “was moved” để diễn tả việc Cafeteria được di dời.'
        }
      },

      {
        label:'The former cafeteria was moved to the eastern side of the garden.',
        keywords:['cafeteria','garden'],
        places:['former','moved','east','eastern'],

        changePractice:{
          prompt:'Hãy miêu tả Cafeteria trước đây và việc nó được di dời, sử dụng từ “former”.',

          requiredGroups:[
            ['former'],
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was moved',
            'was moved to',
            'was relocated',
            'was relocated to'
          ],

          secondHint:'Dùng “the former cafeteria” và một cấu trúc diễn tả sự di dời như “was moved” hoặc “was relocated”.'
        }
      },

      {
        label:'The cafeteria was relocated from the western side to the eastern side of the garden.',
        keywords:['cafeteria','garden'],
        places:['relocated','west','western','east','eastern'],

        changePractice:{
          prompt:'Hãy viết một câu về việc Cafeteria được di dời, sử dụng từ “relocated”.',

          requiredGroups:[
            ['cafeteria']
          ],

          acceptedPhrases:[
            'was relocated',
            'was relocated to',
            'was relocated from',
            'was relocated from the western side to the eastern side of'
          ],

          secondHint:'Dùng cấu trúc “was relocated” để diễn tả sự di dời.'
        }
      }
    ],

    suggestions:[
      'previous',
      'be relocated to',
      'be moved to',
      'former'
    ]
  },

  {
    id:'change-site-e',
    number:18,
    image:'./images/image18.png',
    title:'Kingsley Gardens · 2010–2020',
    type:'Phá bỏ / loại bỏ',
    practiceMode:'change',
    fromYear:2010,
    toYear:2020,

    prompt:'The maps show that the small museum disappeared between 2010 and 2020.',
    instruction:'Describe the removal of the museum and the resulting open area.',

    facts:[
      {
        label:'The former small museum was removed from the site.',
        keywords:['small museum'],
        places:['former','removed'],

        changePractice:{
          prompt:'Hãy miêu tả Small Museum trước đây, sử dụng từ “former” và “removed”.',

          requiredGroups:[
            ['former'],
            ['small museum','museum']
          ],

          acceptedPhrases:[
            'was removed from',
            'was removed'
          ],

          secondHint:'Small Museum trước đây không còn xuất hiện vào năm 2020.'
        }
      },

      {
        label:'The small museum was demolished by 2020.',
        keywords:['small museum'],
        places:['demolished'],

        changePractice:{
          prompt:'Hãy miêu tả việc Small Museum biến mất vào năm 2020, sử dụng từ “demolished”.',

          requiredGroups:[
            ['small museum','museum']
          ],

          acceptedPhrases:[
            'was demolished'
          ],

          secondHint:'Dùng cấu trúc “was demolished”.'
        }
      },

      {
        label:'The original museum site was cleared by 2020.',
        keywords:['museum','site'],
        places:['original','cleared'],

        changePractice:{
          prompt:'Hãy miêu tả khu vực Museum ban đầu, sử dụng từ “original” và “cleared”.',

          requiredGroups:[
            ['original'],
            ['museum']
          ],

          acceptedPhrases:[
            'was cleared'
          ],

          secondHint:'Dùng “the original museum site” và diễn tả rằng khu vực này đã được dọn bỏ vào năm 2020.'
        }
      },

      {
        label:'The former museum was removed, leaving an open area.',
        keywords:['museum','open area'],
        places:['former','removed'],

        changePractice:{
          prompt:'Hãy miêu tả kết quả sau khi Museum bị loại bỏ, sử dụng từ “removed”.',

          requiredGroups:[
            ['museum'],
            ['open area','open space','green area']
          ],

          acceptedPhrases:[
            'was removed',
            'was removed leaving',
            'was removed, leaving'
          ],

          secondHint:'Sau khi Museum bị loại bỏ, một khoảng không gian mở xuất hiện.'
        }
      }
    ],

    suggestions:[
      'former',
      'be removed',
      'be demolished',
      'original',
      'be cleared'
    ]
  },

  {
    id:'change-site-f',
    number:19,
    image:'./images/image19.png',
    title:'Lakewood Campus · 2010–2020',
    type:'Mở rộng',
    practiceMode:'change',
    fromYear:2010,
    toYear:2020,

    prompt:'The maps compare the garden in 2010 and 2020.',
    instruction:'Describe how the garden changed in size while the main building, library and car park remained in place.',

    facts:[
      {
        label:'The garden was expanded between 2010 and 2020.',
        keywords:['garden'],
        places:['expanded'],

        changePractice:{
          prompt:'Hãy miêu tả thay đổi về kích thước của Garden, sử dụng từ “expanded”.',

          requiredGroups:[
            ['garden']
          ],

          acceptedPhrases:[
            'was expanded',
            'expanded in size'
          ],

          secondHint:'Garden lớn hơn vào năm 2020; dùng cấu trúc “was expanded”.'
        }
      },

      {
        label:'The garden was extended by 2020.',
        keywords:['garden'],
        places:['extended'],

        changePractice:{
          prompt:'Hãy miêu tả Garden vào năm 2020, sử dụng từ “extended”.',

          requiredGroups:[
            ['garden']
          ],

          acceptedPhrases:[
            'was extended'
          ],

          secondHint:'Dùng cấu trúc “was extended”.'
        }
      },

      {
        label:'The original garden was expanded in size by 2020.',
        keywords:['garden'],
        places:['original','expanded'],

        changePractice:{
          prompt:'Hãy miêu tả Garden ban đầu và sự thay đổi của nó, sử dụng từ “original”.',

          requiredGroups:[
            ['original'],
            ['garden']
          ],

          acceptedPhrases:[
            'was expanded',
            'expanded in size',
            'was extended'
          ],

          secondHint:'Dùng “the original garden” và diễn tả rằng khu vườn đã được mở rộng.'
        }
      }
    ],

    suggestions:[
      'be expanded',
      'be extended',
      'original'
    ]
  }
];
