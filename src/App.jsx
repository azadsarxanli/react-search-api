import { useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";

import "./App.css";

// const data = [
//   { id: 1, title: "test1" },
//   { id: 2, title: "test2" },
//   { id: 3, title: "deneme1" },
//   { id: 4, title: "deneme2" },
// ];
const AutoCompleteLoader = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={150}
    viewBox="0 0 400 150"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="25" y="15" rx="5" ry="5" width="500" height="10" />
    <rect x="25" y="45" rx="5" ry="5" width="500" height="10" />
    <rect x="25" y="75" rx="5" ry="5" width="500" height="10" />
    <rect x="25" y="105" rx="5" ry="5" width="500" height="10" />
  </ContentLoader>
);

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef();
  const isTyping = search.replace(/\s+/, "").length > 0;
  const inputClassName = isTyping ? "typing" : null;
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);
  useEffect(() => {
    console.log(loading);
  }, [loading]);

  useEffect(() => {
    if (isTyping) {
      // setResult(filteredResult.length > 0 ? filteredResult : false);
      setLoading(true);
      const getData = setTimeout(() => {
        fetch("https://jsonplaceholder.typicode.com/albums")
          .then((response) => response.json())
          .then((data) => {
            const filteredResult = data.filter((item) =>
              item.title.toLowerCase().includes(search.toLowerCase())
            );
            setResult(filteredResult.length > 0 ? filteredResult : false);
            setLoading(false);
          });
      }, 500);

      return () => {
        clearInterval(getData);
        setLoading(false);
      };
    } else {
      setResult(false);
    }
  }, [search]);

  //Handler
  const onChangeHandler = (e) => {
    setSearch(e.target.value);
  };
  const handleClickOutSide = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearch("");
    }
  };

  return (
    <div className="search" ref={searchRef}>
      <input
        value={search}
        className={inputClassName}
        placeholder="Search it..."
        onChange={onChangeHandler}
      />
      {isTyping && (
        <div className="search-result">
          {result &&
            loading === false &&
            result.map((item) => (
              <div key={item.id} className="search-result-item">
                {item.title}
              </div>
            ))}
          {loading && <AutoCompleteLoader />}
          {!result && loading === false && (
            <div className="result-not-found">Nəticə tapılmadı.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
