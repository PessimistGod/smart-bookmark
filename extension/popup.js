import { supabase } from "./public/supabaseClient.js";

/* ================= ELEMENTS ================= */

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const saveBtn = document.getElementById("save");
const loginBtn = document.getElementById("login");
const viewBtn = document.getElementById("view");
const logoutBtn = document.getElementById("logout");

/* ================= AUTOFILL ACTIVE TAB ================= */

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  if (!tabs.length) return;
  const tab = tabs[0];
  titleInput.value = tab.title || "";
  urlInput.value = tab.url || "";
});

/* ================= UI STATE ================= */

function showLoggedOut() {
  saveBtn.disabled = true;
  loginBtn.classList.remove("hidden");
  viewBtn.classList.add("hidden");
  logoutBtn.classList.add("hidden");
}

function showLoggedIn() {
  saveBtn.disabled = false;
  loginBtn.classList.add("hidden");
  viewBtn.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
}

/* ================= AUTH CHECK ================= */

async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  if (data?.session) showLoggedIn();
  else showLoggedOut();
}

/* Keep UI in sync */
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) showLoggedIn();
  else showLoggedOut();
});

/* Initial load */
checkAuth();

/* ================= LOGIN ================= */

loginBtn.onclick = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: chrome.identity.getRedirectURL("oauth2"),
        skipBrowserRedirect: true
      }
    });

    if (error) {
      console.error("OAuth init failed:", error);
      return;
    }

    chrome.identity.launchWebAuthFlow(
      { url: data.url, interactive: true },
      async redirectUrl => {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.warn("Auth flow cancelled");
          return;
        }

        const code = new URL(redirectUrl).searchParams.get("code");
        if (!code) {
          console.error("No OAuth code returned");
          return;
        }

        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("Session exchange failed:", exchangeError);
          return;
        }

        await checkAuth();
      }
    );
  } catch (err) {
    console.error("Login error:", err);
  }
};

/* ================= SAVE BOOKMARK ================= */

saveBtn.onclick = async () => {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      alert("Please login first");
      return;
    }

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!title || !url) {
      alert("Missing title or URL");
      return;
    }

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      domain: new URL(url).hostname,
      user_id: user.id
    });

    if (error) {
      console.error("Save failed:", error);
      alert(error.message);
      return;
    }

    window.close();
  } catch (err) {
    console.error("Save crash:", err);
  }
};

/* ================= OPEN DASHBOARD ================= */

viewBtn.onclick = () => {
  chrome.tabs.create({
    url: "https://smart-bookmark-teal-six.vercel.app/dashboard/bookmarks"
  });
};

/* ================= LOGOUT ================= */

logoutBtn.onclick = async () => {
  try {
    await supabase.auth.signOut();
    chrome.storage.local.clear();
    showLoggedOut();
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
