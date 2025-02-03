"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리 상태
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [expanded, setExpanded] = useState(false); // 박스 확장 여부
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0); // 장바구니 개수

  // flyingItem 상태: 애니메이션을 위해 임시로 렌더링되는 이미지의 src와 스타일 정보
  const [flyingItem, setFlyingItem] = useState<{
    src: string;
    style: React.CSSProperties;
  } | null>(null);

  const cartIconRef = useRef<HTMLDivElement>(null); // 장바구니 아이콘 ref

  const loadingText = "어울리는 옷을 찾는 중입니다...";

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 추천 코디 생성 함수
  const generateRecommendations = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setExpanded(false);
      setRecommendations([
        "/recommendation1.jpg",
        "/recommendation2.jpg",
        "/recommendation3.jpg",
      ]);
    }, 7000);
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

  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        hearts: Math.floor(Math.random() * 100),
        reviews: Math.floor(Math.random() * 50) + 1,
      }))
    );
  }, []);

  // 추천 코디 이미지 클릭 시 호출되는 핸들러
  const handleRecommendationClick = (
    imgSrc: string,
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    // 뷰포트 좌표 + 스크롤 오프셋으로 문서 내 좌표 계산
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const startRect = {
      top: rect.top + scrollY,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    const cartRectViewport = cartIconRef.current?.getBoundingClientRect();
    if (!cartRectViewport) return;
    const cartRect = {
      top: cartRectViewport.top + scrollY,
      left: cartRectViewport.left,
      width: cartRectViewport.width,
      height: cartRectViewport.height,
    };

    // 1. 초기 flying image 스타일 설정
    const initialStyle: React.CSSProperties = {
      position: "absolute",
      top: startRect.top,
      left: startRect.left,
      width: startRect.width,
      height: startRect.height,
      transition: "all 0.4s ease-in-out",
      zIndex: 1000,
    };
    setFlyingItem({ src: imgSrc, style: initialStyle });

    // 2. 첫 단계: 시작 위치 -> 화면 중앙 (0~400ms)
    const centerX = window.innerWidth / 2 - startRect.width / 2;
    const centerY = window.innerHeight / 2 - startRect.height / 2 + scrollY;
    setTimeout(() => {
      setFlyingItem((prev) =>
        prev
          ? {
              ...prev,
              style: {
                ...prev.style,
                top: centerY,
                left: centerX,
              },
            }
          : null
      );
    }, 0);

    // 3. 두 번째 단계: 화면 중앙 -> 장바구니 아이콘 (400~800ms)
    setTimeout(() => {
      setFlyingItem((prev) =>
        prev
          ? {
              ...prev,
              style: {
                ...prev.style,
                top:
                  cartRect.top +
                  cartRect.height / 2 -
                  startRect.height / 2,
                left:
                  cartRect.left +
                  cartRect.width / 2 -
                  startRect.width / 2,
                transform: "scale(0.2)",
                opacity: 0,
                transition: "all 0.4s ease-in-out",
              },
            }
          : null
      );
    }, 400);

    // 4. 애니메이션 완료 후 flying image 제거 및 장바구니 개수 증가
    setTimeout(() => {
      setFlyingItem(null);
      setCartCount((prev) => prev + 1);
    }, 800);
  };

  return (
    <>
      <Head>
        {/* 모바일 브라우저에서 확대 방지를 위한 설정 및 PWA 관련 meta 태그 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href="/manifest.json" />
        <title>My Shop</title>
      </Head>
      <div className="min-h-screen bg-gray-200 relative">
        {flyingItem && (
          <Image
            src={flyingItem.src}
            alt="Flying item"
            style={flyingItem.style}
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover"
          />
        )}

        <div className="w-full max-w-[420px] mx-auto flex flex-col bg-white">
          <header className="bg-gray-50 border-l border-r border-gray-150 p-4 flex items-center justify-between sticky top-0 z-50">
            <h1 className="text-xs font-bold">🛍️ Shop</h1>
            <div className="flex items-center space-x-4">
              <span className="text-xl cursor-pointer">🔍</span>
              <div ref={cartIconRef} className="relative cursor-pointer">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </header>

          <nav className="bg-gray-50 border-l border-r border-b border-gray-150 px-4 sticky top-[48px] z-40">
            <div className="mt-2 flex space-x-2 text-xs text-gray-700 overflow-x-auto no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-2 py-1 ${
                    selectedCategory === category
                      ? "font-bold border-b-2 border-black text-black"
                      : "text-gray-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>

          <main className="p-0 bg-white border-l border-r border-gray-150">
            <div className="flex items-center justify-between px-2 py-1 bg-gray-50 border-b border-gray-150 text-[10px]">
              <div className="flex items-center space-x-1">
                <label htmlFor="snap-toggle" className="text-gray-500"></label>
                <input
                  id="snap-toggle"
                  className="h-3 w-3 accent-gray-500"
                />
              </div>
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
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-y-12">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col">
                  <div className="relative w-full h-40 bg-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-1">
                    <p className="text-[9px] font-bold text-gray-700 truncate">
                      {product.brand}
                    </p>
                    <p className="text-[9px] text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-[9px]">
                      <span className="text-red-500 font-bold">
                        {product.discount}
                      </span>{" "}
                      <span className="text-black font-bold">
                        {product.price}원
                      </span>
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

          <div
            className={`fixed bottom-[50px] left-1/2 transform -translate-x-1/2 w-full max-w-[420px] mx-auto bg-white shadow-lg rounded-xl p-4 flex flex-col items-center space-y-4 border border-gray-300 transition-all duration-700 ease-in-out overflow-hidden ${
              expanded ? "max-h-[450px]" : "max-h-[80px]"
            }`}
          >
            {isSearching ? (
              <p className="flex-1 text-center text-sm font-bold text-gray-600 tracking-wide">
                {loadingText.split("").map((char, index) => (
                  <span
                    key={index}
                    className="loading-text"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {char}
                  </span>
                ))}
              </p>
            ) : recommendations ? (
              !expanded ? (
                <p
                  className="text-center text-sm font-bold text-blue-500 cursor-pointer shimmer-effect"
                  onClick={() => setExpanded(true)}
                >
                  추천된 옷을 확인하세요!
                </p>
              ) : (
                <div className="w-full flex flex-col items-center transition-all duration-300 ease-in-out">
                  <h2 className="text-lg font-bold text-center mb-2">
                    추천된 코디
                  </h2>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {recommendations.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                      >
                        <Image
                          src={img}
                          alt={`추천 코디 ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          onClick={(e) => handleRecommendationClick(img, e)}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-4 bg-gray-200 text-black px-4 py-1 rounded-lg w-250"
                    onClick={() => setExpanded(false)}
                  >
                    닫기
                  </button>
                </div>
              )
            ) : (
              <div className="w-full flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="여행갈 때 입을 옷을 추천해줘"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none"
                  style={{ fontSize: "16px" }}
                />
                <label className="cursor-pointer bg-gray-200 px-3 py-1 rounded-lg">
                  {imagePreview ? "✅" : "📷"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                  onClick={generateRecommendations}
                >
                  전송
                </button>
              </div>
            )}
          </div>

          <style jsx>{`
            .loading-text {
              opacity: 0;
              animation: blink 1.5s infinite ease-in-out;
            }

            @keyframes blink {
              0% {
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }

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
    </>
  );
}