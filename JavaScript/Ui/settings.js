export function setTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
}

export function loadWallpaper() {
  const bg = document.getElementById("desktop-bg");
  bg.style.backgroundImage = "url('https://4kwallpapers.com/images/walls/thumbs_3t/22807.jpg')";
}
