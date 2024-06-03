/* loading.js */

document.onreadystatechange = function () {
    var progressBar = document.getElementById('progress-bar');
  
    // Update progress bar width when the page is loading
    var loadingProgress = function () {
      var max = document.readyState === 'complete' ? 100 : 80;
      var value = Math.floor((100 / max) * document.readyState);
      progressBar.style.width = value + '%';
    };
  
    // Call loadingProgress function on initial load and subsequent state changes
    // setTimeout(loadingProgress, 1000);
    loadingProgress();
    document.onreadystatechange = loadingProgress;
  };
  