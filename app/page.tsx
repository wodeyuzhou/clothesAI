"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// 상단 카테고리 배열
const categories = [
  "전체",
  "상의",
  "맨투맨",
  "후드 티셔츠",
  "셔츠/블라우스",
  "티셔츠",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("전체"); // ✅ 선택된 카테고리 상태 추가
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const loadingText = "어울리는 옷을 찾는 중입니다...";

  // 추천 코디 생성 함수
  const generateRecommendations = () => {
    setIsSearching(true); // "찾는 중..." 상태로 변경
    setTimeout(() => {
      setIsSearching(false);
      setRecommendations([
        "/recommendation1.jpg",
        "/recommendation2.jpg",
        "/recommendation3.jpg",
      ]); // 가상의 추천 코디 이미지
    }, 5000);
  };

  // 상품 데이터 (기본값)
  const initialProducts = Array.from({ length: 12 }).map((_, index) => ({
    id: index + 1,
    brand: "브랜드 " + (index + 1),
    name: "제품 이름 " + (index + 1),
    price: (10000 * (index + 1)).toLocaleString(),
    discount: `${10 + index * 5}%`,
    hearts: (index + 1) * 10,
    rating: "4.5",
    reviews: 10,
    image: "/product-image.jpg",
  }));

  const [products, setProducts] = useState(initialProducts);

  // 클라이언트에서만 동적 데이터를 업데이트
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        hearts: Math.floor(Math.random() * 100),
        reviews: Math.floor(Math.random() * 50) + 1,
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* 공통 컨테이너 */}
      <div className="w-full max-w-[420px] mx-auto flex flex-col bg-white">
        {/* 상단 로고 및 검색 바 */}
        <header className="bg-gray-50 border-l border-r border-gray-150 p-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="text-xs font-bold">🛍️ Shop</h1>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="border border-gray-300 rounded-lg px-2 py-1 text-[10px] w-2/3"
          />
        </header>

        {/* 상단 카테고리 네비게이션 */}
        <nav className="bg-gray-50 border-l border-r border-b border-gray-150 px-4 sticky top-[48px] z-40">
          <div className="mt-2 flex space-x-2 text-xs text-gray-700 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)} // ✅ 클릭 시 선택된 카테고리 변경
                className={`flex-shrink-0 px-2 py-1 ${
                  selectedCategory === category ? "font-bold border-b-2 border-black text-black" : "text-gray-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="p-0 bg-white border-l border-r border-gray-150">
          {/* 필터 섹션 */}
          <div className="flex items-center justify-between px-2 py-1 bg-gray-50 border-b border-gray-150 text-[10px]">
            {/* 왼쪽: 스냅보기 */}
            <div className="flex items-center space-x-1">
              <label htmlFor="snap-toggle" className="text-gray-500">
                
              </label>
              <input
                id="snap-toggle"
                className="h-3 w-3 accent-gray-500"
              />
            </div>
            {/* 오른쪽: 정렬 및 보기 방식 */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-1 text-gray-600">
                <span>추천순</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"  // 👈 아래 방향 화살표 (V 모양)
                    />
                </svg>
              </button>
            </div>
          </div>

          {/* 상품 리스트 */}
          <div className="grid grid-cols-3 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col">
                {/* 이미지 */}
                <div className="relative w-full h-40 bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                {/* 텍스트 정보 */}
                <div className="p-1">
                  <p className="text-[9px] font-bold text-gray-700 truncate">
                    {product.brand}
                  </p>
                  <p className="text-[9px] text-gray-800 truncate">{product.name}</p>
                  <p className="text-[9px]">
                    <span className="text-red-500 font-bold">{product.discount}</span>{" "}
                    <span className="text-black font-bold">{product.price}원</span>
                  </p>
                  <div className="flex items-center text-[8px] text-gray-500 space-x-1 mt-1">
                    <span className="text-red-500">❤️ {product.hearts}</span>
                    <span className="text-yellow-500">⭐ {product.rating}</span>
                    <span>({product.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* 하단 고정 네비게이션 */}
        <footer className="bg-gray-50 border-t border-l border-r border-gray-150 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[420px] mx-auto flex justify-around p-2 text-[8px] shadow-lg z-50">
          <button className="flex flex-col items-center">
            <span>🏠</span>
            <span>카테고리</span>
          </button>
          <button className="flex flex-col items-center">
            <span>📷</span>
            <span>스냅</span>
          </button>
          <button className="flex flex-col items-center">
            <span>🏬</span>
            <span>홈</span>
          </button>
          <button className="flex flex-col items-center">
            <span>❤️</span>
            <span>좋아요</span>
          </button>
          <button className="flex flex-col items-center">
            <span>👤</span>
            <span>마이</span>
          </button>
        </footer>
        
        {/* ✅ 프롬프트 입력 UI (이미지 업로드 추가 & 추천된 옷 표시) ✅ */}
      <div
        className={`fixed bottom-[50px] left-1/2 transform -translate-x-1/2 w-full max-w-[380px] mx-auto bg-white shadow-lg rounded-xl p-2 flex flex-col items-center space-y-2 border border-gray-300 transition-all duration-300 ${
          recommendations && !isSearching ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (recommendations && !isSearching) {
            document.getElementById("recommendations-popup")?.classList.remove("hidden");
          }
        }}
      >
        {isSearching ? (
          // ✅ 왼쪽부터 차례로 깜박이는 애니메이션 적용
          <p className="flex-1 text-center text-sm font-bold text-gray-600 tracking-wide">
            {loadingText.split("").map((char, index) => (
              <span key={index} className="loading-text" style={{ animationDelay: `${index * 0.05}s` }}>
                {char}
              </span>
            ))}
          </p>
        ) : recommendations ? (
          // ✅ 반짝이는 효과 적용
          <p className="text-center text-sm font-bold text-blue-500 cursor-pointer shimmer-effect">
            추천된 옷을 확인하세요!
          </p>
        ) : (
          <div className="w-full flex items-center space-x-2">
            <input
              type="text"
              placeholder="여행갈 때 입을 옷을 추천해줘"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none"
            />
            {/* 이미지 업로드 버튼 */}
            <label className="cursor-pointer bg-gray-200 px-3 py-1 rounded-lg">
              📷
              <input type="file" accept="image/*" className="hidden" />
            </label>
            {/* 전송 버튼 */}
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-lg"
              onClick={generateRecommendations}
            >
              전송
            </button>
          </div>
        )}
      </div>

      {/* ✅ 추천 코디 결과 (클릭하면 전체 화면으로 확장) ✅ */}
      <div
        id="recommendations-popup"
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden"
      >
        <div className="bg-white p-6 rounded-xl text-center w-[90%] max-w-[400px]">
          <h2 className="text-lg font-bold mb-3">추천된 코디</h2>
          <div className="grid grid-cols-3 gap-2">
            {recommendations?.map((img, index) => (
              <div key={index} className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                <Image src={img} alt={`추천 코디 ${index + 1}`} layout="fill" objectFit="cover" />
              </div>
            ))}
          </div>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => document.getElementById("recommendations-popup")?.classList.add("hidden")}
          >
            닫기
          </button>
        </div>
      </div>

      {/* ✅ CSS 애니메이션 효과 */}
      <style jsx>{`
        /* 개별 글자가 순서대로 깜박이는 효과 */
        .loading-text {
          opacity: 0;
          animation: blink 1.5s infinite ease-in-out;
        }

        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* 반짝이는 효과 */
        .shimmer-effect {
          animation: shimmer 1.5s infinite alternate;
        }

        @keyframes shimmer {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  </div>
)
}