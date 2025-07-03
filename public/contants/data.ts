export const descriptions: Record<string, string> = {
  server: "Cho phép sử dụng số lượng CPU cho service",
  auth: "Token xác thực, IP cho phép và danh sách origin (CORS) có thể truy cập hệ thống.",
  minio: "Hỗ trợ upload/download file và media cho toàn hệ thống.",
  websocket: "Kết nối thời gian thực",
  email: "Xác thực người dùng, thông báo hệ thống qua địa chỉ email.",
  webpush: "Gửi Web Push Notifications đến trình duyệt người dùng.",
  rabbitmq: "Xử lý bất đồng bộ như gửi email, push, notification,...",
  cleaner_service: "Xóa dữ liệu cũ không còn cần thiết trong hệ thống.",
  mongodb: "Cơ sở dữ liệu MongoDB để lưu trữ các thông tin.",
  redis:
    "Server cache cho toàn hệ thống 4Work, tăng tốc độ truy xuất dữ liệu, giảm thời gian tải trang.",
};

export const fullTypes = [
  "number",
  "string",
  "boolean",
  "object",
  "array<string>",
  "array<number>",
  "array<boolean>",
  "array<object>",
];

export const getPlaceholderForType = (type: string) => {
  switch (type) {
    case "number":
      return "eg. 123";
    case "string":
      return "eg. abc";
    case "boolean":
      return "eg. true / false";
    case "array<number>":
      return "eg. [1, 2]";
    case "array<string>":
      return 'eg. ["abc", "xyz"]';
    case "array<boolean>":
      return "eg. [true, false]";
    case "array<object>":
      return 'eg. [{"a":1}, {"b":"x"}]';
    case "object":
      return 'eg. {"a": 1, "b": "x"}';
    default:
      return "Enter value";
  }
};
