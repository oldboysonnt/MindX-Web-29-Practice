window.onload = () => {

  const submitForm = document.querySelector('#search');
  const resultList = document.querySelector('#result-list');
  const wrapper = document.querySelector('#wrapper');
  const fetchLoading = document.querySelector('.fetch-loading');
  document.querySelector('#keyword').addEventListener('input', debounce(() => {
    resultList.innerHTML = ``;
    const value = document.querySelector('#keyword').value;

    //event.preventDefault();
    //document.querySelector('#keyword').value = '';
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${value}&type=video&key=AIzaSyA9gQZ-oYomFypZN7PsupZJtOfQqA6Q3qw`)
      .then(response => {
        fetchLoading.innerHTML = `
            <div class="spinner-border text-danger" role="status">
                  <span class="sr-only text-center">Loading...</span>
            </div>
            `;
        return response.json();
      })
      .then(data => {

        console.log(data);
        
        fetchLoading.innerHTML = ``;
        const itemArray = data.items;
        
        if (itemArray === undefined) {
          document.querySelector('.notify-noresult').innerHTML = `
                <div class="text-info font-italic"> Không tìm thấy kết quả </div>   `;
        } else {
          document.querySelector('.notify-noresult').innerHTML = ``;
          for (item of itemArray) {

            const itemHTML =
              `
                <a class='result col-md-12' href='https://www.youtube.com/watch?v=${item.id.videoId}' target='_blank'>
                <div class='row'>
                  <div class='col-4'>
                    <img src='${item.snippet.thumbnails.default.url}' />
                  </div>
                  <div class='col-8'>
                    <div class='video-info'>
                      <h2 class='title'>${item.snippet.title}</h2>
                      <p class='description'>${item.snippet.description}</p>
                      <span>View >></span>
                    </div>
                  </div>
                </div>
              </a>
                `;

            resultList.insertAdjacentHTML('beforeend', itemHTML);
          }


          window.addEventListener('scroll', () => {

            if (window.scrollY + window.innerHeight + 100 >= document.documentElement.scrollHeight) {
              fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${value}&type=video&key=AIzaSyA9gQZ-oYomFypZN7PsupZJtOfQqA6Q3qw&pageToken=${data.nextPageToken}`)
                .then(response => {
                  fetchLoading.innerHTML = `
                      <div class="spinner-border text-danger" role="status">
                            <span class="sr-only text-center">Loading...</span>
                      </div>
                      `;
                  return response.json();
                })
                .then(nextData => {

                  const nextItemArray = nextData.items;

                  for (item of nextItemArray) {


                    const nextItemHTML =
                      `
                            <a class='result col-md-12' href='https://www.youtube.com/watch?v=${item.id.videoId}' target='_blank'>
                            <div class='row'>
                              <div class='col-4'>
                                <img src='${item.snippet.thumbnails.default.url}' />
                              </div>
                              <div class='col-8'>
                                <div class='video-info'>
                                  <h2 class='title'>${item.snippet.title}</h2>
                                  <p class="description">${item.snippet.description}</p>
                                  <span>View >></span>
                                </div>
                              </div>
                            </div>
                          </a>
                            `;

                    resultList.insertAdjacentHTML('beforeend', nextItemHTML);
                  }
                  fetchLoading.innerHTML = ``;
                })
            }
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  }), 1000);
}

function debounce(func, wait) {

  var timeout;

  return function () {
    var context = this,
      args = arguments;

    var executeFunction = function () {
      func.apply(context, args);
    }

    clearTimeout(timeout)
    timeout = setTimeout(executeFunction, wait);
  }
}

