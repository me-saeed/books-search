import { useState, useEffect } from 'react';
import './Test.css';
function App() {
  const [booksList, setbooksList] = useState([]);

  const [bookTitle, setbookTitle] = useState('');

  const [isLoading, setisLoading] = useState(false);
  const [errMsg, seterrMsg] = useState('');

  const sortMostRecent = async () => {
    booksList.sort(function (a, b) {
      if (a.hasOwnProperty('publish_date') && b.hasOwnProperty('publish_date'))
        return new Date(b.publish_date[0]) - new Date(a.publish_date[0]);
    });

    setbooksList((booksList) => [...booksList]);
  };
  const sortAlphabatic = async () => {
    booksList.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });

    setbooksList((booksList) => [...booksList]);
  };
  const searchBytitle = async () => {
    setisLoading(true);
    fetch(`http://openlibrary.org/search.json?title=${bookTitle}`)
      .then((response) => response.json())
      .then((data) => {
        setbookTitle('');
        setbooksList(data.docs);
        setisLoading(false);
      })
      .catch((err) => {
        seterrMsg(err);
      });
  };

  function checkImage(imageSrc) {
    var image = new Image();
    image.src = imageSrc;
    image.onload = function () {
      if (this.width > 0) {
        console.log('image exists');
        return imageSrc;
      }
    };
    image.onerror = function () {
      console.log("image doesn't exist");
    };
  }

  return (
    <div className='App'>
      <label className='bookname'> Book Title:</label>
      <input
        className='bookinput'
        type='text'
        value={bookTitle}
        onChange={(e) => setbookTitle(e.target.value)}
      />

      <button className='btn-search' onClick={searchBytitle}>
        Search
      </button>

      <br />
      {isLoading == true ? (
        <>
          <h4>
            <b> Loading Please Wait............</b>
          </h4>
        </>
      ) : (
        <>
          {booksList != '' && (
            <>
              <button className='btn-search' onClick={sortAlphabatic}>
                Sort Alphabetical
              </button>
              <button className='btn-search' onClick={sortMostRecent}>
                Sort Most Recent
              </button>
            </>
          )}
          <div className='searchcontainer'>
            {booksList.map((s, i) => (
              <>
                <div class='card'>
                  {s.hasOwnProperty('isbn') == true ? (
                    <img
                      src={
                        'http://covers.openlibrary.org/b/isbn/' +
                        s.isbn[0] +
                        '-L.jpg'
                      }
                      alt='Avatar'
                      className='imgavat'
                    />
                  ) : null}

                  <div class='container'>
                    <h4>
                      <b>{s.title}</b>
                    </h4>
                    <div class='date'>
                      {s.hasOwnProperty('publish_date') == true ? (
                        <>{s.publish_date[0]}</>
                      ) : null}
                    </div>
                    <p>
                      {s.author_name}
                      {s.hasOwnProperty('author_name') == true ? (
                        <>{s.author_name[0]}</>
                      ) : null}
                    </p>
                  </div>
                </div>{' '}
              </>
            ))}

            {errMsg && (
              <>
                <h3>{errMsg}</h3>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
