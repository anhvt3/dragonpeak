# 📘 Hướng Dẫn Sử Dụng Lovable

> Tài liệu tổng hợp kinh nghiệm và best practices khi làm việc với Lovable AI.

---

## 📑 Mục Lục

1. [Giới thiệu Lovable](#1-giới-thiệu-lovable)
2. [Chiến lược Prompt hiệu quả](#2-chiến-lược-prompt-hiệu-quả)
3. [Cấu trúc Project khuyến nghị](#3-cấu-trúc-project-khuyến-nghị)
4. [Các tính năng quan trọng](#4-các-tính-năng-quan-trọng)
5. [Debug & Troubleshooting](#5-debug--troubleshooting)
6. [Best Practices từ Project Quiz Game](#6-best-practices-từ-project-quiz-game)
7. [Tài liệu tham khảo](#7-tài-liệu-tham-khảo)

---

## 1. Giới thiệu Lovable

### 🛠️ Công nghệ nền tảng

Lovable sử dụng stack công nghệ hiện đại:

| Công nghệ | Mục đích |
|-----------|----------|
| **React 18** | UI Framework |
| **Vite** | Build tool & Dev server |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS |
| **shadcn/ui** | Component library |

### ⚠️ Giới hạn quan trọng

**Lovable KHÔNG hỗ trợ:**
- ❌ Angular, Vue, Svelte, Next.js
- ❌ Native mobile apps (React Native, Flutter)
- ❌ Backend code trực tiếp (Python, Node.js, Ruby)

**Giải pháp Backend:**
- ✅ **Lovable Cloud** (khuyến nghị) - Tích hợp sẵn, không cần tài khoản ngoài
- ✅ **Supabase Connection** - Kết nối project Supabase có sẵn

---

## 2. Chiến lược Prompt hiệu quả

### 📐 Nguyên tắc vàng: Chia nhỏ task

```
❌ SAI: "Tạo cho tôi một app e-commerce hoàn chỉnh"

✅ ĐÚNG: Chia thành nhiều prompt nhỏ:
  1. "Tạo layout trang chủ với header và footer"
  2. "Thêm danh sách sản phẩm dạng grid"
  3. "Tạo trang chi tiết sản phẩm"
  4. "Thêm giỏ hàng với localStorage"
```

### 🔒 LOCK Instructions - Bảo vệ code hiện có

Khi muốn thêm tính năng mà KHÔNG làm hỏng UI/logic hiện tại:

```markdown
LOCK UI & LOGIC:
❗ KHÔNG thay đổi UI, layout, animation, style hiện có
❗ Chỉ bổ sung code mới theo dạng "add-on"
❗ KHÔNG refactor code cũ

🎯 NHIỆM VỤ:
[Mô tả chi tiết việc cần làm]
```

### 📝 Cấu trúc Prompt chuẩn

```markdown
## BỐI CẢNH
[Mô tả ngắn gọn về tình huống hiện tại]

## YÊU CẦU
[Liệt kê rõ ràng từng điểm cần làm]

## RÀNG BUỘC
[Những gì KHÔNG được thay đổi]

## KẾT QUẢ MONG ĐỢI
[Mô tả output cuối cùng]
```

### ✅ Ví dụ Prompt tốt vs xấu

| ❌ Prompt xấu | ✅ Prompt tốt |
|--------------|--------------|
| "Sửa cái button" | "Đổi màu button Submit từ blue sang green, giữ nguyên size và padding" |
| "Thêm animation" | "Thêm fade-in animation 300ms cho card khi hover, không đổi layout" |
| "Làm responsive" | "Ẩn sidebar trên mobile (<768px), hiện hamburger menu thay thế" |
| "Tích hợp API" | "Tích hợp thư viện X theo docs [link], chỉ thay đổi data layer, giữ nguyên UI" |

---

## 3. Cấu trúc Project khuyến nghị

### 📁 Tổ chức thư mục

```
src/
├── assets/              # Hình ảnh, fonts, media
│   ├── mobile/          # Assets cho mobile
│   └── pc/              # Assets cho desktop
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── game/            # Feature-specific components
│   └── shared/          # Shared/common components
├── config/              # Configuration files
│   ├── gameConfig.ts    # App config
│   ├── mobileAssets.ts  # Mobile asset paths
│   └── desktopAssets.ts # Desktop asset paths
├── contexts/            # React contexts
├── hooks/               # Custom hooks
│   ├── useGameLogic.ts  # Shared logic
│   └── use-mobile.tsx   # Device detection
├── pages/               # Route pages
├── types/               # TypeScript types
└── lib/                 # Utilities
```

### 🔀 Tách logic dùng chung vs UI riêng biệt

**Pattern khuyến nghị:**

```typescript
// hooks/useGameLogic.ts - SHARED LOGIC
export const useGameLogic = () => {
  // Business logic, state management
  // Không có UI code ở đây
};

// pages/MobileGame.tsx - MOBILE UI
const MobileGame = () => {
  const gameLogic = useGameLogic();
  return <MobileLayout {...gameLogic} />;
};

// pages/DesktopGame.tsx - DESKTOP UI
const DesktopGame = () => {
  const gameLogic = useGameLogic();
  return <DesktopLayout {...gameLogic} />;
};
```

### 📱 Quản lý Assets theo device

```typescript
// config/mobileAssets.ts
export const mobileAssets = {
  background: '/assets/mobile/background.jpg',
  mascot: '/assets/mobile/mascot.gif',
};

// config/desktopAssets.ts
export const desktopAssets = {
  background: '/assets/pc/background.jpg',
  mascot: '/assets/pc/mascot.gif',
};

// Usage
const assets = isMobile ? mobileAssets : desktopAssets;
```

---

## 4. Các tính năng quan trọng

### 🎨 Visual Edits (MIỄN PHÍ!)

> **Tip:** Sử dụng Visual Edits để chỉnh sửa UI nhanh mà không tốn credits!

**Cách sử dụng:**
1. Click nút **Edit** ở góc chat
2. Hover và chọn element cần sửa
3. Chỉnh trực tiếp (text, màu, font)
4. Click **Save**

**Miễn phí:** Thay đổi text, màu sắc, fonts
**Tốn credits:** Thay đổi qua prompt

### 📚 Knowledge Files

Lưu thông tin project để Lovable "nhớ" qua các session:

**Settings → Manage Knowledge → Add**

Ví dụ nội dung:
```markdown
# Project Context
- App quiz game cho học sinh
- Responsive: mobile-first
- Mascot: linh vật rồng
- Color theme: đỏ vàng (Tết)

# Technical Decisions
- Sử dụng thư viện usegamigameapi
- totalQuestions luôn = 5
- API timeout = 5 giây
```

### 📋 Plan Mode

Dùng cho các task phức tạp, nhiều bước:

1. Mô tả yêu cầu tổng quan
2. Lovable tạo plan chi tiết
3. Review và approve từng phần
4. Thực hiện tuần tự

**Khi nào dùng:**
- Tích hợp thư viện mới
- Refactor lớn
- Multi-feature implementation

### ⏪ History & Rollback

**Truy cập:** Click icon History ở toolbar

**Tính năng:**
- Xem lịch sử tất cả thay đổi
- Preview code tại mỗi thời điểm
- Rollback về version cũ nếu cần
- Compare changes giữa các version

### 🔐 Secrets Management

Lưu trữ API keys an toàn:

**Settings → Secrets → Add Secret**

```typescript
// Sử dụng trong Edge Functions
const apiKey = Deno.env.get('MY_API_KEY');
```

**⚠️ Lưu ý:**
- KHÔNG hardcode API keys trong code
- Publishable keys có thể để trong code
- Private keys PHẢI dùng Secrets

---

## 5. Debug & Troubleshooting

### 🔍 Sử dụng Console Logs

Lovable có thể đọc console logs từ preview:

```typescript
// Thêm logs để debug
console.log('Current state:', state);
console.log('API response:', data);
```

Khi gặp lỗi, Lovable sẽ tự động đọc logs để phân tích.

### 🔧 Try to Fix Button

Khi có lỗi build/runtime:
1. Lovable hiển thị nút **"Try to Fix"**
2. Click để AI tự động phân tích và sửa
3. **Miễn phí** - không tốn credits!

**Tip:** Nếu "Try to Fix" không hiệu quả sau 2-3 lần, hãy mô tả vấn đề chi tiết hơn.

### ⚡ Instance Upgrade

Nếu app chậm hoặc timeout:

**Settings → Cloud → Advanced Settings → Instance Size**

| Size | Use case |
|------|----------|
| Small | Development, testing |
| Medium | Production nhỏ |
| Large | High traffic |

**Lưu ý:** Instance lớn hơn = chi phí cao hơn

### 🐛 Debugging Checklist

```markdown
□ Kiểm tra Console logs
□ Kiểm tra Network requests (API calls)
□ Thử "Try to Fix" (miễn phí)
□ Rollback về version hoạt động
□ Mô tả chi tiết lỗi + steps to reproduce
□ Upgrade instance nếu timeout
```

---

## 6. Best Practices từ Project Quiz Game

### 📱 Routing cho Responsive App

```typescript
// App.tsx - 3 routes cho 1 app responsive
<Routes>
  <Route path="/" element={<Index />} />      {/* Auto-detect */}
  <Route path="/mobile" element={<MobileGame />} />
  <Route path="/desktop" element={<DesktopGame />} />
</Routes>

// Index.tsx - Auto redirect
const { isMobile } = useDeviceType();
if (isMobile) return <Navigate to="/mobile" />;
return <Navigate to="/desktop" />;
```

### 🎮 Tích hợp External Library

**Prompt mẫu đã dùng:**

```markdown
🎯 TÍCH HỢP THƯ VIỆN usegamigameapi

Đọc kỹ thư viện tại:
👉 https://www.npmjs.com/package/usegamigameapi

⚠️ RÀNG BUỘC:
- Sử dụng đúng 100% các biến từ ví dụ
- KHÔNG đổi tên biến
- KHÔNG viết lại theo cách khác
- Giữ nguyên UI hiện tại
```

### 🛡️ Null Safety Pattern

```typescript
// Luôn validate data từ API
const questionText = quiz?.text ?? quiz?.content ?? '';
const answers = quiz?.answers ?? [];

// Fallback cho missing data
{answers.length > 0 ? (
  answers.map((a, i) => <Answer key={i} {...a} />)
) : (
  <EmptyState message="Không có đáp án" />
)}
```

### 🔄 Query String cho Testing

```typescript
// Đọc query params
const urlParams = new URLSearchParams(window.location.search);
const useSample = urlParams.get('sample') === 'true';

// Usage
// ?sample=true  → Dùng sample data
// ?sample=false → Gọi API thật
```

### 📊 Fixed Progress Pattern

```typescript
// Config: totalQuestions luôn cố định
export const gameConfig = {
  fixedTotalQuestions: 5,
};

// UI: Progress luôn hiển thị đủ 5 bước
{Array.from({ length: gameConfig.fixedTotalQuestions }).map((_, i) => (
  <Step 
    key={i} 
    active={i <= currentQuestionIndex}
    current={i === currentQuestionIndex}
  />
))}
```

### 💡 Lessons Learned

1. **LOCK instructions là must-have** khi tích hợp features mới
2. **Chia nhỏ prompt** - mỗi prompt làm 1 việc rõ ràng
3. **Tách logic khỏi UI** - dễ maintain, dễ test
4. **Config tập trung** - tất cả magic numbers vào config file
5. **Null safety everywhere** - API có thể trả về bất kỳ thứ gì
6. **Assets theo device** - optimize cho từng platform

---

## 7. Tài liệu tham khảo

### 📖 Official Documentation

- [Lovable Docs](https://docs.lovable.dev/)
- [Quick Start Guide](https://docs.lovable.dev/user-guides/quickstart)
- [Lovable Cloud](https://docs.lovable.dev/features/cloud)
- [Visual Edits](https://docs.lovable.dev/features/visual-edit)

### 🎥 Video Tutorials

- [Lovable YouTube Playlist](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

### 💬 Community

- [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

### 💰 Pricing

- [Pricing Page](https://lovable.dev/pricing)
- [Student Discount](https://lovable.dev/students)

---

## 📝 Changelog

| Ngày | Thay đổi |
|------|----------|
| 2025-01-29 | Tạo guide ban đầu từ project Quiz Game |

---

> **Đóng góp:** Nếu bạn có thêm kinh nghiệm hay, hãy cập nhật file này và commit lên repo!
