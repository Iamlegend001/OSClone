export function setWallpaper(url) {
  const bg = document.getElementById("desktop-bg");
  bg.style.backgroundImage = `url('${url}')`;
}
