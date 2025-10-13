import { parseTsv } from "./parser";

const $ = (id: string) => document.getElementById(id)!;

const inputEl = $("input") as HTMLTextAreaElement;
const outputEl = $("output") as HTMLTextAreaElement;
const statusEl = $("status");
const errorsWrap = $("errorsWrap");
const errorsEl = $("errors");
const errCountEl = $("errCount");

const convertBtn = $("convertBtn") as HTMLButtonElement;
const copyBtn = $("copyBtn") as HTMLButtonElement;
const downloadBtn = $("downloadBtn") as HTMLButtonElement;
const clearBtn = $("clearBtn") as HTMLButtonElement;

function setStatus(msg: string) {
  statusEl.textContent = msg;
}

function setButtonsEnabled(hasOutput: boolean) {
  copyBtn.disabled = !hasOutput;
  downloadBtn.disabled = !hasOutput;
}

function renderErrors(errors: string[], warnings: string[]) {
  errorsEl.innerHTML = "";
  const items = [...errors.map((e) => ({ text: e, cls: "err" })), ...warnings.map((w) => ({ text: w, cls: "warn" }))];
  for (const it of items) {
    const li = document.createElement("li");
    li.textContent = it.text;
    errorsEl.appendChild(li);
  }
  errCountEl.textContent = String(items.length);
  errorsWrap.open = items.length > 0;
}

convertBtn.addEventListener("click", () => {
  const raw = inputEl.value;
  const { ok, warnings, errors } = parseTsv(raw);
  const json = JSON.stringify(ok, null, 2);
  outputEl.value = json;
  setButtonsEnabled(ok.length > 0);
  setStatus(`성공 ${ok.length}개 · 오류 ${errors.length}개 · 경고 ${warnings.length}개`);
  renderErrors(errors, warnings);
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outputEl.value);
    setStatus("JSON이 클립보드에 복사되었습니다.");
  } catch {
    setStatus("클립보드 복사 실패. 브라우저 권한을 확인하세요.");
  }
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([outputEl.value], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date();
  const name = `converted-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, "0")}${String(ts.getDate()).padStart(2, "0")}-${String(ts.getHours()).padStart(2, "0")}${String(ts.getMinutes()).padStart(2, "0")}.json`;
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  setStatus("JSON 파일을 다운로드했습니다.");
});

clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  outputEl.value = "";
  setButtonsEnabled(false);
  renderErrors([], []);
  setStatus("초기화됨");
});

// initial state
setButtonsEnabled(false);
renderErrors([], []);
setStatus("TSV를 붙여넣고 Convert를 누르세요. 7번째 컬럼은 알파벳/공백/쉼표만 허용");
