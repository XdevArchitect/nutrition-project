export const heroHighlights = [
  {
    title: "Kiến thức khoa học",
    description: "Hệ thống bài viết cập nhật dựa trên khuyến nghị dinh dưỡng mới nhất trên thế giới."
  },
  {
    title: "Khoá học chuyên sâu",
    description: "Lộ trình 6 tuần giúp bạn tối ưu dinh dưỡng cá nhân với chuyên gia đồng hành."
  },
  {
    title: "Cộng đồng đồng hành",
    description: "Nhóm hỗ trợ duy trì động lực, chia sẻ công thức, chế độ ăn và bài tập."
  }
];

export const featurePillars = [
  {
    title: "Cá nhân hoá",
    description: "Phân tích khẩu phần, giấc ngủ và vận động để lên thực đơn phù hợp mục tiêu."
  },
  {
    title: "Bền vững",
    description: "Ưu tiên nguyên liệu tại địa phương, công thức dễ áp dụng và tiết kiệm thời gian."
  },
  {
    title: "Minh bạch",
    description: "Dữ liệu và công cụ theo dõi tiến trình rõ ràng, hỗ trợ bởi chuyên gia."
  }
];

export const testimonials = [
  {
    name: "Thanh Hà",
    role: "Food Blogger",
    quote: "Khoá học giúp tôi hiểu rõ nhu cầu cơ thể, từ đó xây dựng thực đơn linh hoạt nhưng vẫn đủ dinh dưỡng.",
    initials: "TH"
  },
  {
    name: "Minh Quân",
    role: "Nhân viên văn phòng",
    quote: "Sau 8 tuần, tôi giảm 6kg mà vẫn giữ được năng lượng làm việc nhờ hướng dẫn bài bản từ chuyên gia.",
    initials: "MQ"
  },
  {
    name: "Ngọc Phương",
    role: "Huấn luyện viên yoga",
    quote: "Tôi có thêm kiến thức để tư vấn học viên, đồng thời cải thiện sức khoẻ tiêu hoá của chính mình.",
    initials: "NP"
  }
];

export const articles = [
  {
    slug: "he-thong-plate-la-gi",
    title: "Hệ thống \"Healthy Plate\" và cách áp dụng vào bữa ăn Việt",
    category: "Nền tảng",
    level: "Cơ bản",
    readingTime: "7 phút",
    excerpt: "Sắp xếp đĩa ăn theo tỉ lệ hợp lý giúp bạn cân bằng năng lượng và vi chất mỗi ngày.",
    content: `
### Khái niệm Healthy Plate

Mô hình này đề xuất chia đĩa ăn thành 4 phần: rau củ, tinh bột nguyên cám, protein lành mạnh và chất béo tốt.

### Cách áp dụng

- Ưu tiên rau xanh chiếm ít nhất 40% khẩu phần.
- Thay thế gạo trắng bằng gạo lứt, khoai lang, yến mạch.
- Chọn nguồn protein ít béo: cá, đậu hũ, đậu lăng.

### Mẹo thực hiện

Chuẩn bị meal-prep vào cuối tuần, sử dụng hộp thuỷ tinh chia ngăn để cân đối khẩu phần nhanh chóng.
`
  },
  {
    slug: "chien-luoc-an-sang",
    title: "Chiến lược bữa sáng giúp ổn định đường huyết",
    category: "Chuyên sâu",
    level: "Trung cấp",
    readingTime: "9 phút",
    excerpt: "Bữa sáng giàu protein và chất xơ giúp bạn duy trì tập trung đến trưa mà không thèm đồ ngọt.",
    content: `
### Nguyên tắc vàng

- Kết hợp ít nhất 25g protein.
- Bổ sung chất xơ hoà tan từ yến mạch, hạt chia.
- Hạn chế đường đơn từ nước ép đóng chai.

### Gợi ý thực đơn

- Bánh mì nguyên cám, trứng luộc, bơ và rau.
- Overnight oats với sữa hạt, hạt lanh và trái cây họ berry.
`
  },
  {
    slug: "phuc-hoi-the-chat",
    title: "Phục hồi thể chất sau tập luyện cường độ cao",
    category: "Vận động",
    level: "Nâng cao",
    readingTime: "8 phút",
    excerpt: "Nạp carb đúng thời điểm và bổ sung điện giải giúp bạn sẵn sàng cho buổi tập tiếp theo.",
    content: `
### Ba giai đoạn phục hồi

1. **30 phút đầu:** uống 500ml nước điện giải và nạp 1g carb/kg trọng lượng.
2. **2 giờ tiếp theo:** ưu tiên protein dễ hấp thụ như whey, sữa chua Hy Lạp.
3. **Trước khi ngủ:** bổ sung casein hoặc sữa ấm để hỗ trợ tái tạo cơ.

### Checklist

- Ngủ đủ 7-8 giờ.
- Kéo giãn 10 phút sau tập.
- Ghi lại cảm nhận để điều chỉnh khối lượng tập.
`
  }
];

export const knowledgeCategories = [
  {value: "all", label: "Tất cả"},
  {value: "Nền tảng", label: "Nền tảng"},
  {value: "Chuyên sâu", label: "Chuyên sâu"},
  {value: "Vận động", label: "Vận động"},
  {value: "Lối sống", label: "Lối sống"}
];

export const courseInfo = {
  name: "Lộ trình dinh dưỡng cá nhân hoá 6 tuần",
  description:
    "Khoá học kết hợp video, workshop trực tiếp và coaching 1-1 giúp bạn xây dựng chế độ ăn cân bằng, phù hợp nhịp sống bận rộn.",
  modules: [
    {
      title: "Tuần 1-2: Hiểu cơ thể",
      content: "Đánh giá chỉ số, thói quen và mục tiêu. Xây dựng thực đơn khởi động với chuyên gia."
    },
    {
      title: "Tuần 3-4: Tối ưu hoá",
      content: "Điều chỉnh tỉ lệ dinh dưỡng, tối ưu bữa ăn ngoài, cân đối chi phí."
    },
    {
      title: "Tuần 5-6: Duy trì",
      content: "Thiết lập lộ trình dài hạn, xây dựng thói quen theo dõi và chuẩn bị thực phẩm."
    }
  ],
  bonuses: [
    "02 buổi coaching cá nhân 45 phút",
    "Thực đơn mẫu 28 ngày theo mục tiêu",
    "Bảng theo dõi tiến trình trên Notion"
  ],
  pricing: [
    {
      title: "Cơ bản",
      price: "2.490.000đ",
      description: "Phù hợp người mới bắt đầu",
      items: ["12 video bài giảng", "Checklist meal-prep", "Nhóm cộng đồng"]
    },
    {
      title: "Chuyên sâu",
      price: "4.990.000đ",
      description: "Bao gồm coaching 1-1",
      items: ["Tất cả nội dung gói cơ bản", "02 buổi coaching riêng", "Phân tích khẩu phần chi tiết"],
      highlight: true
    }
  ],
  faq: [
    {
      question: "Khoá học phù hợp cho ai?",
      answer: "Chương trình dành cho người bận rộn muốn cải thiện sức khoẻ, giảm cân lành mạnh hoặc tăng năng lượng làm việc."
    },
    {
      question: "Tôi không nấu ăn giỏi thì sao?",
      answer: "Bạn sẽ nhận được thực đơn đơn giản, gợi ý thay thế và video hướng dẫn meal-prep trong 30 phút."
    },
    {
      question: "Có hỗ trợ sau khoá?",
      answer: "Bạn được tham gia nhóm cộng đồng và nhận cập nhật công thức mới mỗi tháng."
    }
  ]
};

export const contactReasons = [
  "Tư vấn khoá học",
  "Lên thực đơn doanh nghiệp",
  "Hợp tác truyền thông",
  "Khác"
];

export const teamMembers = [
  {
    name: "Bác sĩ Lê Thu Trang",
    role: "Chuyên gia dinh dưỡng lâm sàng",
    description: "10 năm kinh nghiệm tại bệnh viện tuyến trung ương, tập trung vào dinh dưỡng chuyển hoá.",
    initials: "TT"
  },
  {
    name: "Thạc sĩ Nguyễn Minh Châu",
    role: "Chuyên gia thể chất",
    description: "Tư vấn dinh dưỡng cho vận động viên và doanh nghiệp, sáng lập cộng đồng Eat Clean Việt Nam.",
    initials: "MC"
  },
  {
    name: "HLV Trần Vũ Nam",
    role: "Health Coach",
    description: "Huấn luyện viên được chứng nhận IIN, đồng hành cùng 500+ học viên thay đổi lối sống.",
    initials: "VN"
  }
];
