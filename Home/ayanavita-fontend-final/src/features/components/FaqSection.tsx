import React from "react";
import { Card, Container, SubTitle, Title } from "src/ui/ui";


export function FaqSection() {
  const items = [
    {
      q: "Đánh giá “Đã xác thực” là gì?",
      a: "Đây là badge mô phỏng cho khách hàng có đơn hàng/đặt lịch thành công. Khi có backend, bạn xác thực theo orderId/bookingId.",
    },
    {
      q: "Tại sao có nút “Hữu ích”?",
      a: "Like “Hữu ích” giúp sắp xếp review theo chất lượng nội dung và độ tin cậy (signal).",
    },
    {
      q: "Có kiểm duyệt không?",
      a: "Nên có: lọc từ nhạy cảm, spam, kiểm tra ảnh. Trạng thái gợi ý: pending/approved/rejected.",
    },
    {
      q: "Có thể phản hồi review?",
      a: "Có. Nên cho “AYANAVITA Reply” để xử lý khiếu nại, nâng trải nghiệm và tăng uy tín.",
    },
  ];

  return (
    <section className="bg-slate-50" id="faq">
      <Container className="py-16">
        <SubTitle>FAQ</SubTitle>
        <Title className="mt-1">Câu hỏi thường gặp</Title>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {items.map((x) => (
            <Card key={x.q} className="p-6">
              <div className="font-extrabold">{x.q}</div>
              <div className="mt-2 text-slate-600 text-sm">{x.a}</div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
