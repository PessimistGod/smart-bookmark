import { supabase } from "./public/supabaseClient.js";

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const saveBtn = document.getElementById("save");
const loginBtn = document.getElementById("login");
const viewBtn = document.getElementById("view");

/* Autofill active tab */
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0];
  if (!tab) return;
  titleInput.value = tab.title || "";
  urlInput.value = tab.url || "";
});

/* ================= AUTH STATE ================= */

async function checkAuth() {
  const { data, error } = await supabase.auth.getSession();

  console.log("Session check:", data?.session, error);

  if (!data?.session) {
    saveBtn.disabled = true;
    loginBtn.style.display = "block";
    viewBtn.style.display = "none";
  } else {
    saveBtn.disabled = false;
    loginBtn.style.display = "none";
    viewBtn.style.display = "block";
  }
}

/* Listen for auth changes */
supabase.auth.onAuthStateChange((_event, session) => {
  console.log("Auth changed:", session);
  checkAuth();
});

checkAuth();

/* ================= LOGIN FLOW ================= */

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
      console.error("OAuth init error:", error);
      return;
    }

    chrome.identity.launchWebAuthFlow(
      { url: data.url, interactive: true },
      async redirectUrl => {

        if (chrome.runtime.lastError) {
          console.warn("Auth flow error:", chrome.runtime);

          console.warn("Auth flow error:", chrome.runtime.lastError.message);
          return;
        }

        if (!redirectUrl) return;

        console.log("Redirect URL:", redirectUrl);

        const parsed = new URL(redirectUrl);
        const code = parsed.searchParams.get("code");

        if (!code) {
          console.error("No OAuth code found");
          return;
        }

        const { data: sessionData, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        console.log("Exchange result:", sessionData, exchangeError);

        await checkAuth();
      }
    );
  } catch (err) {
    console.error("Login crash:", err);
  }
};

/* ================= SAVE BOOKMARK ================= */

saveBtn.onclick = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    console.log("Current user:", user);

    if (!user) {
      alert("Login required");
      return;
    }

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!title || !url) {
      alert("Missing fields");
      return;
    }

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      domain: new URL(url).hostname,
      user_id: user.id
    });

    if (error) {
      console.error("Insert error:", error);
      alert(error.message);
      return;
    }

    window.close();
  } catch (err) {
    console.error("Save crash:", err);
  }
};

/* ================= VIEW BOOKMARKS ================= */

viewBtn.onclick = () => {
  chrome.tabs.create({
    url: "https://smart-bookmark-teal-six.vercel.app/dashboard/bookmarks"
  });
};
