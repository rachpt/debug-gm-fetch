// ==UserScript==
// @name         GM-Fetch Debug
// @namespace    http://localhost:8080
// @version      0.0.1
// @author       Debug User
// @description  Debug script for @sec-ant/gm-fetch@1.2.1
// @match        http://localhost:8080/*
// @grant        GM.info
// @grant        GM.xmlHttpRequest
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  var M = "__monkeyWindow-" + (() => {
    try {
      return new URL((_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href)).origin;
    } catch {
      return location.origin;
    }
  })(), R = document[M] ?? window, v = R.GM, k = R.GM_xmlhttpRequest;
  function x(p) {
    var e;
    const t = new Headers(), s = p.replace(/\r?\n[\t ]+/g, " ");
    for (const i of s.split(/\r?\n/)) {
      const d = i.split(":"), a = (e = d.shift()) == null ? void 0 : e.trim();
      if (a) {
        const c = d.join(":").trim();
        try {
          t.append(a, c);
        } catch (r) {
          console.warn(`Response ${r.message}`);
        }
      }
    }
    return t;
  }
  const H = async (p, t) => {
    const s = k || v.xmlHttpRequest;
    if (typeof s != "function")
      throw new DOMException(
        "GM_xmlhttpRequest or GM.xmlHttpRequest is not granted.",
        "NotFoundError"
      );
    const e = new Request(p, t);
    if (e.signal.aborted)
      throw new DOMException("Network request aborted.", "AbortError");
    const i = await e.arrayBuffer(), d = i.byteLength ? new TextDecoder().decode(i) : void 0, a = Object.fromEntries(e.headers);
    return new Headers(t == null ? void 0 : t.headers).forEach((c, r) => {
      a[r] = c;
    }), new Promise((c, r) => {
      let l = false;
      const b = new Promise((o) => {
        const { abort: w } = s({
          method: e.method.toUpperCase(),
          url: e.url || location.href,
          headers: a,
          data: d,
          redirect: e.redirect,
          binary: true,
          nocache: e.cache === "no-store",
          revalidate: e.cache === "reload",
          timeout: 3e5,
          responseType: s.RESPONSE_TYPE_STREAM ?? "blob",
          overrideMimeType: e.headers.get("Content-Type") ?? void 0,
          anonymous: e.credentials === "omit",
          onload: ({ response: n }) => {
            if (l) {
              o(null);
              return;
            }
            o(n);
          },
          async onreadystatechange({
            readyState: n,
            responseHeaders: m,
            status: g,
            statusText: q,
            finalUrl: f,
            response: E
          }) {
            if (n === XMLHttpRequest.DONE)
              e.signal.removeEventListener("abort", w);
            else if (n !== XMLHttpRequest.HEADERS_RECEIVED)
              return;
            if (l) {
              o(null);
              return;
            }
            const u = x(m), y = e.url !== f, h = new Response(
              E instanceof ReadableStream ? E : await b,
              {
                headers: u,
                status: g,
                statusText: q
              }
            );
            Object.defineProperties(h, {
              url: {
                value: f
              },
              type: {
                value: "basic"
              },
              ...h.redirected !== y ? {
                redirected: {
                  value: y
                }
              } : {},
              // https://fetch.spec.whatwg.org/#forbidden-response-header-name
              ...u.has("set-cookie") || u.has("set-cookie2") ? {
                headers: {
                  value: u
                }
              } : {}
            }), c(h), l = true;
          },
          onerror: ({ statusText: n, error: m }) => {
            r(
              new TypeError(n || m || "Network request failed.")
            ), o(null);
          },
          ontimeout() {
            r(new TypeError("Network request timeout.")), o(null);
          },
          onabort() {
            r(new DOMException("Network request aborted.", "AbortError")), o(null);
          }
        });
        e.signal.addEventListener("abort", w);
      });
    });
  };
  function getGmFetchVersion() {
    try {
      if (typeof GM_info !== "undefined") {
        const description = GM_info.script.description;
        const match = description.match(/@sec-ant\/gm-fetch@(\d+\.\d+\.\d+)/);
        return match ? match[1] : "未知";
      }
      return "未知";
    } catch (e) {
      console.error("获取版本号失败:", e);
      return "未知 (请查看package.json)";
    }
  }
  function createUI() {
    const container = document.createElement("div");
    container.className = "container";
    container.style.marginTop = "20px";
    const versionInfo = document.createElement("div");
    versionInfo.style.marginBottom = "15px";
    versionInfo.style.padding = "8px";
    versionInfo.style.backgroundColor = "#e9f5ff";
    versionInfo.style.borderRadius = "4px";
    versionInfo.innerHTML = `当前使用的 <strong>@sec-ant/gm-fetch</strong> 版本: <code>${getGmFetchVersion()}</code>`;
    container.appendChild(versionInfo);
    const title = document.createElement("h2");
    title.textContent = "GM-Fetch 测试";
    container.appendChild(title);
    const inputGroup = document.createElement("div");
    inputGroup.style.marginBottom = "10px";
    const label = document.createElement("label");
    label.textContent = "请输入要发送的内容：";
    label.style.display = "block";
    label.style.marginBottom = "5px";
    const input = document.createElement("textarea");
    input.id = "gm-fetch-input";
    input.style.width = "100%";
    input.style.height = "100px";
    input.style.padding = "8px";
    input.style.boxSizing = "border-box";
    input.value = JSON.stringify({ message: "Hello from GM-Fetch!" }, null, 2);
    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    container.appendChild(inputGroup);
    const methodGroup = document.createElement("div");
    methodGroup.style.marginBottom = "15px";
    const methodLabel = document.createElement("label");
    methodLabel.textContent = "请求方法：";
    methodLabel.style.marginRight = "10px";
    const postRadio = document.createElement("input");
    postRadio.type = "radio";
    postRadio.name = "requestMethod";
    postRadio.id = "method-post";
    postRadio.value = "POST";
    postRadio.checked = true;
    postRadio.style.marginRight = "5px";
    const postLabel = document.createElement("label");
    postLabel.htmlFor = "method-post";
    postLabel.textContent = "POST";
    postLabel.style.marginRight = "15px";
    const getRadio = document.createElement("input");
    getRadio.type = "radio";
    getRadio.name = "requestMethod";
    getRadio.id = "method-get";
    getRadio.value = "GET";
    getRadio.style.marginRight = "5px";
    const getLabel = document.createElement("label");
    getLabel.htmlFor = "method-get";
    getLabel.textContent = "GET";
    methodGroup.appendChild(methodLabel);
    methodGroup.appendChild(postRadio);
    methodGroup.appendChild(postLabel);
    methodGroup.appendChild(getRadio);
    methodGroup.appendChild(getLabel);
    container.appendChild(methodGroup);
    const button = document.createElement("button");
    button.textContent = "发送请求";
    button.style.padding = "8px 16px";
    button.style.cursor = "pointer";
    button.onclick = sendRequest;
    container.appendChild(button);
    const resultTitle = document.createElement("h3");
    resultTitle.textContent = "响应结果：";
    resultTitle.style.marginTop = "20px";
    const resultArea = document.createElement("pre");
    resultArea.id = "gm-fetch-result";
    resultArea.className = "result";
    container.appendChild(resultTitle);
    container.appendChild(resultArea);
    document.body.appendChild(container);
  }
  async function sendRequest() {
    var _a;
    const input = document.getElementById("gm-fetch-input");
    const resultArea = document.getElementById(
      "gm-fetch-result"
    );
    const methodRadios = document.getElementsByName(
      "requestMethod"
    );
    const method = ((_a = Array.from(methodRadios).find((radio) => radio.checked)) == null ? void 0 : _a.value) || "POST";
    try {
      let inputData;
      try {
        inputData = JSON.parse(input.value);
      } catch (e) {
        inputData = { text: input.value };
      }
      resultArea.textContent = "请求中...";
      let response;
      if (method === "GET") {
        const queryParams = new URLSearchParams();
        Object.entries(inputData).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        response = await H(
          `http://localhost:8080/api/echo?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          }
        );
      } else {
        response = await H("http://localhost:8080/api/echo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(inputData)
        });
      }
      const data = await response.json();
      resultArea.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      resultArea.textContent = `错误: ${error.message}`;
      console.error("请求错误:", error);
    }
  }
  (function() {
    console.log("GM-Fetch Debug 脚本已加载");
    createUI();
  })();

})();