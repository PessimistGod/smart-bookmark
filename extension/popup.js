import { supabase } from "./public/supabaseClient.js";

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const saveBtn = document.getElementById("save");
const loginBtn = document.getElementById("login");

const WEB_LOGIN_URL = "http://localhost:3000/login"; // change to prod later

async function checkAuth() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    saveBtn.disabled = true;
    titleInput.disabled = true;
    urlInput.disabled = true;
    loginBtn.style.display = "block";
  } else {
    loginBtn.style.display = "none";
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab) {
    titleInput.value = tab.title || "";
    urlInput.value = tab.url || "";
  }
});

saveBtn.onclick = async () => {
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();

  if (!title || !url) {
    alert("Title and URL required");
    return;
  }

  const { error } = await supabase.from("bookmarks").insert({
    title,
    url
  });

  if (error) {
    alert(error.message);
  } else {
    window.close();
  }
};

loginBtn.onclick = () => {
  chrome.tabs.create({
    url: WEB_LOGIN_URL
  });
};

checkAuth();
