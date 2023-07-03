import "../styles/NotFound.css";
// svg 를 component 형식으로 import 하면 편집 가능
import { ReactComponent as NotFoundSvg } from "../assets/images/not_found.svg";

const NotFound = () => {
  // svg 파일에서 편집할 색상을 current 로 지정하면
  // 컴포넌트 fill 속성의 값으로 채워짐
  return (
    <main className="NotFound">
      <NotFoundSvg
        className="not-found-img"
        fill={getComputedStyle(document.documentElement).getPropertyValue(
          "--primary"
        )}
      />
      <h1>404 Not Found</h1>
      <p>요청한 URL 페이지를 찾을 수 없습니다.</p>
    </main>
  );
};

export default NotFound;