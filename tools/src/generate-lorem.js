import { $, bindRun, setStatus } from "./_helpers.js";

const WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus iusto odio dignissimos ducimus blanditiis praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi occaecati provident similique mollitia animi laborum dolorum fuga harum quidem rerum facilis est expedita distinctio nam libero tempore cum soluta nobis eligendi optio cumque impedit minus quod maxime placeat facere possimus omnis voluptas assumenda repellendus temporibus autem quibusdam aut officiis debitis necessitatibus saepe eveniet voluptates repudiandae recusandae itaque earum hic tenetur a sapiente delectus reiciendis").split(" ");

function rand(n) { return Math.floor(Math.random() * n); }
function pick() { return WORDS[rand(WORDS.length)]; }

function sentence() {
  const len = 6 + rand(12);
  const ws = Array.from({ length: len }, pick);
  ws[0] = ws[0][0].toUpperCase() + ws[0].slice(1);
  // Sprinkle a comma in the middle.
  if (len > 8 && rand(2)) {
    const i = 3 + rand(len - 5);
    ws[i] = ws[i] + ",";
  }
  return ws.join(" ") + ".";
}

function paragraph() {
  const n = 3 + rand(4);
  return Array.from({ length: n }, sentence).join(" ");
}

function startClassic(text) {
  return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
}

function run() {
  const unit = $("#opt-unit").value;
  const amount = Math.max(1, Math.min(50, parseInt($("#opt-amount").value, 10) || 1));
  const classic = $("#opt-startclassic").checked;
  let out = "";
  if (unit === "words") {
    const ws = Array.from({ length: amount }, pick);
    ws[0] = ws[0][0].toUpperCase() + ws[0].slice(1);
    out = ws.join(" ") + ".";
  } else if (unit === "sentences") {
    out = Array.from({ length: amount }, sentence).join(" ");
  } else {
    out = Array.from({ length: amount }, paragraph).join("\n\n");
  }
  if (classic && unit !== "words") out = startClassic(out);
  $("#output").value = out;
  setStatus(`Generated ${amount} ${unit}`, "ok");
}

bindRun(run, { auto: true });
run();
