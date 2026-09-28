/* ============================================
   WRITING TASK 1 · MAPS VOCABULARY
   81 MỤC TỪ
============================================ */

(function () {
  "use strict";

  const categories = [
    "Vị trí trong khu vực",
    "Góc và vị trí tương đối",
    "Hai bên, trung tâm và gần nhau",
    "Đường đi và cách miêu tả vị trí",
    "Mô tả thay đổi của bản đồ"
  ];

  /*
    Mỗi dòng gồm:
    [từ vựng, nghĩa, ví dụ, mã nhóm từ]
  */

  const rows = [

    ["in the north of","ở phía bắc của","The school is located in the north of the town.",0],
    ["in the south of","ở phía nam của","The port is located in the south of the city.",0],
    ["in the east of","ở phía đông của","The river is located in the east of the town.",0],
    ["in the west of","ở phía tây của","The library is in the west of the town.",0],
    ["in the northern part of","ở khu vực phía bắc của","The school is in the northern part of the city.",0],
    ["in the southern part of","ở khu vực phía nam của","The port is in the southern part of the city.",0],
    ["in the eastern part of","ở khu vực phía đông của","The park is in the eastern part of the town.",0],
    ["in the western part of","ở khu vực phía tây của","The library is in the western part of the village.",0],

    ["in the north-western corner of","ở góc tây bắc của","A residential area occupies the north-western corner of the city.",1],
    ["in the north-eastern corner of","ở góc đông bắc của","A forest occupies the north-eastern corner of the city.",1],
    ["in the south-western corner of","ở góc tây nam của","A library stands in the south-western corner of the city.",1],
    ["in the south-eastern corner of","ở góc đông nam của","A playground stands in the south-eastern corner of the site.",1],
    ["to the north of","nằm về phía bắc so với","The school lies to the north of the main road.",1],
    ["to the south of","nằm về phía nam so với","The station is situated to the south of the university.",1],
    ["to the east of","nằm về phía đông so với","The stadium lies to the east of the shopping centre.",1],
    ["to the west of","nằm về phía tây so với","The market lies to the west of the city centre.",1],
    ["to the north-east of","nằm về phía đông bắc so với","The park is to the north-east of the shopping centre.",1],
    ["to the north-west of","nằm về phía tây bắc so với","The school is to the north-west of the park.",1],
    ["to the south-east of","nằm về phía đông nam so với","The café lies to the south-east of the fountain.",1],
    ["to the south-west of","nằm về phía tây nam so với","The library is to the south-west of the city centre.",1],

    ["on the northern side of","ở phía bắc của một khu vực","The café is on the northern side of the arts centre.",2],
    ["on the southern side of","ở phía nam của một khu vực","The car park is on the southern side of the site.",2],
    ["on the eastern side of","ở phía đông của một khu vực","Two galleries were located on the eastern side of the arts centre.",2],
    ["on the western side of","ở phía tây của một khu vực","The museum is on the western side of the arts centre.",2],
    ["in the centre of","ở chính giữa của","The information desk was located in the centre of the building.",2],
    ["in the middle of","ở giữa của","The fountain is in the middle of the park.",2],
    ["at the centre of","ngay tại trung tâm của","A stage stands at the centre of the theatre.",2],
    ["centrally","ở vị trí trung tâm","The reception desk is centrally located.",2],
    ["in a central location","tại vị trí trung tâm","The fountain occupies a central location.",2],
    ["between","ở giữa hai đối tượng","The station was located between the university and the city centre.",2],
    ["in between","nằm ở giữa","The fountain is in between the two gardens.",2],
    ["midway between","nằm chính giữa hai đối tượng","The station lies midway between the university and the city centre.",2],
    ["opposite","đối diện với","A glasshouse stood opposite the rose garden.",2],
    ["across from","ở đối diện bên kia","The café stands across from the gallery.",2],
    ["next to","ngay cạnh","The library is next to the museum.",2],
    ["beside","bên cạnh","The park lies beside the school.",2],
    ["adjacent to","liền kề với","The café was adjacent to the gallery.",2],
    ["alongside","dọc theo / sát bên cạnh","Several shops were built alongside the main road.",2],
    ["surrounded by","được bao quanh bởi","The stage was surrounded by seating areas.",2],
    ["enclosed by","được bao kín bởi","The garden is enclosed by the surrounding buildings.",2],
    ["bordered by","được tiếp giáp / bao quanh bởi","The site is bordered by the river.",2],
    ["along","dọc theo","Several shops were constructed along the main road.",2],

    ["at the northern end of","ở cuối phía bắc của","The lobby is located at the northern end of the theatre.",3],
    ["at the southern end of","ở cuối phía nam của","A car park was located at the southern end of the site.",3],
    ["at the eastern end of","ở cuối phía đông của","The river reaches the eastern end of the city.",3],
    ["at the western end of","ở cuối phía tây của","The library is at the western end of the main road.",3],
    ["run through","chạy xuyên qua","A river ran through the village.",3],
    ["run across","chạy ngang qua","The main road runs across the centre of the village.",3],
    ["pass through","đi xuyên qua","A road passes through the park.",3],
    ["divide ... into ...","chia ... thành ...","The river divided the city into two halves.",3],
    ["be located","được đặt / tọa lạc tại","The school is located in the north of the town.",3],
    ["be situated","tọa lạc (trang trọng)","The airport is situated to the east of the city.",3],
    ["lie","nằm (địa điểm địa lý)","The village lies to the south of the river.",3],
    ["stand","đứng / tọa lạc (công trình)","A church stands near the river.",3],
    ["occupy","chiếm một khu vực / vị trí","The parking lot occupied the centre of the site.",3],
    ["be positioned","được bố trí tại","The playground was positioned beside the school.",3],
    ["contain","bao gồm / chứa","The park contains several trees.",3],
    ["feature","có điểm nổi bật là","The park features a large fountain.",3],
    ["house","là nơi đặt / chứa (cơ sở)","The building houses a museum.",3],

    ["be built","được xây dựng","A new market has been built to the east of the city centre.",4],
    ["be constructed","được thi công / xây dựng","A new covered market has been constructed.",4],
    ["be added","được bổ sung","A new tramline has been added.",4],
    ["be introduced","được đưa vào / bổ sung","A bike-rental scheme has been introduced.",4],
    ["be replaced by","được thay thế bởi","The former market has been replaced by a new shop.",4],
    ["give way to","nhường chỗ cho","The old market gave way to a shopping centre.",4],
    ["be converted into","được chuyển đổi thành","The highway has been converted into a pedestrian-only street.",4],
    ["be transformed into","được biến đổi thành","The former factory has been transformed into a museum.",4],
    ["be relocated to","được di dời đến","The station has been relocated to a new position.",4],
    ["be moved to","được chuyển tới","The playground has been moved to the north.",4],
    ["be demolished","bị phá dỡ","The old school has been demolished.",4],
    ["be removed","bị loại bỏ","The old bridge has been removed.",4],
    ["be cleared","bị giải tỏa / dọn sạch","The original wooded area has been cleared.",4],
    ["be expanded","được mở rộng","The university has been expanded.",4],
    ["be extended","được kéo dài / mở rộng","The road has been extended to the east.",4],
    ["be reduced in size","bị thu hẹp diện tích","The park has been reduced in size.",4],
    ["former","trước đây (không còn như cũ)","The former market was replaced by shops.",4],
    ["previous","trước đó","The previous train station was relocated.",4],
    ["original","ban đầu","The original wooded area was cleared.",4],
    ["while","trong khi (nối hai thay đổi)","The market was replaced by shops, while the station was relocated.",4],
    ["although","mặc dù (tương phản)","The centre remained unchanged, although a new scheme was introduced.",4],
    ["with ... added nearby","với ... được bổ sung gần đó","The street was pedestrianised, with a restaurant added nearby.",4]

  ];

  /*
    Tự đưa từ vựng vào hệ thống Vocabulary.
    Không xóa dữ liệu các bộ cũ.
    Không thêm trùng từ nếu đã có Maps.
  */

  const existing = Array.isArray(
    window.VOCABULARY_DATA
  )
    ? window.VOCABULARY_DATA
    : [];

  const seen = new Set(
    existing
      .filter(
        item =>
          item.skills?.includes("writing-task-1") &&
          item.set === "maps"
      )
      .map(
        item => item.word.toLowerCase()
      )
  );

  for (const [
    word,
    meaning,
    example,
    categoryId
  ] of rows) {

    if (seen.has(word.toLowerCase())) {
      continue;
    }

    const category = categories[categoryId];

    existing.push({
      word,
      meaning,
      skills: ["writing-task-1"],
      set: "maps",
      topics: ["maps", category],
      example,
      collocation: word,
      category
    });

    seen.add(word.toLowerCase());
  }

  window.VOCABULARY_DATA = existing;

  window.VOCABULARY_SET_INFO ||= {};

  window.VOCABULARY_SET_INFO[
    "writing-task-1"
  ] ||= {};

  window.VOCABULARY_SET_INFO[
    "writing-task-1"
  ].maps = {
    label: "Maps · Bộ 01",
    titles: [
      "Vị trí & bố cục bản đồ",
      "Thay đổi công trình & từ nối",
      "Giai đoạn 3: Luyện viết theo sơ đồ thực tế"
    ]
  };

})();
