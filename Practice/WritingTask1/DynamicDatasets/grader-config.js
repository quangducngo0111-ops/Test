
/**
 * SMARTCOM IELTS WRITING
 * AI GRADER CONFIGURATION
 *
 * GitHub Pages → Cloudflare Worker → OpenAI API
 *
 * File: DynamicDatasets/grader-config.js
 */

(function () {
  "use strict";

  // URL của Cloudflare Worker sau khi triển khai.
  // Hiện tại chưa có URL nên để trống.
  // Không điền OpenAI API key vào đây.

  const WORKER_URL = "";

  // Endpoint chấm IELTS Writing.

  window.DYNAMIC_GRADER_ENDPOINT = WORKER_URL
    ? WORKER_URL.replace(/\/+$/, "") + "/api/writing/grade"
    : "";

  // Không tự động cho học viên vượt qua bài viết
  // khi AI chưa xác nhận câu trả lời đạt yêu cầu.

  window.DYNAMIC_REQUIRE_AI = true;

  // Phiên bản hệ thống.

  window.SMARTCOM_GRADER_VERSION = "5.1";

})();
