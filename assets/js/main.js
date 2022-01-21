window.addEventListener("load", function () {
  // Music
  const songs = [
    {
      name: 'Đoạn tuyệt nàng đi',
      author: 'Phát Huy',
      image: 'https://cdn.tgdd.vn//GameApp/1257005//huong-dan-choi-florentino-mua-14-bang-ngoc-phu-hieu-va-cach-choi-thumb800-800x450.jpg',
      song: 'Đoạn tuyệt nàng đi',
      duration: '04:58',
    },
    {
      name: 'Hãy trao cho anh',
      author: 'Sơn Tùng',
      image: 'https://image-us.24h.com.vn/upload/3-2021/images/2021-08-25/7dddeba4-553e-4dc3-be90-205779b33f5b-1629856734-80-width650height975.jpeg',
      song: 'Hãy trao cho anh',
      duration: '03:35',
    },
    {
      name: 'Chuỗi ngày vắng em',
      author: 'Châu Khải Phong',
      image: 'https://i.scdn.co/image/ab67616d0000b2737eb5530759478f87e73c49f9',
      song: 'Chuỗi ngày vắng em',
      duration: '04:40',
    },
    {
      name: 'Đoạn Tuyệt Nàng Đi Lofi',
      author: 'Phát Huy',
      image: 'https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg',
      song: 'Đoạn Tuyệt Nàng Đi Lofi',
      duration: '03:52',
    },
    {
      name: 'Gọi anh là Airline',
      author: 'Masew',
      image: 'https://i.ytimg.com/vi/pi34V4e2e5U/maxresdefault.jpg',
      song: 'Gọi anh là Airline',
      duration: '01:18',
    },
  ];
  const musicName = document.querySelector(".music-user__name");
  const musicAuthor = document.querySelector(".music-user__author");
  const musicImage = document.querySelector(".music-image");
  const musicImg = document.querySelector(".music-image img");
  const musicRandom = document.querySelector(".music-random");
  const musicRedo = document.querySelector(".music-redo");
  const playBtn = document.querySelector(".music-play");
  const prevBtn = document.querySelector(".music-prev");
  const nextBtn = document.querySelector(".music-next");
  const progressVolume = document.querySelector(".progress-volume");
  const audio = document.querySelector("#audio");
  const musicCurrent = document.querySelector(".music-current");
  const musicDuration = document.querySelector(".music-duration");
  const progressContainer = document.querySelector(".progress-container");
  const progress = document.querySelector(".progress");
  const controlVolume = document.querySelector(".music-control__volume");
  const songContentList = document.querySelector(".container-main__layout .overview .song-content__list");
  const progressMobile = document.querySelector(".progress-mobile div");
  const musicAngleDown = document.querySelector("#music .angle-down");
  let playing = true;
  let index = JSON.parse(localStorage.getItem("index")) || 0;

  // Music Mobile
  musicImage.addEventListener("click", function() {
    const musicMain = document.querySelector("#music .music-main");
    const containerHeader = document.querySelector("#main .container-header");
    containerHeader.style.zIndex = '1';
    musicMain.classList.add("active");
  })
  musicAngleDown.addEventListener("click", function() {
    const musicMain = document.querySelector("#music .music-main");
    const containerHeader = document.querySelector("#main .container-header");
    containerHeader.style.zIndex = '199';
    musicMain.classList.remove("active");
  })

  playBtn.addEventListener("click", handlePlayMusic);
  audio.addEventListener("timeupdate", handleUpdateTime);
  progressVolume.addEventListener("input", handleChangeVolume);
  progressVolume.value = JSON.parse(localStorage.getItem("volume")) * 100 || 100;
  audio.volume = JSON.parse(localStorage.getItem("volume")) || 1;

  // Render music main
  function renderMusic(song,indexSong) {
    const template = `<li class="song-content__item ${indexSong === index ? "active":""}">
    <div class="song-content__info">
      <span class="song-content__info-image">
        <img src="${song.image}" alt="">
        <div class="song-content__info-overplay ${indexSong === index ? "active":""}" data-index=${indexSong}>
          <i class='bx bxs-right-arrow song-content__info-play'></i>
          <div class="waveform">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </span>
      <div class="song-content__user">
        <div class="song-content__name">${song.name}</div>
        <div class="song-content__author"><a href="#">${song.author}</a></div>
      </div>
    </div>
    <div class="song-content__icon">
      <i class="fas fa-microphone song-content__icon-micro"></i>
      <i class="fas fa-heart song-content__icon-heart"></i>
      <i class="fas fa-ellipsis-h song-content__icon-ellipsis"></i>
      <span class="song-content__icon-duration">${song.duration}</span>
    </div>
  </li>`;
    
    songContentList.insertAdjacentHTML("beforeend", template);
  }
  songs.forEach((song,indexSong) => renderMusic(song,indexSong));
  songContentList.addEventListener("click", function(e) {
    if(e.target.matches(".song-content__info-overplay")) {
      if(e.target.classList.contains("active")) {
        playing = false;
      }
      else {
        playing = true;
      }
      e.target.classList.add("active");
      index = parseInt(e.target.dataset.index);
      localStorage.setItem("index", JSON.stringify(index));
      songContentList.textContent = "";
      songs.forEach((song,indexSong) => renderMusic(song,indexSong));
      handleRenderMusic(songs[index]);
      handlePlayMusic();
    }
    else if(e.target.matches(".song-content__info-play")) {
      e.target.parentElement.classList.add("active");
      index = parseInt(e.target.parentElement.dataset.index);
      localStorage.setItem("index", JSON.stringify(index));
      songContentList.textContent = "";
      songs.forEach((song,indexSong) => renderMusic(song,indexSong));
      handleRenderMusic(songs[index]);
      playing = true;
      handlePlayMusic();
      
    }
    else if(e.target.matches(".waveform")) {
      e.target.parentElement.classList.remove("active");
      handlePlayMusic();
    }
    updateDuration();
  })
  
  // Next music
  nextBtn.addEventListener("click", function () {
    handleChangeMusic(1);
  });

  // Previous music
  prevBtn.addEventListener("click", function () {
    handleChangeMusic(-1);
  });

  // Ended music 
  audio.addEventListener("ended", function () {
    handleChangeMusic(0);
  });

  // Random music
  musicRandom.addEventListener("click", function() {
    musicRandom.classList.toggle("active");
  });

  // Repeat music
  musicRedo.addEventListener("click", function() {
    musicRedo.classList.toggle("active");
  })

  function handleChangeVolume(e) {
    const percent =(e.target.value / 100);
    audio.volume = percent;
    localStorage.setItem("volume", JSON.stringify(percent));
  }
  function handleUpdateTime() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    progressMobile.style.width = `${progressPercent}%`;
    musicCurrent.textContent = convertTime(currentTime);
  }
  function convertTime(time) {
    let hours, minutes, seconds;
    hours = Math.floor(time / 3600);
    time %= 3600;
    minutes = Math.floor(time / 60);
    time %= 60;
    seconds = Math.floor(time);
    if (hours < 1) {
      return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
  }
  songContentList.querySelector(".song-content__item.active .song-content__info-overplay").classList.remove("active");
  function handlePlayMusic() {
    if (playing) {
      audio.play();
      musicImage.classList.add("active");
      songContentList.querySelector(".song-content__item.active .song-content__info-overplay").classList.add("active");
      playBtn.querySelector("i").classList.remove("fa-play");
      playBtn.querySelector("i").classList.add("fa-pause");
      playing = false;
    }
    else {
      audio.pause();
      musicImage.classList.remove("active");
      songContentList.querySelector(".song-content__item.active .song-content__info-overplay").classList.remove("active");
      playBtn.querySelector("i").classList.add("fa-play");
      playBtn.querySelector("i").classList.remove("fa-pause");
      playing = true;
    }
  }
  function handleRenderMusic(song) {
    musicName.textContent = song.name;
    musicAuthor.textContent = song.author;
    musicImg.src = song.image;
    audio.src = `./assets/music/${song.song}.mp3`;
  }
  function handleChangeMusic(num) {
    if (num === 1) {
      if(musicRandom.classList.contains("active")) {
        let random = Math.floor(Math.random() * songs.length);
        while(random === index) {
          random = Math.floor(Math.random() * songs.length);
        }
        index = random;
      }
      else {
        if (index >= songs.length - 1) {
          index = -1;
        }
        index++;
      }
    }
    else if(num === 0) {
      if(musicRedo.classList.contains("active")) {
        index = index;
      }
      else {
        if (index >= songs.length - 1) {
          index = -1;
        }
        index++;
      }
    }
    else if (num === -1) {
      if (index <= 0) {
        index = songs.length;
      }
      index--;
    }
    localStorage.setItem("index", JSON.stringify(index));
    songContentList.textContent = "";
    songs.forEach((song,indexSong) => renderMusic(song,indexSong));
    handleRenderMusic(songs[index]);
    updateDuration();
    playing = true;
    handlePlayMusic();
  }
  handleRenderMusic(songs[index]);
  function updateDuration() {
    setTimeout(() => {
      musicDuration.textContent = convertTime(audio.duration);
    }, 600);
  }
  updateDuration();

  // Drag and Drop
  let isReady = false;
  progressContainer.addEventListener("mousedown", function () {
    isReady = true;
    progressContainer.classList.add("active");
  })
  document.addEventListener("mousemove", function (e) {
    const clientX = e.clientX;
    const left = progressContainer.getBoundingClientRect().left;
    const width = progressContainer.getBoundingClientRect().width;
    const min = left;
    const max = width + left;
    if (isReady && clientX >= min && clientX <= max) {
      const percent = (clientX - left) / width;
      progress.style.width = `${percent * 100}%`;
      audio.currentTime = percent * audio.duration;
    }
  })
  document.addEventListener("mouseup", function (e) {
    progressContainer.classList.remove("active");
    isReady = false;
  })
  progressContainer.addEventListener("click", function(e) {
    const clientX = e.clientX;
    const left = progressContainer.getBoundingClientRect().left;
    const width = progressContainer.getBoundingClientRect().width;
    const percent = (clientX - left) / width;
    progress.style.width = `${percent * 100}%`;
    audio.currentTime = percent * audio.duration;
  });

  // Focus input history
  const searchInput = document.querySelector("#search");
  const menuHistory = document.querySelector(".container-header__history");
  const menuHistoryItems = document.querySelectorAll(".container-header__history--item");
  const iconTimes = document.querySelector(".icon-times");
  const searchContainer = document.querySelector(".container-header__search");
  searchInput.addEventListener("focus", function() {
    menuHistory.classList.add("show");
    searchContainer.style = `border-radius: 20px 20px 0 0`;
  });
  searchInput.addEventListener("blur", function() {
    menuHistory.classList.remove("show");
    searchContainer.style = `border-radius: 20px`;
  });
  searchInput.addEventListener("input", function(e) {
    const value = e.target.value;
    if(value) {
      iconTimes.classList.add("show");
    }
    else {
      iconTimes.classList.remove("show");
    }
  });
  [...menuHistoryItems].forEach(item => item.addEventListener("click", function(e) {
    const textContent = item.querySelector("p").textContent;
    searchInput.value = textContent;
    iconTimes.classList.add("show");
  }));
  iconTimes.addEventListener("click", function() {
    searchInput.value = "";
    iconTimes.classList.remove("show");
  });
  

  //Modal
  const modalMain = document.querySelector(".modal-main");
  const modal = document.querySelector(".modal");
  const modalClose = document.querySelector(".modal-close");
  modalMain.addEventListener("click", function() {
    modal.classList.add("show");
  });
  modalClose.addEventListener("click", function(e) {
    e.stopPropagation();
    modal.classList.remove("show");
  });

  // Setting
  const settingMain = document.querySelector(".setting-main");
  const setting = document.querySelector(".setting");
  settingMain.addEventListener("click", function() {
    setting.classList.toggle("show");
  })

  //Container main list
  const containerMainListItems = document.querySelectorAll(".container-main__list li");
  const songContentImages = document.querySelector(".container-main__layout .song-content__images");
  const containerMainSong = document.querySelector(".container-main__layout .song");
  const containerMainPlaylist = document.querySelector(".container-main__layout .playlist");
  const containerMainAlbum = document.querySelector(".container-main__layout .album");
  const containerLayoutOverview = document.querySelector(".container-main__layout .overview");
  const containerLayoutArtist = document.querySelector(".container-main__layout .artist-container");
  const containerLayoutMV = document.querySelector(".container-main__layout .mv-container");
  const containerLayoutUpload = document.querySelector(".container-main__layout .upload-container");

  [...containerMainListItems].forEach(item => item.addEventListener("click", function() {
    const active = item.parentElement.querySelector(".active");
    active.classList.remove("active");
    item.classList.add("active");
    const indexItem = parseInt(item.dataset.index);
    if(indexItem === 2) {
      songContentImages.style = `opacity: 0; visibility: hidden; width: 0; margin-right: 0;`;
      songContentList.style.maxHeight = `500px`;
      containerMainPlaylist.style.display = "none";
      containerMainAlbum.style.display = "none";
    }
    else {
      songContentImages.style = `opacity: 1; visibility: visible; width: 245px; margin-right: 20px;`;
      songContentList.style.maxHeight = `245px`;
      containerMainPlaylist.style.display = "block";
      containerMainAlbum.style.display = "block";
    }
    if(indexItem === 3) {
      containerMainSong.style.display = "none";
      containerMainAlbum.style.display = "none";
    }
    else {
      containerMainSong.style.display = "block";
    }
    if(indexItem === 4) {
      containerLayoutArtist.style.display = "block";
      containerLayoutOverview.style.display = "none";
      containerMainSong.style.display = "none";
      containerMainPlaylist.style.display = "none";
      containerMainAlbum.style.display = "none";
    }
    else {
      containerLayoutOverview.style.display = "block";
      containerLayoutArtist.style.display = "none";
    }
    if(indexItem === 5) {
      containerMainSong.style.display = "none";
      containerMainPlaylist.style.display = "none";
    }
    if(indexItem === 6) {
      containerLayoutOverview.style.display = "none";
      containerLayoutMV.style.display = "block";
    }
    else {
      containerLayoutOverview.style.display = "block";
      containerLayoutMV.style.display = "none";
    }
    if(indexItem === 7) {
      containerLayoutUpload.style.display = "block";
      containerLayoutOverview.style.display = "none";
    }
    else {
      containerLayoutUpload.style.display = "none";
    }
  }));


  // Modal create new playlist 
  const navPlaylist = document.querySelector("#nav .nav-playlist");
  const playlistCreate = document.querySelector(".container-main__layout .playlist-create")
  const modalPlaylist = document.querySelector(".modal-create__playlist");
  const modalFormPlaylist = document.querySelector(".modal-form");
  const containerPlaylistList = document.querySelector(".container-main__layout .playlist .playlist-list");
  const inputPlaylist = document.querySelector(".input-playlist");
  const buttonSubmitPlaylist = document.querySelector(".button-submit");

  navPlaylist.addEventListener("click", handleAddPlaylist);
  playlistCreate.addEventListener("click", handleAddPlaylist)
  function handleAddPlaylist(e) {
    modalPlaylist.classList.add("show");
    inputPlaylist.focus();
  }
  modalPlaylist.addEventListener("click", function(e) {
    if(e.target.matches(".modal-form__close")) {
      modalPlaylist.classList.remove("show");
    }
  });

  modalFormPlaylist.addEventListener("submit", function(e) {
    e.preventDefault();
    const value = this.elements["input-playlist"].value;
    if(value) {
      renderPlaylist(value);
      this.elements["input-playlist"].value = "";
      modalPlaylist.classList.remove("show");
    }
  });
  function renderPlaylist(value) {
    const template = `<li class="playlist-list__item">
    <div class="playlist-list__image">
      <img src="./assets/img/img1.jpg" alt="">
      <div class="playlist-list__image-overplay">
        <i class="fas fa-times"></i>
        <span><i class="fas fa-play"></i></span>
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
    <div class="playlist-list__content">
      <div class="playlist-list__heading">${value}</div>
      <div class="playlist-list__desc">Zing MP3</div>
    </div>
  </li>`;
  containerPlaylistList.insertAdjacentHTML("beforeend", template);
  }

  // Mobile menu
  const mobileBtn = document.querySelector(".mobile-button");
  const nav = document.querySelector("#nav");
  mobileBtn.addEventListener("click", function() {
    mobileBtn.classList.toggle("active");
    nav.classList.toggle("active");
  })

  //Container Body Mixtape carousel
  const mixtape = {
    next: document.querySelectorAll(".container-body__mixtape .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__mixtape .child-icon i")[0],
    row: document.querySelector(".container-body__mixtape .child-row"),
    item: document.querySelectorAll(".container-body__mixtape .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(mixtape);

  //Container Body Suggest carousel  
  const suggest = {
    next: document.querySelectorAll(".container-body__suggest .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__suggest .child-icon i")[0],
    row: document.querySelector(".container-body__suggest .child-row"),
    item: document.querySelectorAll(".container-body__suggest .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(suggest)

  //Container Body Recent carousel  
  const recent = {
    next: document.querySelectorAll(".container-body__recent .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__recent .child-icon i")[0],
    row: document.querySelector(".container-body__recent .child-row"),
    item: document.querySelectorAll(".container-body__recent .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(recent)

  //Container Body Mix carousel  
  const mix = {
    next: document.querySelectorAll(".container-body__mix .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__mix .child-icon i")[0],
    row: document.querySelector(".container-body__mix .child-row"),
    item: document.querySelectorAll(".container-body__mix .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(mix)

  //Container Body Category carousel  
  const category = {
    next: document.querySelectorAll(".container-body__category .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__category .child-icon i")[0],
    row: document.querySelector(".container-body__category .child-row"),
    item: document.querySelectorAll(".container-body__category .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(category)

  //Container Body Discover carousel  
  const discover = {
    next: document.querySelectorAll(".container-body__discover .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__discover .child-icon i")[0],
    row: document.querySelector(".container-body__discover .child-row"),
    item: document.querySelectorAll(".container-body__discover .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(discover);

  //Container Body International carousel  
  const international = {
    next: document.querySelectorAll(".container-body__international .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__international .child-icon i")[0],
    row: document.querySelector(".container-body__international .child-row"),
    item: document.querySelectorAll(".container-body__international .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(international)

  //Container Body Romance carousel  
  const romance = {
    next: document.querySelectorAll(".container-body__romance .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__romance .child-icon i")[0],
    row: document.querySelector(".container-body__romance .child-row"),
    item: document.querySelectorAll(".container-body__romance .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(romance)

  //Container Body Top 100 carousel  
  const top = {
    next: document.querySelectorAll(".container-body__top .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__top .child-icon i")[0],
    row: document.querySelector(".container-body__top .child-row"),
    item: document.querySelectorAll(".container-body__top .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(top)

  //Container Body Concert carousel  
  const concert = {
    next: document.querySelectorAll(".container-body__concert .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__concert .child-icon i")[0],
    row: document.querySelector(".container-body__concert .child-row"),
    item: document.querySelectorAll(".container-body__concert .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(concert)

  //Container Body hits carousel  
  const hits = {
    next: document.querySelectorAll(".container-body__hits .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__hits .child-icon i")[0],
    row: document.querySelector(".container-body__hits .child-row"),
    item: document.querySelectorAll(".container-body__hits .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(hits)

  //Container Body heard carousel  
  const heard = {
    next: document.querySelectorAll(".container-body__heard .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__heard .child-icon i")[0],
    row: document.querySelector(".container-body__heard .child-row"),
    item: document.querySelectorAll(".container-body__heard .child-row__item"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(heard)

  //Container Body release carousel  
  const release = {
    next: document.querySelectorAll(".container-body__release .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__release .child-icon i")[0],
    row: document.querySelector(".container-body__release .container-body__release-list"),
    item: document.querySelectorAll(".container-body__release .container-body__release-list li"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(release)

  //Container Body mv carousel  
  const mv = {
    next: document.querySelectorAll(".container-body__mv .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__mv .child-icon i")[0],
    row: document.querySelector(".container-body__mv .mv-list"),
    item: document.querySelectorAll(".container-body__mv .mv-list li"),
    column: 3,
    index: 0,
    position: 0,
  }
  carousel(mv)

  //Container Body live carousel  
  const live = {
    next: document.querySelector("#main .container-body .container-body__live .icon-arrow-right"),
    prev:  document.querySelector("#main .container-body .container-body__live .icon-arrow-left"),
    row: document.querySelector("#main .container-body .container-body__live .live-list"),
    item: document.querySelectorAll("#main .container-body .container-body__live .live-list li"),
    column: 6,
    index: 0,
    position: 0,
  }
  carousel(live)




  //Container Body Event carousel  
  const event = {
    next: document.querySelectorAll(".container-body__upcoming .child-icon i")[1],
    prev:  document.querySelectorAll(".container-body__upcoming .child-icon i")[0],
    row: document.querySelector(".container-body__upcoming .child-row"),
    item: document.querySelectorAll(".container-body__upcoming .child-row__item"),
    column: 3,
    index: 0,
    position: 0,
  }
  carousel(event)
  

  // Container body singer 
  const singer = {
    next: document.querySelector("#main .container-body__singer .icon-arrow-right"),
    prev:  document.querySelector("#main .container-body__singer .icon-arrow-left"),
    row: document.querySelector("#main .container-body__singer .singer-list"),
    item: document.querySelectorAll("#main .container-body__singer .singer-list li"),
    column: 4,
    index: 0,
    position: 0,
  }
  carousel(singer, 4000)


  function carousel({next, prev, row, item, column, index, position}, timer = 0) {
    const length = item.length;
    next.addEventListener("click", function() {
      handleChangeSlide(1);
    })
    prev.addEventListener("click", function() {
      handleChangeSlide(-1);
    })
    if(timer !== 0) {
      setInterval(() => {
        if(index >= Math.ceil(length / column) - 1) {
          index = -1;
        }
        index ++;
        position = -1 * 100 * index;
        row.style.transform = `translateX(${position}%)`;
      }, timer);
    }
    function handleChangeSlide(num) {
      if(num === 1){
        if(index >= Math.ceil(length / column) - 1) {
          return;
        }
        index ++;
      }
      else if(num === -1) {
        if(index <= 0) {
          return;
        }
        index --;
      }
      position = -1 * 100 * index;
      row.style.transform = `translateX(${position}%)`;
    }
  }
   

  // Container tab
  const containerTab = document.querySelectorAll("#main .container-tab");
  const containerIconArrow = document.querySelectorAll("#main .container-header .container-header__btn span");
  let indexTab = 0;
  containerIconArrow[0].classList.add("hiddenIcon");
  containerIconArrow[1].addEventListener("click", function(e) {
    if(indexTab >= containerTab.length - 1) {
      return;
    }
    indexTab ++;
    if(indexTab >= containerTab.length - 1) {
      e.target.classList.add("hiddenIcon");
    }
    containerIconArrow[0].classList.remove("hiddenIcon");
    [...containerTab].forEach(item => item.classList.remove('active-tab'));
    containerTab[indexTab].classList.add("active-tab");
  })
  containerIconArrow[0].addEventListener("click", function(e) {
    if(indexTab <= 0) {
      return;
    }
    indexTab --;
    if(indexTab <= 0) {
      e.target.classList.add("hiddenIcon");
    }
    containerIconArrow[1].classList.remove("hiddenIcon");
    [...containerTab].forEach(item => item.classList.remove('active-tab'));
    containerTab[indexTab].classList.add("active-tab");
  })


})