import { useState, useReducer, useRef } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import "../../css/Note/NoteDetail.css";
import "../../css/Note/Content.css";
import "../../css/Note/NotePrint.css";
import {
  getSubDetailHandler,
  deleteSubHandler,
} from "../../service/note.service";
import { RxDot, RxDotFilled } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { IoPrint } from "react-icons/io5";
import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import { RiBallPenFill, RiGoogleFill } from "react-icons/ri";
import {
  FaTags,
  FaClipboard,
  FaCheck,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa";

export const detailLoader = async ({ params }) => {
  const subid = params?.subid;
  const { data, keys } = await getSubDetailHandler(subid);
  return { data, keys };
};

const showMsg = (ele) => {
  ele.style.animationName = "popUp";
  ele.style.animationDuration = "3s";
  setTimeout(() => {
    ele.style.animationName = "";
    ele.style.animationDuration = "";
  }, 3000);
};

const NoteDetail = () => {
  const { catid, subid } = useParams();
  const { data, keys } = useLoaderData();
  const nav = useNavigate();
  const [subject] = useState({ ...data });
  const [keywords] = useState([...keys]);
  const [bookmark, setBookmark] = useState(subject.s_bookmark);
  const [msg, setMsg] = useState("");
  const [copyMsg, setCopyMsg] = useState("키워드 복사");
  const [position, setPosition] = useState(0);
  const bookmarkRef = useRef(null);

  const changeKeyword = (state, action) => {
    switch (action.type) {
      case "PREV":
        if (state > 1) {
          setPosition(position + 100);
          return state - 1;
        }
        if (state === 1) {
          setPosition((action.payload - 1) * 100 * -1);
          return action.payload;
        }
      case "NEXT":
        if (state < action.payload) {
          setPosition(position - 100);
          return state + 1;
        }
        if (state === action.payload) {
          setPosition(0);
          return 1;
        }
      case "SELECT": {
        setPosition((action.payload - 1) * 100 * -1);
        return action.payload;
      }
      default: {
        setPosition(state * 100 * -1);
        return state;
      }
    }
  };
  const [state, dispatch] = useReducer(changeKeyword, 1);

  const bookmarkHandler = async () => {
    try {
      let res = await fetch(`/note/sub/bookmark/${subid}`, { method: "PATCH" });
      res = await res.json();
      if (res.error) {
        alert(res.error);
      } else {
        setBookmark(res.result);
        setMsg(res.MESSAGE);
        showMsg(bookmarkRef.current);
      }
    } catch (error) {
      console.log(error);
      alert("서버 접속 중 오류가 발생했습니다.");
    }
  };

  const deleteHandler = async () => {
    if (!window.confirm("이 주제를 삭제할까요?")) {
      return false;
    } else {
      const res = await deleteSubHandler(catid, subid);
      if (res) {
        alert(res);
        nav(`/note/category/${catid}`, { replace: true });
      }
    }
  };

  const copyKeyword = () => {
    const value = keywords[state - 1].k_keyword;
    navigator.clipboard.writeText(value);
    setCopyMsg("복사 완료!");
    setTimeout(() => {
      setCopyMsg("키워드 복사");
    }, 3000);
  };

  const keywordList = keywords.map((ele, idx) => {
    return (
      <div
        key={`${ele.k_keyid}-${idx}`}
        data-id={ele.k_index}
        className="keyword"
      >
        <div className="top-box">
          <div className="key">{ele.k_keyword}</div>
          <div className="wrong">틀린 횟수: {ele.k_wrongcount}</div>
        </div>
        <div className="desc">{ele.k_desc}</div>
      </div>
    );
  });
  const [keywordSlide] = useState([...keywordList]);

  const keywordDot = keywords.map((ele, idx) => {
    return (
      <button
        key={`${ele.k_keyid}-${idx}`}
        className={state === ele.k_index ? "keyword-dot active" : "keyword-dot"}
        onClick={() => dispatch({ type: "SELECT", payload: ele.k_index })}
      >
        {state === ele.k_index ? <RxDotFilled /> : <RxDot />}
        {ele.k_keyword}
      </button>
    );
  });

  return (
    <article className="Detail">
      <section className="menu">
        <div className="bookmark-wrap">
          <button
            className={bookmark === 0 ? "bookmark-btn" : "bookmark-btn active"}
            value={bookmark}
            onClick={bookmarkHandler}
          >
            {bookmark === 0 ? <RxBookmark /> : <RxBookmarkFilled />}
            북마크
          </button>
          <div className="bookmark msg" ref={bookmarkRef}>
            {msg}
          </div>
        </div>
        <Link className="write" to={`/note/write/${catid}/${subid}`}>
          <RiBallPenFill />
          수정
        </Link>
        <button className="delete" onClick={deleteHandler}>
          <MdDelete />
          삭제
        </button>
        <button onClick={() => window.print()}>
          <IoPrint />
          인쇄
        </button>
        <a
          className="search"
          href={`https://google.com/search?q=${subject.s_subject}`}
          target="_blank"
          rel="noreferrer"
        >
          <RiGoogleFill />
          검색
        </a>
      </section>
      <section className="title">
        <div className="subject">{subject.s_subject}</div>
        <Link className="category" to={`/note/category/${catid}`}>
          {subject.s_category}
        </Link>
      </section>
      <section className="keyword-list-top">
        <div className="keyword-count">
          <FaTags />
          {state} / {subject.s_keycount}
        </div>

        <button className="copy-btn" onClick={copyKeyword}>
          {copyMsg === "키워드 복사" ? <FaClipboard /> : <FaCheck />}
          <span className="copy-msg">{copyMsg}</span>
        </button>
      </section>
      <section className="keyword-slide">
        <button
          className="prev"
          onClick={() => dispatch({ type: "PREV", payload: keywords?.length })}
        >
          <FaCaretLeft />
        </button>
        <div className="keyword-list-wrap">
          <div
            className="keyword-list"
            style={{ transform: `translateX(${position}%)` }}
          >
            {keywordSlide}
          </div>
        </div>
        <button
          className="next"
          onClick={() => dispatch({ type: "NEXT", payload: keywords?.length })}
        >
          <FaCaretRight />
        </button>
      </section>
      <div className="keyword-list-bottom">{keywordDot}</div>
      <section className="content">
        <div dangerouslySetInnerHTML={{ __html: subject?.s_content }}></div>
      </section>
    </article>
  );
};
export default NoteDetail;
